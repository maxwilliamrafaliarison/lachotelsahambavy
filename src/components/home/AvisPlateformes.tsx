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
 * FORME RETENUE, après une version en liste à filets : des GÉLULES, dans
 * la langue du menu (demande de la direction, 14/08/2026). Fond pâle,
 * encre orange, remplissage à l'orange vif au survol, logo de la
 * plateforme et points médians comme séparateurs.
 *
 * ELLES S'ENROULENT au lieu de s'empiler : trois lignes à filets prenaient
 * dix rangées de hauteur pour trois liens. La demande était que la section
 * ne prenne pas de place, et c'est ce qui la tient compacte.
 *
 * La note n'est plus le grand chiffre de la version précédente : depuis
 * que la barre du haut porte la note consolidée sur chaque page, ce n'est
 * plus ici qu'on vient la chercher. Ici on vient choisir OÙ écrire.
 *
 * L'ACCESSIBILITÉ NE PERD RIEN à cette économie : l'action ayant disparu
 * du texte visible de chaque gélule, elle est ajoutée hors écran, en tête
 * du lien. Surtout pas par `aria-label`, qui REMPLACE le contenu au lieu
 * de s'y ajouter et effaçait donc la note et le nombre d'avis.
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
      nom: "Tripadvisor",
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
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start lg:gap-12">
            <div className="lg:col-span-4">
              <span className="ge-label mb-3">{t.label}</span>
              <h2 className="mb-3 text-[26px] leading-tight md:text-[30px]" style={{ textWrap: "balance" }}>
                {t.title}
              </h2>
              <p className="ge-measure text-[15px] leading-relaxed text-body">{t.subtitle}</p>
            </div>

            <div className="lg:col-span-8">
              {/* L'appel à l'action, énoncé une seule fois pour les trois
                  lignes. C'est ce qui permet aux lignes de n'être que des
                  lignes, et non trois boutons répétant la même phrase. */}
              <p className="mb-4 text-[11px] uppercase tracking-[0.16em] text-muted">{t.action}</p>

              {/* Gélules, dans la langue du menu : fond pâle, encre
                  orange, remplissage au survol. Elles s'enroulent au lieu
                  de s'empiler, ce qui tient la section en trois lignes de
                  hauteur au lieu de dix. */}
              <ul className="flex flex-wrap gap-2.5">
                {plateformes.map(({ id, nom, href, note, bareme, total, Logo }) => (
                  <li key={id}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="lh-gelule"
                    >
                      {/* L'action se dit dans le nom accessible, mais SANS
                          aria-label : celui-ci remplaçait tout le contenu,
                          si bien qu'un lecteur d'écran annonçait « Donner
                          mon avis (Booking.com) » et perdait la note et le
                          nombre d'avis. Sur téléphone, où la note
                          consolidée de la barre du haut est masquée, la
                          page n'annonçait plus aucun chiffre. Un texte
                          hors écran s'AJOUTE au contenu au lieu de s'y
                          substituer. */}
                      <span className="sr-only">{t.action} :</span>
                      <Logo taille={16} />
                      <span>{nom}</span>
                      <span aria-hidden="true" className="lh-gelule__point">·</span>
                      <span className="lh-gelule__note">
                        {nf.format(note)}/{bareme}
                      </span>
                      <span aria-hidden="true" className="lh-gelule__point">·</span>
                      <span className="lh-gelule__avis">
                        {t.reviews.replace("{n}", ni.format(total))}
                      </span>
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
