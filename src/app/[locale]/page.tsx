import { getDictionary } from "@/i18n/getDictionary";
import { locales, type Locale, getBasePath } from "@/lib/utils";
import HeroSlider from "@/components/home/HeroSlider";
import PromoBanner from "@/components/home/PromoBanner";
import Welcome from "@/components/home/Welcome";
import RoomsGrid from "@/components/home/RoomsGrid";
import Philosophy from "@/components/home/Philosophy";
import Offers from "@/components/home/Offers";
import RestaurantTeaser from "@/components/home/RestaurantTeaser";
import Destinations from "@/components/home/Destinations";
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
      <HeroSlider dict={dict} />
      <BookingBar dict={dict} />
      <PromoBanner dict={dict} />
      <Welcome dict={dict} locale={locale as Locale} />
      <RoomsGrid dict={dict} locale={locale as Locale} />
      <Philosophy dict={dict} />
      <Offers dict={dict} />
      <RestaurantTeaser dict={dict} locale={locale as Locale} />
      <Destinations dict={dict} locale={locale as Locale} />
      <Testimonials dict={dict} locale={locale as Locale} />
      <ContactSection dict={dict} />
    </>
  );
}
