import { getDictionary } from "@/i18n/getDictionary";
import { locales, type Locale, getBasePath } from "@/lib/utils";
import HeroHome from "@/components/home/HeroHome";
import PromoBanner from "@/components/home/PromoBanner";
import Welcome from "@/components/home/Welcome";
import OurHouse from "@/components/home/OurHouse";
import RoomsGrid from "@/components/home/RoomsGrid";
import RestaurantTeaser from "@/components/home/RestaurantTeaser";
import DestinationsTeaser from "@/components/home/DestinationsTeaser";
import Testimonials from "@/components/home/Testimonials";
import ContactSection from "@/components/home/ContactSection";
import BookingBar from "@/components/home/BookingBar";

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return {
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: {
      languages: {
        fr: `${getBasePath()}/fr/`,
        en: `${getBasePath()}/en/`,
        es: `${getBasePath()}/es/`,
      },
    },
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  return (
    <>
      <HeroHome dict={dict} />
      <PromoBanner dict={dict} />
      <Welcome dict={dict} locale={locale as Locale} />
      <OurHouse dict={dict} locale={locale as Locale} />
      <RoomsGrid dict={dict} locale={locale as Locale} />
      <DestinationsTeaser dict={dict} locale={locale as Locale} />
      <RestaurantTeaser dict={dict} locale={locale as Locale} />
      <Testimonials dict={dict} locale={locale as Locale} />
      <ContactSection dict={dict} />
      <BookingBar dict={dict} />
    </>
  );
}
