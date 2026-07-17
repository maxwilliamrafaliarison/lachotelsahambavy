import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";
import RecapRows from "@/components/ui/RecapRows";
import type { Locale } from "@/lib/utils";

/**
 * Welcome — intro éditoriale « Panorama » : label + h2 balance à gauche,
 * prose en mesure de lecture à droite, les 3 stats en filets fins
 * (50+ bungalows · 520 ha · 28 ans) et CTA contour encre. Aéré, sans
 * ornement — la photo, c'est le hero au-dessus.
 *
 * Server Component : plus de compteur animé (le chiffre posé à filet fin
 * est plus « Glacier Express » qu'un compteur qui défile).
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function Welcome({ dict, locale }: { dict: any; locale: Locale }) {
  const stats = [
    { label: dict.welcome.stat1, value: dict.welcome.stat1Value },
    { label: dict.welcome.stat2, value: dict.welcome.stat2Value },
    { label: dict.welcome.stat3, value: dict.welcome.stat3Value },
  ];

  return (
    <section id="welcome" className="scroll-mt-24 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid gap-10 md:grid-cols-12 md:gap-14">
          {/* Colonne titre */}
          <div className="md:col-span-5">
            <ScrollReveal>
              <span className="ge-label mb-4">{dict.welcome.label}</span>
              <h2 style={{ textWrap: "balance" }}>{dict.welcome.title}</h2>
              {dict.welcome.subtitle && (
                <p className="mt-5 text-[15px] leading-relaxed text-muted">
                  {dict.welcome.subtitle}
                </p>
              )}
            </ScrollReveal>
          </div>

          {/* Colonne prose + stats + CTA */}
          <div className="md:col-span-7">
            <ScrollReveal delay={120}>
              <div className="ge-measure space-y-5 text-[15px] leading-relaxed text-body md:text-base">
                {dict.welcome.intro && <p>{dict.welcome.intro}</p>}
                <p>{dict.welcome.p1}</p>
                <p>{dict.welcome.p2}</p>
                {dict.welcome.p3 && <p>{dict.welcome.p3}</p>}
              </div>

              <RecapRows className="mt-10 max-w-md" rows={stats} />

              <div className="mt-10">
                <Link href={`/${locale}/hebergements/`} className="ge-cta ge-cta--ghost">
                  {dict.welcome.cta}
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
