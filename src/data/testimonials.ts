import type { Locale } from "@/lib/utils";

/**
 * Avis clients, relevés un par un sur les fiches publiques de l'hôtel.
 *
 * CE FICHIER A ÉTÉ ENTIÈREMENT REFAIT LE 21/08/2026, et il faut savoir
 * pourquoi avant d'y toucher.
 *
 * Il contenait quarante-cinq témoignages. Trente ont été supprimés le
 * 11/08 comme inventés, et les quinze restants déclarés « tous
 * authentiques ». Cette affirmation était fausse, et l'historique de git
 * le montre sans discussion : neuf des quinze sont nés dans le commit
 * 308bbd3 « expand reviews », exactement celui qui avait produit les
 * trente autres. Aucune source ne les accompagnait.
 *
 * Le contrôle a été refait en lisant les pages elles-mêmes : la fiche
 * Booking de l'hôtel et sa fiche TripAdvisor, chargées dans un vrai
 * navigateur. Les six avis traçables s'y retrouvent, nom et texte. Les
 * neuf autres n'y figurent nulle part, pas une phrase, pas un fragment.
 *
 * ET LES SIX VRAIS N'ÉTAIENT PAS CITÉS FIDÈLEMENT :
 *   - Michel écrivait sur BOOKING ; le site l'affichait sous le logo
 *     TripAdvisor, et lui avait ajouté une initiale, « Michel R. » ;
 *   - « Le meilleur hôtel de Madagascar jusqu'ici » est le TITRE de
 *     l'avis de Raith, pas son texte, et cet avis comporte une réserve
 *     sur la route d'accès que le site taisait ;
 *   - Amelia s'arrête à « La cuisine était délicieuse » : « à base de
 *     produits frais du potager » lui avait été ajouté ;
 *   - une phrase entière avait été ajoutée à Michel, une autre retirée du
 *     milieu de celui d'Isabelle ;
 *   - Hélène, notée 9/10 sur Booking, s'affichait avec cinq étoiles.
 *
 * D'OÙ LES TROIS RÈGLES QUI GOUVERNENT CE FICHIER.
 *
 * 1. `original` est le texte EXACT, relevé sur la plateforme, fautes
 *    comprises. « Lhôtel », « décoré », « le sejour » : on n'y touche
 *    pas. Une faute corrigée reste une modification du propos d'autrui,
 *    et c'est déjà ce que la directive Omnibus appelle présenter un avis
 *    de manière trompeuse.
 *
 * 2. `traduction` n'est PAS le texte du client. Le client a écrit dans
 *    une langue, une seule, portée par `langueOriginale`. Les traductions
 *    sont un service de lecture, et l'affichage doit le dire, comme
 *    Booking et TripAdvisor le disent avec leur « voir la traduction ».
 *
 * 3. AUCUN AVIS N'ENTRE ICI SANS SON `source` : l'URL de la page publique
 *    où il se lit. C'est la seule chose qui empêche la liste de redevenir
 *    ce qu'elle était.
 *
 * LA SÉLECTION EST ASSUMÉE, et c'est le point délicat. Un avis Booking a
 * deux moitiés, un « + » et un « − ». Publier la moitié positive d'un
 * avis mitigé serait précisément trompeur. Ne figurent donc ici que les
 * avis dont l'auteur N'A RIEN ÉCRIT de négatif, cités intégralement.
 * Ceux qui portent une réserve, sur la route d'accès surtout, ne sont pas
 * tronqués : ils sont simplement absents, et la mention de transparence
 * renvoie aux fiches où ils se lisent tous.
 *
 * LES AVIS GOOGLE ONT ÉTÉ RELEVÉS PAR LA DIRECTION ELLE-MÊME, le
 * 21/08/2026, dans le panneau d'avis de sa propre fiche, puis transmis
 * pour intégration. Ce n'est pas rien : trois autres voies avaient été
 * fermées avant celle-là.
 *   - Recopier depuis Wanderlog, un agrégateur qui republie les avis
 *     Google : source de seconde main, écartée.
 *   - Lire la fiche Google par un outil : Google sert un contrôle
 *     anti-robot, qu'on ne franchit pas.
 *   - L'API Places : elle facture le champ `reviews` au SKU le plus cher
 *     de sa grille et demande une carte bancaire, ce dont la direction
 *     n'a pas voulu.
 *
 * LES CONDITIONS DE GOOGLE réservent la reprise de leur contenu à une
 * API officielle ou à une autorisation préalable. Publier ces avis est
 * donc une décision de la direction, prise en connaissance de cause le
 * 21/08/2026, et non une inadvertance. Elle porte sur les avis que ses
 * propres clients ont écrits sur son propre établissement, qu'elle a
 * lus dans son propre tableau de bord, et qui sont reproduits mot pour
 * mot. C'est ici que quelqu'un doit venir lire s'il veut rouvrir la
 * question.
 *
 * VINGT-DEUX AVIS RELEVÉS, SEIZE PUBLIÉS : sept Tripadvisor et neuf
 * Google. Les sept avis Booking restent en réserve, leurs conditions
 * générales en interdisant la reprise sans accord écrit ; voir
 * le fichier de réserve. Le lot Tripadvisor
 * s'est étoffé quand la fiche TripAdvisor a fini par livrer ses cent
 * quarante-quatre avis, page par page, ce que la première lecture n'avait
 * pas obtenu.
 *
 * RÈGLES D'AFFICHAGE DE TRIPADVISOR, lues le 21/08/2026 dans leur propre
 * documentation. Elles engagent qui cite leurs avis :
 *   - seuls les avis à CINQ bulles peuvent être cités, et seulement si la
 *     note globale de l'établissement atteint 4 sur 5. Le Lac Hôtel est à
 *     4,1 : la condition tient, mais de peu. SI LA NOTE DESCEND SOUS 4,
 *     LES SEPT CITATIONS TRIPADVISOR DOIVENT ÊTRE RETIRÉES ;
 *   - la date de l'avis doit figurer, d'où `dateAvis` ;
 *   - le texte doit être entre guillemets ;
 *   - l'origine doit être explicite (« Avis de voyageur Tripadvisor ») ;
 *   - le logo fait au moins 20 px de haut ;
 *   - la note se donne en BULLES à leur vert Moss #00AA6C, sur fond blanc,
 *     55 px de large au minimum, jamais une icône ni un chiffre maison ;
 *   - tout est aligné à gauche.
 * La graphie de la marque est « Tripadvisor », un seul mot et un seul A
 * majuscule, depuis leur refonte de 2020.
 *
 * LES QUINZE AUTEURS ONT ÉTÉ PASSÉS EN REVUE par la direction le
 * 21/08/2026, précisément parce que le cas « Toky R. » avait montré
 * qu'un employé pouvait se glisser dans une fiche. Deux noms
 * appelaient un contrôle et ont été confirmés comme de vraies
 * clientes : « Karine R. », qui a aussi écrit sur Google sous
 * « Karine Rajaona Razafindrakoto », et « ADA 36 », qui précise vivre
 * dans la région. Une cliente locale et fidèle est parfaitement
 * légitime ; ce n'est pas la proximité géographique qui pose
 * problème, c'est le lien d'intérêt, et il n'y en a pas ici.
 *
 * Textes relevés le 21/08/2026.
 */

export type Plateforme = "booking" | "google" | "tripadvisor";

export interface Avis {
  /** Nom ou pseudonyme TEL QUE la plateforme l'affiche. Rien à ajouter. */
  auteur: string;
  /** Origine telle que la plateforme l'affiche. Absente si non affichée. */
  pays?: string;
  plateforme: Plateforme;
  /** Note du client, sur le barème de SA plateforme (Booking sur 10). */
  note: number;
  bareme: 5 | 10;
  /** Date de PUBLICATION de l'avis, telle qu'affichée sur la fiche.
      Tripadvisor l'exige pour toute citation, et l'article L.111-7-2 la
      demande aussi. C'est la date de l'avis, pas celle du séjour : les
      deux diffèrent parfois de plusieurs mois. */
  dateAvis: Record<Locale, string>;
  /** Langue dans laquelle le client a écrit. */
  langueOriginale: Locale;
  /** Texte exact. NE JAMAIS RETOUCHER, pas même une faute. */
  original: string;
  /** Traductions de courtoisie. Signalées comme telles à l'affichage. */
  traduction: Partial<Record<Locale, string>>;
  /** Page publique où l'avis se lit. Obligatoire. */
  source: string;
}

/* Google ne donne pas de lien par avis hors de son API : le renvoi se
   fait donc vers le panneau d'avis de la fiche, où ils se lisent tous. */
const GOOGLE_FICHE = "https://www.google.com/maps?cid=9763325951372533936";
/* TripAdvisor donne à chaque avis son propre permalien. On le prend
   plutôt que l'adresse de la fiche : le lecteur qui veut vérifier tombe
   sur l'avis lui-même, et non sur une liste de deux cent trente où le
   retrouver relève de la chance. */
const TA = (id: string) =>
  `https://www.tripadvisor.fr/ShowUserReviews-g298271-d649892-r${id}-Lac_Hotel_Sahambavy-Fianarantsoa_Fianarantsoa_Province.html`;

/**
 * LES SEPT AVIS BOOKING NE SONT PLUS ICI, et ils ne doivent pas y
 * revenir tels quels. Ils sont dans src/data/avis-booking-reserve.ts,
 * un module que RIEN N'IMPORTE.
 *
 * L'article 4.2.4 des conditions générales que l'hôtel a signées
 * (version malgache v2601_nE_i) interdit d'utiliser les avis « de
 * quelque manière que ce soit » sans accord écrit préalable. Un filtre
 * à l'exécution ne suffisait pas : le rendu était juste, mais le paquet
 * JavaScript emportait les sept textes en clair chez chaque visiteur,
 * dans un fragment de 56 ko. Seul un module qu'aucun chemin n'atteint
 * garantit qu'ils ne partent pas. La marche à suivre le jour où Booking
 * donnera son accord est en tête du fichier de réserve.
 */

const tousLesAvis: Avis[] = [
  /* ─── TripAdvisor ─────────────────────────────────────────────
     Relevés sur la fiche PRINCIPALE (d649892, 4,1/5 sur 230 avis,
     nº 1 sur 7 hôtels à Fianarantsoa). Attention : il existe une
     seconde fiche, « LACHOTEL » (d2277409), qui capte onze avis de
     plus. Voir la note en fin de fichier. */
  {
    auteur: "Karine R.",
    pays: "Madagascar",
    plateforme: "tripadvisor",
    note: 5,
    bareme: 5,
    dateAvis: { fr: "juillet 2026", en: "July 2026", es: "julio de 2026" },
    langueOriginale: "fr",
    original:
      "Le cadre est top pour se ressourcer. Les chambres sur pilotis sont bien décorées et donnent une sérénité sans faille. La cuisine est excellente et l'équipe est vraiment aux petits soins durant le sejour",
    traduction: {
      en: "The setting is perfect for recharging. The overwater rooms are nicely decorated and give off an unfailing serenity. The food is excellent and the team really looks after you throughout the stay",
      es: "El entorno es ideal para reponer fuerzas. Las habitaciones sobre pilotes están bien decoradas y transmiten una serenidad sin fisuras. La cocina es excelente y el equipo está realmente pendiente de uno durante toda la estancia",
    },
    source: TA("1069379531"),
  },
  {
    auteur: "Philippe R",
    plateforme: "tripadvisor",
    note: 5,
    bareme: 5,
    dateAvis: { fr: "septembre 2025", en: "September 2025", es: "septiembre de 2025" },
    langueOriginale: "fr",
    original:
      "Le plus bel hôtel que nous ayons pu avoir durant notre road trip de 4 semaines à Madagascar.\nVéritable havre de paix avec des bungalows sur pilotis très bien équipés et très confortables, permettant de profiter de la terrasse durant les couchers de soleil sur le lac, et le tout au milieu d'un joli parc botanique où toutes les essences sont répertoriées.\nLa qualité de la prestation est excellente et le restaurant est parfait, avec des assiettes aussi variées que généreuses.\nUne mention spéciale pour le personnel attentionné, d'une grande gentillesse et très professionnel.",
    traduction: {
      en: "The finest hotel we stayed in during our four-week road trip through Madagascar.\nA true haven of peace, with very well equipped and very comfortable overwater bungalows, letting you enjoy the terrace as the sun sets over the lake, all in the middle of a lovely botanical park where every species is labelled.\nThe standard is excellent and the restaurant is faultless, with plates as varied as they are generous.\nA special mention for the attentive staff, extremely kind and highly professional.",
      es: "El hotel más bonito de todos los que tuvimos durante nuestro viaje de cuatro semanas por Madagascar.\nUn verdadero remanso de paz, con bungalós sobre pilotes muy bien equipados y muy cómodos, que permiten disfrutar de la terraza durante las puestas de sol sobre el lago, y todo ello en medio de un bonito parque botánico donde todas las especies están identificadas.\nLa calidad del servicio es excelente y el restaurante es perfecto, con platos tan variados como generosos.\nMención especial para el personal atento, de una gran amabilidad y muy profesional.",
    },
    source: TA("1032015866"),
  },
  {
    auteur: "muriel e",
    pays: "France",
    plateforme: "tripadvisor",
    note: 5,
    bareme: 5,
    dateAvis: { fr: "juillet 2025", en: "July 2025", es: "julio de 2025" },
    langueOriginale: "fr",
    original:
      "Très belles chambres, lits confortables, excellente cuisine, rhum arrangé excellent et, par dessus tout, un personnel aux petits soins, souriant et très bienveillant. Nos amis de Fianarantsoa, venus nous voir, ont également été très bien reçus. Le cadre est exceptionnel, avec un lac sur lequel on peut faire du pedalo et une très belle balade autour, 8km. Enfin, je conseille la visite de la plantation de thé juste à côté. Un point très fort de notre séjour !",
    traduction: {
      en: "Very beautiful rooms, comfortable beds, excellent food, excellent spiced rum and, above all, staff who look after everything, smiling and full of kindness. Our friends from Fianarantsoa, who came to see us, were also very well received. The setting is exceptional, with a lake you can pedal-boat on and a lovely 8 km walk around it. Finally, I recommend visiting the tea plantation right next door. A real highlight of our stay!",
      es: "Habitaciones muy bonitas, camas cómodas, excelente cocina, ron arreglado excelente y, sobre todo, un personal pendiente de todo, sonriente y muy amable. Nuestros amigos de Fianarantsoa, que vinieron a vernos, también fueron muy bien recibidos. El entorno es excepcional, con un lago en el que se puede navegar en hidropedal y un paseo precioso de 8 km a su alrededor. Por último, aconsejo visitar la plantación de té justo al lado. ¡Un momento fuerte de nuestra estancia!",
    },
    source: TA("1021688734"),
  },
  {
    auteur: "cems35",
    pays: "France",
    plateforme: "tripadvisor",
    note: 5,
    bareme: 5,
    dateAvis: { fr: "décembre 2024", en: "December 2024", es: "diciembre de 2024" },
    langueOriginale: "fr",
    original:
      "Superbe hôtel dans un cadre enchanteur. Très bon accueil. Grand bungalow confortable, avec vue sur le lac, jolie déco, vaste salle de bains. Belle piscine. Grand parc arboré, Service irréprochable.\nTrès bon restaurant. Un excellent souvenir !",
    traduction: {
      en: "Superb hotel in an enchanting setting. A very warm welcome. A large, comfortable bungalow with a lake view, pretty decoration and a vast bathroom. A lovely swimming pool. A large wooded park, faultless service.\nVery good restaurant. An excellent memory!",
      es: "Hotel soberbio en un marco encantador. Muy buena acogida. Bungaló grande y cómodo, con vistas al lago, bonita decoración, amplio cuarto de baño. Bonita piscina. Gran parque arbolado, servicio impecable.\nMuy buen restaurante. ¡Un recuerdo excelente!",
    },
    source: TA("985366315"),
  },
  {
    auteur: "nadjatardif",
    pays: "Madagascar",
    plateforme: "tripadvisor",
    note: 5,
    bareme: 5,
    dateAvis: { fr: "février 2024", en: "February 2024", es: "febrero de 2024" },
    langueOriginale: "fr",
    original:
      "Weekend apaisant à côté de Fianarantsoa. De magnifiques bungalows décorés avec goût. Une vue sur le lac imprenable, des plantes, des plantes et encore des plantes, un vrai plaisir de déambuler dans l'enceinte de l'hôtel.\nDe plus, nous avons pu profiter en famille de la piscine et du pédalo sur le lac !\nL'équipe est à l'écoute et pleine d'attention pour chaque personne, le service est nickel !\nUne parenthèse sereine et de détente assurée. Merci",
    traduction: {
      en: "A soothing weekend just outside Fianarantsoa. Magnificent bungalows decorated with taste. An uninterrupted view over the lake, plants, plants and more plants, a real pleasure to wander the grounds.\nWe were also able to enjoy the pool and the pedal boat on the lake as a family!\nThe team listens and is full of attention for every person, the service is spotless!\nA serene, restful parenthesis, guaranteed. Thank you",
      es: "Un fin de semana apacible junto a Fianarantsoa. Bungalós magníficos decorados con gusto. Una vista al lago inmejorable, plantas, plantas y más plantas, un verdadero placer pasear por el recinto del hotel.\nAdemás, pudimos disfrutar en familia de la piscina y del hidropedal en el lago.\nEl equipo está atento y lleno de detalles con cada persona, ¡el servicio es impecable!\nUn paréntesis sereno y de descanso asegurado. Gracias",
    },
    source: TA("939971995"),
  },
  {
    auteur: "pat2",
    pays: "La Réunion",
    plateforme: "tripadvisor",
    note: 5,
    bareme: 5,
    dateAvis: { fr: "janvier 2024", en: "January 2024", es: "enero de 2024" },
    langueOriginale: "fr",
    original:
      "Voici un hôtel lacustre très agréable.\nJolies et spacieuses constructions sur pilotis pour des chambres très confortables.\nAccueil d'une grande gentillesse .\nTres bonne cuisine.\nBon rapport qualite-prix\nUne halte où vous pouvez également découvrir l'unique plantation de thé Malgache.\nJe recommande fortement",
    traduction: {
      en: "Here is a very pleasant lakeside hotel.\nPretty, spacious overwater structures making for very comfortable rooms.\nA welcome of great kindness.\nVery good food.\nGood value for money\nA stop where you can also discover the only Malagasy tea plantation.\nI strongly recommend it",
      es: "He aquí un hotel lacustre muy agradable.\nBonitas y espaciosas construcciones sobre pilotes para habitaciones muy cómodas.\nUna acogida de gran amabilidad.\nMuy buena cocina.\nBuena relación calidad-precio\nUna parada donde también puede descubrir la única plantación de té malgache.\nLo recomiendo encarecidamente",
    },
    source: TA("935186469"),
  },
  {
    auteur: "Olivier & Perly",
    plateforme: "tripadvisor",
    note: 5,
    bareme: 5,
    dateAvis: { fr: "juillet 2023", en: "July 2023", es: "julio de 2023" },
    langueOriginale: "fr",
    original:
      "Magnifique hôtel, cadre de rêve.\nLe personnel est d'une extrême gentillesse et aux petits soins.\nLes bungalows sont magnifiques (nous avions pris le bungalow nuptial plus un bungalow famille). Décoration idyllique face au lac, le jardin et la partie restauration sont du même niveau.\nLes plats et boissons proposés étaient très bons, dégustés dans un très beau cadre.\nNous recommandons également la visite de la plantation de thé où nous avons été très bien reçu egalement.\nNe tardez pas vous rendre à cette adresse avec un rapport qualité prix irréprochable.",
    traduction: {
      en: "Magnificent hotel, a dream setting.\nThe staff are extremely kind and attentive to every detail.\nThe bungalows are magnificent (we took the honeymoon bungalow plus a family bungalow). Idyllic decoration facing the lake, and the garden and the restaurant are of the same standard.\nThe dishes and drinks on offer were very good, enjoyed in a very beautiful setting.\nWe also recommend visiting the tea plantation, where we were very well received too.\nDon't wait to go to this address, with faultless value for money.",
      es: "Hotel magnífico, un marco de ensueño.\nEl personal es de una amabilidad extrema y está pendiente de todo.\nLos bungalós son magníficos (tomamos el bungaló nupcial más un bungaló familiar). Decoración idílica frente al lago, y el jardín y la parte de restauración están al mismo nivel.\nLos platos y las bebidas eran muy buenos, degustados en un marco precioso.\nRecomendamos también la visita a la plantación de té, donde nos recibieron igual de bien.\nNo tarden en ir a esta dirección, con una relación calidad-precio impecable.",
    },
    source: TA("906696275"),
  },
  /* ─── Google ──────────────────────────────────────────────────
     Relevés par la direction elle-même, le 21/08/2026, dans le
     panneau d'avis de sa propre fiche, puis transmis. Voir la note
     « LES AVIS GOOGLE » en tête de fichier.

     LES DATES SONT ABSOLUES alors que Google affiche du relatif. Un
     « il y a un mois » figé dans un fichier devient un mensonge au
     bout de six mois : chaque date est donc convertie depuis le
     relevé du 21/08/2026. Le recoupement tient : Miora Ramampiandra
     titre son avis « 08 Mars » et Google le datait d'« il y a
     5 mois », ce qui tombe bien sur mars 2026.

     NEUF SUR VINGT : les tronqués par « En savoir plus » sont
     écartés faute de texte entier, et ceux qui portent une réserve
     ne sont pas tronqués mais absents, comme pour Tripadvisor.

     « TOKY R. » : SOUPÇON LEVÉ, ne pas le rouvrir. Son avis avait été
     écarté un temps, sur la seule coïncidence de son prénom avec celui
     du réceptionniste que le client « Michel » remercie nommément dans
     son avis Booking. La déduction était faible : Toky est un prénom
     malgache très répandu. Vérification faite le 21/08/2026 sur son
     profil de contributeur Google, c'est un Local Guide de niveau 4
     qui a aussi noté un ranch à Isalo, une crêperie à Batz-sur-Mer et
     un salon de massage à Paris : un voyageur, pas un employé. Son
     avis est publié.

     Le principe, lui, reste entier : un avis d'employé sur son propre
     établissement est en conflit d'intérêts, la directive Omnibus le
     range parmi les pratiques trompeuses et les règles de Google
     l'interdisent. Mais un soupçon se vérifie avant de retirer
     l'avis d'un vrai client. */
  {
    auteur: "JM FRACHET",
    plateforme: "google",
    note: 5,
    bareme: 5,
    dateAvis: { fr: "juillet 2026", en: "July 2026", es: "julio de 2026" },
    langueOriginale: "fr",
    original:
      "Superbe Lac Hôtel à Sahambavy à seulement 16 kms de Fianrantsoa et 30 minutes de la RN7 : un pause idéale en circuit RN7.\nExcellent accueil. Les chambres sur pilotis sont un délice : vastes avec une literie au top et une déco raffinée...et en bonus un magnifique tableau au coucher du soleil sur l'eau.\nUne expérience inoubliable dans un lieu unique. Allez-y !",
    traduction: {
      en: "A superb Lac Hôtel at Sahambavy, only 16 km from Fianarantsoa and 30 minutes from the RN7: the ideal pause on an RN7 tour.\nAn excellent welcome. The overwater rooms are a delight: vast, with top-quality bedding and refined decoration... and as a bonus, a magnificent painting of the sun setting on the water.\nAn unforgettable experience in a unique place. Go!",
      es: "Un soberbio Lac Hôtel en Sahambavy, a solo 16 km de Fianarantsoa y a 30 minutos de la RN7: la pausa ideal en un circuito por la RN7.\nExcelente acogida. Las habitaciones sobre pilotes son una delicia: amplias, con una cama excelente y una decoración refinada... y de regalo, un magnífico cuadro al atardecer sobre el agua.\nUna experiencia inolvidable en un lugar único. ¡Vayan!",
    },
    source: GOOGLE_FICHE,
  },
  {
    auteur: "ADA 36",
    plateforme: "google",
    note: 5,
    bareme: 5,
    dateAvis: { fr: "mars 2026", en: "March 2026", es: "marzo de 2026" },
    langueOriginale: "fr",
    original:
      "Un lieu paradisiaque, un endroit \"bout du monde\" dans un cadre enchanteresque. On est très bien accueilli par Maggie ou Olga et tout le personnel est d'une gentillesse extrême. Délicieuse cuisine préparée avec les légumes du jardin, balades à pied autour du lac ou dans les plantations de thé, pédalos, piscine ou repos, c'est l'endroit idéal pour se ressourcer. Je vis dans la région et c'est mon hôtel préféré ! Merci à toute l'équipe du Lac Hôtel !",
    traduction: {
      en: "A paradise, an \"end of the world\" place in an enchanting setting. Maggie or Olga give you a warm welcome and all the staff are extremely kind. Delicious cooking made with vegetables from the garden, walks around the lake or through the tea plantations, pedal boats, the pool or simply rest: it is the ideal place to recharge. I live in the region and it is my favourite hotel! Thank you to the whole Lac Hôtel team!",
      es: "Un lugar paradisíaco, un rincón «del fin del mundo» en un marco encantador. Maggie u Olga le reciben de maravilla y todo el personal es de una amabilidad extrema. Cocina deliciosa preparada con las verduras del huerto, paseos a pie alrededor del lago o por las plantaciones de té, hidropedales, piscina o descanso: es el lugar ideal para reponer fuerzas. Vivo en la región y es mi hotel preferido. ¡Gracias a todo el equipo del Lac Hôtel!",
    },
    source: GOOGLE_FICHE,
  },
  {
    auteur: "Cathy Veyrier",
    plateforme: "google",
    note: 5,
    bareme: 5,
    dateAvis: { fr: "mai 2026", en: "May 2026", es: "mayo de 2026" },
    langueOriginale: "fr",
    original:
      "Ce n'est pas vraiment partageable ! Chaque expérience est unique : d'abord l'accueil est très personnalisé sans être lourd , la carte est un véritable pousse au crime … mention spéciale au canard sous toutes ses formes , le canard confit au gingembre en particulier . Et puis ensuite les lieux se prêtent aussi bien à la ballade bucolique aux alentours , qu'à la contemplation et aux soins également avec une merveilleuse masseuse . Bref le Lac Hotel il faut y aller quelque soient vos désidératas l'expérience sera la vôtre !",
    traduction: {
      en: "It is not really shareable! Every experience is unique: first the welcome, very personal without being heavy, then the menu, a real temptation... a special mention for the duck in all its forms, the ginger duck confit in particular. And the place lends itself just as well to a bucolic walk in the surroundings as to contemplation, and to treatments too, with a wonderful masseuse. In short, the Lac Hotel: you must go, whatever your wishes, the experience will be your own!",
      es: "¡No es algo que se pueda compartir de verdad! Cada experiencia es única: primero la acogida, muy personalizada sin resultar pesada, luego la carta, una auténtica tentación... mención especial para el pato en todas sus formas, el confit de pato al jengibre en particular. Y además el lugar se presta tanto al paseo bucólico por los alrededores como a la contemplación, y también a los cuidados, con una masajista maravillosa. En resumen, el Lac Hotel: hay que ir, sean cuales sean sus deseos, la experiencia será la suya.",
    },
    source: GOOGLE_FICHE,
  },
  {
    auteur: "Valérie Hanchar",
    plateforme: "google",
    note: 5,
    bareme: 5,
    dateAvis: { fr: "mars 2026", en: "March 2026", es: "marzo de 2026" },
    langueOriginale: "fr",
    original:
      "Un paradis pas loin de Fianarantsoa! Les chambres sont vastes et confortables, le personnel très accueillant, le jardin est un enchantement de fleurs et plantes ( les botanistes en herbe vont épuiser leur appareil photo !) , les plantations de thé aux alentours sont l'occasion de marches paisibles, la piscine permet de se rafraîchir agréablement dans un cadre apaisant, et puis l'on mange délicieusement ( je vous conseille les plats à base de canard: une tuerie! Mais aussi les glaces!)… bref, ce lieu paradisiaque mérite le détour ! Je recommande vivement",
    traduction: {
      en: "A paradise not far from Fianarantsoa! The rooms are vast and comfortable, the staff very welcoming, the garden is an enchantment of flowers and plants (budding botanists will wear out their cameras!), the tea plantations nearby make for peaceful walks, the pool lets you cool off pleasantly in a soothing setting, and then you eat deliciously (I recommend the duck dishes: a killer! And the ice creams too!)... in short, this heavenly place is worth the detour! I warmly recommend it",
      es: "¡Un paraíso no lejos de Fianarantsoa! Las habitaciones son amplias y cómodas, el personal muy acogedor, el jardín es un encanto de flores y plantas (¡los botánicos en ciernes agotarán su cámara!), las plantaciones de té de los alrededores invitan a paseos apacibles, la piscina permite refrescarse agradablemente en un entorno sereno, y además se come de maravilla (les aconsejo los platos de pato: ¡una locura! ¡Y también los helados!)... en resumen, ¡este lugar paradisíaco merece el desvío! Lo recomiendo vivamente",
    },
    source: GOOGLE_FICHE,
  },
  {
    auteur: "Miora Ramampiandra",
    plateforme: "google",
    note: 5,
    bareme: 5,
    dateAvis: { fr: "mars 2026", en: "March 2026", es: "marzo de 2026" },
    langueOriginale: "fr",
    original:
      "On s'est régalé… Tout est très bon!\nAutant la nourriture, les jus, les vins, la sangria, et beaucoup d'autres.\nAucun endroit égal à Fianarantsoa.\nEndroit fabuleux, très bien entretenu. Grand luxe, tout le confort, magnifique déco, chambre très spacieuse, grande douche bien chaude.\nRien à redire… Cela en vaut vraiment la peine!",
    traduction: {
      en: "We had a feast... Everything is very good!\nThe food, the juices, the wines, the sangria, and much more.\nNowhere in Fianarantsoa comes close.\nA fabulous place, very well kept. Great luxury, every comfort, magnificent decoration, a very spacious room, a big hot shower.\nNothing to fault... It really is worth it!",
      es: "Nos dimos un festín... ¡Todo está muy bueno!\nTanto la comida como los zumos, los vinos, la sangría y mucho más.\nNingún sitio se le iguala en Fianarantsoa.\nLugar fabuloso, muy bien cuidado. Gran lujo, todas las comodidades, decoración magnífica, habitación muy espaciosa, ducha grande y bien caliente.\nNada que objetar... ¡Vale realmente la pena!",
    },
    source: GOOGLE_FICHE,
  },
  {
    auteur: "Florian Mugnier",
    plateforme: "google",
    note: 5,
    bareme: 5,
    dateAvis: { fr: "juin 2026", en: "June 2026", es: "junio de 2026" },
    langueOriginale: "fr",
    original:
      "Magnifique séjour passé au lac hôtel dans un décor délicieusement surrané. Les chambres dans les chalets sur pilotis sont splendides, tout comme le jardin. La cuisine est bonne et l'accueil chaleureux. Une parenthèse reposante et dépaysante à 1h de Fianarantsoa, et une très bonne étape accessible depuis la RN7.",
    traduction: {
      en: "A magnificent stay at the lac hôtel, in a deliciously old-fashioned setting. The rooms in the overwater chalets are splendid, as is the garden. The food is good and the welcome warm. A restful change of scene an hour from Fianarantsoa, and a very good stop reachable from the RN7.",
      es: "Magnífica estancia en el lac hôtel, en un decorado deliciosamente añejo. Las habitaciones de los chalés sobre pilotes son espléndidas, igual que el jardín. La cocina es buena y la acogida cálida. Un paréntesis reposado y exótico a una hora de Fianarantsoa, y una muy buena etapa accesible desde la RN7.",
    },
    source: GOOGLE_FICHE,
  },
  {
    auteur: "Ahidoba de Franchi",
    plateforme: "google",
    note: 5,
    bareme: 5,
    dateAvis: { fr: "août 2025", en: "August 2025", es: "agosto de 2025" },
    langueOriginale: "fr",
    original:
      "Le personnel de cet hôtel est particulièrement sympathique, très accueillant, très souriant, et efficace!\nLes repas sont délicieux et très généreux. En juillet il fait froid, le feu de cheminée nous a réchauffés! Les chambres sont sur pilotis face au lac, vraiment photogénique!!\nMerci à toute l'équipe!",
    traduction: {
      en: "The staff at this hotel are particularly friendly, very welcoming, full of smiles, and efficient!\nThe meals are delicious and very generous. In July it is cold, and the fire in the hearth warmed us up! The rooms are on stilts facing the lake, truly photogenic!!\nThank you to the whole team!",
      es: "¡El personal de este hotel es especialmente simpático, muy acogedor, muy sonriente y eficaz!\nLas comidas son deliciosas y muy generosas. En julio hace frío, ¡y el fuego de la chimenea nos calentó! Las habitaciones están sobre pilotes frente al lago, ¡realmente fotogénicas!\n¡Gracias a todo el equipo!",
    },
    source: GOOGLE_FICHE,
  },
  {
    auteur: "Toky R.",
    plateforme: "google",
    note: 5,
    bareme: 5,
    dateAvis: { fr: "juillet 2026", en: "July 2026", es: "julio de 2026" },
    langueOriginale: "fr",
    original: "Véritable havre de paix. Chambres très confortables. Cuisine exquise.",
    traduction: {
      en: "A true haven of peace. Very comfortable rooms. Exquisite food.",
      es: "Un verdadero remanso de paz. Habitaciones muy cómodas. Cocina exquisita.",
    },
    source: GOOGLE_FICHE,
  },
  {
    auteur: "Susana Terán Martínez",
    plateforme: "google",
    note: 5,
    bareme: 5,
    dateAvis: { fr: "juillet 2026", en: "July 2026", es: "julio de 2026" },
    /* Écrit en espagnol : c'est le seul avis du site dont l'original
       n'est ni français ni anglais, et il sert la version espagnole. */
    langueOriginale: "es",
    original: "Me encanta la dueña, muy amable y simpática, y los empleados! Buenísima comida!!!!",
    traduction: {
      fr: "J'adore la propriétaire, très aimable et sympathique, et les employés aussi ! Une nourriture excellente !",
      en: "I love the owner, so kind and friendly, and the staff too! Wonderful food!",
    },
    source: GOOGLE_FICHE,
  },
];

/* Ce que le site publie. Il n'y a plus de filtre : la liste ne contient
   que ce qui doit être publié, les avis Booking ayant quitté le fichier. */
export const avisVerifies: Avis[] = tousLesAvis;

/**
 * Texte de l'avis dans la langue du lecteur, et s'il s'agit d'une
 * traduction.
 *
 * L'appelant DOIT afficher la mention quand `traduit` est vrai. C'est ce
 * qui distingue un avis rapporté d'un avis réécrit, et c'est ce que font
 * Booking et TripAdvisor avec leur « voir la traduction ».
 */
export function texteAffiche(avis: Avis, locale: Locale): { texte: string; traduit: boolean } {
  if (locale === avis.langueOriginale) return { texte: avis.original, traduit: false };
  const t = avis.traduction[locale];
  return t ? { texte: t, traduit: true } : { texte: avis.original, traduit: false };
}

/* NOTE POUR LA DIRECTION, à traiter hors du code.
 *
 * 1. DEUX FICHES TRIPADVISOR pour le même hôtel : « Lac Hôtel Sahambavy »
 *    (d649892, 230 avis, 4,1/5) et « LACHOTEL » (d2277409, 11 avis,
 *    4,5/5). La seconde capte des avis qui devraient nourrir la
 *    première. Une demande de fusion se fait gratuitement depuis le
 *    centre de gestion propriétaire.
 *
 * 2. LES 177 AVIS GOOGLE sont récupérables en entier par le propriétaire
 *    de la fiche, via l'API Google Business Profile. Aucun n'est publié
 *    ici tant qu'ils n'ont pas été lus à cette source.
 */
