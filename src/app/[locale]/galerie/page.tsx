"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState, use } from "react";
import { getDictionary } from "@/i18n/getDictionary";
import { type Locale, getBasePath } from "@/lib/utils";
import PanoramaHero from "@/components/ui/PanoramaHero";
import GalleryLightbox from "@/components/gallery/GalleryLightbox";

const basePath = getBasePath();

type Category =
  | "all"
  | "rooms"
  | "restaurant"
  | "nature"
  | "plantation"
  | "train"
  | "village"
  | "jardins"
  | "boutique";

interface Photo {
  src: string;
  alt: string;
  category: Category;
}

const photos: Photo[] = [
  { src: `${basePath}/images/gallery/gallery-01.jpg`, alt: "Allée pilotis Lac Hôtel", category: "rooms" },
  { src: `${basePath}/images/gallery/gallery-02.jpg`, alt: "Chambre lit baldaquin", category: "rooms" },
  { src: `${basePath}/images/gallery/gallery-07.jpg`, alt: "Chambre coucher de soleil", category: "rooms" },
  { src: `${basePath}/images/gallery/gallery-09.jpg`, alt: "Restaurant cheminée", category: "restaurant" },
  { src: `${basePath}/images/gallery/gallery-05.jpg`, alt: "Façade hôtel et terrasse", category: "restaurant" },
  { src: `${basePath}/images/gallery/gallery-03.jpg`, alt: "Vue lac bungalows", category: "nature" },
  { src: `${basePath}/images/gallery/gallery-08.jpg`, alt: "Coucher de soleil sur le lac", category: "nature" },
  { src: `${basePath}/images/gallery/gallery-06.jpg`, alt: "Activité kayak sur le lac", category: "nature" },
  { src: `${basePath}/images/pool/piscine-jardin-palmiers-jour.jpg`, alt: "Piscine au milieu des palmiers du jardin", category: "nature" },
  { src: `${basePath}/images/gallery/gallery-04.jpg`, alt: "Jardins et plantation de thé", category: "plantation" },
  { src: `${basePath}/images/gallery/gallery-10.jpg`, alt: "Bâtiment principal et jardins", category: "train" },
  { src: `${basePath}/images/train/draisine-fce-embarquement-voyageurs.jpg`, alt: "Embarquement des voyageurs sur la draisine FCE", category: "train" },
  { src: `${basePath}/images/train/draisine-rails-gare-sahambavy.jpg`, alt: "Draisine sur les rails à la gare de Sahambavy", category: "train" },
  { src: `${basePath}/images/village/rizieres-sahambavy-vue-aerienne.jpg`, alt: "Rizières en terrasses de Sahambavy vues du ciel", category: "village" },
  { src: `${basePath}/images/village/femme-betsileo-maison-traditionnelle.jpg`, alt: "Femme betsileo devant une maison traditionnelle", category: "village" },
  { src: `${basePath}/images/village/portrait-homme-betsileo-sourire.jpg`, alt: "Portrait d'un homme betsileo souriant", category: "village" },
  { src: `${basePath}/images/village/scene-village-zebus-grand-arbre.jpg`, alt: "Scène de village avec zébus sous un grand arbre", category: "village" },
  { src: `${basePath}/images/village/maison-betsileo-enfants-fenetres.jpg`, alt: "Maison betsileo avec des enfants aux fenêtres", category: "village" },
  { src: `${basePath}/images/jardins/orchidee-tigree-jardin-hotel.jpg`, alt: "Orchidée tigrée des jardins de l'hôtel", category: "jardins" },
  { src: `${basePath}/images/jardins/bougainvillier-violet-jardin.jpg`, alt: "Bougainvillier violet en fleur dans le jardin", category: "jardins" },
  { src: `${basePath}/images/jardins/zinnia-orange-abeille-jardin.jpg`, alt: "Zinnia orange visité par une abeille", category: "jardins" },
  { src: `${basePath}/images/jardins/gaillarde-rouge-jaune-jardin.jpg`, alt: "Gaillarde rouge et jaune dans les massifs", category: "jardins" },
  { src: `${basePath}/images/jardins/statue-cherubin-jardin-fougeres.jpg`, alt: "Statue de chérubin parmi les fougères du jardin", category: "jardins" },
  { src: `${basePath}/images/boutique/boutique-exterior.jpg`, alt: "La boutique du Lac Hôtel", category: "boutique" },
  { src: `${basePath}/images/boutique/bio-mami-shop-entree-boutique.jpg`, alt: "Entrée de la boutique Bio Mami Shop", category: "boutique" },
  { src: `${basePath}/images/boutique/etal-legumes-bio-mami-shop.jpg`, alt: "Étal de légumes bio de la boutique", category: "boutique" },
  { src: `${basePath}/images/boutique/savon-artisanal-curcuma-natural-by-maggie.jpg`, alt: "Savon artisanal au curcuma Natural by Maggie", category: "boutique" },
  { src: `${basePath}/images/boutique/savon-coco-artisanal-bois-sculpte.jpg`, alt: "Savon artisanal à la coco sur bois sculpté", category: "boutique" },
  { src: `${basePath}/images/boutique/savon-fleur-marguerite-artisanal.jpg`, alt: "Savon artisanal à la fleur de marguerite", category: "boutique" },
];

export default function GalleryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const [dict, setDict] = useState<any>(null);
  const [activeFilter, setActiveFilter] = useState<Category>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    getDictionary(locale as Locale).then(setDict);
  }, [locale]);

  if (!dict) return null;

  const filters: { key: Category; label: string }[] = [
    { key: "all", label: dict.gallery.all },
    { key: "rooms", label: dict.gallery.rooms },
    { key: "restaurant", label: dict.gallery.restaurant },
    { key: "nature", label: dict.gallery.nature },
    { key: "plantation", label: dict.gallery.plantation },
    { key: "train", label: dict.gallery.train },
    { key: "village", label: dict.gallery.village ?? "Village" },
    { key: "jardins", label: dict.gallery.jardins ?? "Jardins" },
    { key: "boutique", label: dict.gallery.boutique ?? "Boutique" },
  ];

  const filtered = activeFilter === "all"
    ? photos
    : photos.filter((p) => p.category === activeFilter);

  return (
    <>
      <PanoramaHero
        image={`${basePath}/images/hero/hero-lake-sunset.jpg`}
        imageAlt={dict.gallery.heroSubtitle}
        label={dict.gallery.heroLabel ?? "Lac Hôtel Sahambavy"}
        title={dict.gallery.heroTitle}
        kicker={dict.gallery.heroSubtitle}
      />

      {/* ──── Filtres + grille masonry — grammaire Panorama ──── */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          {/* Filtres — pastilles hairline, accent thé unique */}
          <div className="mb-10 flex flex-wrap gap-2 md:mb-14 md:gap-3">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => {
                  setActiveFilter(f.key);
                  setLightboxIndex(null);
                }}
                aria-pressed={activeFilter === f.key}
                className={`rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors duration-300 md:px-5 md:py-2.5 ${
                  activeFilter === f.key
                    ? "border-lake bg-lake text-white"
                    : "border-hairline bg-white text-muted hover:border-lake hover:text-lake"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Grille masonry — vignettes hairline, zoom discret au survol */}
          <div className="masonry-grid">
            {filtered.map((photo, i) => (
              <button
                key={photo.src}
                className="group block w-full cursor-pointer overflow-hidden rounded-[3px] border border-hairline bg-white text-left"
                onClick={() => setLightboxIndex(i)}
                aria-label={`Ouvrir ${photo.alt}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  className="block w-full transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox avec swipe Apple-style */}
      {lightboxIndex !== null && (
        <GalleryLightbox
          photos={filtered}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onIndexChange={setLightboxIndex}
        />
      )}
    </>
  );
}
