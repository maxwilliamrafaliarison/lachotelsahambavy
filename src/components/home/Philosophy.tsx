import ScrollReveal from "@/components/ui/ScrollReveal";
import { getBasePath } from "@/lib/utils";

const basePath = getBasePath();

const pillars = [
  { key: "pillar1", icon: "leaf" },
  { key: "pillar2", icon: "people" },
  { key: "pillar3", icon: "house" },
  { key: "pillar4", icon: "water" },
];

function PillarIcon({ type }: { type: string }) {
  const cls = "w-8 h-8 text-gold";
  switch (type) {
    case "leaf":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 20A7 7 0 019.8 6.9C15.5 4.9 17 3.5 17 3.5s-1.5 5.5 0 10.5c-1-1-2.5-1.5-4-1.5" />
          <path d="M6 21c1-3 3.5-6 7-8" />
        </svg>
      );
    case "people":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
        </svg>
      );
    case "house":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      );
    case "water":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
        </svg>
      );
    default:
      return null;
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function Philosophy({ dict }: { dict: any }) {
  return (
    <section className="relative py-16 md:py-40 overflow-hidden">
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${basePath}/images/hotel/hotel-gardens.jpg)` }}
      />
      <div className="absolute inset-0 bg-cream/90 backdrop-blur-sm" />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-8">
          <ScrollReveal>
            <span className="section-label">{dict.philosophy.label}</span>
            <h2 className="mb-6">{dict.philosophy.title}</h2>
            <div className="section-divider" />
          </ScrollReveal>
        </div>

        <div className="max-w-3xl mx-auto text-center mb-16">
          <ScrollReveal delay={100}>
            <p className="text-text-body leading-[1.9] text-base mb-4">{dict.philosophy.p1}</p>
            <p className="text-text-muted text-sm leading-relaxed">{dict.philosophy.p2}</p>
          </ScrollReveal>
        </div>

        {/* Pillars — glass cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, i) => (
            <ScrollReveal key={pillar.key} delay={i * 100}>
              <div className="glass-card p-8 h-full flex flex-col items-center text-center">
                <div className="mb-5">
                  <PillarIcon type={pillar.icon} />
                </div>
                <h3 className="text-base font-semibold text-brown-deep mb-3">
                  {dict.philosophy[pillar.key]}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  {dict.philosophy[`${pillar.key}Desc`]}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
