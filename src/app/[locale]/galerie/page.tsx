"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState, use } from "react";
import { getDictionary } from "@/i18n/getDictionary";
import { type Locale, getBasePath } from "@/lib/utils";
import PageHero from "@/components/ui/PageHero";
import SectionHeader from "@/components/ui/SectionHeader";
import GalleryLightbox from "@/components/gallery/GalleryLightbox";

const basePath = getBasePath();

type Category = "all" | "rooms" | "restaurant" | "nature" | "plantation" | "train" | "repos" | "equipe";

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
  { src: `${basePath}/images/gallery/gallery-04.jpg`, alt: "Jardins et plantation de thé", category: "plantation" },
  { src: `${basePath}/images/gallery/gallery-10.jpg`, alt: "Bâtiment principal et jardins", category: "train" },
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
  ];

  const filtered = activeFilter === "all"
    ? photos
    : photos.filter((p) => p.category === activeFilter);

  return (
    <>
      <PageHero
        title={dict.gallery.heroTitle}
        subtitle={dict.gallery.heroSubtitle}
        image={`${basePath}/images/hero/hero-lake-sunset.jpg`}
      />

      {/* Filtres + grille masonry premium */}
      <section className="py-14 md:py-24 relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(180deg, #FFFFFF 0%, #FBFAF6 50%, #FFFFFF 100%)",
          }}
        />
        <div className="absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full bg-gold/5 blur-3xl -z-10" />

        <div className="max-w-[1200px] mx-auto px-5 md:px-6 relative">
          <SectionHeader
            title={dict.gallery.heroTitle}
            subtitle={dict.gallery.heroSubtitle}
          />

          {/* Boutons filtre premium — faux-glass avec bordure dorée translucide */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-10 md:mb-14">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`px-4 md:px-5 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-medium uppercase tracking-[0.15em] transition-all duration-300 border ${
                  activeFilter === f.key
                    ? "bg-brown-deep text-cream border-brown-deep shadow-lg"
                    : "bg-white/70 text-text-body border-gold/20 hover:bg-white hover:border-gold/50 hover:text-brown-deep"
                }`}
                style={
                  activeFilter !== f.key
                    ? {
                        backdropFilter: "blur(10px)",
                        WebkitBackdropFilter: "blur(10px)",
                      }
                    : undefined
                }
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Grille masonry — wrap chaque image avec .product-photo pour
              la bordure dorée intérieure premium + hover zoom subtil */}
          <div className="masonry-grid">
            {filtered.map((photo, i) => (
              <button
                key={photo.src}
                className="product-photo group cursor-pointer block w-full text-left"
                onClick={() => setLightboxIndex(i)}
                aria-label={`Ouvrir ${photo.alt}`}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  className="w-full block transition-transform duration-[1s] ease-out group-hover:scale-[1.04]"
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
