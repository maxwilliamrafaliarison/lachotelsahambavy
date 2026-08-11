"use client";

import { useCallback, useEffect, useRef } from "react";
import ScrollReveal from "@/components/ui/ScrollReveal";
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
 * LA BOUCLE. La liste est rendue DEUX FOIS, et le recalage joue dans les
 * DEUX SENS : passé la moitié de la piste on retranche cette moitié,
 * revenu au début on l'ajoute. Le second exemplaire occupant exactement
 * la place du premier, l'œil ne voit aucun saut, et la piste n'a plus ni
 * fin ni commencement, quel que soit le sens du geste. Le doublon est
 * marqué aria-hidden, sinon un lecteur d'écran énoncerait chaque avis
 * deux fois.
 *
 * ACCESSIBILITÉ. WCAG 2.2.2 demande qu'un mouvement de plus de cinq
 * secondes puisse être arrêté. Le bouton explicite ayant été retiré, ce
 * rôle revient au survol, au focus clavier et à tout geste de
 * défilement, qui figent la piste. Sous prefers-reduced-motion, seule
 * l'avance automatique est supprimée : la boucle de recalage, elle,
 * continue de tourner, sans quoi la piste buterait sur sa fin et le
 * doublon masqué aux lecteurs d'écran deviendrait pleinement visible.
 *
 * QUINZE AVIS, TOUS RÉELS. Voir l'en-tête de src/data/testimonials.ts.
 */

type Plateforme = "booking" | "google" | "tripadvisor";

type Carte = Review & { source: Plateforme };

/* Nom et logo de la plateforme d'origine. Les cartes ne sont pas
   cliquables : les liens vers les plateformes vivent dans la barre
   supérieure et dans la section des notes, et un lien dans une piste qui
   glisse serait de toute façon une cible mouvante. */
const MARQUES: Record<
  Plateforme,
  { nom: string; Logo: (p: { taille?: number }) => React.ReactElement }
> = {
  booking: { nom: "Booking.com", Logo: LogoBooking },
  google: { nom: "Google", Logo: LogoGoogle },
  tripadvisor: { nom: "TripAdvisor", Logo: LogoTripAdvisor },
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

/** Gel long, le temps qu'un survol à la souris ou un focus clavier dure. */
const GEL_LONG = 600_000;

/**
 * Gel d'un geste au doigt ou au stylet, en millisecondes.
 *
 * La souris annonce son départ : `pointerleave` relance la piste, le gel
 * peut donc durer tant que le curseur reste dessus. Rien n'annonce en
 * revanche qu'un doigt s'est éloigné, et un gel long figerait le ruban
 * pour le reste de la visite. Quarante secondes : de quoi lire deux ou trois
 * avis posément, sans que la page paraisse morte à qui l'a effleurée.
 */
const GEL_TACTILE = 40_000;

/** Durée du gel posé par un geste, selon ce qui l'a produit. */
function gelDuGeste(type: string) {
  return type === "mouse" ? GEL_LONG : GEL_TACTILE;
}

/**
 * Replie une position de défilement dans la première moitié de la piste,
 * celle-ci contenant deux exemplaires identiques de la liste.
 *
 * Le repli joue dans LES DEUX SENS : au-delà de la moitié on retranche
 * cette moitié, revenu au début on l'ajoute. Sans ce second cas, un
 * glissement vers la droite buterait sur le début de la piste.
 *
 * La comparaison haute est STRICTE, pour que la position « moitié » soit
 * un point de repos : sinon les deux replis se renverraient la piste
 * image après image dès qu'elle s'immobilise sur zéro.
 */
function recaler(position: number, moitie: number) {
  if (moitie <= 0) return position;
  if (position > moitie) return position - moitie;
  if (position <= 0) return position + moitie;
  return position;
}

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

// Les pays sont écrits en français dans testimonials.ts, où ils servent
// aussi de clé aux drapeaux : sans cette table ils resteraient en
// français sur /en et /es. Mêmes clés que DRAPEAUX, à tenir à jour avec
// lui. Pays absent de la table, on affiche le libellé français plutôt
// que rien.
const PAYS: Record<string, Record<Locale, string>> = {
  Allemagne: { fr: "Allemagne", en: "Germany", es: "Alemania" },
  Australie: { fr: "Australie", en: "Australia", es: "Australia" },
  Belgique: { fr: "Belgique", en: "Belgium", es: "Bélgica" },
  Espagne: { fr: "Espagne", en: "Spain", es: "España" },
  France: { fr: "France", en: "France", es: "Francia" },
  Italie: { fr: "Italie", en: "Italy", es: "Italia" },
  "La Réunion": { fr: "La Réunion", en: "Réunion", es: "La Reunión" },
  Madagascar: { fr: "Madagascar", en: "Madagascar", es: "Madagascar" },
  "Royaume-Uni": { fr: "Royaume-Uni", en: "United Kingdom", es: "Reino Unido" },
  Suisse: { fr: "Suisse", en: "Switzerland", es: "Suiza" },
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

    /* Le réglage système ne suspend que l'AVANCE automatique, jamais la
       boucle : c'est elle qui recale la piste, et une piste non recalée
       bute sur sa fin en exposant le doublon réservé aux yeux. Lu à
       chaque image plutôt qu'une fois pour toutes, il est donc pris en
       compte même s'il change en cours de visite. */
    const moinsDeMouvement = window.matchMedia("(prefers-reduced-motion: reduce)");

    let raf = 0;
    let precedent = performance.now();

    const avancer = (maintenant: number) => {
      // Onglet réveillé après une heure : on ne rattrape pas le retard.
      const dt = Math.min(maintenant - precedent, 100);
      precedent = maintenant;
      if (
        !moinsDeMouvement.matches &&
        maintenant >= geleJusqua.current &&
        !document.hidden
      ) {
        piste.scrollLeft += (VITESSE * dt) / 1000;
      }
      /* Recalage : le second exemplaire occupant exactement la place du
         premier, le repli est invisible et la boucle n'a ni fin ni
         commencement. Il tourne à chaque image, y compris quand l'avance
         est suspendue, car la molette et le doigt déplacent eux aussi la
         piste.

         On n'écrit `scrollLeft` que si la valeur change : réécrire la
         position déjà en place ne déplace rien, mais peut couper net le
         défilement par inertie lancé au doigt sur mobile, où la boucle
         tourne justement pendant que la piste glisse toute seule. */
      const cible = recaler(piste.scrollLeft, piste.scrollWidth / 2);
      if (cible !== piste.scrollLeft) piste.scrollLeft = cible;
      raf = requestAnimationFrame(avancer);
    };

    raf = requestAnimationFrame(avancer);
    return () => cancelAnimationFrame(raf);
  }, []);

  /* Saisie à la souris. Le doigt et la molette n'ont besoin de rien : le
     conteneur défile nativement.

     On ne retient que la dernière abscisse du pointeur, et le
     déplacement appliqué est RELATIF. Une position absolue calculée
     depuis le début du geste annulerait le recalage de boucle au
     mouvement suivant : la piste resterait bloquée sur son début dès que
     l'on tire vers la droite. Le repli est refait ici, et pas seulement
     dans la boucle, sinon le navigateur bloquerait la position à zéro
     jusqu'à l'image suivante et la saisie accrocherait au passage. */
  const saisie = useRef<{ x: number } | null>(null);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    suspendre(gelDuGeste(e.pointerType));
    if (e.pointerType !== "mouse") return;
    const piste = pisteRef.current;
    if (!piste) return;
    saisie.current = { x: e.clientX };
    piste.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = saisie.current;
    const piste = pisteRef.current;
    if (!s || !piste) return;
    const vise = piste.scrollLeft - (e.clientX - s.x);
    piste.scrollLeft = recaler(vise, piste.scrollWidth / 2);
    s.x = e.clientX;
  };

  /* Gel de survol réservé à la SOURIS. Un doigt qui se pose déclenche lui
     aussi l'entrée du pointeur, et il ne repart jamais vraiment : une
     simple tape figeait le ruban dix minutes. Le tactile a son propre
     gel, posé au contact, qui expire seul (voir GEL_TACTILE). */
  const survol = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse") suspendre(GEL_LONG);
  };

  const finSurvol = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse") suspendre(0);
  };

  /* Le gel posé ici doit valoir celui du contact : un relâchement ne
     signifie pas que l'on a fini de lire. Au doigt il expirera de
     lui-même, à la souris c'est `pointerleave` qui relancera la piste. */
  const relacher = (e: React.PointerEvent<HTMLDivElement>) => {
    const piste = pisteRef.current;
    if (saisie.current && piste?.hasPointerCapture(e.pointerId)) {
      piste.releasePointerCapture(e.pointerId);
    }
    saisie.current = null;
    suspendre(gelDuGeste(e.pointerType));
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
        onPointerEnter={survol}
        onPointerLeave={finSurvol}
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
  const pays = PAYS[carte.location]?.[locale] ?? carte.location;
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
          {pays}
        </span>
      </footer>
    </article>
  );
}
