import { siteConfig } from "@/data/site";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { LogoGoogle, LogoTripAdvisor, LogoBooking } from "@/components/ui/LogosPlateformes";
import type { Locale } from "@/lib/utils";

/**
 * « Donnez votre avis » : les trois plateformes, en liste.
 *
 * REFONTE DU 14/08/2026. La version précédente alignait trois cartes
 * bordées, chacune terminée par « Donner mon avis » et une flèche. Trois
 * encadrés, trois boutons, la même phrase répétée trois fois pour un seul
 * geste : c'était bavard, et la direction l'a jugé lourd.
 *
 * CE QUI A ÉTÉ RETIRÉ, et pourquoi c'est le sujet. Le luxe ici tient à ce
 * qu'on enlève, pas à ce qu'on ajoute :
 *   - les bordures. Trois cadres pour trois lignes de même nature ne
 *     séparent rien qu'un filet ne sépare mieux ;
 *   - l'encart blanc qui enveloppait le tout. La section respire sur le
 *     papier de la page, comme les autres ;
 *   - la triple répétition de l'appel à l'action. Il est énoncé UNE fois,
 *     au-dessus de la liste. Chaque ligne n'a plus besoin que de sa
 *     flèche : l'intention a déjà été dite.
 *
 * CE QUI DEVIENT L'OBJET PRINCIPAL : la note. Elle passe en chiffre
 * ample et léger, dans la fonte de titrage, alignée à droite en chiffres
 * tabulaires pour que les trois se lisent en colonne. C'est l'information
 * qui rassure un voyageur hésitant ; elle méritait mieux qu'un corps 13.
 *
 * L'ACCESSIBILITÉ NE PERD RIEN à cette économie : l'action ayant disparu
 * du texte visible de chaque ligne, elle est portée par l'`aria-label`,
 * qui reste complet (« Donner mon avis (Booking.com) »).
 *
 * OÙ MÈNENT LES LIENS (ce n'est pas uniforme, et c'est voulu) :
 *
 *  - TripAdvisor ouvre directement le formulaire de rédaction
 *    (UserReviewEdit, mêmes identifiants g/d que la fiche).
 *  - Google ouvre la fiche de l'hôtel par son CID, d'où « Rédiger un avis »
 *    est à un clic. Le lien direct `search.google.com/local/writereview`
 *    exige le Place ID : il se déduit du CID, mais aucune vérification
 *    publique n'était possible sans compte connecté et un identifiant
 *    erroné enverrait les clients noter un autre établissement. Maggie peut
 *    récupérer le lien officiel dans sa fiche d'établissement Google
 *    (« Demander des avis ») ; il remplacera celui-ci tel quel.
 *  - Booking.com n'expose aucune URL publique de rédaction : la plateforme
 *    n'accepte un avis que d'un client identifié, via le lien qu'elle lui
 *    envoie après le séjour. Le lien mène donc à la fiche de l'hôtel.
 *
 * Server Component : trois liens, aucune interactivité.
 */

type Plateforme = {
  id: string;
  nom: string;
  href: string;
  note: number;
  bareme: 5 | 10;
  total: number;
  Logo: (p: { taille?: number }) => React.ReactElement;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function AvisPlateformes({ dict, locale }: { dict: any; locale: Locale }) {
  const t = dict.reviewsCta;

  const plateformes: Plateforme[] = [
    {
      id: "booking",
      nom: "Booking.com",
      href: siteConfig.social.booking,
      note: siteConfig.ratings.booking.score,
      bareme: 10,
      total: siteConfig.ratings.booking.total,
      Logo: LogoBooking,
    },
    {
      id: "google",
      nom: "Google",
      href: siteConfig.social.googleAvis,
      note: siteConfig.ratings.google.score,
      bareme: 5,
      total: siteConfig.ratings.google.total,
      Logo: LogoGoogle,
    },
    {
      id: "tripadvisor",
      nom: "TripAdvisor",
      href: siteConfig.social.tripadvisorAvis,
      note: siteConfig.ratings.tripadvisor.score,
      bareme: 5,
      total: siteConfig.ratings.tripadvisor.total,
      Logo: LogoTripAdvisor,
    },
  ];

  const nf = new Intl.NumberFormat(locale === "en" ? "en-GB" : locale === "es" ? "es-ES" : "fr-FR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
  const ni = new Intl.NumberFormat(locale === "en" ? "en-GB" : locale === "es" ? "es-ES" : "fr-FR");

  return (
    <section id="donner-un-avis" className="scroll-mt-24 py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <ScrollReveal>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start lg:gap-16">
            <div className="lg:col-span-5">
              <span className="ge-label mb-3">{t.label}</span>
              <h2 className="mb-3 text-[26px] leading-tight md:text-[30px]" style={{ textWrap: "balance" }}>
                {t.title}
              </h2>
              <p className="ge-measure text-[15px] leading-relaxed text-body">{t.subtitle}</p>
            </div>

            <div className="lg:col-span-7">
              {/* L'appel à l'action, énoncé une seule fois pour les trois
                  lignes. C'est ce qui permet aux lignes de n'être que des
                  lignes, et non trois boutons répétant la même phrase. */}
              <p className="mb-4 text-[11px] uppercase tracking-[0.16em] text-muted">{t.action}</p>

              {/* Filet en tête : la liste est encadrée haut et bas, ce qui la
                  pose comme un objet et non comme trois lignes flottantes. */}
              <ul className="border-t border-hairline">
                {plateformes.map(({ id, nom, href, note, bareme, total, Logo }) => (
                  <li key={id}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${t.action} (${nom})`}
                      className="group flex items-center gap-4 border-b border-hairline py-6 transition-colors duration-300 hover:border-ink/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lake focus-visible:ring-offset-4"
                    >
                      <Logo taille={22} />

                      <span className="min-w-0 flex-1">
                        <span className="block text-[15px] font-medium leading-tight text-ink">
                          {nom}
                        </span>
                        <span className="block text-[12px] leading-tight text-muted">
                          {t.reviews.replace("{n}", ni.format(total))}
                        </span>
                      </span>

                      {/* La note, en chiffre ample et léger : c'est elle que
                          le voyageur hésitant vient chercher. Tabulaire pour
                          que les trois s'alignent à la virgule près. */}
                      {/* Largeur minimale et alignement à droite : sans cela
                          « 9,0/10 » et « 4,1/5 » ne tombent pas sur la même
                          colonne, et l'œil ne peut plus comparer les trois
                          notes d'un seul balayage vertical. */}
                      <span className="flex min-w-[4.75rem] items-baseline justify-end gap-0.5 font-[family-name:var(--font-display)] tabular-nums">
                        <span className="text-[26px] font-light leading-none text-ink md:text-[30px]">
                          {nf.format(note)}
                        </span>
                        <span className="text-[13px] leading-none text-muted">/{bareme}</span>
                      </span>

                      <svg
                        viewBox="0 0 16 16"
                        width="13"
                        height="13"
                        aria-hidden="true"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="ml-1 shrink-0 text-muted transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:text-ink motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                      >
                        <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" />
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
