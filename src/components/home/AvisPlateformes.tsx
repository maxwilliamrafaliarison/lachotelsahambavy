import { siteConfig } from "@/data/site";
import ScrollReveal from "@/components/ui/ScrollReveal";
import LogoPlateforme from "@/components/ui/LogoPlateforme";
import type { Plateforme } from "@/data/testimonials";
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
 * LE LOGO BOOKING RESTE, sur arbitrage de la direction (21/08/2026), et
 * il ne faut pas le retirer au nom de la prudence.
 *
 * Le contrat qui lie l'hôtel est la version MALGACHE des conditions
 * générales (v2601_nE_i, servie pour cc1=mg), et elle diffère de la
 * version française : son article 4.3.3 interdit d'employer « la
 * marque/le logo Booking.com [...] à des fins de comparaison de prix ou à
 * TOUTE AUTRE FIN [...] sans accord écrit préalable », mais la même
 * clause se termine par une permission, « l'établissement peut enchérir
 * sur la marque Booking.com ou l'employer pour son propre marketing ».
 * Le site de l'hôtel est son propre marketing.
 *
 * La tension porte sur un mot : l'interdiction dit « marque/logo », la
 * permission dit « marque ». Le nom est donc couvert sans discussion, le
 * pictogramme est discutable. La direction a tranché pour le garder, un
 * lien vers la fiche apportant des réservations à Booking. Le jour où
 * quelqu'un voudra revenir là-dessus, c'est cette clause qu'il faut
 * relire, et non celle de la version française, qui ne s'applique pas
 * ici.
 *
 * À NE PAS CONFONDRE avec les avis eux-mêmes : leur reprise est, elle,
 * interdite sans accord écrit, et les sept avis Booking sont en réserve
 * pour cette raison (voir CONSENTEMENT_BOOKING dans testimonials.ts).
 *
 * Server Component : trois liens, aucune interactivité.
 */

type Fiche = {
  id: Plateforme;
  nom: string;
  href: string;
  note: number;
  bareme: 5 | 10;
  total: number;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function AvisPlateformes({ dict, locale }: { dict: any; locale: Locale }) {
  const t = dict.reviewsCta;
  /* « 9 sur 10 » pour les lecteurs d'écran : la clé vit dans la section
     des témoignages, qui en a besoin aussi. Une seule formulation pour
     les deux endroits du site où une note est lue à voix haute. */
  const noteSur: string = dict.testimonials?.noteSur ?? "{note} sur {bareme}";

  const plateformes: Fiche[] = [
    {
      id: "booking",
      nom: "Booking.com",
      href: siteConfig.social.booking,
      note: siteConfig.ratings.booking.score,
      bareme: 10,
      total: siteConfig.ratings.booking.total,
    },
    {
      id: "google",
      nom: "Google",
      href: siteConfig.social.googleAvis,
      note: siteConfig.ratings.google.score,
      bareme: 5,
      total: siteConfig.ratings.google.total,
    },
    {
      id: "tripadvisor",
      nom: "Tripadvisor",
      href: siteConfig.social.tripadvisorAvis,
      note: siteConfig.ratings.tripadvisor.score,
      bareme: 5,
      total: siteConfig.ratings.tripadvisor.total,
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

              {/* UNE BANDE, ET NON PLUS TROIS GÉLULES. Les gélules
                  portaient des logos dessinés à la main, faute de place
                  pour les vrais : le logotype Booking exige 120 px de
                  large, une gélule en fait 230 en tout. Trois cellules
                  à filets laissent à chaque marque sa taille réelle sans
                  que la section prenne beaucoup plus de hauteur.

                  ALIGNÉ À GAUCHE dans chaque cellule : Tripadvisor
                  l'impose, Booking le recommande. */}
              <ul className="lh-plateformes">
                {plateformes.map(({ id, nom, href, note, bareme, total }) => (
                  <li key={id}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="lh-plateforme"
                    >
                      {/* L'action se dit dans le nom accessible, mais SANS
                          aria-label : celui-ci remplacerait tout le
                          contenu et effacerait la note et le nombre
                          d'avis. Le nom de la plateforme, lui, est porté
                          par le texte alternatif du logotype. */}
                      <span className="sr-only">{t.action} :</span>
                      <LogoPlateforme plateforme={id} hauteur={20} />
                      <span className="lh-plateforme__chiffres">
                        <span aria-hidden="true">
                          {nf.format(note)}/{bareme}
                        </span>
                        <span className="sr-only">
                          {noteSur
                            .replace("{note}", nf.format(note))
                            .replace("{bareme}", String(bareme))}
                        </span>
                        <span aria-hidden="true" className="lh-plateforme__point">
                          ·
                        </span>
                        <span>{t.reviews.replace("{n}", ni.format(total))}</span>
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
