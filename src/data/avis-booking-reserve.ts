import type { Avis } from "./testimonials";

/**
 * Les sept avis Booking, EN RÉSERVE ET HORS DU SITE.
 *
 * CE FICHIER N'EST IMPORTÉ PAR PERSONNE, et c'est tout son objet.
 *
 * Ils vivaient dans testimonials.ts, filtrés à l'exécution par un
 * booléen. Le rendu était juste : aucun n'apparaissait dans le HTML.
 * Mais le filtre étant évalué à l'exécution, le paquet JavaScript les
 * emportait quand même : ils partaient en clair, texte et traductions,
 * chez chaque visiteur, dans un fragment de 56 ko. Or l'article 4.2.4
 * des conditions générales de Booking interdit à l'établissement
 * d'utiliser les avis « de quelque manière que ce soit », et les
 * distribuer à tout visiteur du site en est une.
 *
 * Les sortir dans un module que rien n'importe est la seule façon
 * certaine de ne pas les livrer : aucun assembleur ne peut inclure ce
 * qu'aucun chemin n'atteint.
 *
 * POURQUOI LES GARDER. Le relevé et les traductions représentent un
 * travail réel, et l'article 4.2.4 prévoit lui-même la levée de
 * l'interdiction : il suffit d'un accord écrit de Booking, que la
 * direction peut demander depuis son extranet. Le jour où il arrive, il
 * suffit d'importer `avisBookingEnReserve` dans testimonials.ts et de le
 * concaténer à `tousLesAvis`.
 *
 * D'ici là, personne ne doit ajouter cet import. Textes relevés le
 * 21/08/2026 sur la fiche de l'hôtel.
 */

const BOOKING = "https://www.booking.com/hotel/mg/lac-sahambavy.fr.html#tab-reviews";

export const avisBookingEnReserve: Avis[] = [
  {
    auteur: "Isabelle",
    pays: "La Réunion",
    plateforme: "booking",
    note: 10,
    bareme: 10,
    dateAvis: { fr: "25 juillet 2025", en: "25 July 2025", es: "25 de julio de 2025" },
    langueOriginale: "fr",
    original:
      "Un havre de paix, bungalows sur pilotis les pieds dans l'eau très confortables. Le personnel souriant et aux p'tits soins. Un magnifique jardin botanique bien entretenu. La piscine doit être bien agréable en été austral. Et l'on y mange très bien. Je recommande vivement cet endroit hors du temps.",
    traduction: {
      en: "A haven of peace, with very comfortable overwater bungalows right at the water's edge. Smiling staff who look after every detail. A magnificent, well-kept botanical garden. The pool must be lovely in the southern summer. And the food is very good. I warmly recommend this timeless place.",
      es: "Un remanso de paz, con bungalós sobre pilotes muy cómodos, a ras del agua. Personal sonriente y pendiente de todo. Un magnífico jardín botánico bien cuidado. La piscina debe de ser deliciosa en el verano austral. Y se come muy bien. Recomiendo vivamente este lugar fuera del tiempo.",
    },
    source: BOOKING,
  },
  {
    auteur: "Michel",
    pays: "France",
    plateforme: "booking",
    note: 9,
    bareme: 10,
    dateAvis: { fr: "20 octobre 2025", en: "20 October 2025", es: "20 de octubre de 2025" },
    langueOriginale: "fr",
    original:
      "Endroit magnifique, personnel très serviable et prévenant. Nous avons passé un excellent séjour. Nous avons également visité la plantation de thé grâce à Toky le réceptionniste qui a fait le nécessaire car le weekend l'usine était fermée... Grand remerciement !",
    traduction: {
      en: "A magnificent place, with very helpful and thoughtful staff. We had an excellent stay. We also visited the tea plantation thanks to Toky the receptionist, who made the arrangements because the factory was closed at the weekend... Many thanks!",
      es: "Un lugar magnífico, con un personal muy servicial y atento. Pasamos una estancia excelente. También visitamos la plantación de té gracias a Toky, el recepcionista, que se ocupó de todo porque el fin de semana la fábrica estaba cerrada... ¡Muchas gracias!",
    },
    source: BOOKING,
  },
  {
    auteur: "Amelia",
    pays: "France",
    plateforme: "booking",
    note: 10,
    bareme: 10,
    dateAvis: { fr: "28 décembre 2025", en: "28 December 2025", es: "28 de diciembre de 2025" },
    langueOriginale: "fr",
    original:
      "Bungalows sur le lac très confortable.\nLe jardin est sublime.\nPersonnel très accueillant.\nLa cuisine était délicieuse.",
    traduction: {
      en: "Very comfortable bungalows on the lake.\nThe garden is sublime.\nVery welcoming staff.\nThe food was delicious.",
      es: "Bungalós sobre el lago muy cómodos.\nEl jardín es sublime.\nPersonal muy acogedor.\nLa comida estaba deliciosa.",
    },
    source: BOOKING,
  },
  {
    auteur: "Helene",
    pays: "France",
    plateforme: "booking",
    note: 9,
    bareme: 10,
    dateAvis: { fr: "6 janvier 2025", en: "6 January 2025", es: "6 de enero de 2025" },
    langueOriginale: "fr",
    /* « Lhôtel » et « décoré » sont dans l'avis. On ne corrige pas. */
    original:
      "Lhôtel est un havre de paix, la chambre très spacieuse est joliment décoré, avec élégance et goût. Le personnel est adorable, aux petits soins. Le jardin est magnifique et offre un joli cadre reposant. Le petit déjeuner était succulent.",
    traduction: {
      en: "The hotel is a haven of peace, the very spacious room is prettily decorated, with elegance and taste. The staff are lovely and endlessly attentive. The garden is magnificent and makes for a restful setting. Breakfast was delicious.",
      es: "El hotel es un remanso de paz, la habitación, muy espaciosa, está bonitamente decorada, con elegancia y gusto. El personal es encantador y muy atento. El jardín es magnífico y ofrece un marco reposado. El desayuno estaba delicioso.",
    },
    source: BOOKING,
  },
  {
    auteur: "Klemm",
    pays: "Suisse",
    plateforme: "booking",
    note: 10,
    bareme: 10,
    dateAvis: { fr: "12 août 2025", en: "12 August 2025", es: "12 de agosto de 2025" },
    langueOriginale: "en",
    original:
      "We loved how unique our accommodation was; we stayed in the Train Wagon. The staff, especially the lady who received us was super inviting and happy to share tips on what local food we should try for dinner. I had some form of stir fried vegetables which were absolutely delicious!",
    traduction: {
      fr: "Nous avons adoré le caractère unique de notre hébergement ; nous avons séjourné dans le Wagon. Le personnel, et surtout la dame qui nous a accueillis, s'est montré très avenant et heureux de nous conseiller la cuisine locale à goûter au dîner. J'ai pris une sorte de légumes sautés, absolument délicieux !",
      es: "Nos encantó lo singular de nuestro alojamiento; nos alojamos en el Vagón. El personal, y sobre todo la señora que nos recibió, fue muy acogedor y encantado de aconsejarnos qué cocina local probar en la cena. Tomé una especie de verduras salteadas, ¡absolutamente deliciosas!",
    },
    source: BOOKING,
  },
  {
    auteur: "Rambelomanana",
    pays: "France",
    plateforme: "booking",
    note: 10,
    bareme: 10,
    dateAvis: { fr: "1er mai 2025", en: "1 May 2025", es: "1 de mayo de 2025" },
    langueOriginale: "fr",
    original: "Le personnel adorable !\nLes chambres magnifiques la vue sur le lac !!",
    traduction: {
      en: "Lovely staff!\nMagnificent rooms, and the view over the lake!!",
      es: "¡Personal encantador!\n¡Habitaciones magníficas y la vista al lago!!",
    },
    source: BOOKING,
  },
  {
    auteur: "Madeleine",
    pays: "La Réunion",
    plateforme: "booking",
    note: 10,
    bareme: 10,
    dateAvis: { fr: "7 janvier 2025", en: "7 January 2025", es: "7 de enero de 2025" },
    langueOriginale: "fr",
    original: "Une pépite à découvrir absolument",
    traduction: {
      en: "A gem, absolutely worth discovering",
      es: "Una joya que hay que descubrir sin falta",
    },
    source: BOOKING,
  },
];
