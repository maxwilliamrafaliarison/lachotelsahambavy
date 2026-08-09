"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CATALOGUE,
  TAUX_EUR_DEFAUT,
  estSoumisTva,
  formatAr,
  formatEur,
  type CatalogueItem,
} from "@/lib/admin/tarifs";
import {
  type Devis,
  type LigneDevis,
  type Remise,
  nbNuits,
  totaux,
  libelleRemise,
} from "@/lib/admin/proforma";
import { genererProformaPdf } from "@/lib/admin/proforma-pdf";
import { getBasePath } from "@/lib/utils";

const basePath = getBasePath();

/**
 * Seuils de la jauge de remise (en % des prestations). Sous le 1er seuil, la
 * réception accorde librement ; entre les deux, la remise reste raisonnable ;
 * au-delà, elle relève de la Direction. Valeurs à ajuster par Maggie.
 */
const SEUIL_RECEPTION = 15;
const SEUIL_DIRECTION = 30;

/** Compteur annuel PRO-2026-NNN, mémorisé sur le poste (modifiable à la main). */
function numeroSuivant(): string {
  const annee = new Date().getFullYear();
  const cle = `lachotel-proforma-compteur-${annee}`;
  const n = parseInt(localStorage.getItem(cle) ?? "0", 10) + 1;
  return `PRO-${annee}-${String(n).padStart(3, "0")}`;
}
function enregistrerNumero(numero: string) {
  const m = numero.match(/^PRO-(\d{4})-(\d{1,4})$/);
  if (!m) return;
  const cle = `lachotel-proforma-compteur-${m[1]}`;
  const n = parseInt(m[2], 10);
  const actuel = parseInt(localStorage.getItem(cle) ?? "0", 10);
  if (n > actuel) localStorage.setItem(cle, String(n));
}

const aujourdhui = () => new Date().toISOString().slice(0, 10);

let seq = 0;
const uid = () => `l${Date.now().toString(36)}${(seq++).toString(36)}`;

export default function ProformaSimulator() {
  const [numero, setNumero] = useState("PRO-…");
  const [dateEmission, setDateEmission] = useState(aujourdhui());
  const [validiteJours, setValiditeJours] = useState(30);
  const [nom, setNom] = useState("");
  const [contact, setContact] = useState("");
  const [arrivee, setArrivee] = useState("");
  const [depart, setDepart] = useState("");
  const [personnes, setPersonnes] = useState(2);
  const [lignes, setLignes] = useState<LigneDevis[]>([]);
  const [remiseType, setRemiseType] = useState<Remise["type"]>("aucune");
  const [remiseValeur, setRemiseValeur] = useState(0);
  const [exoneration, setExoneration] = useState(false);
  const [tauxEur, setTauxEur] = useState(TAUX_EUR_DEFAUT);
  const [notes, setNotes] = useState("");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfNom, setPdfNom] = useState("");
  const [busy, setBusy] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  /* Initialisation côté client : compteur + taux mémorisés sur le poste. */
  useEffect(() => {
    setNumero(numeroSuivant());
    const t = parseInt(localStorage.getItem("lachotel-proforma-taux") ?? "", 10);
    if (t > 0) setTauxEur(t);
  }, []);
  useEffect(() => {
    if (tauxEur > 0) localStorage.setItem("lachotel-proforma-taux", String(tauxEur));
  }, [tauxEur]);

  const nuits = nbNuits(arrivee, depart);

  function qteParDefaut(item: CatalogueItem): number {
    const n = Number.isFinite(nuits) ? Math.max(1, nuits) : 1;
    const pax = Number.isFinite(personnes) ? Math.max(1, personnes) : 1;
    if (item.unite === "nuit") return n;
    if (item.unite === "pers./nuit") return n * pax;
    if (item.unite === "personne") return pax;
    return 1;
  }

  function ajouterCatalogue(item: CatalogueItem) {
    setLignes((ls) => [
      ...ls,
      {
        id: uid(),
        label: item.label,
        qte: qteParDefaut(item),
        unite: item.unite,
        prixAr: item.prixAr,
        soumisTva: estSoumisTva(item),
      },
    ]);
  }
  function ajouterLigneLibre() {
    setLignes((ls) => [
      ...ls,
      { id: uid(), label: "", qte: 1, unite: "unité", prixAr: 0, soumisTva: true },
    ]);
  }
  function modifierLigne(id: string, patch: Partial<LigneDevis>) {
    setLignes((ls) => ls.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  }
  function supprimerLigne(id: string) {
    setLignes((ls) => ls.filter((l) => l.id !== id));
  }

  const remise: Remise = useMemo(() => {
    if (remiseType === "pourcent") return { type: "pourcent", valeur: remiseValeur };
    if (remiseType === "montant") return { type: "montant", valeur: remiseValeur };
    return { type: "aucune" };
  }, [remiseType, remiseValeur]);

  const devis: Devis = {
    numero,
    dateEmission,
    validiteJours,
    client: { nom, contact },
    sejour: { arrivee, depart, personnes },
    lignes,
    remise,
    exoneration,
    tauxEur,
    notes,
  };
  const t = totaux(devis);

  /** Remise en % des prestations, pour la jauge (même si saisie en montant). */
  const remisePct = t.prestationsTtc > 0 ? (t.remiseAr / t.prestationsTtc) * 100 : 0;

  async function genererPdf() {
    setErreur(null);
    if (!nom.trim()) {
      setErreur("Indiquez le nom du client (en haut du formulaire).");
      return;
    }
    if (lignes.length === 0) {
      setErreur("Ajoutez au moins une ligne au devis (boutons « Ajouter » ci-dessous).");
      return;
    }
    setBusy(true);
    try {
      const bytes = await genererProformaPdf(devis, `${basePath}/images/logo/logo-dark.png`);
      const ab = new ArrayBuffer(bytes.byteLength);
      new Uint8Array(ab).set(bytes);
      const blob = new Blob([ab], { type: "application/pdf" });
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
      const url = URL.createObjectURL(blob);
      const nomFichier = `${numero} · ${nom.trim().replace(/[\\/:*?"<>|]/g, "")}.pdf`;
      setPdfUrl(url);
      setPdfNom(nomFichier);
      const a = document.createElement("a");
      a.href = url;
      a.download = nomFichier;
      a.click();
      enregistrerNumero(numero);
    } catch (e) {
      setErreur(`La génération du PDF a échoué : ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setBusy(false);
    }
  }

  const inputCls =
    "w-full rounded border border-hairline bg-white px-3 py-2 text-[14px] text-ink outline-none transition-colors focus:border-lake";
  const labelCls = "mb-1 block text-[11px] font-semibold uppercase tracking-[0.14em] text-muted";

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      {/* ============ Colonne formulaire ============ */}
      <div className="space-y-8">
        {/* Client & séjour */}
        <section className="rounded-[3px] border border-hairline bg-white p-6">
          <p className="ge-label mb-4">1 · Client & séjour</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="pf-nom">Nom du client *</label>
              <input id="pf-nom" className={inputCls} value={nom} onChange={(e) => setNom(e.target.value)} placeholder="M. et Mme Rakoto" />
            </div>
            <div>
              <label className={labelCls} htmlFor="pf-contact">Contact (e-mail / téléphone)</label>
              <input id="pf-contact" className={inputCls} value={contact} onChange={(e) => setContact(e.target.value)} placeholder="rakoto@mail.com · +261 …" />
            </div>
            <div>
              <label className={labelCls} htmlFor="pf-arrivee">Arrivée</label>
              <input id="pf-arrivee" type="date" className={inputCls} value={arrivee} onChange={(e) => setArrivee(e.target.value)} />
            </div>
            <div>
              <label className={labelCls} htmlFor="pf-depart">Départ</label>
              <input id="pf-depart" type="date" className={inputCls} value={depart} min={arrivee || undefined} onChange={(e) => setDepart(e.target.value)} />
            </div>
            <div>
              <label className={labelCls} htmlFor="pf-personnes">Personnes</label>
              <input id="pf-personnes" type="number" min={1} max={40} className={inputCls} value={personnes} onChange={(e) => setPersonnes(Math.max(1, parseInt(e.target.value || "1", 10)))} />
            </div>
            <div className="flex items-end pb-2 text-[13px] text-body">
              {nuits > 0 ? (
                <span><strong className="text-terracotta">{nuits} nuit{nuits > 1 ? "s" : ""}</strong> · les quantités s&apos;ajustent automatiquement</span>
              ) : (
                <span className="text-muted">Renseignez les dates pour calculer les nuits</span>
              )}
            </div>
          </div>
        </section>

        {/* Lignes */}
        <section className="rounded-[3px] border border-hairline bg-white p-6">
          <p className="ge-label mb-4">2 · Composez le séjour</p>
          {(["Hébergement", "Restauration", "Suppléments"] as const).map((groupe) => (
            <div key={groupe} className="mb-3">
              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">{groupe}</p>
              <div className="flex flex-wrap gap-2">
                {CATALOGUE.filter((c) => c.groupe === groupe).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => ajouterCatalogue(item)}
                    className="rounded-full border border-hairline bg-paper px-3.5 py-1.5 text-[12.5px] text-body transition-colors hover:border-lake hover:text-lake"
                    title={`${formatAr(item.prixAr)} / ${item.unite}${estSoumisTva(item) ? " · TTC" : " · hors TVA"}`}
                  >
                    + {item.label.replace(" (double/twin/single)", "")}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <button type="button" onClick={ajouterLigneLibre} className="mt-1 rounded-full border border-dashed border-hairline px-3.5 py-1.5 text-[12.5px] text-muted transition-colors hover:border-lake hover:text-lake">
            + Ligne libre (prestation sur mesure)
          </button>

          {lignes.length > 0 && (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[620px] text-[13.5px]">
                <thead>
                  <tr className="border-b border-hairline text-left">
                    <th className="pb-2 pr-3 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted">Désignation</th>
                    <th className="w-16 pb-2 pr-3 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted">Qté</th>
                    <th className="w-24 pb-2 pr-3 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted">Unité</th>
                    <th className="w-28 pb-2 pr-3 text-right text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted">P.U. TTC</th>
                    <th className="w-14 pb-2 text-center text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted" title="Soumis à la TVA 20 %">TVA</th>
                    <th className="w-28 pb-2 text-right text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted">Total</th>
                    <th className="w-8 pb-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {lignes.map((l) => (
                    <tr key={l.id} className="border-b border-hairline/60">
                      <td className="py-2 pr-3">
                        <input aria-label="Désignation" className={inputCls} value={l.label} placeholder="Désignation…" onChange={(e) => modifierLigne(l.id, { label: e.target.value })} />
                      </td>
                      <td className="py-2 pr-3">
                        <input aria-label="Quantité" type="number" min={0} className={`${inputCls} text-right`} value={l.qte} onChange={(e) => modifierLigne(l.id, { qte: Math.max(0, parseInt(e.target.value || "0", 10)) })} />
                      </td>
                      <td className="py-2 pr-3">
                        <input aria-label="Unité" className={inputCls} value={l.unite} onChange={(e) => modifierLigne(l.id, { unite: e.target.value })} />
                      </td>
                      <td className="py-2 pr-3">
                        <input aria-label="Prix unitaire TTC en ariary" type="number" min={0} step={1000} className={`${inputCls} text-right`} value={l.prixAr} onChange={(e) => modifierLigne(l.id, { prixAr: Math.max(0, parseInt(e.target.value || "0", 10)) })} />
                      </td>
                      <td className="py-2 text-center">
                        <input
                          type="checkbox"
                          aria-label="Ligne soumise à la TVA"
                          checked={l.soumisTva}
                          onChange={(e) => modifierLigne(l.id, { soumisTva: e.target.checked })}
                          className="h-4 w-4 accent-[var(--color-lake)]"
                        />
                      </td>
                      <td className="py-2 text-right font-semibold tabular-nums text-ink">{formatAr(l.qte * l.prixAr)}</td>
                      <td className="py-2 pl-2">
                        <button type="button" aria-label={`Supprimer la ligne ${l.label || ""}`} onClick={() => supprimerLigne(l.id)} className="text-muted transition-colors hover:text-copper">✕</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-2 text-[11.5px] text-muted">
                Prix saisis <strong>TTC</strong> (TVA 20 % comprise). Décochez « TVA »
                pour une ligne hors taxe (ex. vignette touristique).
              </p>
            </div>
          )}
        </section>

        {/* Remise, exonération, paramètres */}
        <section className="rounded-[3px] border border-hairline bg-white p-6">
          <p className="ge-label mb-4">3 · Remise, exonération & paramètres</p>

          {/* Remise + jauge */}
          <div className="mb-5 rounded-[3px] border border-hairline bg-paper p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls} htmlFor="pf-remise-type">Remise accordée</label>
                <select id="pf-remise-type" className={inputCls} value={remiseType} onChange={(e) => setRemiseType(e.target.value as Remise["type"])}>
                  <option value="aucune">Aucune</option>
                  <option value="pourcent">En % des prestations</option>
                  <option value="montant">Montant fixe (Ar)</option>
                </select>
              </div>
              {remiseType !== "aucune" && (
                <div>
                  <label className={labelCls} htmlFor="pf-remise-val">{remiseType === "pourcent" ? "Pourcentage (%)" : "Montant (Ar)"}</label>
                  <input id="pf-remise-val" type="number" min={0} max={remiseType === "pourcent" ? 100 : undefined} className={inputCls} value={remiseValeur} onChange={(e) => setRemiseValeur(Math.max(0, parseFloat(e.target.value || "0")))} />
                </div>
              )}
            </div>

            {/* Jauge de remise */}
            <div className="mt-4">
              <div className="mb-1.5 flex items-baseline justify-between text-[12px]">
                <span className="font-semibold uppercase tracking-[0.12em] text-muted">Niveau de remise</span>
                <span className="tabular-nums font-semibold text-ink">
                  {remisePct.toFixed(1)} % · {formatAr(t.remiseAr)}
                </span>
              </div>
              <div className="relative h-3 w-full overflow-hidden rounded-full bg-hairline">
                {/* zones repères */}
                <div className="absolute inset-y-0 left-0 bg-tea/15" style={{ width: `${(SEUIL_RECEPTION / 50) * 100}%` }} />
                <div className="absolute inset-y-0 bg-gold/20" style={{ left: `${(SEUIL_RECEPTION / 50) * 100}%`, width: `${((SEUIL_DIRECTION - SEUIL_RECEPTION) / 50) * 100}%` }} />
                {/* remplissage */}
                <div
                  className="absolute inset-y-0 left-0 rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, (remisePct / 50) * 100)}%`,
                    background:
                      remisePct <= SEUIL_RECEPTION
                        ? "var(--color-tea)"
                        : remisePct <= SEUIL_DIRECTION
                          ? "var(--color-gold)"
                          : "var(--color-copper)",
                  }}
                />
              </div>
              <p className="mt-1.5 text-[11.5px] leading-snug text-muted">
                {remisePct <= SEUIL_RECEPTION ? (
                  <span className="text-terracotta">Marge confortable : la réception peut accorder cette remise.</span>
                ) : remisePct <= SEUIL_DIRECTION ? (
                  <span className="text-gold">Remise importante, à confirmer selon l&apos;accord agence.</span>
                ) : (
                  <span className="text-copper">Au-delà de {SEUIL_DIRECTION} %, validation de la Direction recommandée.</span>
                )}
              </p>
            </div>
          </div>

          {/* Exonération */}
          <label className="mb-5 flex cursor-pointer items-start gap-3 rounded-[3px] border border-hairline bg-paper p-4">
            <input
              type="checkbox"
              checked={exoneration}
              onChange={(e) => setExoneration(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-[var(--color-lake)]"
            />
            <span className="text-[13.5px] leading-snug text-body">
              <span className="font-semibold text-ink">Exonération de TVA</span> : les
              prestations sont facturées hors taxe (le total baisse de 20 % sur les
              lignes soumises à TVA). La mention « Exonéré de TVA » apparaît sur la facture.
            </span>
          </label>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className={labelCls} htmlFor="pf-taux">Taux : 1 € = … Ar</label>
              <input id="pf-taux" type="number" min={1} step={50} className={inputCls} value={tauxEur} onChange={(e) => setTauxEur(Math.max(1, parseInt(e.target.value || "1", 10)))} />
            </div>
            <div>
              <label className={labelCls} htmlFor="pf-numero">N° de proforma</label>
              <input id="pf-numero" className={inputCls} value={numero} onChange={(e) => setNumero(e.target.value)} />
            </div>
            <div>
              <label className={labelCls} htmlFor="pf-date">Date d&apos;émission</label>
              <input id="pf-date" type="date" className={inputCls} value={dateEmission} onChange={(e) => setDateEmission(e.target.value)} />
            </div>
            <div>
              <label className={labelCls} htmlFor="pf-validite">Validité (jours)</label>
              <input id="pf-validite" type="number" min={1} className={inputCls} value={validiteJours} onChange={(e) => setValiditeJours(Math.max(1, parseInt(e.target.value || "30", 10)))} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls} htmlFor="pf-notes">Notes sur la facture (optionnel)</label>
              <input id="pf-notes" className={inputCls} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Acompte de 50 % à la confirmation…" />
            </div>
          </div>
        </section>
      </div>

      {/* ============ Colonne récapitulatif (sticky) ============ */}
      <aside className="lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-[3px] border border-hairline bg-white p-6">
          <p className="ge-label mb-4">Récapitulatif</p>
          <div className="ge-rows">
            <div className="ge-row"><span>Prestations TTC</span><span>{formatAr(t.prestationsTtc)}</span></div>
            {t.remiseAr > 0 && (
              <div className="ge-row"><span>{libelleRemise(remise)}</span><span>- {formatAr(t.remiseAr)}</span></div>
            )}
            <div className="ge-row"><span>dont HT</span><span>{formatAr(t.ht)}</span></div>
            {exoneration ? (
              <div className="ge-row"><span>TVA</span><span className="!text-terracotta">Exonéré</span></div>
            ) : (
              <div className="ge-row"><span>dont TVA 20 %</span><span>{formatAr(t.tva)}</span></div>
            )}
            {t.vignette > 0 && (
              <div className="ge-row"><span>Vignette touristique</span><span>{formatAr(t.vignette)}</span></div>
            )}
            <div className="ge-row !border-b-2 !border-b-ink/20">
              <span className="font-semibold text-ink">TOTAL À PAYER</span>
              <span className="!text-[17px]">{formatAr(t.totalAr)}</span>
            </div>
            <div className="ge-row"><span>Équivalent (1 € = {new Intl.NumberFormat("fr-FR").format(tauxEur)} Ar)</span><span>{formatEur(t.totalAr, tauxEur)}</span></div>
          </div>

          {erreur && (
            <p role="alert" className="mt-4 rounded-[3px] border border-copper/40 bg-copper/10 px-3 py-2.5 text-[13px] text-copper">
              {erreur}
            </p>
          )}

          <button type="button" onClick={genererPdf} disabled={busy} className="ge-cta mt-5 w-full disabled:opacity-60">
            {busy ? "Génération…" : "Générer le PDF"}
          </button>
          {pdfUrl && (
            <a href={pdfUrl} download={pdfNom} className="mt-3 block text-center text-[13px] text-lake underline underline-offset-4">
              Re-télécharger « {pdfNom} »
            </a>
          )}
          <p className="mt-4 text-[11.5px] leading-relaxed text-muted">
            Le numéro s&apos;incrémente automatiquement sur ce poste après chaque
            génération. Modifiable à la main si besoin (reprise d&apos;un registre).
          </p>
        </div>
      </aside>
    </div>
  );
}
