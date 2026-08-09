/**
 * Génération PDF de la facture proforma — côté client, via pdf-lib (léger,
 * pas de moteur de rendu embarqué). A4, logo, multi-pages si besoin.
 */
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import { type Devis, totaux, nbNuits, libelleRemise, formatDateFr } from "./proforma";
import { siteConfig } from "@/data/site";

const A4: [number, number] = [595.28, 841.89];
const MARGE = 48;
const INK = rgb(0.106, 0.106, 0.09); // #1B1B17
const BODY = rgb(0.29, 0.29, 0.267);
const MUTED = rgb(0.54, 0.525, 0.486);
const TEA = rgb(0.184, 0.365, 0.275); // #2F5D46
const HAIRLINE = rgb(0.906, 0.894, 0.863);

/**
 * Les fontes standard PDF (Helvetica) n'encodent que WinAnsi : translittère
 * les caractères exotiques (flèches, espaces fines…) au lieu de planter.
 * WinAnsi couvre Latin-1 + € … quotes typographiques œ Œ ™ ; le reste → « - ».
 */
function winAnsiSafe(s: string): string {
  return s
    .replace(/[\u00A0\u202F\u2009\u2007]/g, " ") // espaces insécables/fines
    .replace(/[\u2194\u21C4\u21D4]/g, "-") // fléches doubles
    .replace(/[\u2192\u21D2]/g, ">")
    .replace(/[\u2190\u21D0]/g, "<")
    .replace(/[\u2219\u22C5]/g, "\u00B7")
    .replace(/[\u02BC\u2032]/g, "'")
    .replace(
      // Tout ce qui reste hors Latin-1 imprimable et hors extras WinAnsi -> "-"
      /[^\x20-\x7E\xA0-\xFF\u20AC\u201A\u0192\u201E\u2026\u2020\u2021\u02C6\u2030\u0160\u2039\u0152\u017D\u2018\u2019\u201C\u201D\u2022\u2013\u2014\u02DC\u2122\u0161\u203A\u0153\u017E\u0178]/g,
      "-"
    );
}


function fmtAr(n: number): string {
  // Espace fine insécable remplacée par espace simple (WinAnsi)
  return `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(Math.round(n)).replace(/[  ]/g, " ")} Ar`;
}
function fmtEur(n: number): string {
  return `${new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n).replace(/[  ]/g, " ")} EUR`;
}

export async function genererProformaPdf(devis: Devis, logoUrl: string): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const helv = await doc.embedFont(StandardFonts.Helvetica);
  const helvBold = await doc.embedFont(StandardFonts.HelveticaBold);

  doc.setTitle(`Facture proforma ${devis.numero} · Lac Hôtel Sahambavy`);
  doc.setAuthor("Lac Hôtel Sahambavy");
  doc.setSubject("Facture proforma");

  let logo: Awaited<ReturnType<PDFDocument["embedPng"]>> | null = null;
  try {
    const bytes = await fetch(logoUrl).then((r) => r.arrayBuffer());
    logo = await doc.embedPng(bytes);
  } catch {
    logo = null; // pas de logo → en-tête typographique seul
  }

  const t = totaux(devis);
  const nuits = nbNuits(devis.sejour.arrivee, devis.sejour.depart);

  let page = doc.addPage(A4);
  let y = A4[1] - MARGE;

  const text = (
    p: PDFPage,
    str: string,
    x: number,
    yy: number,
    opts: { font?: PDFFont; size?: number; color?: ReturnType<typeof rgb>; align?: "left" | "right"; maxW?: number } = {}
  ) => {
    const font = opts.font ?? helv;
    const size = opts.size ?? 9.5;
    let s = winAnsiSafe(str);
    if (opts.maxW) {
      while (font.widthOfTextAtSize(s, size) > opts.maxW && s.length > 3) s = s.slice(0, -2);
      if (s !== str) s = s.slice(0, -1) + "…";
    }
    const w = font.widthOfTextAtSize(s, size);
    p.drawText(s, {
      x: opts.align === "right" ? x - w : x,
      y: yy,
      size,
      font,
      color: opts.color ?? BODY,
    });
  };
  const line = (p: PDFPage, yy: number, x1 = MARGE, x2 = A4[0] - MARGE, color = HAIRLINE) => {
    p.drawLine({ start: { x: x1, y: yy }, end: { x: x2, y: yy }, thickness: 0.7, color });
  };

  /* ---------- En-tête ---------- */
  if (logo) {
    const h = 54;
    const w = (logo.width / logo.height) * h;
    page.drawImage(logo, { x: MARGE, y: y - h + 6, width: w, height: h });
  } else {
    text(page, "LAC HÔTEL SAHAMBAVY", MARGE, y - 12, { font: helvBold, size: 15, color: INK });
  }
  text(page, "FACTURE PROFORMA", A4[0] - MARGE, y - 4, { font: helvBold, size: 15, color: INK, align: "right" });
  text(page, `N° ${devis.numero}`, A4[0] - MARGE, y - 22, { font: helvBold, size: 10.5, color: TEA, align: "right" });
  text(page, `Émise le ${formatDateFr(devis.dateEmission)}`, A4[0] - MARGE, y - 37, { size: 9, color: MUTED, align: "right" });
  text(page, `Valable ${devis.validiteJours} jours`, A4[0] - MARGE, y - 50, { size: 9, color: MUTED, align: "right" });
  y -= 74;
  line(page, y);
  y -= 22;

  /* ---------- Client & séjour ---------- */
  text(page, "ADRESSÉE À", MARGE, y, { font: helvBold, size: 8, color: MUTED });
  text(page, "SÉJOUR", 330, y, { font: helvBold, size: 8, color: MUTED });
  y -= 16;
  text(page, devis.client.nom || "…", MARGE, y, { font: helvBold, size: 11, color: INK });
  const arrivee = devis.sejour.arrivee ? formatDateFr(devis.sejour.arrivee) : "…";
  const depart = devis.sejour.depart ? formatDateFr(devis.sejour.depart) : "…";
  text(page, `Du ${arrivee} au ${depart}`, 330, y, { size: 10, color: INK });
  y -= 15;
  if (devis.client.contact) text(page, devis.client.contact, MARGE, y, { size: 9.5 });
  text(
    page,
    `${nuits} nuit${nuits > 1 ? "s" : ""} · ${devis.sejour.personnes} personne${devis.sejour.personnes > 1 ? "s" : ""}`,
    330,
    y,
    { size: 9.5 }
  );
  y -= 28;

  /* ---------- Tableau ---------- */
  const COL = {
    label: MARGE,
    qte: 358,
    unite: 396,
    pu: 486,
    total: A4[0] - MARGE,
  };
  const header = (p: PDFPage, yy: number) => {
    text(p, "DÉSIGNATION", COL.label, yy, { font: helvBold, size: 8, color: MUTED });
    text(p, "QTÉ", COL.qte, yy, { font: helvBold, size: 8, color: MUTED });
    text(p, "UNITÉ", COL.unite, yy, { font: helvBold, size: 8, color: MUTED });
    text(p, "P.U. (AR)", COL.pu, yy, { font: helvBold, size: 8, color: MUTED, align: "right" });
    text(p, "TOTAL (AR)", COL.total, yy, { font: helvBold, size: 8, color: MUTED, align: "right" });
    line(p, yy - 6, MARGE, A4[0] - MARGE, rgb(0.72, 0.7, 0.66));
  };
  header(page, y);
  y -= 22;

  for (const l of devis.lignes) {
    if (y < 150) {
      page = doc.addPage(A4);
      y = A4[1] - MARGE;
      header(page, y);
      y -= 22;
    }
    text(page, l.label, COL.label, y, { size: 9.5, color: INK, maxW: 296 });
    text(page, new Intl.NumberFormat("fr-FR").format(l.qte).replace(/[  ]/g, " "), COL.qte, y, { size: 9.5 });
    text(page, l.unite, COL.unite, y, { size: 8.5, color: MUTED });
    text(page, fmtAr(l.prixAr).replace(" Ar", ""), COL.pu, y, { size: 9.5, align: "right" });
    text(page, fmtAr(l.qte * l.prixAr).replace(" Ar", ""), COL.total, y, { font: helvBold, size: 9.5, color: INK, align: "right" });
    y -= 8;
    line(page, y);
    y -= 14;
  }

  /* ---------- Totaux ---------- */
  if (y < 190) {
    page = doc.addPage(A4);
    y = A4[1] - MARGE;
  }
  y -= 4;
  const totalX1 = 330;
  const totLine = (label: string, val: string, opts: { color?: ReturnType<typeof rgb>; bold?: boolean } = {}) => {
    text(page, label, totalX1, y, { size: 9.5, color: opts.color, font: opts.bold ? helvBold : helv });
    text(page, val, COL.total, y, { size: 9.5, color: opts.color, font: opts.bold ? helvBold : helv, align: "right" });
    y -= 16;
  };

  totLine("Prestations TTC", fmtAr(t.prestationsTtc));
  if (t.remiseAr > 0) totLine(libelleRemise(devis.remise), `- ${fmtAr(t.remiseAr)}`, { color: TEA });
  totLine("dont HT", fmtAr(t.ht), { color: MUTED });
  if (devis.exoneration) {
    totLine("TVA", "Exoneree", { color: TEA });
  } else {
    totLine("dont TVA 20%", fmtAr(t.tva), { color: MUTED });
  }
  if (t.vignette > 0) totLine("Vignette touristique (hors TVA)", fmtAr(t.vignette));

  line(page, y + 4, totalX1, A4[0] - MARGE, rgb(0.72, 0.7, 0.66));
  y -= 8;
  text(page, "TOTAL A PAYER", totalX1, y, { font: helvBold, size: 12, color: INK });
  text(page, fmtAr(t.totalAr), COL.total, y, { font: helvBold, size: 12, color: INK, align: "right" });
  y -= 16;
  text(page, `Équivalent au taux 1 EUR = ${new Intl.NumberFormat("fr-FR").format(devis.tauxEur).replace(/[  ]/g, " ")} Ar`, totalX1, y, { size: 8.5, color: MUTED });
  text(page, fmtEur(t.totalEur), COL.total, y, { font: helvBold, size: 10.5, color: TEA, align: "right" });
  y -= 20;
  if (devis.exoneration) {
    text(page, "Exonere de TVA, a confirmer selon le regime applicable.", MARGE, y, { size: 8, color: MUTED });
    y -= 14;
  }
  y -= 10;

  /* ---------- Notes ---------- */
  if (devis.notes.trim()) {
    text(page, "NOTES", MARGE, y, { font: helvBold, size: 8, color: MUTED });
    y -= 14;
    for (const raw of devis.notes.split("\n").slice(0, 6)) {
      text(page, raw.trim(), MARGE, y, { size: 9, maxW: A4[0] - 2 * MARGE });
      y -= 13;
    }
  }

  /* ---------- Pied de page (sur chaque page) ---------- */
  for (const p of doc.getPages()) {
    line(p, 92);
    text(p, "Lac Hôtel Sahambavy", MARGE, 78, { font: helvBold, size: 8.5, color: INK });
    text(p, siteConfig.address, MARGE, 66, { size: 8 });
    text(p, `${siteConfig.email} · ${siteConfig.phone} · ${siteConfig.url.replace("https://", "")}`, MARGE, 54, { size: 8 });
    text(
      p,
      `RCS ${siteConfig.legal.rcs} · STAT ${siteConfig.legal.stat} · NIF ${siteConfig.legal.nif}`,
      MARGE,
      42,
      { size: 7.5, color: MUTED }
    );
    text(
      p,
      "Facture proforma établie à titre indicatif : elle ne vaut pas facture définitive.",
      MARGE,
      30,
      { size: 7.5, color: MUTED }
    );
  }

  return doc.save();
}
