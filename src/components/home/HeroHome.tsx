"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { getBasePath } from "@/lib/utils";
import { alt, type TexteAlternatif } from "@/lib/alt";
import type { Locale } from "@/lib/utils";

/**
 * Le visiteur accepte-t-il le mouvement ?
 *
 * `useSyncExternalStore` plutôt qu'un `useState` posé depuis un effet : la
 * règle react-hooks/set-state-in-effect l'interdit, et à raison, car cela
 * provoque un rendu de trop. L'instantané serveur vaut `false`, donc le
 * HTML sort sans animation et la première peinture est identique pour
 * tout le monde ; l'hydratation active le défilement si le système le
 * permet. Bonus : un visiteur qui change son réglage en cours de route
 * voit le hero s'arrêter, sans rechargement.
 */
function useMouvementAutorise(): boolean {
  return useSyncExternalStore(
    (notifier) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", notifier);
      return () => mq.removeEventListener("change", notifier);
    },
    () => !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

const basePath = getBasePath();

/**
 * Vues du hero, dans l'ordre de défilement.
 *
 * La PREMIÈRE est le point d'entrée visuel du site et le LCP : elle seule
 * est préchargée. Les suivantes sont montées au fur et à mesure qu'on
 * s'en approche : un hero de six photos ne doit pas coûter six images à
 * l'ouverture de la page.
 */
const VUES: { src: string; alt: TexteAlternatif }[] = [
  {
    src: "/images/hero/hero-lever-de-soleil-lac.jpg",
    alt: { fr: "Lever de soleil sur le Lac Hôtel Sahambavy, les bungalows sur pilotis et les collines, vus au drone", en: "Sunrise over Lac Hôtel Sahambavy, the overwater bungalows and the hills, seen from the air", es: "Amanecer sobre el Lac Hôtel Sahambavy, los bungalows sobre pilotes y las colinas, vistos desde el aire" },
  },
  {
    src: "/images/hero/hero-piscine-jardins.jpg",
    alt: { fr: "La piscine et les jardins du Lac Hôtel, vus au drone depuis le bâtiment Superior", en: "The Lac Hôtel pool and gardens from above, looking out from the Superior building", es: "La piscina y los jardines del Lac Hôtel desde el aire, sobre el edificio Superior" },
  },
  {
    src: "/images/hero/hero-plantation-the-rizieres.jpg",
    alt: { fr: "Les théiers et les rizières de Sahambavy, vus au drone", en: "The tea bushes and rice paddies of Sahambavy from the air", es: "Los tés y los arrozales de Sahambavy vistos desde el aire" },
  },
  {
    src: "/images/hero/hero-pilotis-brume.jpg",
    alt: { fr: "Un bungalow sur pilotis au bout de son ponton, dans la brume du matin", en: "An overwater bungalow at the end of its jetty, in the morning mist", es: "Un bungalow sobre pilotes al final de su pasarela, entre la bruma matinal" },
  },
  {
    src: "/images/hero/hero-sunset.jpg",
    alt: { fr: "Coucher de soleil sur le lac Sahambavy, un bungalow sur pilotis au fil de l'eau", en: "Sunset over Lake Sahambavy, an overwater bungalow at the water's edge", es: "Atardecer sobre el lago Sahambavy, un bungalow sobre pilotes a ras del agua" },
  },
  {
    src: "/images/hero/hotel-vu-du-lac-bungalows-pilotis.jpg",
    alt: { fr: "Les bungalows sur pilotis du Lac Hôtel vus depuis le lac Sahambavy", en: "The Lac Hôtel overwater bungalows seen from Lake Sahambavy", es: "Los bungalows sobre pilotes del Lac Hôtel vistos desde el lago Sahambavy" },
  },
];

/** Durée d'affichage d'une vue, fondu compris (ms). */
const DUREE_VUE = 7000;

/**
 * Hero d'accueil : diaporama plein écran.
 *
 * Remplace la photo unique (demande du 08/08/2026). La photo elle-même
 * avait remplacé un hero vidéo en juillet : elle porte mieux la direction
 * « Panorama », titrage géant ultra-light posé sur le plan d'eau, dont
 * l'uniformité garantit le contraste.
 *
 * TROIS PRÉCAUTIONS
 *
 * 1. Le LCP. `preload` ne porte que sur la première vue ; les autres sont
 *    montées paresseusement, et seulement une fois qu'on les approche.
 *    Un visiteur qui repart au bout de trois secondes n'aura chargé
 *    qu'une seule image, exactement comme avant.
 *
 * 2. Le mouvement. Avec `prefers-reduced-motion: reduce`, le diaporama ne
 *    démarre pas du tout : la première vue reste, fixe. Ce n'est pas une
 *    dégradation, c'est le comportement attendu d'un fond animé.
 *
 * 3. L'onglet en arrière-plan. Le minuteur est suspendu quand la page
 *    n'est pas visible : sans cela on revient sur un onglet qui a défilé
 *    dans le vide et consommé de la batterie pour rien.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export default function HeroHome({ dict, locale }: { dict: any; locale: Locale }) {
  const bgRef = useRef<HTMLDivElement>(null);
  const [vue, setVue] = useState(0);
  const anime = useMouvementAutorise();
  const ctrl = dict.hero.controls;

  /* Les vues déjà montées. L'ensemble ne fait que croître : quand on saute
     d'un repère à l'autre, la vue de destination doit être dans le DOM
     AVANT que le fondu ne commence, sinon on enchaîne sur un cadre vide le
     temps du téléchargement. On monte donc la cible et ses deux voisines,
     et on ne démonte jamais : une image déjà en cache ne coûte rien. */
  const [montees, setMontees] = useState<number[]>([0]);
  /* Le défilement est-il en marche ? Une bande qui bouge toute seule doit
     pouvoir être arrêtée (WCAG 2.2.2), et le visiteur qui prend la main
     sur les flèches ne veut pas que le minuteur le double trois secondes
     plus tard. */
  const [enMarche, setEnMarche] = useState(true);
  /* Incrémenté à chaque geste : relance le minuteur à zéro pour laisser la
     vue choisie s'afficher pleinement. */
  const [reprise, setReprise] = useState(0);
  /* Le minuteur lit la vue courante ici : sans cela il faudrait le
     reconstruire à chaque changement de vue, et le compte à rebours
     repartirait de zéro à chaque fondu automatique. */
  const vueRef = useRef(0);

  const aller = useCallback((i: number) => {
    const n = VUES.length;
    const cible = ((i % n) + n) % n;
    vueRef.current = cible;
    setVue(cible);
    setMontees((deja) => {
      const ajouts = [cible, (cible + 1) % n, (cible - 1 + n) % n].filter(
        (k) => !deja.includes(k),
      );
      return ajouts.length ? [...deja, ...ajouts] : deja;
    });
  }, []);

  /** Navigation à la main : on va à la vue et on relance le compte à rebours. */
  const allerManuel = useCallback(
    (i: number) => {
      aller(i);
      setReprise((r) => r + 1);
    },
    [aller],
  );

  /* Parallaxe douce, inchangée */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      if (bgRef.current) bgRef.current.style.transform = "none";
      return;
    }
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        if (bgRef.current && window.scrollY < window.innerHeight) {
          bgRef.current.style.transform = `translateY(${window.scrollY * 0.2}px) scale(1.05)`;
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  /* Défilement */
  useEffect(() => {
    if (!anime || !enMarche) return;

    let timer: ReturnType<typeof setInterval> | null = null;
    const demarrer = () => {
      if (timer) return;
      timer = setInterval(() => aller(vueRef.current + 1), DUREE_VUE);
    };
    const arreter = () => {
      if (timer) clearInterval(timer);
      timer = null;
    };
    const onVisibilite = () => (document.hidden ? arreter() : demarrer());

    demarrer();
    document.addEventListener("visibilitychange", onVisibilite);
    return () => {
      arreter();
      document.removeEventListener("visibilitychange", onVisibilite);
    };
  }, [anime, enMarche, reprise, aller]);

  /* Balayage tactile. Sur téléphone, trois pastilles de 36 px dans un coin
     ne sont pas le geste naturel : on fait glisser la photo. On ne retient
     que les gestes franchement horizontaux, pour ne pas confisquer le
     défilement vertical de la page. */
  const depart = useRef<{ x: number; y: number } | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse") return;
    depart.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const d = depart.current;
    depart.current = null;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    allerManuel(dx < 0 ? vue + 1 : vue - 1);
  };

  return (
    <section
      className="relative h-[100svh] min-h-[560px] w-full overflow-hidden md:min-h-[700px]"
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={() => (depart.current = null)}
    >
      <div
        ref={bgRef}
        className="absolute inset-0 will-change-transform"
        style={{ transform: "scale(1.05)" }}
      >
        {VUES.map((v, i) => (
          <div
            key={v.src}
            aria-hidden={i !== vue}
            className={`absolute inset-0 transition-opacity duration-[2200ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
              i === vue ? "opacity-100" : "opacity-0"
            }`}
          >
            {montees.includes(i) && (
              <Image
                src={`${basePath}${v.src}`}
                alt={alt(v.alt, locale)}
                fill
                sizes="100vw"
                {...(i === 0 ? { preload: true } : { loading: "lazy" as const })}
                /* Très lent travelling avant sur la vue affichée : 12 s pour
                   3 % d'échelle. À peine perceptible image par image, mais
                   c'est ce qui empêche le fond de paraître figé entre deux
                   fondus. */
                className={`object-cover object-center transition-transform duration-[12000ms] ease-linear ${
                  anime && i === vue ? "scale-[1.03]" : "scale-100"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Voile de contraste. Le ciel et les nuages (moitié haute) restent
          lumineux ; la moitié basse, où le titrage ultra-light croise la
          bande texturée des bungalows, est nettement assombrie. Sans cela,
          l'Inter Tight 200 devient illisible sur le feuillage. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.32) 0%, rgba(0,0,0,0.10) 20%, rgba(0,0,0,0.02) 38%, rgba(0,0,0,0.38) 58%, rgba(0,0,0,0.64) 78%, rgba(0,0,0,0.78) 100%)",
        }}
      />

      <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-24 md:px-12 md:pb-36 lg:px-20">
        <div className="max-w-4xl">
          {/* Le sur-titre « Sahambavy · Madagascar » a été retiré : l'emblème
              géant, juste au-dessus, écrit déjà « Sahambavy - Fianarantsoa /
              Madagascar ». La clé dict.hero.eyebrow reste en place, elle sert
              encore de label au hero de la page « L'Hôtel », où l'emblème
              géant ne s'affiche pas. */}
          <h1
            className="mb-5 md:mb-6"
            style={{
              color: "#FFFFFF",
              textShadow: "0 2px 40px rgba(0,0,0,0.35), 0 1px 3px rgba(0,0,0,0.3)",
              textWrap: "balance",
            }}
          >
            {dict.hero.title}
            <br />
            {dict.hero.titleEm}
          </h1>
          <p
            className="mb-8 max-w-[52ch] text-[15px] leading-relaxed text-white/90 md:mb-10 md:text-base"
            style={{ textShadow: "0 1px 12px rgba(0,0,0,0.35)" }}
          >
            {dict.hero.subtitle}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row md:gap-4">
            <a
              href="#rooms"
              className="ge-cta"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("rooms")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              {dict.hero.cta1}
            </a>
            <a
              href="#contact"
              className="ge-cta ge-cta--onphoto"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              {dict.hero.cta2}
            </a>
          </div>
        </div>
      </div>

      {/* Commandes du diaporama : en bas à droite pour ne pas concurrencer le
          titrage, et regroupées en un seul bloc plutôt qu'en deux grosses
          flèches posées au milieu des bords, qui datent la page.

          Elles s'affichent TOUJOURS, y compris sous prefers-reduced-motion :
          c'est justement le visiteur privé de défilement automatique qui a
          le plus besoin de tourner les vues à la main. Seul le bouton
          pause/lecture disparaît alors, puisqu'il n'y a rien à suspendre.

          PLACEMENT : la bulle WhatsApp est fixée en bas à droite (56 px,
          marge 24). Les anciens repères passaient dessous ; des boutons,
          eux, doivent rester cliquables. Sur mobile le bloc est donc centré
          sous les boutons d'appel, à gauche de la bulle ; à partir de md il
          reste à droite mais remonte au-dessus d'elle. */}
      <div
        role="group"
        aria-label={ctrl.diaporama}
        className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 md:bottom-24 md:left-auto md:right-12 md:translate-x-0 lg:right-20"
      >
        <button
          type="button"
          onClick={() => allerManuel(vue - 1)}
          aria-label={ctrl.precedente}
          className={CLASSE_BOUTON}
        >
          <Chevron sens="gauche" />
        </button>

        <div className="mx-1.5 flex items-center gap-2 md:mx-2">
          {VUES.map((v, i) => (
            <button
              key={v.src}
              type="button"
              onClick={() => allerManuel(i)}
              aria-label={ctrl.vue.replace("{n}", String(i + 1)).replace("{total}", String(VUES.length))}
              aria-current={i === vue ? "true" : undefined}
              className={`h-1.5 rounded-full transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${
                i === vue ? "w-7 bg-white/90" : "w-1.5 bg-white/45 hover:bg-white/70"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => allerManuel(vue + 1)}
          aria-label={ctrl.suivante}
          className={CLASSE_BOUTON}
        >
          <Chevron sens="droite" />
        </button>

        {anime && (
          <button
            type="button"
            onClick={() => setEnMarche((m) => !m)}
            aria-label={enMarche ? ctrl.pause : ctrl.lecture}
            aria-pressed={!enMarche}
            className={`${CLASSE_BOUTON} ml-1.5`}
          >
            {enMarche ? (
              <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true" fill="currentColor">
                <rect x="2" y="1.5" width="2.6" height="9" rx="0.6" />
                <rect x="7.4" y="1.5" width="2.6" height="9" rx="0.6" />
              </svg>
            ) : (
              <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true" fill="currentColor">
                <path d="M3 1.6l7 4.4-7 4.4z" />
              </svg>
            )}
          </button>
        )}
      </div>
    </section>
  );
}

/* Verre translucide : le même vocabulaire que les pastilles du menu, mais
   décliné en blanc : le fond est ici une photo, pas la page crème. */
const CLASSE_BOUTON =
  "flex h-8 w-8 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white/90 backdrop-blur-md transition-colors duration-300 hover:bg-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 md:h-9 md:w-9";

function Chevron({ sens }: { sens: "gauche" | "droite" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={sens === "gauche" ? "-ml-px" : "ml-px"}
    >
      <path d={sens === "gauche" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
    </svg>
  );
}
