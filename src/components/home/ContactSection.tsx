import ScrollReveal from "@/components/ui/ScrollReveal";
import { siteConfig } from "@/data/site";
import { getBasePath } from "@/lib/utils";

const basePath = getBasePath();

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function ContactSection({ dict }: { dict: any }) {
  return (
    <section id="contact" className="relative py-32 md:py-40 overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${basePath}/images/hero/hero-lake-sunset.jpg)` }}
      />
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />

      <div className="relative z-10 max-w-[1000px] mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <ScrollReveal>
            <span className="section-label">{dict.contact.label}</span>
            <h2 className="mb-4" style={{ color: "#FFFFFF" }}>{dict.contact.title}</h2>
            {dict.contact.subtitle && (
              <p className="text-white/60 font-[family-name:var(--font-sub)] text-lg">
                {dict.contact.subtitle}
              </p>
            )}
          </ScrollReveal>
        </div>

        {/* Contact cards — glass dark */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {[
            { icon: "mail", label: dict.contact.reservations, value: siteConfig.email, href: `mailto:${siteConfig.email}` },
            { icon: "phone", label: dict.contact.whatsapp, value: siteConfig.phone, href: `https://wa.me/${siteConfig.whatsapp}` },
            { icon: "pin", label: dict.contact.address, value: siteConfig.address, href: siteConfig.social.google },
            { icon: "clock", label: dict.contact.access, value: dict.contact.accessDetail, href: null },
          ].map((item, i) => (
            <ScrollReveal key={item.label} delay={i * 80}>
              <div className="glass-dark p-6 flex items-start gap-4 h-full">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <ContactIcon type={item.icon} />
                </div>
                <div>
                  <h4 className="text-[0.65rem] font-semibold text-white/50 uppercase tracking-[0.15em] mb-2">
                    {item.label}
                  </h4>
                  {item.href ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gold hover:text-gold-light transition-colors"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-sm text-white/70">{item.value}</p>
                  )}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Promo reminder */}
        <ScrollReveal delay={200}>
          <div className="text-center">
            <p className="text-white/50 text-sm font-[family-name:var(--font-sub)] italic">
              {dict.contact.offerReminder}
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

function ContactIcon({ type }: { type: string }) {
  const cls = "w-4 h-4 text-gold";
  switch (type) {
    case "mail":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M22 7l-10 6L2 7" />
        </svg>
      );
    case "phone":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
        </svg>
      );
    case "pin":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      );
    case "clock":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      );
    default:
      return null;
  }
}
