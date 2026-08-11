"use client";

import { useCallback, useEffect, useRef } from "react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { siteConfig } from "@/data/site";
import {
  bookingReviews,
  googleReviews,
  tripadvisorReviews,
  type Review,
} from "@/data/testimonials";
import { LogoGoogle, LogoTripAdvisor, LogoBooking } from "@/components/ui/LogosPlateformes";
import type { Locale } from "@/lib/utils";

/**
 * Ruban de témoignages, défilant et manipulable.
 *
 * POURQUOI UN RUBAN ET NON UN CARROUSEL. Un carrousel a des vues, un
 * index, des flèches : il dit « il y a quinze avis, en voici un ». Une
 * piste qui glisse sans fin dit « il y en a trop pour les compter ».
 *
 * CE N'EST PLUS UNE ANIMATION CSS. La première version translatait la
 * piste par keyframes, avec un bouton pour l'arrêter. La direction a
 * demandé de retirer le bouton et de rendre le ruban saisissable
 * (10/08/2026) : or une translation CSS ne se saisit pas, elle ignore la
 * molette et le doigt.
 *
 * La piste est donc devenue un conteneur à défilement horizontal natif,
 * dont on pousse `scrollLeft` image par image. Trois conséquences,
 * toutes voulues :
 *   - le doigt, la molette et le pavé tactile fonctionnent tels quels,
 *     sans une ligne de code, parce que c'est du défilement natif ;
 *   - la souris peut empoigner la piste, ce que le natif ne donne pas ;
 *   - toucher le ruban l'arrête, et c'est ce qui remplace le bouton.
 *
 * LA BOUCLE. La liste est rendue DEUX FOIS. Dès que le défilement passe
 * la moitié de la piste, on lui retranche cette moitié : le second
 * exemplaire occupant exactement la place du premier, l'œil ne voit
 * aucun saut. Le doublon est marqué aria-hidden, sinon un lecteur
 * d'écran énoncerait chaque avis deux fois.
 *
 * ACCESSIBILITÉ. WCAG 2.2.2 demande qu'un mouvement de plus de cinq
 * secondes puisse être arrêté. Le bouton explicite ayant été retiré, ce
 * rôle revient au survol, au focus clavier et à tout geste de
 * défilement, qui figent la piste. Sous prefers-reduced-motion elle ne
 * démarre pas du tout : elle reste une bande que l'on parcourt à la main.
 *
 * QUINZE AVIS, TOUS RÉELS. Voir l'en-tête de src/data/testimonials.ts.
 */

type Plateforme = "booking" | "google" | "tripadvisor";

type Carte = Review & { source: Plateforme };

const MARQUES: Record<
  Plateforme,
  { nom: string; href: string; Logo: (p: { taille?: number }) => React.ReactElement }
> = {
  booking: { nom: "Booking.com", href: siteConfig.social.booking, Logo: LogoBooking },
  google: { nom: "Google", href: siteConfig.social.google, Logo: LogoGoogle },
  tripadvisor: { nom: "TripAdvisor", href: siteConfig.social.tripadvisor, Logo: LogoTripAdvisor },
};

/* Un avis de chaque plateforme à tour de rôle : le ruban alterne les
   origines au lieu de servir cinq Booking puis cinq Google. */
function melanger(): Carte[] {
  const files: [Plateforme, Review[]][] = [
    ["booking", bookingReviews],
    ["google", googleReviews],
    ["tripadvisor", tripadvisorReviews],
  ];
  const max = Math.max(...files.map(([, r]) => r.length));
  const sortie: Carte[] = [];
  for (let i = 0; i < max; i++) {
    for (const [source, avis] of files) {
      if (avis[i]) sortie.push({ ...avis[i], source });
    }
  }
  return sortie;
}

const CARTES = melanger();

/** Vitesse du défilement, en pixels par seconde. Assez lent pour lire. */
const VITESSE = 42;

/** Délai avant reprise après un geste, en millisecondes. */
const REPRISE = 2500;

/** Gel long, le temps qu'un survol ou un focus dure. */
const GEL_LONG = 600_000;

// Drapeaux Unicode : discrets, lisibles, sans dépendance. Clé = pays tel
// qu'il est écrit dans testimonials.ts. Pays inconnu, pas de drapeau.
const DRAPEAUX: Record<string, string> = {
  Allemagne: "🇩🇪",
  Australie: "🇦🇺",
  Belgique: "🇧🇪",
  Espagne: "🇪🇸",
  France: "🇫🇷",
  Italie: "🇮🇹",
  "La Réunion": "🇷🇪",
  Madagascar: "🇲🇬",
  "Royaume-Uni": "🇬🇧",
  Suisse: "🇨🇭",
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function Testimonials({ dict, locale }: { dict: any; locale: Locale }) {
  const t = dict.testimonials;
  const pisteRef = useRef<HTMLDivElement>(null);
  /* Instant avant lequel on ne pousse pas la piste. Un ref et non un
     état : il change à chaque mouvement de souris, et un rendu par
     mouvement serait ruineux. */
  const geleJusqua = useRef(0);

  const suspendre = useCallback((duree: number = REPRISE) => {
    geleJusqua.current = performance.now() + duree;
  }, []);

  useEffect(() => {
    const piste = pisteRef.current;
    if (!piste) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let precedent = performance.now();

    const avancer = (maintenant: number) => {
      // Onglet réveillé après une heure : on ne rattrape pas le retard.
      const dt = Math.min(maintenant - precedent, 100);
      precedent = maintenant;
      if (maintenant >= geleJusqua.current && !document.hidden) {
        piste.scrollLeft += (VITESSE * dt) / 1000;
      }
      /* Deux exemplaires dans la piste : au-delà de la moitié, on recule
         d'une moitié. Position identique à l'œil, boucle sans fin. */
      const moitie = piste.scrollWidth / 2;
      if (moitie > 0 && piste.scrollLeft >= moitie) piste.scrollLeft -= moitie;
      raf = requestAnimationFrame(avancer);
    };

    raf = requestAnimationFrame(avancer);
    return () => cancelAnimationFrame(raf);
  }, []);

  /* Saisie à la souris. Le doigt et la molette n'ont besoin de rien : le
     conteneur défile nativement. */
  const saisie = useRef<{ x: number; depart: number } | null>(null);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    suspendre(GEL_LONG);
    if (e.pointerType !== "mouse") return;
    const piste = pisteRef.current;
    if (!piste) return;
    saisie.current = { x: e.clientX, depart: piste.scrollLeft };
    piste.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = saisie.current;
    const piste = pisteRef.current;
    if (!s || !piste) return;
    piste.scrollLeft = s.depart - (e.clientX - s.x);
  };

  const relacher = (e: React.PointerEvent<HTMLDivElement>) => {
    const piste = pisteRef.current;
    if (saisie.current && piste?.hasPointerCapture(e.pointerId)) {
      piste.releasePointerCapture(e.pointerId);
    }
    saisie.current = null;
    suspendre();
  };

  return (
    <section className="overflow-hidden py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="mx-auto mb-10 max-w-2xl text-center md:mb-14">
          <ScrollReveal>
            <span className="ge-label mb-4">{t.label}</span>
            <h2 style={{ textWrap: "balance" }}>{t.title}</h2>
          </ScrollReveal>
        </div>
      </div>

      {/* Le ruban déborde volontairement de la grille : une piste qui
          s'arrête aux marges du contenu ne donne pas la sensation de
          continuité. Les fondus latéraux, posés en masque, évitent que
          les cartes n'apparaissent et ne disparaissent d'un coup net. */}
      <div
        ref={pisteRef}
        className="lh-ruban"
        role="region"
        aria-label={t.label}
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={relacher}
        onPointerCancel={relacher}
        onMouseEnter={() => suspendre(GEL_LONG)}
        onMouseLeave={() => suspendre(0)}
        onFocusCapture={() => suspendre(GEL_LONG)}
        onBlurCapture={() => suspendre(0)}
        onWheel={() => suspendre()}
      >
        <div className="lh-ruban__piste">
          {[0, 1].map((exemplaire) => (
            <ul
              key={exemplaire}
              className="lh-ruban__lot"
              aria-hidden={exemplaire === 1 ? "true" : undefined}
            >
              {CARTES.map((c) => (
                <li key={`${exemplaire}-${c.source}-${c.name}`}>
                  <CarteAvis carte={c} locale={locale} />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 md:px-10">
        {/* Article L.111-7-2 du Code de la consommation. Dite en une
            ligne plutôt qu'en paragraphe : l'obligation porte sur
            l'information, pas sur sa longueur. Discrète à dessein, 11 px
            en gris de service. Ce gris tient 4,5:1 sur le papier, le
            plancher AA : on ne peut pas l'éclaircir davantage, et une
            mention illisible ne remplirait plus son office. */}
        <p className="mt-7 text-center text-[11px] leading-relaxed tracking-[0.01em] text-muted md:mt-9">
          {t.transparence}
        </p>
      </div>
    </section>
  );
}

function CarteAvis({ carte, locale }: { carte: Carte; locale: Locale }) {
  const marque = MARQUES[carte.source];
  const drapeau = DRAPEAUX[carte.location];
  const { Logo } = marque;

  return (
    <article className="lh-avis">
      <div className="lh-avis__source">
        <Logo taille={16} />
        <span>{marque.nom}</span>
        <span className="lh-avis__note" aria-label={`${carte.rating} / 5`}>
          {"★".repeat(carte.rating)}
        </span>
      </div>

      <blockquote className="lh-avis__texte">{carte.text[locale]}</blockquote>

      <footer className="lh-avis__pied">
        <span className="lh-avis__nom">{carte.name}</span>
        <span className="lh-avis__lieu">
          {drapeau && <span aria-hidden="true">{drapeau} </span>}
          {carte.location}
        </span>
      </footer>
    </article>
  );
}
