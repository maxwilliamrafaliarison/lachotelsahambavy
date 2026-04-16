import { notFound } from "next/navigation";
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
    <>
      <JsonLd
        schemas={[
          organizationSchema(),
          websiteSchema(typedLocale),
          lodgingBusinessSchema(typedLocale),
        ]}
      />
      <TopBar />
      <Navbar locale={typedLocale} dict={dict} />
      <main className="flex-1">{children}</main>
      <Footer locale={typedLocale} dict={dict} />
      <WhatsAppFloat locale={typedLocale} dict={dict} />
      <CookieNotice dict={dict} />
    </>
  );
}
