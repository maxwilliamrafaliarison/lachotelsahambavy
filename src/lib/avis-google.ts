import { z } from "zod";
import type { Locale } from "@/lib/utils";

/**
 * Avis Google, récupérés en direct sur l'API Places.
 *
 * POURQUOI CEUX-CI NE SONT PAS DANS testimonials.ts, ET NE DOIVENT
 * JAMAIS Y ENTRER. La politique de Google est explicite : hors le
 * `place_id`, rien de ce que rend l'API ne peut être préchargé, mis en
 * cache ni conservé. Un avis Google recopié dans un fichier du dépôt
 * serait un entrepôt, ce que la règle interdit. Et les conditions
 * générales de Google ajoutent qu'on ne peut reproduire le contenu de
 * leurs services que par une API officielle ou avec autorisation : la
 * recopie à la main, telle qu'elle avait été faite depuis un agrégateur,
 * n'était donc pas permise non plus.
 *
 * D'où deux modèles distincts dans le code, et il faut les garder
 * distincts : `Avis` (testimonials.ts) est relevé, traduit, vérifié et
 * stocké ; `AvisGoogle` ne vit que le temps d'un rendu.
 *
 * TROIS OBLIGATIONS D'AFFICHAGE, que le composant doit honorer :
 *   1. créditer l'auteur « avec toutes les ressources disponibles
 *      (avatar, nom et lien de profil) quand la place le permet » ;
 *   2. donner accès à l'avis lui-même sur Google Maps, par le
 *      `googleMapsUri` que l'API fournit ;
 *   3. « indiquer clairement comment les avis sont triés et filtrés ».
 *      L'API en rend cinq au plus, les plus pertinents selon Google, et
 *      la mention de transparence de la section le dit.
 *
 * CINQ AVIS AU MAXIMUM, sur les 177 que porte la fiche. C'est la limite
 * de l'API Places, et c'est le prix de la simplicité : elle ne demande
 * qu'une clé, là où l'API Business Profile exige un dossier instruit
 * pendant deux semaines, un OAuth à renouveler, et n'est de toute façon
 * pas prévue pour alimenter un site public.
 *
 * SANS CLÉ, LE SITE NE CHANGE PAS. Toute défaillance (variable absente,
 * réseau, quota dépassé, réponse inattendue) rend un tableau vide, et la
 * section se contente alors des avis Tripadvisor. Cette fonction ne jette
 * jamais : un avis client n'est pas une raison de casser une page.
 */

/* Identifiant de la fiche, vérifié et non recopié d'une source tierce :
   ses octets décodés contiennent les deux moitiés du FID de l'hôtel, et
   la seconde vaut exactement le CID 9763325951372533936 que porte
   siteConfig. Le `place_id` est le SEUL champ que Google autorise à
   conserver indéfiniment ; c'est pour cela qu'il peut figurer ici. */
export const PLACE_ID = "ChIJZ7Frpw7F5yERsKDpdTlNfoc";

/** Durée de vie du rendu, en secondes. Voir la note sur le cache plus bas. */
const FRAICHEUR = 3600;

const TexteLocalise = z.object({
  text: z.string(),
  languageCode: z.string().optional(),
});

const AvisBrut = z.object({
  rating: z.number().min(1).max(5),
  text: TexteLocalise.optional(),
  originalText: TexteLocalise.optional(),
  relativePublishTimeDescription: z.string().optional(),
  publishTime: z.string().optional(),
  googleMapsUri: z.string().url().optional(),
  authorAttribution: z
    .object({
      displayName: z.string(),
      uri: z.string().url().optional(),
      photoUri: z.string().url().optional(),
    })
    .optional(),
});

const Reponse = z.object({ reviews: z.array(AvisBrut).optional() });

export type AvisGoogle = {
  /** Nom d'affichage de l'auteur, tel que Google le donne. */
  auteur: string;
  /** Profil de l'auteur. Obligatoire à afficher si présent. */
  auteurUrl?: string;
  /** Avatar. À afficher « quand la place le permet ». */
  auteurPhoto?: string;
  note: number;
  texte: string;
  /** Google traduit lui-même : il faut le dire, comme pour nos traductions. */
  traduitParGoogle: boolean;
  /** « il y a un mois », déjà localisé par Google. */
  dateRelative: string;
  /** L'avis sur Google Maps. Obligatoire à afficher si présent. */
  urlAvis?: string;
};

/** Le paramètre de langue attendu par l'API, à partir de notre locale. */
function langue(locale: Locale): string {
  return locale === "en" ? "en" : locale === "es" ? "es" : "fr";
}

export async function recupererAvisGoogle(locale: Locale): Promise<AvisGoogle[]> {
  /* PAS D'AVIS GOOGLE EN EXPORT STATIQUE, et c'est une question de règle
     avant d'être une question technique. Le site se construit aussi en
     pages figées pour GitHub Pages (NEXT_PUBLIC_BASE_PATH défini, output
     "export"). Dans ce mode, la récupération n'aurait lieu qu'une fois,
     à la construction, et le texte des avis serait écrit en dur dans le
     HTML livré : exactement l'entreposage que la politique de Google
     interdit, et des avis figés jusqu'au prochain déploiement par
     surcroît. La version statique se contente donc de Tripadvisor. */
  if (process.env.NEXT_PUBLIC_BASE_PATH) return [];

  const cle = process.env.GOOGLE_PLACES_API_KEY;
  if (!cle) return [];

  try {
    const url =
      `https://places.googleapis.com/v1/places/${PLACE_ID}` +
      `?languageCode=${langue(locale)}&regionCode=MG`;

    const r = await fetch(url, {
      headers: {
        "X-Goog-Api-Key": cle,
        /* Le masque limite la réponse à ce qu'on affiche. Ce n'est pas
           qu'une économie : la facturation de l'API Places dépend des
           champs demandés, et demander la fiche entière pour cinq avis
           la ferait basculer dans une strate plus chère. */
        "X-Goog-FieldMask": "reviews",
      },
      /* UN CACHE DE RENDU D'UNE HEURE, ET RIEN D'AUTRE. La politique de
         Google interdit de précharger, mettre en cache ou conserver le
         contenu de l'API. La lecture la plus stricte imposerait un appel
         par affichage de page, ce qui serait coûteux et lent sans rien
         apporter au lecteur. Le compromis retenu : une heure de
         fraîcheur, en mémoire du serveur de rendu, jamais sur disque et
         jamais en base. Aucun texte d'avis n'est écrit nulle part.
         Pour revenir à la lecture stricte, mettre FRAICHEUR à 0. */
      next: { revalidate: FRAICHEUR },
    });

    if (!r.ok) return [];

    const analyse = Reponse.safeParse(await r.json());
    if (!analyse.success) return [];

    return (analyse.data.reviews ?? []).flatMap((a) => {
      const texte = a.text?.text ?? a.originalText?.text;
      const auteur = a.authorAttribution?.displayName;
      /* Un avis sans texte est une note seule : Google en compte
         beaucoup, et une carte vide ne dit rien. Un avis sans auteur ne
         peut pas être crédité, donc pas affiché. */
      if (!texte || !auteur) return [];

      const langueTexte = a.text?.languageCode;
      const langueOrigine = a.originalText?.languageCode;

      return [
        {
          auteur,
          auteurUrl: a.authorAttribution?.uri,
          auteurPhoto: a.authorAttribution?.photoUri,
          note: Math.round(a.rating),
          texte,
          traduitParGoogle: Boolean(
            langueTexte && langueOrigine && langueTexte !== langueOrigine,
          ),
          dateRelative: a.relativePublishTimeDescription ?? "",
          urlAvis: a.googleMapsUri,
        },
      ];
    });
  } catch {
    /* Réseau coupé, quota dépassé, réponse illisible : la page se rend
       sans Google. Voir la note en tête. */
    return [];
  }
}
