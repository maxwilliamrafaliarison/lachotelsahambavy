import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionHeader from "@/components/ui/SectionHeader";
import { siteConfig } from "@/data/site";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function ContactSection({ dict }: { dict: any }) {
  return (
    <section id="contact" className="py-24 bg-white">
      <div className="max-w-[1200px] mx-auto px-4">
        <SectionHeader
          label={dict.contact.label}
          title={dict.contact.title}
          subtitle={dict.contact.subtitle}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: "📧", label: dict.contact.reservations, value: siteConfig.email, href: `mailto:${siteConfig.email}` },
            { icon: "📱", label: dict.contact.whatsapp, value: siteConfig.phone, href: `https://wa.me/${siteConfig.whatsapp}` },
            { icon: "📍", label: dict.contact.address, value: siteConfig.address, href: siteConfig.social.google },
            { icon: "🚆", label: dict.contact.access, value: dict.contact.accessDetail, href: null },
          ].map((item, i) => (
            <ScrollReveal key={item.label} delay={i * 100}>
              <div className="bg-cream rounded-xl p-6 text-center h-full">
                <div className="text-2xl mb-3">{item.icon}</div>
                <h4 className="text-sm font-semibold text-text-dark mb-2">{item.label}</h4>
                {item.href ? (
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-sm text-gold hover:text-gold-light transition-colors">
                    {item.value}
                  </a>
                ) : (
                  <p className="text-sm text-text-muted">{item.value}</p>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Special offer reminder */}
        <ScrollReveal delay={200}>
          <div className="mt-12 bg-brown-deep text-cream rounded-xl p-8 text-center">
            <span className="text-2xl mb-2 block">🎉</span>
            <h3 className="text-xl text-white mb-2">{dict.contact.offerReminder}</h3>
            <p className="text-sm text-cream/70">{dict.contact.offerReminderDetail}</p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
