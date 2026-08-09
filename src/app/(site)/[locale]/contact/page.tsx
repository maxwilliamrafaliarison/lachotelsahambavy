/**
 * Page Contact — COMPOSANT SERVEUR.
 *
 * Elle était en "use client" avec `if (!dict) return null` : le HTML servi
 * se réduisait à `<main class="flex-1"></main>`. Zéro h1, zéro formulaire,
 * aucun JSON-LD, et le <title> générique du layout racine. Sur la page de
 * conversion du site, c'était le pire endroit possible pour ne rien rendre
 * côté serveur.
 *
 * Le dictionnaire est désormais attendu au rendu, et seul le formulaire —
 * qui a besoin d'état — reste un îlot client.
 */

import { Suspense } from "react";
import { getDictionary } from "@/i18n/getDictionary";
import { locales, type Locale, getBasePath } from "@/lib/utils";
import PanoramaHero from "@/components/ui/PanoramaHero";
import RecapRows from "@/components/ui/RecapRows";
import ScrollReveal from "@/components/ui/ScrollReveal";
import BookingForm from "@/components/booking/BookingForm";
import { siteConfig, carteEmbed } from "@/data/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema-org";
import { buildBreadcrumb } from "@/lib/seo/breadcrumbs";

 

const basePath = getBasePath();

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return {
    title: dict.contact.heroTitle,
    description: dict.contact.heroSubtitle ?? dict.meta.description,
  };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const loc = locale as Locale;
  const dict = await getDictionary(loc);

  const whatsappHref = `https://wa.me/${siteConfig.whatsapp.replace(/^\+/, "")}`;

  return (
    <>
      <JsonLd schemas={[breadcrumbSchema(buildBreadcrumb(loc, "contact"))]} />

      <PanoramaHero
        image={`${basePath}/images/hero/hero-lake-sunset.jpg`}
        label={dict.contact.label}
        title={dict.contact.heroTitle}
        kicker={dict.contact.heroSubtitle}
      />

      {/* Intro + coordonnées — filets fins, monde clair */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="grid gap-12 md:grid-cols-2 md:gap-16 lg:gap-24">
            <ScrollReveal>
              <span className="ge-label mb-3">{dict.contact.label}</span>
              <h2 className="mb-5" style={{ textWrap: "balance" }}>
                {dict.contact.title}
              </h2>
              <p className="ge-measure text-[15px] leading-relaxed text-body md:text-base">
                {dict.contact.subtitle}
              </p>
              <div className="mt-8 border-t border-hairline pt-6">
                <p className="ge-measure text-[15px] leading-relaxed text-body">
                  <span className="font-semibold text-terracotta">{dict.contact.offerReminder}</span>
                  {". "}
                  {dict.contact.offerReminderDetail}
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <RecapRows
                className="[&_.ge-row>span:last-child]:whitespace-normal [&_.ge-row>span:last-child]:text-right"
                rows={[
                  {
                    label: dict.contact.reservations,
                    value: (
                      <a
                        href={`mailto:${siteConfig.email}`}
                        className="transition-colors hover:text-lake-deep"
                      >
                        {siteConfig.email}
                      </a>
                    ),
                  },
                  {
                    label: dict.contact.whatsapp,
                    value: (
                      <a
                        href={whatsappHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors hover:text-lake-deep"
                      >
                        {siteConfig.phone}
                      </a>
                    ),
                  },
                  {
                    label: dict.contact.address,
                    value: (
                      <a
                        href={siteConfig.social.google}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors hover:text-lake-deep"
                      >
                        {siteConfig.address}
                      </a>
                    ),
                  },
                ]}
              />
              <div className="mt-9">
                <span className="ge-label mb-3">{dict.contact.access}</span>
                <p className="mt-2 text-[15px] leading-relaxed text-body">
                  {dict.contact.accessDetail}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {dict.contact.transferNote}
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Formulaire de réservation — inchangé, posé dans une surface sobre */}
      <section id="booking-form" className="scroll-mt-24 bg-mist-bg py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="mx-auto max-w-[880px]">
            <div className="rounded-[3px] border border-hairline bg-white p-6 md:p-10">
              <Suspense
                fallback={
                  <div className="py-16 text-center text-sm text-muted">
                    Chargement du formulaire…
                  </div>
                }
              >
                <BookingForm dict={dict} locale={locale as Locale} />
              </Suspense>
            </div>
          </div>
        </div>
      </section>


      {/* Carte — Google Maps */}
      <section className="bg-mist-bg py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <ScrollReveal>
            <span className="ge-label mb-3">{dict.contact.address}</span>
            <h2 className="mb-8">{dict.contact.mapTitle}</h2>
            <div className="overflow-hidden rounded-[3px] border border-hairline">
              <iframe
                src={carteEmbed(locale)}
                width="100%"
                height="450"
                style={{ border: 0, display: "block" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lac Hotel Sahambavy"
              />
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
