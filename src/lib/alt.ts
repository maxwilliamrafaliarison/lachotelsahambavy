import type { Locale } from "@/lib/utils";

/**
 * Textes alternatifs trilingues.
 *
 * POURQUOI PAS DANS LES DICTIONNAIRES. Un texte alternatif décrit UNE image
 * précise ; le séparer d'elle par une clé, c'est garantir qu'un jour on
 * changera la photo sans changer sa description, et qu'un aveugle entendra
 * la précédente. Les garder au contact de l'image est le seul moyen de les
 * maintenir justes.
 *
 * La forme `{ fr, en, es }` est celle qu'emploient déjà rooms.ts et site.ts
 * pour toutes leurs données éditoriales : on ne crée pas un mécanisme de
 * plus.
 *
 * COMMENT ÉCRIRE UN BON TEXTE ALTERNATIF. Il remplace l'image, il ne la
 * commente pas : on décrit ce qu'un voyant y voit et qui compte pour la
 * page, sans « photo de » ni « image montrant ». Une image purement
 * décorative prend `alt=""` et disparaît des lecteurs d'écran, ce qui vaut
 * mieux qu'une description creuse.
 */
export type TexteAlternatif = { fr: string; en: string; es: string };

/** Le texte alternatif dans la langue de la page, français par défaut. */
export function alt(t: TexteAlternatif, locale: Locale): string {
  return t[locale] ?? t.fr;
}
