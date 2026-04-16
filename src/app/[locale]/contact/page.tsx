"use client";

import { Suspense, useEffect, useState, use } from "react";
import { getDictionary } from "@/i18n/getDictionary";
import { type Locale, getBasePath } from "@/lib/utils";
import PageHero from "@/components/ui/PageHero";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionHeader from "@/components/ui/SectionHeader";
import BookingForm from "@/components/booking/BookingForm";
import { siteConfig } from "@/data/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema-org";
import { buildBreadcrumb } from "@/lib/seo/breadcrumbs";

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const loc = locale as Locale;
  const [dict, setDict] = useState<any>(null);

  useEffect(() => {
    getDictionary(loc).then(setDict);
  }, [loc]);

  if (!dict) return null;

  return (
    <>
      <JsonLd schemas={[breadcrumbSchema(buildBreadcrumb(loc, "contact"))]} />
      <PageHero
        title={dict.contact.heroTitle}
        subtitle={dict.contact.heroSubtitle}
        image={`${getBasePath()}/images/hero/hero-lake-sunset.jpg`}
      />

      {/* Contact info cards */}
      <section className="py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-4">
          <SectionHeader
            label={dict.contact.label}
            title={dict.contact.title}
            subtitle={dict.contact.subtitle}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "\uD83D\uDCE7", label: dict.contact.reservations, value: siteConfig.email, href: `mailto:${siteConfig.email}` },
              { icon: "\uD83D\uDCF1", label: dict.contact.whatsapp, value: siteConfig.phone, href: `https://wa.me/${siteConfig.whatsapp.replace(/^\+/, "")}` },
              { icon: "\uD83D\uDCCD", label: dict.contact.address, value: siteConfig.address, href: siteConfig.social.google },
              { icon: "\uD83D\uDE86", label: dict.contact.access, value: dict.contact.accessDetail, href: null },
            ].map((item, i) => (
              <ScrollReveal key={item.label} delay={i * 100}>
                <div className="bg-cream rounded-xl p-6 text-center h-full">
                  <div className="text-2xl mb-3">{item.icon}</div>
                  <h4 className="text-sm font-semibold text-text-dark mb-2">{item.label}</h4>
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
                    <p className="text-sm text-text-muted">{item.value}</p>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Booking form multi-step */}
      <section id="booking-form" className="py-24 bg-cream">
        <div className="max-w-[900px] mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl text-brown-deep mb-3">{dict.contact.title}</h2>
            <p className="text-text-muted text-sm md:text-base">{dict.contact.subtitle}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6 md:p-10 border border-brown-deep/5">
            <Suspense
              fallback={
                <div className="text-center py-16 text-text-muted text-sm">
                  Chargement du formulaire…
                </div>
              }
            >
              <BookingForm dict={dict} locale={locale as Locale} />
            </Suspense>
          </div>
        </div>
      </section>

      {/* Special offer reminder */}
      <section className="py-16 bg-white">
        <div className="max-w-[800px] mx-auto px-4">
          <ScrollReveal>
            <div className="bg-brown-deep text-cream rounded-xl p-8 text-center">
              <span className="text-2xl mb-2 block">{"\uD83C\uDF89"}</span>
              <h3 className="text-xl text-white mb-2">{dict.contact.offerReminder}</h3>
              <p className="text-sm text-cream/70">{dict.contact.offerReminderDetail}</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Cancellation & booking conditions */}
      <section id="conditions" className="py-16 bg-white">
        <div className="max-w-[800px] mx-auto px-4">
          <ScrollReveal>
            <h3 className="text-xl mb-6 text-center">{dict.contact.cancellation}</h3>
            <div className="bg-cream/60 rounded-xl p-6 md:p-8 border border-brown-deep/5">
              <ul className="space-y-3">
                {dict.contact.cancellationRules.map((rule: string, i: number) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-text-muted text-sm leading-relaxed"
                  >
                    <span className="text-gold mt-0.5 flex-shrink-0">
                      {i < 2 ? "\u2139\uFE0F" : "\u26A0\uFE0F"}
                    </span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Google Maps */}
      <section className="py-16 bg-cream">
        <div className="max-w-[1200px] mx-auto px-4">
          <ScrollReveal>
            <h3 className="text-xl mb-6 text-center">{dict.contact.mapTitle}</h3>
            <div className="rounded-xl overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3774.5!2d47.25!3d-21.0667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sSahambavy!5e0!3m2!1sfr!2smg!4v1"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lac Hotel Sahambavy"
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-[600px] mx-auto px-4 text-center">
          <ScrollReveal>
            <a
              href={`https://wa.me/${siteConfig.whatsapp.replace(/^\+/, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#25D366] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#20bd5a] transition-colors shadow-lg"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {dict.footer?.whatsappCta || dict.contact.whatsapp}
            </a>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
