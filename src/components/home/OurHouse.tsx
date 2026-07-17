import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { type Locale, getBasePath } from "@/lib/utils";

const basePath = getBasePath();

/**
 * « Notre Maison » — bloc humain de la page d'accueil, version « Panorama ».
 *
 * Fond brume pour marquer la respiration après l'intro éditoriale, photo
 * d'équipe en 7/5 avec la citation famille en Inter Tight light (PAS
 * d'italique serif en monde clair — réservé au monde nuit), signature en
 * .ge-label, puis les 4 vignettes-métiers (captions conservées : elles
 * désignent des métiers, pas des personnes — pas de consentement nominal).
 *
 * Server Component : aucune interaction au-delà de ScrollReveal.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function OurHouse({ dict, locale }: { dict: any; locale: Locale }) {
  const vignettes = [
    { key: "garden", src: "team-garden.jpg", label: dict.ourHouse.captions.garden },
    { key: "welcome", src: "team-welcome.jpg", label: dict.ourHouse.captions.welcome },
    { key: "craft", src: "team-craft.jpg", label: dict.ourHouse.captions.craft },
    { key: "rooms", src: "team-rooms.jpg", label: dict.ourHouse.captions.rooms },
  ] as const;

  return (
    <section id="our-house" className="scroll-mt-24 bg-mist-bg py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        {/* ─── Photo famille + récit + citation ──────────────────────── */}
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <ScrollReveal className="lg:col-span-7">
            <div className="overflow-hidden rounded-[3px] border border-hairline">
              <img
                src={`${basePath}/images/team/team-hero.jpg`}
                alt="Maggie Leong et l'équipe du Lac Hôtel Sahambavy"
                className="aspect-[4/3] w-full object-cover"
                loading="lazy"
              />
            </div>
          </ScrollReveal>

          <ScrollReveal className="lg:col-span-5" delay={150}>
            <span className="ge-label mb-4">{dict.ourHouse.label}</span>
            <h2 className="mb-6" style={{ textWrap: "balance" }}>
              {dict.ourHouse.title}
            </h2>
            <p className="ge-measure mb-8 text-[15px] leading-relaxed text-body">
              {dict.ourHouse.paragraph}
            </p>
            {/* Citation en Inter Tight light — jamais d'italique serif en monde clair */}
            <blockquote className="mb-4 font-[family-name:var(--font-display)] text-2xl font-light leading-snug text-ink">
              {dict.ourHouse.quote}
            </blockquote>
            <cite className="ge-label not-italic">{dict.ourHouse.signature}</cite>
          </ScrollReveal>
        </div>

        {/* ─── 4 vignettes-métiers, captions conservées ──────────────── */}
        <div className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
          {vignettes.map((v, i) => (
            <ScrollReveal key={v.key} delay={i * 80}>
              <figure className="group relative overflow-hidden rounded-[3px]">
                <img
                  src={`${basePath}/images/team/${v.src}`}
                  alt={v.label}
                  className="aspect-[4/5] w-full object-cover transition-transform duration-[1.2s] group-hover:scale-105"
                  loading="lazy"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-4 py-3">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white">
                    {v.label}
                  </span>
                </figcaption>
              </figure>
            </ScrollReveal>
          ))}
        </div>

        {/* ─── CTA ───────────────────────────────────────────────────── */}
        <div className="mt-14 text-center">
          <ScrollReveal>
            <Link href={`/${locale}/notre-equipe/`} className="ge-cta ge-cta--ghost">
              {dict.ourHouse.ctaLabel}
            </Link>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
