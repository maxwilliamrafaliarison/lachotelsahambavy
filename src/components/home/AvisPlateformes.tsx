import { siteConfig } from "@/data/site";
import ScrollReveal from "@/components/ui/ScrollReveal";
import LogoPlateforme from "@/components/ui/LogoPlateforme";
import type { Plateforme } from "@/data/testimonials";
import type { Locale } from "@/lib/utils";

/**
 * Où laisser un avis : les trois plateformes, en une bande.
 *
 * LA SECTION N'A PLUS NI TITRE NI CHAPÔ (direction, 21/08/2026). Elle en
 * avait : « Votre avis », « Vous avez séjourné chez nous ? » et trois
 * lignes d'explication, dans une colonne qui prenait le tiers de la
 * largeur. Tout est parti. Posée juste au-dessus des types
 * d'hébergement, la bande n'a pas besoin de se présenter : c'est la
 * seule chose à cet endroit de la page, et les logotypes disent
 * d'eux-mêmes de quoi il s'agit. Il reste une ligne pour annoncer
 * l'action, et les trois plateformes.
 *
 * ELLE N'A DONC PLUS DE <h2>, et ce n'est pas un oubli : un titre de
 * niveau deux annoncerait un chapitre, or ceci n'en est plus un. La
 * hiérarchie des titres de la page reste continue sans lui, vérifié.
 *
 * TROIS CELLULES À FILETS remplacent les gélules du 14/08. Les gélules
 * portaient des logos dessinés à la main, faute de place pour les vrais :
 * le logotype Booking exige 120 px de large, une gélule en faisait 230 en
 * tout. Voir LogoPlateforme pour le détail des chartes.
 *
 * ON NE RÉPÈTE PAS L'APPEL À L'ACTION dans chaque cellule. Il est énoncé
 * UNE fois, au-dessus : trois boutons portant la même phrase seraient
 * bavards, et c'est ce que la direction avait reproché à la toute
 * première version.
 *
 * OÙ MÈNENT LES LIENS (ce n'est pas uniforme, et c'est voulu) :
 *
 *  - Tripadvisor ouvre directement le formulaire de rédaction
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
 * il ne faut pas le retirer au nom de la prudence. Le contrat qui lie
 * l'hôtel est la version MALGACHE des conditions générales (v2601_nE_i),
 * et elle diffère de la française : son article 4.3.3 interdit d'employer
 * « la marque/le logo Booking.com [...] à des fins de comparaison de prix
 * ou à TOUTE AUTRE FIN [...] sans accord écrit préalable », mais la même
 * clause se termine par une permission, « l'établissement peut enchérir
 * sur la marque Booking.com ou l'employer pour son propre marketing ».
 * Le site de l'hôtel est son propre marketing.
 *
 * La tension porte sur un mot : l'interdiction dit « marque/logo », la
 * permission dit « marque ». Le nom est couvert sans discussion, le
 * pictogramme est discutable. Ne pas relire là-dessus la version
 * française des conditions, qui ne s'applique pas ici.
 *
 * À NE PAS CONFONDRE avec les avis eux-mêmes : leur reprise est, elle,
 * interdite sans accord écrit, et les sept avis Booking sont en réserve
 * pour cette raison (voir src/data/avis-booking-reserve.ts, que rien
 * n'importe).
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

  /* AUCUNE MARGE BASSE, et c'est le point de l'affaire. La bande fait
     91 px de haut et flottait dans 290 px de vide : 108 au-dessus,
     182 en dessous. Trois sections empilaient leurs marges autour d'un
     élément qui n'est pas un chapitre.

     Elle se rattache désormais à ce qu'elle annonce : sa marge basse
     tombe à zéro, et c'est la marge haute des hébergements, réduite elle
     aussi, qui fait toute la séparation. Le blanc au-dessus reste plus
     grand que celui du dessous, pour que l'œil rattache la bande aux
     chambres et non au bloc gris qui précède. */
  return (
    <section id="donner-un-avis" className="scroll-mt-24 pt-14 pb-0 md:pt-16">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <ScrollReveal>
          {/* PLUS DE TITRE NI DE CHAPÔ, sur décision de la direction
              (21/08/2026). La section portait « Votre avis / Vous avez
              séjourné chez nous ? » et trois lignes d'explication, dans
              une colonne de gauche qui occupait le tiers de la largeur.

              Elle se réduit désormais à ce qu'elle fait : une ligne qui
              annonce l'action, et les trois plateformes. Posée juste
              au-dessus des types d'hébergement, elle n'a pas besoin de se
              présenter ; c'est la seule chose à cet endroit de la page,
              et les logotypes disent d'eux-mêmes de quoi il s'agit.

              La section n'a donc plus de <h2>. Ce n'est pas un oubli : un
              titre de niveau deux annoncerait un chapitre, et ceci n'en
              est plus un. La hiérarchie des titres de la page reste
              continue sans lui. */}
          <div>
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
        </ScrollReveal>
      </div>
    </section>
  );
}
