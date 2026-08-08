"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { getBasePath } from "@/lib/utils";

/**
 * Le visiteur accepte-t-il le mouvement ?
 *
 * `useSyncExternalStore` plutôt qu'un `useState` posé depuis un effet : la
 * règle react-hooks/set-state-in-effect l'interdit, et à raison — cela
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
 * s'en approche — un hero de six photos ne doit pas coûter six images à
 * l'ouverture de la page.
 */
const VUES = [
  {
    src: "/images/hero/hotel-vu-du-lac-bungalows-pilotis.jpg",
    alt: "Les bungalows sur pilotis du Lac Hôtel vus depuis le lac Sahambavy",
  },
  {
    src: "/images/hero/hero-lever-de-soleil-lac.jpg",
    alt: "Lever de soleil sur le Lac Hôtel Sahambavy, les bungalows sur pilotis et les collines, vus au drone",
  },
  {
    src: "/images/hero/hero-piscine-jardins.jpg",
    alt: "La piscine et les jardins du Lac Hôtel, vus au drone depuis le bâtiment Superior",
  },
  {
    src: "/images/hero/hero-plantation-the-rizieres.jpg",
    alt: "Les théiers et les rizières de Sahambavy, vus au drone",
  },
  {
    src: "/images/hero/hero-pilotis-brume.jpg",
    alt: "Un bungalow sur pilotis au bout de son ponton, dans la brume du matin",
  },
  {
    src: "/images/hero/hero-bio-mami-shop.jpg",
    alt: "La boutique Bio Mami Shop de l'hôtel, sous son flamboyant",
  },
];

/** Durée d'affichage d'une vue, fondu compris (ms). */
const DUREE_VUE = 7000;

/**
 * Hero d'accueil — diaporama plein écran.
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
 *    dégradation — c'est le comportement attendu d'un fond animé.
 *
 * 3. L'onglet en arrière-plan. Le minuteur est suspendu quand la page
 *    n'est pas visible : sans cela on revient sur un onglet qui a défilé
 *    dans le vide et consommé de la batterie pour rien.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export default function HeroHome({ dict }: { dict: any }) {
  const bgRef = useRef<HTMLDivElement>(null);
  const [vue, setVue] = useState(0);
  const anime = useMouvementAutorise();

  /* — Parallaxe douce, inchangée — */
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

  /* — Défilement — */
  useEffect(() => {
    if (!anime) return;

    let timer: ReturnType<typeof setInterval> | null = null;
    const demarrer = () => {
      if (timer) return;
      timer = setInterval(() => setVue((v) => (v + 1) % VUES.length), DUREE_VUE);
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
  }, [anime]);

  const monter = useCallback(
    (i: number) => i === 0 || Math.abs(i - vue) <= 1 || (vue === VUES.length - 1 && i === 0),
    [vue],
  );

  return (
    <section className="relative h-[100svh] min-h-[560px] w-full overflow-hidden md:min-h-[700px]">
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
            {monter(i) && (
              <Image
                src={`${basePath}${v.src}`}
                alt={i === 0 ? v.alt : ""}
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
          lumineux ; la moitié basse — où le titrage ultra-light croise la
          bande texturée des bungalows — est nettement assombrie. Sans cela,
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

      {/* Repères de vue — discrets, en bas à droite pour ne pas concurrencer
          le titrage. Ce ne sont pas des points décoratifs : un fond qui
          change tout seul doit pouvoir être repris en main, et le visiteur
          qui a aperçu une vue doit pouvoir y revenir. */}
      {anime && (
        <div
          role="group"
          aria-label="Vues de l’hôtel"
          className="absolute bottom-8 right-6 z-20 flex items-center gap-2 md:bottom-10 md:right-12 lg:right-20"
        >
          {VUES.map((v, i) => (
            <button
              key={v.src}
              type="button"
              onClick={() => setVue(i)}
              aria-label={`Vue ${i + 1} sur ${VUES.length}`}
              aria-current={i === vue ? "true" : undefined}
              className={`h-1.5 rounded-full transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${
                i === vue ? "w-7 bg-white/90" : "w-1.5 bg-white/45 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
