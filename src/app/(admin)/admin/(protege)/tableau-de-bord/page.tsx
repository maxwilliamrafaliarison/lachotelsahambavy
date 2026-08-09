import type { Metadata } from "next";
import Link from "next/link";
import { hasDb } from "@/lib/db";
import { synthese, topAgences, saisonnalite, anneesDisponibles } from "@/lib/db/stats";

export const metadata: Metadata = { title: "Tableau de bord" };
export const dynamic = "force-dynamic";

const MOIS_FR = ["", "janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
const fmtAr = (n: number) => `${new Intl.NumberFormat("fr-FR").format(Math.round(n))} Ar`;
const fmtM = (n: number) =>
  n >= 1_000_000
    ? `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 }).format(n / 1_000_000)} M Ar`
    : fmtAr(n);

function Tuile({ label, valeur, sous }: { label: string; valeur: string; sous?: string }) {
  return (
    <div className="rounded-[3px] border border-hairline bg-white p-5">
      <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-muted">{label}</p>
      <p className="mt-2 font-[family-name:var(--font-display)] text-[28px] font-extralight leading-none text-ink tabular-nums">
        {valeur}
      </p>
      {sous && <p className="mt-1.5 text-[12px] text-muted">{sous}</p>}
    </div>
  );
}

export default async function TableauDeBord({
  searchParams,
}: {
  searchParams: Promise<{ annee?: string }>;
}) {
  if (!hasDb()) {
    return (
      <div>
        <p className="ge-label mb-2">Tableau de bord</p>
        <h1 className="mb-3 !text-[38px]">Base de données non configurée</h1>
        <div className="ge-measure space-y-4 text-[15px] text-body">
          <p>
            Le tableau de bord affiche le chiffre d&apos;affaires, les agences et la
            saisonnalité à partir d&apos;une base de données. Elle n&apos;est pas encore
            branchée.
          </p>
          <ol className="list-decimal space-y-2 pl-5">
            <li>Créez une base Postgres gratuite sur <strong>neon.tech</strong> (région Europe).</li>
            <li>Copiez la chaîne de connexion dans la variable <code>DATABASE_URL</code> de Vercel.</li>
            <li>Lancez la migration puis l&apos;import de l&apos;historique (voir <code>docs/base-de-donnees.md</code>).</li>
          </ol>
          <p className="text-[13px] text-muted">
            Tant que la base n&apos;est pas configurée, le reste de l&apos;espace équipe
            (facture proforma) fonctionne normalement.
          </p>
        </div>
      </div>
    );
  }

  const annees = await anneesDisponibles();
  const params = await searchParams;
  const annee = Number(params.annee) || annees[0] || new Date().getFullYear();

  const [syn, agences, mois] = await Promise.all([
    synthese(annee),
    topAgences(annee, 12),
    saisonnalite(annee),
  ]);

  const maxCaMois = Math.max(1, ...mois.map((m) => m.ca));
  const maxCaAgence = Math.max(1, ...agences.map((a) => a.ca));

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="ge-label mb-2">Tableau de bord</p>
          <h1 className="!text-[38px]">Activité {annee}</h1>
        </div>
        {annees.length > 1 && (
          <nav className="flex gap-1.5">
            {annees.map((a) => (
              <Link
                key={a}
                href={`/admin/tableau-de-bord?annee=${a}`}
                className={`rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
                  a === annee ? "bg-lake text-white" : "border border-hairline text-body hover:border-lake hover:text-lake"
                }`}
              >
                {a}
              </Link>
            ))}
          </nav>
        )}
      </div>

      {/* Tuiles */}
      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Tuile label="Chiffre d'affaires" valeur={fmtM(syn.caTotal)} sous={`${syn.factures + syn.proformas} documents`} />
        <Tuile label="Voyageurs (PAX)" valeur={new Intl.NumberFormat("fr-FR").format(syn.paxTotal)} sous={`sur ${syn.agencesActives} agences actives`} />
        <Tuile label="Panier moyen" valeur={fmtM(syn.panierMoyen)} sous="par document" />
        <Tuile label="Documents" valeur={`${syn.factures} / ${syn.proformas}`} sous={`factures / proformas · ${syn.avoirs} avoirs`} />
      </div>

      {/* Saisonnalité */}
      <section className="mb-10 rounded-[3px] border border-hairline bg-white p-6">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="!text-[20px]">Saisonnalité : chiffre d&apos;affaires par mois d&apos;arrivée</h2>
          <span className="text-[12px] text-muted">en ariary</span>
        </div>
        {mois.length === 0 ? (
          <p className="text-[14px] text-muted">Aucun séjour daté pour {annee}.</p>
        ) : (
          <div className="flex items-end gap-2 md:gap-3" style={{ height: 220 }}>
            {mois.map((m) => {
              const h = Math.max(2, (m.ca / maxCaMois) * 180);
              const moisNum = Number(m.mois.slice(5, 7));
              return (
                <div key={m.mois} className="flex flex-1 flex-col items-center justify-end gap-2" title={`${MOIS_FR[moisNum]} : ${fmtAr(m.ca)} · ${m.sejours} séjours · ${m.pax} pax`}>
                  <span className="text-[10px] font-semibold text-muted tabular-nums">{fmtM(m.ca).replace(" Ar", "")}</span>
                  <div className="w-full rounded-t-[3px] bg-lake transition-all" style={{ height: h }} />
                  <span className="text-[11px] text-muted">{MOIS_FR[moisNum]}</span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Top agences */}
      <section className="rounded-[3px] border border-hairline bg-white p-6">
        <h2 className="mb-6 !text-[20px]">Agences par chiffre d&apos;affaires</h2>
        {agences.length === 0 ? (
          <p className="text-[14px] text-muted">Aucune donnée pour {annee}.</p>
        ) : (
          <div className="space-y-3">
            {agences.map((a, i) => (
              <div key={a.nom} className="grid grid-cols-[1.4rem_1fr_auto] items-center gap-3">
                <span className="text-[12px] font-semibold text-muted tabular-nums">{i + 1}</span>
                <div>
                  <div className="mb-1 flex items-baseline justify-between gap-3">
                    <span className="truncate text-[13.5px] text-ink">{a.nom}</span>
                    <span className="shrink-0 text-[11.5px] text-muted tabular-nums">{a.docs} doc · {a.pax} pax</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-hairline">
                    <div className="h-full rounded-full bg-lake" style={{ width: `${(a.ca / maxCaAgence) * 100}%` }} />
                  </div>
                </div>
                <span className="w-28 text-right text-[13.5px] font-semibold text-ink tabular-nums">{fmtM(a.ca)}</span>
              </div>
            ))}
          </div>
        )}
        <p className="mt-6 text-[12px] text-muted">
          Données importées des factures 2026 (proformas + factures, hors avoirs).
          Le chiffre d&apos;affaires réel se lit sur les factures émises ; les proformas
          indiquent le pipeline.
        </p>
      </section>
    </div>
  );
}
