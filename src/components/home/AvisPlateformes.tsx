import { siteConfig } from "@/data/site";
import ScrollReveal from "@/components/ui/ScrollReveal";
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
  Logo: () => React.ReactElement;
};

/* Les marques sont dessinées à leurs couleurs officielles : un client
   repère « Google » ou « TripAdvisor » à sa couleur avant de lire le mot. */

function LogoGoogle() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.53 5.53 0 0 1-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A11.99 11.99 0 0 0 12 24Z"
      />
      <path fill="#FBBC05" d="M5.27 14.29a7.2 7.2 0 0 1 0-4.58V6.62H1.29a12 12 0 0 0 0 10.76l3.98-3.09Z" />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.7 0 3.99 2.47 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75Z"
      />
    </svg>
  );
}

function LogoTripAdvisor() {
  /* La chouette : deux yeux cerclés de vert, pupilles noires, sourcil et
     bec. Même géométrie que la version monochrome du pied de page, portée
     ici au vert de la marque. */
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
      <g fill="none" stroke="#00AA6C" strokeWidth="1.7">
        <circle cx="7.4" cy="14" r="3.5" />
        <circle cx="16.6" cy="14" r="3.5" />
        <path d="M3 10.6C4.6 8.7 8 7.4 12 7.4s7.4 1.3 9 3.2" strokeLinecap="round" />
      </g>
      <path d="M12 7.4 10.2 5.1h3.6L12 7.4Z" fill="#00AA6C" />
      <circle cx="7.4" cy="14" r="1.35" fill="#1B1B17" />
      <circle cx="16.6" cy="14" r="1.35" fill="#1B1B17" />
    </svg>
  );
}

function LogoBooking() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
      <rect x="0" y="0" width="24" height="24" rx="5" fill="#003580" />
      {/* Le « B » de la marque, tracé plutôt que composé en texte : aucune
          dépendance à une police, donc un rendu identique partout. */}
      <path
        d="M7.6 5.6h4.28c2.2 0 3.5 1.06 3.5 2.83 0 1.06-.5 1.9-1.36 2.35 1.2.4 1.9 1.36 1.9 2.66 0 2-1.46 3.16-3.86 3.16H7.6V5.6Zm2.28 4.42h1.8c.92 0 1.44-.44 1.44-1.2 0-.75-.5-1.16-1.42-1.16h-1.82v2.36Zm0 4.6h2.02c1 0 1.56-.48 1.56-1.3 0-.83-.56-1.3-1.6-1.3H9.88v2.6Z"
        fill="#FFFFFF"
      />
      <circle cx="17.6" cy="15.5" r="1.25" fill="#FEBA02" />
    </svg>
  );
}

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
