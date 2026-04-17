import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { type Locale, getBasePath } from "@/lib/utils";

/**
 * "Notre Maison" — homepage human-storytelling block.
 *
 * Why this section exists:
 *   La page d'accueil enchaînait Welcome (mise en bouche éditoriale) →
 *   RoomsGrid (catalogue) → Philosophy (générique RSE). Aucun visage,
 *   aucun prénom, aucune voix : le site sonnait "hôtel de chaîne dans un
 *   beau cadre" alors que c'est un domaine familial fondé en 1998 par
 *   Kim et Olga Leong, repris par leur fille Maggie revenue du Canada.
 *   Cette section ramène les humains au premier plan, juste après le
 *   premier paragraphe d'accueil — "voilà qui vous reçoit".
 *
 *   Les 4 vignettes ne nomment personne (on n'a pas le consentement
 *   nominal de l'équipe villageoise) — elles désignent des *métiers*
 *   ("Le jardin", "L'accueil", "Les artisans", "Les bungalows").
 *   Les noms de la famille restent dans le paragraphe, signé.
 *
 * Server Component : aucun état, aucune interaction au-delà de
 * ScrollReveal (lui-même client). On évite donc d'embarquer du JS pour
 * cette section.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function OurHouse({ dict, locale }: { dict: any; locale: Locale }) {
  const basePath = getBasePath();

  const vignettes = [
    { key: "garden", src: "team-garden.jpg", label: dict.ourHouse.captions.garden },
    { key: "welcome", src: "team-welcome.jpg", label: dict.ourHouse.captions.welcome },
    { key: "craft", src: "team-craft.jpg", label: dict.ourHouse.captions.craft },
    { key: "rooms", src: "team-rooms.jpg", label: dict.ourHouse.captions.rooms },
  ] as const;

  return (
    <section id="our-house" className="py-16 md:py-40 bg-cream-dark/30">
      <div className="max-w-[1300px] mx-auto px-6">
        {/* ─── Header — eyebrow + title centered ─────────────────────── */}
        <div className="max-w-3xl mx-auto text-center mb-16 md:mb-20">
          <ScrollReveal>
            <span className="section-label">{dict.ourHouse.label}</span>
            <h2 className="mb-6">{dict.ourHouse.title}</h2>
            <div className="section-divider" />
          </ScrollReveal>
        </div>

        {/* ─── Middle — 7/5 split: hero photo + paragraph + signed line ─ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center mb-16 md:mb-24">
          <ScrollReveal className="lg:col-span-7">
            <div className="rounded-md overflow-hidden shadow-lg">
              <img
                src={`${basePath}/images/team/team-hero.jpg`}
                alt="Maggie Leong et l'équipe du Lac Hôtel Sahambavy"
                className="w-full aspect-[4/3] object-cover"
                loading="lazy"
              />
            </div>
          </ScrollReveal>

          <ScrollReveal className="lg:col-span-5" delay={150}>
            <p className="text-text-body leading-[1.95] text-base mb-8">
              {dict.ourHouse.paragraph}
            </p>
            <blockquote className="font-[family-name:var(--font-sub)] italic text-xl md:text-2xl text-gold leading-snug mb-3 not-prose">
              {dict.ourHouse.quote}
            </blockquote>
            <cite className="not-italic text-[0.65rem] uppercase tracking-[0.25em] text-text-muted">
              {dict.ourHouse.signature}
            </cite>
          </ScrollReveal>
        </div>

        {/* ─── Bottom — 4 portrait vignettes with role captions ──────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
          {vignettes.map((v, i) => (
            <ScrollReveal key={v.key} delay={i * 80}>
              <figure className="group relative overflow-hidden rounded-md">
                <img
                  src={`${basePath}/images/team/${v.src}`}
                  alt={v.label}
                  className="w-full aspect-[4/5] object-cover transition-transform duration-[1.2s] group-hover:scale-105"
                  loading="lazy"
                />
                <figcaption className="absolute inset-x-0 bottom-0 px-4 py-3 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
                  <span className="text-[0.6rem] uppercase tracking-[0.25em] text-white font-medium">
                    {v.label}
                  </span>
                </figcaption>
              </figure>
            </ScrollReveal>
          ))}
        </div>

        {/* ─── CTA — minimal underline pattern (introduced in PR #20) ── */}
        <div className="text-center mt-16">
          <ScrollReveal>
            <Link href={`/${locale}/notre-equipe/`} className="btn btn--minimal">
              {dict.ourHouse.ctaLabel}
            </Link>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
