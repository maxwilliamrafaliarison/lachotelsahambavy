import type { ReactNode } from "react";

/**
 * Avis de service : bandeau d'information sur la disponibilité d'une
 * prestation.
 *
 * POURQUOI UN TROISIÈME REGISTRE DE COULEUR
 * Le design system n'en avait que deux : le bleu du lac pour ce qui est
 * cliquable, la terre cuite pour l'éditorial. Un avis n'est ni l'un ni
 * l'autre : il n'appelle pas au clic et ne raconte pas l'hôtel, il
 * informe.
 *
 * ROUGE, sur décision de la direction (08/08/2026). La première version
 * était ambre : une ligne ferroviaire à l'arrêt n'est pas une panne du
 * site, et l'ambre disait « à vérifier avec nous » plutôt que « vous avez
 * un problème ». La direction veut que l'information accroche l'œil.
 * C'est un arbitrage éditorial qui lui revient. Le rouge est donc pris
 * pur (teinte 0,0°), à 19,3° de la terre cuite pour rester impossible à
 * confondre avec le registre éditorial. Encre sur fond : 7,37:1.
 *
 * TOUJOURS PAS DE TRIANGLE D'AVERTISSEMENT. La couleur suffit à alerter ;
 * l'iconographie de l'erreur système ferait basculer le message vers
 * « quelque chose est cassé », alors qu'il s'agit d'une information de
 * service assortie d'une invitation à nous joindre.
 *
 * `role="status"` plutôt que `role="alert"` : l'avis est présent au
 * chargement, il n'interrompt rien. `alert` forcerait le lecteur d'écran
 * à couper sa lecture, et ce n'est pas parce que le bloc est devenu
 * rouge qu'il faut couper la parole au visiteur.
 */
export default function AvisService({
  pastille,
  children,
  className = "",
}: {
  /** Texte de la pastille : court, l'état en deux ou trois mots. */
  pastille: string;
  /** Le message, et ce que le visiteur peut faire. */
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      role="status"
      className={`rounded-[4px] border border-avis-hairline bg-avis-bg px-5 py-4 md:px-6 md:py-5 ${className}`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:gap-5">
        <span className="inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-avis/[0.12] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-avis">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-avis" />
          {pastille}
        </span>
        <div className="ge-measure text-[14.5px] leading-relaxed text-avis [&_a]:font-semibold [&_a]:underline [&_a]:decoration-avis/40 [&_a]:underline-offset-4 [&_a:hover]:decoration-avis">
          {children}
        </div>
      </div>
    </div>
  );
}
