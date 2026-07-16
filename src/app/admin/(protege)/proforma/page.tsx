import type { Metadata } from "next";
import ProformaSimulator from "./ProformaSimulator";

export const metadata: Metadata = { title: "Facture proforma" };

export default function ProformaPage() {
  return (
    <div>
      <p className="ge-label mb-2">Devis séjour</p>
      <h1 className="mb-3 !text-[38px]">Facture proforma</h1>
      <p className="ge-measure mb-10 text-[15px] text-body">
        Renseignez le client et les dates, ajoutez les prestations d&apos;un clic
        (les quantités se calculent seules), appliquez la remise éventuelle —
        puis générez le PDF. Objectif : moins de deux minutes.
      </p>
      <ProformaSimulator />
    </div>
  );
}
