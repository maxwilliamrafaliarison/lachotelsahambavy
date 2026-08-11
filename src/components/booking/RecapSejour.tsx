"use client";

import { useSearchParams } from "next/navigation";

/**
 * Les deux lignes personnalisées de la page de confirmation : le prénom du
 * client et les dates de son séjour.
 *
 * POURQUOI CE PETIT ÎLOT
 * La page a été repassée en composant serveur pour que son titre et sa
 * structure soient dans le HTML. Mais lire les paramètres d'URL côté
 * serveur (`await searchParams`) rend la page dynamique, et l'export
 * statique GitHub Pages, qui prérend tout au build, refuse alors de la
 * générer : « couldn't be rendered statically because it used
 * await searchParams ».
 *
 * D'où le partage : le serveur rend tout ce qui ne dépend pas de l'URL
 * (le h1, le pictogramme, la carte des prochaines étapes, les boutons)
 * et seules ces deux lignes sont hydratées côté client.
 *
 * `suppressHydrationWarning` n'est pas nécessaire : le serveur rend le
 * gabarit sans substitution, le client le complète.
 */

function formatDate(iso: string | null, locale: string): string {
  if (!iso) return "…";
  try {
    return new Date(iso).toLocaleDateString(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function RecapSejour({
  locale,
  gabaritSousTitre,
  gabaritSejour,
}: {
  locale: string;
  /** Contient « {name} ». */
  gabaritSousTitre: string;
  /** Contient « {checkin} » et « {checkout} ». */
  gabaritSejour: string;
}) {
  const params = useSearchParams();
  const name = params.get("name") || "";
  const checkin = params.get("checkin");
  const checkout = params.get("checkout");

  return (
    <>
      <p className="text-base md:text-lg text-muted mb-2">
        {/* Sans paramètre `name` (accès direct à la page, lien partagé), une
            substitution nue laissait « Merci , votre demande… » avec une
            espace avant la virgule. On absorbe donc l'espace qui précède le
            marqueur dans les trois gabarits, et on la restitue seulement
            quand le prénom est présent. */}
        {gabaritSousTitre.replace(" {name}", name ? ` ${name}` : "")}
      </p>
      {checkin && checkout ? (
        <p className="text-sm text-ink font-medium mb-10">
          {gabaritSejour
            .replace("{checkin}", formatDate(checkin, locale))
            .replace("{checkout}", formatDate(checkout, locale))}
        </p>
      ) : (
        <div className="mb-10" />
      )}
    </>
  );
}
