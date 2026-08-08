import ScrollReveal from "@/components/ui/ScrollReveal";
import { siteConfig } from "@/data/site";

/**
 * Bloc contact final — dernier temps clair avant le footer nuit.
 * Fond brume, coordonnées à filets fins (pas de ge-rows ici : les valeurs
 * longues — adresse, itinéraire — doivent pouvoir passer à la ligne, ce que
 * le nowrap du ge-row interdit), CTA plein thé.
 *
 * id="contact" + scroll-mt-24 : ancre ciblée depuis le hero / la navbar.
 * NB : ce composant ne reçoit pas `locale` (signature conservée) — les CTA
 * pointent donc vers e-mail et WhatsApp, valables dans les trois langues.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function ContactSection({ dict }: { dict: any }) {
  const items: Array<{ label: string; value: string; href: string | null }> = [
    {
      label: dict.contact.reservations,
      value: siteConfig.email,
      href: `mailto:${siteConfig.email}`,
    },
    {
      label: dict.contact.whatsapp,
      value: siteConfig.phone,
      href: `https://wa.me/${siteConfig.whatsapp.replace(/[^\d+]/g, "")}`,
    },
    {
      label: dict.contact.address,
      value: siteConfig.address,
      href: siteConfig.social.google,
    },
    {
      label: dict.contact.access,
      value: dict.contact.accessDetail,
      href: null,
    },
  ];

  return (
    <section id="contact" className="scroll-mt-24 bg-mist-bg py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid gap-10 md:grid-cols-12 md:gap-14">
          {/* ─── Titre + CTA ───────────────────────────────────────────── */}
          <div className="md:col-span-5">
            <ScrollReveal>
              <span className="ge-label mb-4">{dict.contact.label}</span>
              <h2 style={{ textWrap: "balance" }}>{dict.contact.title}</h2>
              {dict.contact.subtitle && (
                <p className="mt-5 text-[15px] leading-relaxed text-muted">
                  {dict.contact.subtitle}
                </p>
              )}
              <div className="mt-8">
                <a href={`mailto:${siteConfig.email}`} className="ge-cta">
                  {dict.contact.cta ?? dict.contact.title}
                </a>
              </div>
              {dict.contact.offerReminder && (
                <p className="mt-6 text-sm text-terracotta">{dict.contact.offerReminder}</p>
              )}
            </ScrollReveal>
          </div>

          {/* ─── Coordonnées à filets fins ─────────────────────────────── */}
          <div className="md:col-span-7">
            <ScrollReveal delay={120}>
              <div className="border-t border-hairline">
                {items.map((item) => (
                  <div key={item.label} className="border-b border-hairline py-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
                      {item.label}
                    </p>
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.href.startsWith("mailto:") ? undefined : "_blank"}
                        rel="noopener noreferrer"
                        className="mt-1 inline-block text-[15px] font-medium text-terracotta transition-colors hover:text-lake-deep"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="mt-1 text-[15px] leading-relaxed text-ink">{item.value}</p>
                    )}
                  </div>
                ))}
              </div>
              {dict.contact.transferNote && (
                <p className="mt-3 text-xs text-muted">{dict.contact.transferNote}</p>
              )}
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
