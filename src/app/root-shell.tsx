import { Inter_Tight, Inter, Cormorant_Garamond } from "next/font/google";
import { Plausible } from "@/components/seo/Plausible";
import "./globals.css";

/**
 * Coque HTML partagée par les layouts racines.
 *
 * POURQUOI PLUSIEURS LAYOUTS RACINES
 * `<html lang>` doit porter la langue de la page. Or seul un layout situé
 * SOUS le segment `[locale]` connaît cette langue : un layout de groupe
 * placé au-dessus ne reçoit pas le paramètre. Tant que `app/layout.tsx`
 * existait, il était le seul à rendre `<html>` — et il annonçait « fr »
 * sur les pages anglaises et espagnoles, aux lecteurs d'écran comme aux
 * moteurs.
 *
 * D'où la bascule vers des layouts racines multiples (route groups) :
 *   (site)/[locale]/layout.tsx  → lang = fr | en | es
 *   (admin)/admin/layout.tsx    → lang = fr, outil interne
 *   (racine)/layout.tsx         → lang = fr, la seule page hors [locale]
 *
 * Les trois passent par cette coque : les polices ne sont déclarées qu'une
 * fois, `globals.css` n'est importé qu'ici, et le script Plausible reste
 * unique. Sans elle, la duplication dériverait au premier changement.
 *
 * Les variables de police gardent leurs noms historiques
 * (--font-inter-tight / --font-inter / --font-cormorant).
 */

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  weight: ["200", "300", "400", "600"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

export default function RootShell({
  lang,
  children,
}: {
  /** Code de langue BCP 47 servi dans le HTML : « fr », « en » ou « es ». */
  lang: string;
  children: React.ReactNode;
}) {
  return (
    <html
      lang={lang}
      data-scroll-behavior="smooth"
      className={`${interTight.variable} ${inter.variable} ${cormorant.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col">
        {children}
        <Plausible />
      </body>
    </html>
  );
}
