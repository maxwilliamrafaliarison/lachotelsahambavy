import { notFound } from "next/navigation";
import { locales, type Locale } from "@/lib/utils";
import { getDictionary } from "@/i18n/getDictionary";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppFloat from "@/components/layout/WhatsAppFloat";
import CookieNotice from "@/components/layout/CookieNotice";

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

  const dict = await getDictionary(locale as Locale);

  return (
    <>
      <Navbar locale={locale as Locale} dict={dict} />
      <main className="flex-1">{children}</main>
      <Footer locale={locale as Locale} dict={dict} />
      <WhatsAppFloat locale={locale as Locale} dict={dict} />
      <CookieNotice dict={dict} />
    </>
  );
}
