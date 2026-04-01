import type { Metadata } from "next";
import { Playfair_Display, Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-sub",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://maxwilliamrafaliarison.github.io/lachotelsahambavy"),
  title: "Lac Hôtel Sahambavy — Éco-lodge de luxe sur le lac | Madagascar",
  description:
    "Éco-lodge de charme à Fianarantsoa, Madagascar. Bungalows sur pilotis, restaurant panoramique, plantation de thé.",
  openGraph: {
    type: "website",
    siteName: "Lac Hôtel Sahambavy",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      className={`${playfair.variable} ${inter.variable} ${cormorant.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
