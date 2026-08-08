import type { ReactNode } from "react";

/**
 * Avis de service — bandeau d'information sur la disponibilité d'une
 * prestation.
 *
 * POURQUOI UN TROISIÈME REGISTRE DE COULEUR
 * Le design system n'en avait que deux : le bleu du lac pour ce qui est
 * cliquable, la terre cuite pour l'éditorial. Un avis n'est ni l'un ni
 * l'autre — il n'appelle pas au clic et ne raconte pas l'hôtel, il
 * informe. D'où l'ambre, choisi pour être lisible comme « autre chose » :
 * 20,6° de teinte d'écart avec la terre cuite. Le cuivre, testé d'abord,
 * n'en était qu'à 0,9° et se confondait. Encre sur fond : 6,98:1.
 *
 * PAS DE ROUGE, PAS D'ICÔNE D'ALERTE
 * Une ligne ferroviaire à l'arrêt n'est pas une panne du site. Le rouge
 * et le triangle d'avertissement diraient au visiteur qu'il a un problème
 * à régler, alors qu'on lui donne une information de service. L'ambre et
 * la pastille disent « à vérifier avec nous », ce qui est exactement le
 * message.
 *
 * `role="status"` plutôt que `role="alert"` : l'avis est présent au
 * chargement, il n'interrompt rien. `alert` forcerait le lecteur d'écran
 * à couper sa lecture.
 */
export default function AvisService({
  pastille,
  children,
  className = "",
}: {
  /** Texte de la pastille — court, l'état en deux ou trois mots. */
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
