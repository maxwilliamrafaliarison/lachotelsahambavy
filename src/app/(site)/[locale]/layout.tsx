import type { Metadata } from "next";
import { notFound } from "next/navigation";
import RootShell from "@/app/root-shell";
import { locales, type Locale } from "@/lib/utils";
import { getDictionary } from "@/i18n/getDictionary";
import TopBar from "@/components/layout/TopBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppFloat from "@/components/layout/WhatsAppFloat";
import CookieNotice from "@/components/layout/CookieNotice";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  lodgingBusinessSchema,
  organizationSchema,
  websiteSchema,
} from "@/lib/schema-org";

/**
 * LAYOUT RACINE du site public : c'est lui qui rend <html> et <body>.
 *
 * Il a récupéré ce rôle de `app/layout.tsx`, supprimé : ce dernier ne
 * recevait pas le paramètre de langue et annonçait donc `lang="fr"` sur
 * toutes les pages anglaises et espagnoles. Seul un layout situé sous
 * `[locale]` connaît la langue de la page.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc = (locales.includes(locale as Locale) ? locale : "fr") as Locale;

  /* og:locale suivait le même sort que lang : figé à fr_FR partout. */
  const OG: Record<Locale, string> = { fr: "fr_FR", en: "en_GB", es: "es_ES" };
  const autres = (Object.keys(OG) as Locale[]).filter((l) => l !== loc).map((l) => OG[l]);

  const dict = await getDictionary(loc);

  /* Image de partage, héritée par les 51 pages : sans elle, le
     `twitter:card = summary_large_image` annoncé plus bas ne disposait
     d'aucune illustration et les partages sortaient en vignette nue.
     Posée ici, dans le layout, elle n'impose aucune modification aux
     pages ; celles qui redéfiniraient `openGraph` la remplaceraient
     (aucune ne le fait aujourd'hui). Dimensions réelles du fichier
     servi depuis public/ : 2400 × 1350 (16/9). */
  const partage = {
    url: "/images/hero/hotel-vu-du-lac-bungalows-pilotis.jpg",
    width: 2400,
    height: 1350,
    alt: "Le Lac Hôtel Sahambavy vu du lac, avec ses bungalows sur pilotis",
  };

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://lachotel.com"),
    title: {
      default: dict.meta.title,
      template: "%s · Lac Hôtel Sahambavy",
    },
    description: dict.meta.description,
    applicationName: "Lac Hôtel Sahambavy",
    authors: [{ name: "Lac Hôtel Sahambavy" }],
    creator: "Lac Hôtel Sahambavy",
    publisher: "Lac Hôtel Sahambavy",
    icons: { icon: "/favicon.png", apple: "/apple-icon.png" },
    openGraph: {
      type: "website",
      siteName: "Lac Hôtel Sahambavy",
      locale: OG[loc],
      alternateLocale: autres,
      images: [partage],
    },
    twitter: {
      card: "summary_large_image",
      images: [partage.url],
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
    formatDetection: { email: true, telephone: true, address: true },
  };
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();

  const typedLocale = locale as Locale;
  const dict = await getDictionary(typedLocale);

  return (
    <RootShell lang={typedLocale}>
      <JsonLd
        schemas={[
          organizationSchema(),
          websiteSchema(typedLocale),
          lodgingBusinessSchema(typedLocale),
        ]}
      />
      <TopBar locale={locale as Locale} />
      <Navbar locale={typedLocale} dict={dict} />
      <main className="flex-1">{children}</main>
      <Footer locale={typedLocale} dict={dict} />
      <WhatsAppFloat locale={typedLocale} dict={dict} />
      <CookieNotice dict={dict} />
    </RootShell>
  );
}
