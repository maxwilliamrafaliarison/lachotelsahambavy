import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionHeader from "@/components/ui/SectionHeader";

const pillars = [
  {
    key: "pillar1",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 256 256" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M128 232c0-96 88-120 88-176a88 88 0 00-176 0c0 56 88 80 88 176z" />
        <path d="M128 128c24-24 40-56 40-72" />
        <path d="M128 128c-24-24-40-56-40-72" />
        <line x1="128" y1="128" x2="128" y2="232" />
      </svg>
    ),
  },
  {
    key: "pillar2",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 256 256" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M128 80c24 0 40 16 40 48s-16 48-40 48" />
        <path d="M128 80c-24 0-40 16-40 48s16 48 40 48" />
        <path d="M88 168l-48 48" />
        <path d="M168 168l48 48" />
        <path d="M128 176v40" />
        <circle cx="128" cy="52" r="20" />
      </svg>
    ),
  },
  {
    key: "pillar3",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 256 256" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="48" y="80" width="72" height="128" rx="4" />
        <rect x="136" y="48" width="72" height="160" rx="4" />
        <line x1="48" y1="208" x2="208" y2="208" />
        <polyline points="60 80 84 56 108 80" />
        <polyline points="148 48 172 24 196 48" />
      </svg>
    ),
  },
  {
    key: "pillar4",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 256 256" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M128 24c-48 32-80 80-80 128 0 48 32 80 80 80s80-32 80-80c0-48-32-96-80-128z" />
        <path d="M128 72c16 24 32 56 32 80s-16 40-32 40-32-16-32-40 16-56 32-80z" />
        <circle cx="128" cy="168" r="12" />
      </svg>
    ),
  },
];

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function Philosophy({ dict }: { dict: any }) {
  return (
    <section className="py-24 bg-cream">
      <div className="max-w-[1200px] mx-auto px-4">
        <SectionHeader
          label={dict.philosophy.label}
          title={dict.philosophy.title}
        />

        <div className="max-w-2xl mx-auto text-center mb-12">
          <p className="text-text-body mb-4 leading-relaxed">{dict.philosophy.p1}</p>
          <p className="text-text-muted text-sm leading-relaxed">{dict.philosophy.p2}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, i) => (
            <ScrollReveal key={pillar.key} delay={i * 100}>
              <div className="liquid-glass relative overflow-hidden h-full flex flex-col items-center text-center p-8 min-h-[240px]">
                {/* Filigrane icon - large, in corner */}
                <div className="absolute -bottom-4 -right-4 text-brown-deep/[0.06] pointer-events-none">
                  {pillar.icon}
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center flex-1">
                  <h3 className="text-lg font-semibold text-brown-deep mb-3">{dict.philosophy[pillar.key]}</h3>
                  <p className="text-sm text-text-muted leading-relaxed">{dict.philosophy[`${pillar.key}Desc`]}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
