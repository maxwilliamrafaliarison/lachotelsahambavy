import type { Metadata } from "next";
import { CATALOGUE, formatAr } from "@/lib/admin/tarifs";

export const metadata: Metadata = { title: "Aide — mode d'emploi" };

/**
 * Le mode d'emploi d'une page pour l'équipe (livrable Phase 2).
 * Imprimable : Cmd/Ctrl+P depuis le navigateur.
 */
export default function AidePage() {
  return (
    <article className="max-w-3xl">
      <p className="ge-label mb-2">Documentation équipe</p>
      <h1 className="mb-3 !text-[38px]">Créer une facture proforma</h1>
      <p className="mb-10 text-[15px] text-body">
        Tout se passe sur la page <strong>Facture proforma</strong>. Trois étapes,
        moins de deux minutes. Cette page s&apos;imprime (Cmd/Ctrl+P) si vous la
        voulez à côté du poste.
      </p>

      <ol className="space-y-6 text-[14.5px] leading-relaxed text-body">
        <li className="rounded-[3px] border border-hairline bg-white p-5">
          <strong className="text-ink">1 · Client & séjour.</strong> Tapez le nom du
          client (obligatoire), son contact, les dates d&apos;arrivée/départ et le
          nombre de personnes. Le nombre de nuits se calcule tout seul.
        </li>
        <li className="rounded-[3px] border border-hairline bg-white p-5">
          <strong className="text-ink">2 · Composez le séjour.</strong> Cliquez sur les
          boutons : chaque clic ajoute une ligne avec la bonne quantité (une chambre
          → nombre de nuits ; petit-déjeuner ou taxe de séjour → personnes × nuits).
          Tout reste modifiable dans le tableau : désignation, quantité, prix.
          « Ligne libre » sert aux prestations sur mesure (draisine, pique-nique…).
        </li>
        <li className="rounded-[3px] border border-hairline bg-white p-5">
          <strong className="text-ink">3 · Remise & PDF.</strong> Choisissez la remise
          (en % ou en montant — ex. l&apos;offre « 50 % sur la 2ᵉ nuitée » = montant
          fixe équivalent à une demi-nuitée), vérifiez le récapitulatif à droite,
          puis <strong>Générer le PDF</strong> : il se télécharge immédiatement,
          prêt à joindre à un e-mail.
        </li>
      </ol>

      <h2 className="mb-4 mt-12 !text-[24px]">Bon à savoir</h2>
      <ul className="list-disc space-y-2 pl-5 text-[14.5px] leading-relaxed text-body">
        <li>
          <strong className="text-ink">Numérotation.</strong> Le numéro (PRO-2026-001,
          002…) s&apos;incrémente automatiquement sur ce poste après chaque PDF. Vous
          pouvez le corriger à la main — l&apos;outil retiendra le plus grand numéro.
        </li>
        <li>
          <strong className="text-ink">Taux euro.</strong> 1 € = 4 900 Ar par défaut
          (doc tarifs 2026). Changez-le dans « Remise & paramètres » : il est mémorisé
          pour les prochaines factures sur ce poste.
        </li>
        <li>
          <strong className="text-ink">La proforma n&apos;est pas une facture
          définitive</strong> — la mention légale figure automatiquement en pied de
          page, avec RCS, STAT et NIF de l&apos;hôtel.
        </li>
        <li>
          <strong className="text-ink">Profils.</strong> « Direction » (Maggie, Max) et
          « Réception » (Toky, Tata) ont aujourd&apos;hui exactement le même accès à
          l&apos;outil — le profil sert à savoir qui est connecté. Votre profil
          s&apos;affiche en haut à droite.
        </li>
        <li>
          <strong className="text-ink">Mot de passe oublié ?</strong> Voir avec Max :
          les comptes se gèrent dans la configuration du site (Vercel), aucune donnée
          client n&apos;est stockée en ligne.
        </li>
      </ul>

      <h2 className="mb-4 mt-12 !text-[24px]">Tarifs 2026 chargés dans l&apos;outil</h2>
      <div className="ge-rows max-w-xl">
        {CATALOGUE.map((c) => (
          <div key={c.id} className="ge-row">
            <span>{c.label}</span>
            <span>{formatAr(c.prixAr)} / {c.unite}</span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[12px] text-muted">
        Source : document tarifaire de Maggie (16/07/2026). Pour changer un tarif
        durablement, demander la mise à jour de l&apos;outil (fichier tarifs).
      </p>
    </article>
  );
}
