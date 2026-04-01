"use client";

import { useEffect, useState } from "react";
import { getDictionary } from "@/i18n/getDictionary";
import { locales, type Locale } from "@/lib/utils";
import PageHero from "@/components/ui/PageHero";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionHeader from "@/components/ui/SectionHeader";
import { use } from "react";

const basePath = "/lachotelsahambavy";

type Category = "all" | "rooms" | "restaurant" | "nature" | "theicole" | "train";

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
  { src: `${basePath}/images/gallery/gallery-04.jpg`, alt: "Jardins et plantation de thé", category: "theicole" },
  { src: `${basePath}/images/gallery/gallery-10.jpg`, alt: "Bâtiment principal et jardins", category: "train" },
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
        image={`${basePath}/images/hero/hero-lake-sunset.jpg`}
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
