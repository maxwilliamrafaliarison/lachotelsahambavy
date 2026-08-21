import type { Locale } from "@/lib/utils";

const dictionaries = {
  fr: () => import("./dictionaries/fr.json").then((m) => m.default),
  en: () => import("./dictionaries/en.json").then((m) => m.default),
  es: () => import("./dictionaries/es.json").then((m) => m.default),
};

/**
 * Dictionnaire d'une langue, avec repli sur le français.
 *
 * LE REPLI N'EST PAS UNE COMMODITÉ, il répare un 500. Le segment
 * `[locale]` accepte n'importe quelle chaîne : `/tarifs/`, `/blog/`,
 * `/rooms/`, une faute de frappe, un vieux lien absent de la table de
 * redirections, tout cela entre dans la route et arrive ici avec une
 * « langue » qui n'existe pas. `dictionaries["tarifs"]` vaut alors
 * `undefined`, et l'appeler jetait « TypeError: b[a] is not a function ».
 *
 * LE LAYOUT FAIT DÉJÀ LE BON GESTE : il appelle `notFound()` dès que la
 * locale n'est pas reconnue. Mais `generateMetadata` s'exécute AVANT lui
 * et appelle cette fonction : elle plantait la première, et le visiteur
 * recevait une erreur serveur là où il aurait dû recevoir une page
 * introuvable. Constaté le 21/08/2026 sur /inconnue/, qui rendait 500
 * quand /truc/machin/ rendait bien 404, faute de correspondre au segment.
 *
 * Le dictionnaire français rendu ici ne sera jamais affiché : la page
 * sera remplacée par la 404 quelques instants plus tard. Il sert
 * uniquement à laisser la génération des métadonnées aller à son terme.
 *
 * NE PAS « corriger » ce repli en jetant une erreur explicite : ce serait
 * revenir au 500. La validation de la langue appartient au layout, pas
 * au chargeur de dictionnaire.
 */
export const getDictionary = async (locale: Locale) => {
  return (dictionaries[locale] ?? dictionaries.fr)();
};
