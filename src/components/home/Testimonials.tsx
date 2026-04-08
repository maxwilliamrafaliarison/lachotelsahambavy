"use client";

import { useState, useEffect } from "react";
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
  { name: "Helene", location: "France", rating: 5, text: { fr: "L'hotel est un havre de paix, la chambre tres spacieuse est joliment decoree, avec elegance et gout. Le personnel est adorable, aux petits soins.", en: "The hotel is a haven of peace, the very spacious room is beautifully decorated, with elegance and taste. The staff is adorable and attentive.", es: "El hotel es un remanso de paz, la habitacion muy espaciosa esta bellamente decorada, con elegancia y gusto." } },
  { name: "Raith", location: "UK", rating: 5, text: { fr: "Le meilleur hotel a Madagascar jusqu'ici. Excellent a tous les niveaux.", en: "The best hotel so far in Madagascar. Excellent in every way.", es: "El mejor hotel de Madagascar hasta ahora. Excelente en todos los sentidos." } },
  { name: "Isabelle", location: "La Reunion", rating: 5, text: { fr: "Un havre de paix, bungalows sur pilotis tres confortables. Le personnel souriant et aux p'tits soins. Un magnifique jardin botanique.", en: "A haven of peace, very comfortable overwater bungalows. Smiling staff. A magnificent botanical garden.", es: "Un remanso de paz, bungalows sobre pilotes muy comodos. Personal sonriente. Un magnifico jardin botanico." } },
  { name: "Klemm", location: "Suisse", rating: 5, text: { fr: "Nous avons adore le caractere unique de notre hebergement. Nous avons sejourne dans le Wagon. Le personnel etait super accueillant.", en: "We loved how unique our accommodation was; we stayed in the Train Wagon. The staff was super inviting.", es: "Nos encanto lo unico de nuestro alojamiento; nos quedamos en el Vagon. El personal fue muy acogedor." } },
  { name: "Amelia", location: "France", rating: 5, text: { fr: "Bungalows sur le lac tres confortables. Le jardin est sublime. La cuisine etait delicieuse.", en: "Very comfortable lakeside bungalows. The garden is sublime. The food was delicious.", es: "Bungalows sobre el lago muy comodos. El jardin es sublime. La cocina estaba deliciosa." } },
];

const googleReviews: Review[] = [
  { name: "Jean-Pierre M.", location: "France", rating: 5, text: { fr: "Un endroit magique au bord du lac. Les bungalows sur pilotis sont un reve. Le petit-dejeuner est excellent avec des produits frais du potager.", en: "A magical place by the lake. The overwater bungalows are a dream. Breakfast is excellent with fresh produce from the garden.", es: "Un lugar magico junto al lago. Los bungalows sobre pilotes son un sueno. El desayuno es excelente." } },
  { name: "Sarah L.", location: "Belgique", rating: 5, text: { fr: "Le cadre est exceptionnel, entre lac et plantation de the. Le restaurant propose une cuisine locale raffinee. Nous y retournerons.", en: "The setting is exceptional, between the lake and the tea plantation. The restaurant offers refined local cuisine. We'll return.", es: "El entorno es excepcional, entre el lago y la plantacion de te. El restaurante ofrece una cocina local refinada." } },
  { name: "Marco B.", location: "Italia", rating: 4, text: { fr: "Hotel de charme dans un cadre naturel magnifique. Le personnel est tres attentionne. La visite de la plantation de the est un must.", en: "Charming hotel in a magnificent natural setting. Very attentive staff. The tea plantation visit is a must.", es: "Hotel con encanto en un entorno natural magnifico. Personal muy atento. La visita a la plantacion de te es imprescindible." } },
  { name: "Claire D.", location: "France", rating: 5, text: { fr: "Coup de coeur absolu ! Les chambres sont decorees avec gout, le restaurant est delicieux et le cadre sur le lac est a couper le souffle.", en: "Absolute favorite! The rooms are tastefully decorated, the restaurant is delicious and the lake setting is breathtaking.", es: "Favorito absoluto! Las habitaciones estan decoradas con gusto, el restaurante es delicioso y el entorno del lago es impresionante." } },
];

const tripadvisorReviews: Review[] = [
  { name: "Michel R.", location: "France", rating: 5, text: { fr: "Endroit magnifique, personnel tres serviable et prevenant. Grand remerciement a Toky le receptionniste ! La cuisine est excellente.", en: "Magnificent place, very helpful and thoughtful staff. Big thanks to Toky the receptionist! The food is excellent.", es: "Lugar magnifico, personal muy servicial y atento. Muchas gracias a Toky el recepcionista!" } },
  { name: "Anne-Marie P.", location: "Suisse", rating: 5, text: { fr: "Un ecrin de verdure au bord du lac. L'accueil est chaleureux, les chambres sont spacieuses et bien decorees. La balade autour du lac est superbe.", en: "A lush green setting by the lake. The welcome is warm, rooms are spacious and well decorated. The lake walk is superb.", es: "Un entorno verde junto al lago. La bienvenida es calida, las habitaciones son espaciosas. El paseo alrededor del lago es magnifico." } },
  { name: "David W.", location: "Australia", rating: 5, text: { fr: "Tres bel hotel, cadre unique a Madagascar. Le lac et les plantations de the offrent un panorama exceptionnel.", en: "Very beautiful hotel, unique setting in Madagascar. The lake and tea plantations offer an exceptional panorama.", es: "Hotel muy bonito, entorno unico en Madagascar. El lago y las plantaciones de te ofrecen un panorama excepcional." } },
  { name: "Francoise G.", location: "France", rating: 5, text: { fr: "Nous avons passe 3 nuits dans le wagon nuptial. Une experience inoubliable ! Le personnel est aux petits soins, le cadre est paradisiaque.", en: "We spent 3 nights in the honeymoon wagon. An unforgettable experience! The staff is attentive, the setting is heavenly.", es: "Pasamos 3 noches en el vagon nupcial. Una experiencia inolvidable! El personal es atento, el entorno es paradisiaco." } },
];

const sources = [
  { id: "booking", name: "Booking.com", score: siteConfig.ratings.booking.score, total: siteConfig.ratings.booking.total, reviews: bookingReviews },
  { id: "google", name: "Google", score: siteConfig.ratings.google.score, total: siteConfig.ratings.google.total, reviews: googleReviews },
  { id: "tripadvisor", name: "TripAdvisor", score: siteConfig.ratings.tripadvisor.score, total: siteConfig.ratings.tripadvisor.total, reviews: tripadvisorReviews },
];

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function Testimonials({ dict, locale }: { dict: any; locale: Locale }) {
  const [activeSource, setActiveSource] = useState(0);
  const [activeReview, setActiveReview] = useState(0);
  const currentSource = sources[activeSource];

  useEffect(() => { setActiveReview(0); }, [activeSource]);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveReview((prev) => (prev + 1) % currentSource.reviews.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [activeSource, currentSource.reviews.length]);

  return (
    <section className="py-32 md:py-40">
      <div className="max-w-[900px] mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <ScrollReveal>
            <span className="section-label">{dict.testimonials.label}</span>
            <h2>{dict.testimonials.title}</h2>
            <div className="section-divider" />
          </ScrollReveal>
        </div>

        {/* Source tabs — minimal */}
        <ScrollReveal>
          <div className="flex justify-center gap-8 mb-16">
            {sources.map((source, i) => (
              <button
                key={source.id}
                onClick={() => setActiveSource(i)}
                className={`flex flex-col items-center gap-2 transition-all duration-300 group ${
                  activeSource === i ? "opacity-100" : "opacity-40 hover:opacity-70"
                }`}
              >
                <span className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold text-brown-deep">
                  {source.score}
                </span>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <span key={j} className={`text-[0.6rem] ${j < Math.round(source.score) ? "text-gold" : "text-text-light"}`}>&#9733;</span>
                  ))}
                </div>
                <span className="text-[0.6rem] uppercase tracking-[0.15em] text-text-muted">
                  {source.name}
                </span>
                {/* Active indicator */}
                <div className={`h-[2px] w-full transition-all duration-300 ${
                  activeSource === i ? "bg-gold" : "bg-transparent"
                }`} />
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Review — centered, minimal */}
        <div className="relative min-h-[200px]">
          {currentSource.reviews.map((review, i) => (
            <div
              key={`${currentSource.id}-${i}`}
              className={`transition-all duration-700 ${
                i === activeReview ? "opacity-100 relative" : "opacity-0 absolute inset-0 pointer-events-none"
              }`}
            >
              <div className="text-center">
                {/* Large quote */}
                <blockquote className="text-xl md:text-2xl font-[family-name:var(--font-sub)] text-text-body italic leading-relaxed mb-10 max-w-2xl mx-auto">
                  &ldquo;{review.text[locale]}&rdquo;
                </blockquote>

                {/* Author — minimal */}
                <div className="flex items-center justify-center gap-4">
                  <div className="w-[1px] h-6 bg-gold" />
                  <div className="text-left">
                    <div className="text-sm font-semibold text-brown-deep">{review.name}</div>
                    <div className="text-[0.6rem] text-text-muted uppercase tracking-wider">
                      {review.location}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dots — minimal */}
        <div className="flex justify-center gap-2 mt-10">
          {currentSource.reviews.map((_, i) => (
            <button
              key={i}
              className={`h-[2px] rounded-full transition-all duration-300 ${
                i === activeReview ? "w-8 bg-gold" : "w-4 bg-brown-deep/15 hover:bg-brown-deep/30"
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
