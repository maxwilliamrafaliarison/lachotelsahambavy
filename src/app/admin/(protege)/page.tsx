import Link from "next/link";
import { auth } from "@/lib/admin/auth";

export default async function AdminHome() {
  const session = await auth();
  const prenom = session?.user?.name?.split(" ")[0] ?? "";

  const estDirection = session?.user?.role === "admin";

  return (
    <div>
      <p className="ge-label mb-2">
        Tableau de bord · {estDirection ? "Direction" : "Réception"}
      </p>
      <h1 className="mb-3 !text-[38px]">Bonjour {prenom}</h1>
      <p className="ge-measure mb-10 text-[15px] text-body">
        Outils internes du Lac Hôtel. La facture proforma se génère en moins de deux
        minutes — voir la page Aide pour le mode d&apos;emploi pas à pas.
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        <Link
          href="/admin/tableau-de-bord"
          className="group rounded-[3px] border border-hairline bg-white p-7 transition-colors hover:border-tea"
        >
          <p className="ge-label mb-2">Activité</p>
          <h2 className="mb-2 !text-[24px]">Tableau de bord</h2>
          <p className="text-[14px] text-body">
            Chiffre d&apos;affaires, agences les plus actives, saisonnalité — à partir
            de l&apos;historique des factures.
          </p>
          <span className="mt-4 inline-block text-[12.5px] font-semibold uppercase tracking-[0.12em] text-tea">
            Ouvrir →
          </span>
        </Link>

        <Link
          href="/admin/proforma"
          className="group rounded-[3px] border border-hairline bg-white p-7 transition-colors hover:border-tea"
        >
          <p className="ge-label mb-2">Devis séjour</p>
          <h2 className="mb-2 !text-[24px]">Facture proforma</h2>
          <p className="text-[14px] text-body">
            Composez le séjour (nuitées, repas, suppléments), appliquez une remise,
            générez le PDF logoté numéroté — prêt à envoyer.
          </p>
          <span className="mt-4 inline-block text-[12.5px] font-semibold uppercase tracking-[0.12em] text-tea">
            Ouvrir →
          </span>
        </Link>

        <Link
          href="/admin/aide"
          className="group rounded-[3px] border border-hairline bg-white p-7 transition-colors hover:border-tea"
        >
          <p className="ge-label mb-2">Documentation</p>
          <h2 className="mb-2 !text-[24px]">Aide — mode d&apos;emploi</h2>
          <p className="text-[14px] text-body">
            Le guide d&apos;une page pour l&apos;équipe : créer une proforma, appliquer
            la remise, retrouver la numérotation, changer le taux euro.
          </p>
          <span className="mt-4 inline-block text-[12.5px] font-semibold uppercase tracking-[0.12em] text-tea">
            Consulter →
          </span>
        </Link>
      </div>
    </div>
  );
}
