/**
 * Requêtes du tableau de bord d'équipe. Server-only (accès base).
 */
import { sql } from "drizzle-orm";
import { getDb } from "./index";

export type TopAgence = { nom: string; docs: number; pax: number; ca: number };
export type MoisStat = { mois: string; sejours: number; pax: number; ca: number };
export type Synthese = {
  factures: number;
  proformas: number;
  avoirs: number;
  caTotal: number;
  panierMoyen: number;
  paxTotal: number;
  agencesActives: number;
};

/* eslint-disable @typescript-eslint/no-explicit-any */

export async function synthese(annee: number): Promise<Synthese> {
  const db = getDb();
  const r = await db.execute(sql`
    select
      count(*) filter (where d.type='FACTURE')::int as factures,
      count(*) filter (where d.type='PROFORMA')::int as proformas,
      count(*) filter (where d.type='AVOIR')::int as avoirs,
      coalesce(sum(d.montant_ca) filter (where d.type<>'AVOIR'),0)::bigint as ca_total,
      coalesce(sum(s.pax) filter (where d.type<>'AVOIR'),0)::int as pax_total,
      count(distinct d.agence_id) filter (where d.type<>'AVOIR')::int as agences
    from documents d left join sejours s on s.id = d.sejour_id
    where d.annee = ${annee}`);
  const row = r.rows[0] as any;
  const nonAvoir = Number(row.factures) + Number(row.proformas);
  return {
    factures: Number(row.factures),
    proformas: Number(row.proformas),
    avoirs: Number(row.avoirs),
    caTotal: Number(row.ca_total),
    paxTotal: Number(row.pax_total),
    agencesActives: Number(row.agences),
    panierMoyen: nonAvoir ? Math.round(Number(row.ca_total) / nonAvoir) : 0,
  };
}

export async function topAgences(annee: number, limite = 12): Promise<TopAgence[]> {
  const db = getDb();
  const r = await db.execute(sql`
    select a.nom,
           count(*)::int as docs,
           coalesce(sum(s.pax),0)::int as pax,
           coalesce(sum(d.montant_ca),0)::bigint as ca
    from documents d
      join agences a on a.id = d.agence_id
      left join sejours s on s.id = d.sejour_id
    where d.type <> 'AVOIR' and d.annee = ${annee}
    group by a.nom
    order by ca desc
    limit ${limite}`);
  return (r.rows as any[]).map((x) => ({
    nom: x.nom,
    docs: Number(x.docs),
    pax: Number(x.pax),
    ca: Number(x.ca),
  }));
}

export async function saisonnalite(annee: number): Promise<MoisStat[]> {
  const db = getDb();
  const r = await db.execute(sql`
    select to_char(s.date_in, 'YYYY-MM') as mois,
           count(*)::int as sejours,
           coalesce(sum(s.pax),0)::int as pax,
           coalesce(sum(d.montant_ca),0)::bigint as ca
    from documents d join sejours s on s.id = d.sejour_id
    where d.type <> 'AVOIR' and d.annee = ${annee} and s.date_in is not null
    group by mois order by mois`);
  return (r.rows as any[]).map((x) => ({
    mois: x.mois,
    sejours: Number(x.sejours),
    pax: Number(x.pax),
    ca: Number(x.ca),
  }));
}

/** Années présentes en base (pour le sélecteur). */
export async function anneesDisponibles(): Promise<number[]> {
  const db = getDb();
  const r = await db.execute(sql`select distinct annee from documents where annee is not null order by annee desc`);
  return (r.rows as any[]).map((x) => Number(x.annee));
}
