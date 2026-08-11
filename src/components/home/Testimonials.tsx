"use client";

import { useState } from "react";
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
 * Ruban de témoignages, en défilement continu.
 *
 * POURQUOI UN RUBAN ET NON UN CARROUSEL. Un carrousel a des vues, un
 * index, des flèches : il dit « il y a quinze avis, en voici un ». Une
 * piste qui glisse sans fin dit « il y en a trop pour les compter ».
 * C'est une figure d'abondance, et c'est ce qu'on est venu chercher en
 * regardant ce que fait Hostinger.
 *
 * LE PROCÉDÉ. La liste est rendue DEUX FOIS dans la même piste, et
 * l'animation translate celle-ci de -50 % avant de repartir à zéro. À
 * l'instant du saut, le second exemplaire occupe exactement la place
 * qu'occupait le premier : l'œil ne voit aucune couture. Le doublon est
 * marqué aria-hidden, sinon un lecteur d'écran énoncerait chaque avis
 * deux fois.
 *
 * LES AVIS SONT MÊLÉS, un par plateforme à tour de rôle, et non rangés
 * par source comme dans la version précédente à trois colonnes. Le
 * mélange est calculé, jamais tiré au sort : le serveur et le client
 * doivent produire le même ordre, sans quoi l'hydratation casse.
 *
 * QUINZE AVIS, TOUS RÉELS. Voir l'en-tête de src/data/testimonials.ts :
 * les trente témoignages rédigés en interne ont été supprimés.
 *
 * PAS DE MENTION DE TRANSPARENCE SOUS LE RUBAN : elle y figurait, la
 * direction l'a fait retirer le 10/08/2026. L'article L.111-7-2 du Code
 * de la consommation demande pourtant à tout site affichant des avis de
 * dire s'ils sont contrôlés et par qui. Les libellés restent dans les
 * dictionnaires (`testimonials.transparence`) : remettre le paragraphe
 * est l'affaire d'une ligne.
 */

type Plateforme = "booking" | "google" | "tripadvisor";

type Carte = Review & { source: Plateforme };

const MARQUES: Record<Plateforme, { nom: string; href: string; Logo: (p: { taille?: number }) => React.ReactElement }> = {
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
  /* Le défilement se met en pause au survol par CSS. Ce bouton existe
     pour tous les autres : WCAG 2.2.2 demande qu'un mouvement qui dure
     plus de cinq secondes puisse être arrêté, et un visiteur au clavier
     ou sur écran tactile n'a pas de survol. */
  const [enMarche, setEnMarche] = useState(true);

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
      <div className="lh-ruban" data-anime={enMarche ? "true" : "false"}>
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
        <div className="mt-8 flex flex-col items-center gap-4 text-center md:mt-10">
          <button
            type="button"
            onClick={() => setEnMarche((m) => !m)}
            aria-pressed={!enMarche}
            className="lh-ruban__pause"
          >
            {enMarche ? (
              <svg viewBox="0 0 12 12" width="9" height="9" aria-hidden="true" fill="currentColor">
                <rect x="2" y="1.5" width="2.6" height="9" rx="0.6" />
                <rect x="7.4" y="1.5" width="2.6" height="9" rx="0.6" />
              </svg>
            ) : (
              <svg viewBox="0 0 12 12" width="9" height="9" aria-hidden="true" fill="currentColor">
                <path d="M3 1.6l7 4.4-7 4.4z" />
              </svg>
            )}
            {enMarche ? t.pause : t.lecture}
          </button>
        </div>
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
