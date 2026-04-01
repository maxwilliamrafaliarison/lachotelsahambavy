import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionHeader from "@/components/ui/SectionHeader";

const pillars = [
  { icon: "🌿", key: "pillar1" },
  { icon: "👐", key: "pillar2" },
  { icon: "🏘", key: "pillar3" },
  { icon: "🦎", key: "pillar4" },
];

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function Philosophy({ dict }: { dict: any }) {
  return (
    <section className="philosophy-section py-24">
      <div className="max-w-[1200px] mx-auto px-4 relative z-10">
        <SectionHeader
          label={dict.philosophy.label}
          title={dict.philosophy.title}
          light
        />

        <div className="max-w-2xl mx-auto text-center mb-12">
          <p className="text-cream/80 mb-4">{dict.philosophy.p1}</p>
          <p className="text-cream/70 text-sm">{dict.philosophy.p2}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, i) => (
            <ScrollReveal key={pillar.key} delay={i * 100}>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center hover:bg-white/10 transition-colors">
                <div className="text-3xl mb-3">{pillar.icon}</div>
                <h3 className="text-lg text-white mb-2">{dict.philosophy[pillar.key]}</h3>
                <p className="text-sm text-cream/70">{dict.philosophy[`${pillar.key}Desc`]}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
