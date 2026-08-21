import { getDictionary } from "@/i18n/getDictionary";
import { locales, type Locale } from "@/lib/utils";
import HeroHome from "@/components/home/HeroHome";
import Welcome from "@/components/home/Welcome";
import OurHouse from "@/components/home/OurHouse";
import AvisPlateformes from "@/components/home/AvisPlateformes";
import RoomsGrid from "@/components/home/RoomsGrid";
import RestaurantTeaser from "@/components/home/RestaurantTeaser";
import DestinationsTeaser from "@/components/home/DestinationsTeaser";
import GalleryTeaser from "@/components/home/GalleryTeaser";
import Testimonials from "@/components/home/Testimonials";
import ContactSection from "@/components/home/ContactSection";
import BookingBar from "@/components/home/BookingBar";
import { JsonLd } from "@/components/seo/JsonLd";
import { videoObjectSchema } from "@/lib/schema-org";
import { pageAlternates } from "@/lib/seo/alternates";
import { recupererAvisGoogle } from "@/lib/avis-google";

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return {
    // `absolute` court-circuite le gabarit racine : dict.meta.title porte
    // déjà « Lac Hôtel Sahambavy » en tête, le suffixe l'aurait répété.
    title: { absolute: dict.meta.title },
    description: dict.meta.description,
    /* Même helper que les autres pages : les alternates écrites à la main
       ici oubliaient la canonique, et pointaient sur le basePath du
       déploiement au lieu de l'apex du domaine. */
    alternates: pageAlternates(locale as Locale, ""),
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  /* Les avis Google se récupèrent ICI, dans le composant serveur : le
     ruban est un composant client, il ne peut pas appeler l'API, et la
     clé n'a rien à faire dans le navigateur. Sans clé configurée, la
     fonction rend un tableau vide et la page ne change pas. */
  const avisGoogle = await recupererAvisGoogle(locale as Locale);

  return (
    <>
      {/* Émis ici et pas dans le layout : seule l'accueil porte la vidéo,
          et un VideoObject sur une page qui n'en contient pas est une
          donnée structurée invalide. */}
      <JsonLd schemas={[videoObjectSchema(locale as Locale)]} />
      <HeroHome dict={dict} locale={locale as Locale} />
      <Welcome dict={dict} locale={locale as Locale} />
      <OurHouse dict={dict} locale={locale as Locale} />
      <AvisPlateformes dict={dict} locale={locale as Locale} />
      <RoomsGrid dict={dict} locale={locale as Locale} />
      <DestinationsTeaser dict={dict} locale={locale as Locale} />
      <RestaurantTeaser dict={dict} locale={locale as Locale} />
      {/* La galerie après les univers et avant les avis : le visiteur a vu
          les chambres, la destination et la table, il peut alors avoir envie
          de tout voir ; les clients parlent juste après. */}
      <GalleryTeaser dict={dict} locale={locale as Locale} />
      <Testimonials dict={dict} locale={locale as Locale} avisGoogle={avisGoogle} />
      <ContactSection dict={dict} />
      <BookingBar dict={dict} />
    </>
  );
}
