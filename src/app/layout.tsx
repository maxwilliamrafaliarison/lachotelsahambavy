import type { Metadata } from "next";
import { Inter_Tight, Inter, Cormorant_Garamond } from "next/font/google";
import { Plausible } from "@/components/seo/Plausible";
import "./globals.css";

/**
 * Direction artistique « Panorama + Nuit sur le lac » (validée 16/07/2026) :
 * - Inter Tight (200-300) : titrage géant ultra-fin, transposition Glacier Express
 * - Cormorant Garamond : serif éditorial des canvases « Nuit » (pages signature)
 * - Inter : texte courant
 * Les variables gardent leurs noms historiques (--font-heading/--font-sub/--font-body)
 * pour ne casser aucun composant pendant la migration.
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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://lachotel.com"),
  title: {
    default: "Lac Hôtel Sahambavy — Éco-lodge de charme sur le lac | Madagascar",
    template: "%s · Lac Hôtel Sahambavy",
  },
  description:
    "Éco-lodge de charme à Fianarantsoa, Madagascar. Bungalows sur pilotis, restaurant panoramique, plantation de thé.",
  applicationName: "Lac Hôtel Sahambavy",
  authors: [{ name: "Lac Hôtel Sahambavy" }],
  creator: "Lac Hôtel Sahambavy",
  publisher: "Lac Hôtel Sahambavy",
  icons: {
    icon: "/favicon.png",
    apple: "/apple-icon.png",
  },
  openGraph: {
    type: "website",
    siteName: "Lac Hôtel Sahambavy",
    locale: "fr_FR",
    alternateLocale: ["en_GB", "es_ES"],
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: {
    email: true,
    telephone: true,
    address: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
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
