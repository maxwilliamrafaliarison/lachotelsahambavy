import { siteConfig } from "@/data/site";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { LogoGoogle, LogoTripAdvisor, LogoBooking } from "@/components/ui/LogosPlateformes";
import type { Locale } from "@/lib/utils";

/**
 * « Donnez votre avis » : trois boutons vers Booking, Google et TripAdvisor,
 * posés juste avant les types de chambres (demande de Maggie, 09/08/2026).
 *
 * POURQUOI UN ENCART ET PAS UNE BANDE
 * La section précédente (« Notre Maison ») est déjà sur fond brume et la
 * grille des chambres sur papier. Une troisième bande de couleur aurait
 * haché la page ; l'encart bordé se lit comme une respiration, pas comme
 * un étage de plus.
 *
 * OÙ MÈNENT LES BOUTONS (ce n'est pas uniforme, et c'est voulu) :
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
 *    envoie après le séjour. Le bouton mène donc à la fiche de l'hôtel.
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
          <div className="grid grid-cols-1 gap-8 rounded-[3px] border border-hairline bg-white p-7 md:p-10 lg:grid-cols-12 lg:items-center lg:gap-12">
            <div className="lg:col-span-5">
              <span className="ge-label mb-3">{t.label}</span>
              <h2 className="mb-3 text-[26px] leading-tight md:text-[30px]" style={{ textWrap: "balance" }}>
                {t.title}
              </h2>
              <p className="ge-measure text-[15px] leading-relaxed text-body">{t.subtitle}</p>
            </div>

            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:col-span-7">
              {plateformes.map(({ id, nom, href, note, bareme, total, Logo }) => (
                <li key={id}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${t.action} (${nom})`}
                    className="group flex h-full flex-col gap-3 rounded-[3px] border border-hairline px-5 py-5 transition-colors duration-300 hover:border-terracotta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
                  >
                    <Logo />
                    <span className="text-[15px] font-medium leading-none text-ink">{nom}</span>
                    <span className="text-[13px] leading-none text-muted">
                      <span className="font-medium tabular-nums text-ink">
                        {nf.format(note)}/{bareme}
                      </span>{" "}
                      · {t.reviews.replace("{n}", ni.format(total))}
                    </span>
                    <span className="mt-auto flex items-center gap-1.5 pt-2 text-[13px] font-medium text-terracotta">
                      {t.action}
                      <svg
                        viewBox="0 0 16 16"
                        width="12"
                        height="12"
                        aria-hidden="true"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="transition-transform duration-300 group-hover:translate-x-0.5"
                      >
                        <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" />
                      </svg>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
