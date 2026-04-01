"use client";

import { useEffect, useState } from "react";
import { getDictionary } from "@/i18n/getDictionary";
import { locales, type Locale } from "@/lib/utils";
import PageHero from "@/components/ui/PageHero";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionHeader from "@/components/ui/SectionHeader";
import { use } from "react";

const basePath = "/lachotelsahambavy";
const CDN = "https://www.lachotel.com/wp-content/uploads/";

type Category = "all" | "rooms" | "restaurant" | "nature" | "theicole" | "train";

interface Photo {
  src: string;
  alt: string;
  category: Category;
}

const photos: Photo[] = [
  { src: `${CDN}lachotel-terrasse-605x465.jpg`, alt: "Terrasse lac hotel", category: "rooms" },
  { src: `${CDN}piscine-4-605x465.jpg`, alt: "Piscine", category: "rooms" },
  { src: `${CDN}Restaurant_03-605x465.jpg`, alt: "Restaurant", category: "restaurant" },
  { src: `${CDN}pizza-piscine-605x465.jpg`, alt: "Pizza piscine", category: "restaurant" },
  { src: `${CDN}vanille-lachotel.jpg`, alt: "Vanille", category: "restaurant" },
  { src: `${CDN}vue-lac-hotel.jpg`, alt: "Vue lac", category: "nature" },
  { src: `${CDN}lac-hotel-slide_home-2-605x465.jpg`, alt: "Lac hotel panorama", category: "nature" },
  { src: `${CDN}ramasseur-de-the-605x465.jpg`, alt: "Ramasseur de the", category: "theicole" },
  { src: `${CDN}FCE-train-11-605x465.jpg`, alt: "Train FCE", category: "train" },
];

export default function GalleryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const [dict, setDict] = useState<any>(null);
  const [activeFilter, setActiveFilter] = useState<Category>("all");
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  useEffect(() => {
    getDictionary(locale as Locale).then(setDict);
  }, [locale]);

  if (!dict) return null;

  const filters: { key: Category; label: string }[] = [
    { key: "all", label: dict.gallery.all },
    { key: "rooms", label: dict.gallery.rooms },
    { key: "restaurant", label: dict.gallery.restaurant },
    { key: "nature", label: dict.gallery.nature },
    { key: "theicole", label: dict.gallery.theicole },
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
        image={`${CDN}vue-lac-hotel.jpg`}
      />

      <section className="py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-4">
          <SectionHeader
            title={dict.gallery.heroTitle}
            subtitle={dict.gallery.heroSubtitle}
          />

          {/* Filter buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeFilter === f.key
                    ? "bg-brown-deep text-cream shadow-md"
                    : "bg-cream text-text-dark hover:bg-brown-deep/10"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Masonry grid */}
          <div className="masonry-grid">
            {filtered.map((photo, i) => (
              <div
                key={photo.src}
                className="group cursor-pointer overflow-hidden rounded-xl"
                onClick={() => setLightboxSrc(photo.src)}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  className="w-full block rounded-xl transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxSrc && (
        <div
          className="lightbox-overlay"
          onClick={() => setLightboxSrc(null)}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxSrc(null);
            }}
            className="absolute top-6 right-6 text-white text-4xl font-light hover:text-cream transition-colors z-[2001]"
            aria-label="Fermer"
          >
            &times;
          </button>
          <img
            src={lightboxSrc}
            alt=""
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
