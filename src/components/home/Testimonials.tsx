"use client";

import { useState, useEffect } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { siteConfig } from "@/data/site";
import type { Locale } from "@/lib/utils";

interface Review {
  name: string;
  location: string;
  rating: number;
  text: { fr: string; en: string; es: string };
}

const bookingReviews: Review[] = [
  { name: "Hélène", location: "France", rating: 5, text: { fr: "L'hôtel est un havre de paix, la chambre très spacieuse est joliment décorée, avec élégance et goût. Le personnel est adorable, aux petits soins.", en: "The hotel is a haven of peace, the very spacious room is beautifully decorated, with elegance and taste. The staff is adorable and attentive.", es: "El hotel es un remanso de paz, la habitación muy espaciosa está bellamente decorada, con elegancia y gusto." } },
  { name: "Raith", location: "UK", rating: 5, text: { fr: "Le meilleur hôtel à Madagascar jusqu'ici. Excellent à tous les niveaux.", en: "The best hotel so far in Madagascar. Excellent in every way.", es: "El mejor hotel de Madagascar hasta ahora. Excelente en todos los sentidos." } },
  { name: "Isabelle", location: "La Réunion", rating: 5, text: { fr: "Un havre de paix, bungalows sur pilotis très confortables. Le personnel souriant et aux p'tits soins. Un magnifique jardin botanique.", en: "A haven of peace, very comfortable overwater bungalows. Smiling staff. A magnificent botanical garden.", es: "Un remanso de paz, bungalows sobre pilotes muy cómodos. Personal sonriente. Un magnífico jardín botánico." } },
  { name: "Klemm", location: "Suisse", rating: 5, text: { fr: "Nous avons adoré le caractère unique de notre hébergement — nous avons séjourné dans le Wagon. Le personnel était super accueillant.", en: "We loved how unique our accommodation was; we stayed in the Train Wagon. The staff was super inviting.", es: "Nos encantó lo único de nuestro alojamiento; nos quedamos en el Vagón. El personal fue muy acogedor." } },
  { name: "Amelia", location: "France", rating: 5, text: { fr: "Bungalows sur le lac très confortables. Le jardin est sublime. La cuisine était délicieuse.", en: "Very comfortable lakeside bungalows. The garden is sublime. The food was delicious.", es: "Bungalows sobre el lago muy cómodos. El jardín es sublime. La cocina estaba deliciosa." } },
];

const googleReviews: Review[] = [
  { name: "Jean-Pierre M.", location: "France", rating: 5, text: { fr: "Un endroit magique au bord du lac. Les bungalows sur pilotis sont un rêve. Le petit-déjeuner est excellent avec des produits frais du potager.", en: "A magical place by the lake. The overwater bungalows are a dream. Breakfast is excellent with fresh produce from the garden.", es: "Un lugar mágico junto al lago. Los bungalows sobre pilotes son un sueño. El desayuno es excelente." } },
  { name: "Sarah L.", location: "Belgique", rating: 5, text: { fr: "Le cadre est exceptionnel, entre lac et plantation de thé. Le restaurant propose une cuisine locale raffinée. Nous y retournerons.", en: "The setting is exceptional, between the lake and the tea plantation. The restaurant offers refined local cuisine. We'll return.", es: "El entorno es excepcional, entre el lago y la plantación de té. El restaurante ofrece una cocina local refinada." } },
  { name: "Marco B.", location: "Italia", rating: 4, text: { fr: "Hôtel de charme dans un cadre naturel magnifique. Le personnel est très attentionné. La visite de la plantation de thé est un must.", en: "Charming hotel in a magnificent natural setting. Very attentive staff. The tea plantation visit is a must.", es: "Hotel con encanto en un entorno natural magnífico. Personal muy atento. La visita a la plantación de té es imprescindible." } },
  { name: "Claire D.", location: "France", rating: 5, text: { fr: "Coup de cœur absolu ! Les chambres sont décorées avec goût, le restaurant est délicieux et le cadre sur le lac est à couper le souffle.", en: "Absolute favorite! The rooms are tastefully decorated, the restaurant is delicious and the lake setting is breathtaking.", es: "¡Favorito absoluto! Las habitaciones están decoradas con gusto, el restaurante es delicioso y el entorno del lago es impresionante." } },
];

const tripadvisorReviews: Review[] = [
  { name: "Michel R.", location: "France", rating: 5, text: { fr: "Endroit magnifique, personnel très serviable et prévenant. Grand remerciement à Toky le réceptionniste ! La cuisine est excellente.", en: "Magnificent place, very helpful and thoughtful staff. Big thanks to Toky the receptionist! The food is excellent.", es: "Lugar magnífico, personal muy servicial y atento. ¡Muchas gracias a Toky el recepcionista!" } },
  { name: "Anne-Marie P.", location: "Suisse", rating: 5, text: { fr: "Un écrin de verdure au bord du lac. L'accueil est chaleureux, les chambres sont spacieuses et bien décorées. La balade autour du lac est superbe.", en: "A lush green setting by the lake. The welcome is warm, rooms are spacious and well decorated. The lake walk is superb.", es: "Un entorno verde junto al lago. La bienvenida es cálida, las habitaciones son espaciosas. El paseo alrededor del lago es magnífico." } },
  { name: "David W.", location: "Australia", rating: 4, text: { fr: "Très bel hôtel, cadre unique à Madagascar. Le train FCE depuis Fianarantsoa est une aventure incroyable et l'hôtel est le point de départ idéal.", en: "Very beautiful hotel, unique setting in Madagascar. The FCE train from Fianarantsoa is an incredible adventure and the hotel is the ideal starting point.", es: "Hotel muy bonito, entorno único en Madagascar. El tren FCE es una aventura increíble y el hotel es el punto de partida ideal." } },
  { name: "Françoise G.", location: "France", rating: 5, text: { fr: "Nous avons passé 3 nuits dans le wagon nuptial. Une expérience inoubliable ! Le personnel est aux petits soins, le cadre est paradisiaque.", en: "We spent 3 nights in the honeymoon wagon. An unforgettable experience! The staff is attentive, the setting is heavenly.", es: "Pasamos 3 noches en el vagón nupcial. ¡Una experiencia inolvidable! El personal es atento, el entorno es paradisíaco." } },
];

const sources = [
  {
    id: "booking",
    name: "Booking.com",
    score: siteConfig.ratings.booking.score,
    total: siteConfig.ratings.booking.total,
    color: "#003580",
    reviews: bookingReviews,
  },
  {
    id: "google",
    name: "Google",
    score: siteConfig.ratings.google.score,
    total: siteConfig.ratings.google.total,
    color: "#4285F4",
    reviews: googleReviews,
  },
  {
    id: "tripadvisor",
    name: "TripAdvisor",
    score: siteConfig.ratings.tripadvisor.score,
    total: siteConfig.ratings.tripadvisor.total,
    color: "#00AF87",
    reviews: tripadvisorReviews,
  },
];

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function Testimonials({ dict, locale }: { dict: any; locale: Locale }) {
  const [activeSource, setActiveSource] = useState(0);
  const [activeReview, setActiveReview] = useState(0);
  const currentSource = sources[activeSource];

  useEffect(() => {
    setActiveReview(0);
  }, [activeSource]);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveReview((prev) => (prev + 1) % currentSource.reviews.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeSource, currentSource.reviews.length]);

  return (
    <section className="py-24 bg-cream">
      <div className="max-w-[1000px] mx-auto px-4">
        <SectionHeader
          label={dict.testimonials.label}
          title={dict.testimonials.title}
        />

        {/* Source tabs - liquid glass */}
        <ScrollReveal>
          <div className="flex justify-center gap-4 mb-12 flex-wrap">
            {sources.map((source, i) => (
              <button
                key={source.id}
                onClick={() => setActiveSource(i)}
                className={`liquid-glass px-6 py-4 flex flex-col items-center gap-1 min-w-[140px] transition-all duration-300 ${
                  activeSource === i ? "ring-2 ring-gold shadow-lg scale-105" : "hover:scale-102"
                }`}
              >
                <span className="font-semibold text-brown-deep text-sm">{source.name}</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold" style={{ color: source.color }}>
                    {source.score}
                  </span>
                  <span className="text-xs text-text-muted">/5</span>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <span key={j} className={`text-xs ${j < Math.round(source.score) ? "text-gold" : "text-gray-300"}`}>★</span>
                  ))}
                </div>
                <span className="text-xs text-text-muted">{source.total} {locale === "fr" ? "avis" : locale === "es" ? "opiniones" : "reviews"}</span>
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Reviews carousel - liquid glass */}
        <div className="relative min-h-[220px]">
          {currentSource.reviews.map((review, i) => (
            <div
              key={`${currentSource.id}-${i}`}
              className={`transition-all duration-500 ${
                i === activeReview ? "opacity-100 relative" : "opacity-0 absolute inset-0 pointer-events-none"
              }`}
            >
              <div className="liquid-glass p-8 md:p-10">
                <div className="text-center">
                  {/* Stars */}
                  <div className="flex justify-center mb-4 gap-1">
                    {Array.from({ length: review.rating }).map((_, j) => (
                      <span key={j} className="text-gold text-lg">★</span>
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-lg font-[family-name:var(--font-sub)] text-text-body italic mb-6 leading-relaxed max-w-2xl mx-auto">
                    &ldquo;{review.text[locale]}&rdquo;
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: currentSource.color }}>
                      {review.name.charAt(0)}
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-text-dark text-sm">{review.name}</div>
                      <div className="text-xs text-text-muted">{review.location} · {currentSource.name}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {currentSource.reviews.map((_, i) => (
            <button
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i === activeReview ? "bg-gold scale-125" : "bg-brown-deep/20 hover:bg-brown-deep/40"
              }`}
              onClick={() => setActiveReview(i)}
              aria-label={`Review ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
