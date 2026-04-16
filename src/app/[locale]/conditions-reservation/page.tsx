/**
 * Page /[locale]/conditions-reservation/
 *
 * Conditions générales de réservation — conformité UE.
 * Références légales : Directive 2011/83/UE, Règlement 524/2013 (RLL/ODR),
 * RGPD (UE 2016/679), article L221-28 12° du Code de la consommation français.
 *
 * Le contenu est piloté entièrement depuis les dictionnaires i18n
 * (`dict.conditions`), donc statique et traduit pour FR / EN / ES.
 */

import Link from "next/link";
import { getDictionary } from "@/i18n/getDictionary";
import { locales, type Locale, getBasePath } from "@/lib/utils";
import PageHero from "@/components/ui/PageHero";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { siteConfig } from "@/data/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema-org";
import { buildBreadcrumb } from "@/lib/seo/breadcrumbs";

type Section = {
  title: string;
  intro?: string;
  items: string[];
};

const basePath = getBasePath();

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return {
    title: `${dict.conditions.heroTitle} — ${siteConfig.name}`,
    description: dict.conditions.heroSubtitle,
    robots: { index: true, follow: true },
  };
}

/**
 * Linkify transforms URLs and email addresses inside a dict string
 * into anchor tags. Kept local to this page — the dict content can contain
 * ec.europa.eu/consumers/odr/ or booking@lachotel.com and we want them clickable.
 */
function Linkify({ text }: { text: string }) {
  // Match http(s)://..., bare domains (ec.europa.eu/...), and email addresses.
  const pattern = /(https?:\/\/[^\s]+|(?:www\.|(?:ec|mtv|cnil|aepd)\.[^\s]+?\/[^\s]*|(?:ec|mtv|cnil|aepd)\.[^\s)]+)|[\w.+-]+@[\w.-]+\.[a-z]{2,})/gi;
  const parts: Array<string | { kind: "url" | "email"; value: string }> = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    const raw = match[0];
    if (raw.includes("@") && !raw.startsWith("http")) {
      parts.push({ kind: "email", value: raw });
    } else {
      parts.push({ kind: "url", value: raw });
    }
    lastIndex = match.index + raw.length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));

  return (
    <>
      {parts.map((part, i) => {
        if (typeof part === "string") return <span key={i}>{part}</span>;
        if (part.kind === "email") {
          return (
            <a
              key={i}
              href={`mailto:${part.value}`}
              className="text-brown-deep underline decoration-gold/60 hover:decoration-gold"
            >
              {part.value}
            </a>
          );
        }
        const href = part.value.startsWith("http") ? part.value : `https://${part.value}`;
        return (
          <a
            key={i}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brown-deep underline decoration-gold/60 hover:decoration-gold"
          >
            {part.value}
          </a>
        );
      })}
    </>
  );
}

export default async function ConditionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const loc = locale as Locale;

  const sections = dict.conditions.sections as Section[];

  return (
    <>
      <JsonLd schemas={[breadcrumbSchema(buildBreadcrumb(loc, "conditions"))]} />
      <PageHero
        title={dict.conditions.heroTitle}
        subtitle={dict.conditions.heroSubtitle}
        image={`${basePath}/images/hero/hero-lake-sunset.jpg`}
      />

      {/* Intro + metadata */}
      <section className="py-20 bg-white">
        <div className="max-w-[820px] mx-auto px-6">
          <ScrollReveal>
            <p className="text-text-muted leading-relaxed text-lg font-[family-name:var(--font-sub)]">
              {dict.conditions.intro}
            </p>
            <p className="mt-6 text-sm text-text-muted/80 italic">
              {dict.conditions.lastUpdated} — {dict.conditions.lastUpdatedDate}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Sections (table of contents + content) */}
      <section className="pb-20 bg-white">
        <div className="max-w-[820px] mx-auto px-6 grid gap-12 md:gap-16">
          {sections.map((section, i) => {
            const anchor = `sec-${i + 1}`;
            return (
              <ScrollReveal key={anchor} delay={i * 40}>
                <article
                  id={anchor}
                  className="bg-cream/60 rounded-2xl p-8 md:p-10 scroll-mt-24"
                >
                  <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-heading)] text-brown-deep mb-6">
                    {section.title}
                  </h2>
                  {section.intro && (
                    <p className="text-text-muted leading-relaxed mb-6">
                      <Linkify text={section.intro} />
                    </p>
                  )}
                  <ul className="space-y-4">
                    {section.items.map((item, j) => (
                      <li key={j} className="flex gap-4 text-text-muted leading-relaxed">
                        <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-gold mt-2.5" />
                        <span>
                          <Linkify text={item} />
                        </span>
                      </li>
                    ))}
                  </ul>
                </article>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-brown-deep text-white">
        <div className="max-w-[640px] mx-auto px-6 text-center">
          <ScrollReveal>
            <p className="text-lg md:text-xl mb-8 font-[family-name:var(--font-sub)] text-cream/90">
              {dict.conditions.contactLead}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/${loc}/contact/`} className="btn btn--primary">
                {dict.conditions.contactCta}
              </Link>
              <a
                href={`mailto:${siteConfig.email}`}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-cream/40 text-cream rounded-lg hover:bg-cream/10 transition-colors duration-300"
              >
                {siteConfig.email}
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
