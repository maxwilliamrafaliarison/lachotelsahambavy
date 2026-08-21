/**
 * Page /[locale]/conditions-reservation/
 *
 * Conditions générales de réservation conformes au droit de l'UE.
 * Références légales : Directive 2011/83/UE, Règlement 524/2013 (RLL/ODR),
 * RGPD (UE 2016/679), article L221-28 12° du Code de la consommation français.
 *
 * Le contenu est piloté entièrement depuis les dictionnaires i18n
 * (`dict.conditions`), donc statique et traduit pour FR / EN / ES.
 */

import Link from "next/link";
import { getDictionary } from "@/i18n/getDictionary";
import { locales, type Locale, getBasePath } from "@/lib/utils";
import PanoramaHero from "@/components/ui/PanoramaHero";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { siteConfig } from "@/data/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema-org";
import { buildBreadcrumb } from "@/lib/seo/breadcrumbs";
import { pageAlternates } from "@/lib/seo/alternates";

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
    title: dict.conditions.heroTitle,
    /* Description écrite pour la page de résultats, et non reprise du
       sous-titre affiché : celui-ci tenait en une demi-ligne là où Google
       en montre cent cinquante caractères. */
    description: dict.conditions.metaDescription ?? dict.conditions.heroSubtitle,
    alternates: pageAlternates(locale as Locale, "conditions-reservation"),
    robots: { index: true, follow: true },
  };
}

/**
 * Linkify transforms URLs and email addresses inside a dict string
 * into anchor tags. Kept local to this page because the dict content can contain
 * ec.europa.eu/consumers/odr/ or booking@lachotel.com and we want them clickable.
 */
function Linkify({ text }: { text: string }) {
  // Match http(s)://..., bare domains (ec.europa.eu/...), and email addresses.
  /* « www\. » N'AVAIT PAS DE SUITE, et c'est ce qui produisait deux liens
     morts par page, dans les trois langues. La première branche de
     l'alternance ne capturait que les quatre caractères « www. » :
     « www.mtv.travel » donnait un lien href="https://www." dont le
     libellé était « www. ». Idem pour la CNIL en français et en anglais,
     l'AEPD en espagnol. Il manquait simplement de quoi consommer le
     domaine, et la borne « ni espace ni parenthèse fermante » est
     nécessaire : ces adresses apparaissent entre parenthèses, comme dans
     « CNIL (France, www.cnil.fr) ». */
  const pattern = /(https?:\/\/[^\s]+|(?:www\.[^\s)]+|(?:ec|mtv|cnil|aepd)\.[^\s]+?\/[^\s]*|(?:ec|mtv|cnil|aepd)\.[^\s)]+)|[\w.+-]+@[\w.-]+\.[a-z]{2,})/gi;
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
              className="text-ink underline decoration-lake/50 underline-offset-2 transition-colors hover:decoration-lake"
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
            className="text-ink underline decoration-lake/50 underline-offset-2 transition-colors hover:decoration-lake"
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

      <PanoramaHero
        image={`${basePath}/images/hero/hero-lake-sunset.jpg`}
        label={dict.conditions.navLabel}
        title={dict.conditions.heroTitle}
        kicker={dict.conditions.heroSubtitle}
        height="tall"
      />

      {/* Intro + sommaire à filets fins */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="grid gap-12 md:grid-cols-[1fr_320px] md:gap-16 lg:gap-24">
            <ScrollReveal>
              <p className="ge-measure text-base leading-relaxed text-body md:text-lg">
                {dict.conditions.intro}
              </p>
              <p className="mt-7 text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">
                {dict.conditions.lastUpdated}
                {loc === "fr" ? " : " : ": "}
                {dict.conditions.lastUpdatedDate}
              </p>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <nav aria-label={dict.conditions.heroTitle} className="border-t border-hairline">
                {sections.map((section, i) => (
                  <a
                    key={i}
                    href={`#sec-${i + 1}`}
                    className="block border-b border-hairline py-3 text-sm text-body transition-colors hover:text-lake"
                  >
                    {section.title}
                  </a>
                ))}
              </nav>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Sections : blocs hairline, typo éditoriale */}
      <section className="pb-16 md:pb-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="mx-auto grid max-w-[820px] gap-14 md:gap-20">
            {sections.map((section, i) => {
              const anchor = `sec-${i + 1}`;
              return (
                <ScrollReveal key={anchor} delay={i * 40}>
                  <article id={anchor} className="scroll-mt-24 border-t border-hairline pt-8 md:pt-10">
                    <h2 className="mb-6" style={{ textWrap: "balance" }}>
                      {section.title}
                    </h2>
                    {section.intro && (
                      <p className="mb-6 text-[15px] leading-relaxed text-body">
                        <Linkify text={section.intro} />
                      </p>
                    )}
                    <ul className="space-y-4">
                      {section.items.map((item, j) => (
                        <li key={j} className="flex gap-4 text-[15px] leading-relaxed text-body">
                          <span className="mt-[0.65em] h-1 w-1 flex-shrink-0 rounded-full bg-terracotta/70" />
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
        </div>
      </section>

      {/* Contact : bande douce, monde clair */}
      <section className="bg-mist-bg py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="mx-auto max-w-[640px] text-center">
            <ScrollReveal>
              <h3 className="mb-8" style={{ textWrap: "balance" }}>
                {dict.conditions.contactLead}
              </h3>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Link href={`/${loc}/contact/`} className="ge-cta">
                  {dict.conditions.contactCta}
                </Link>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="ge-cta ge-cta--ghost"
                  style={{ textTransform: "none", letterSpacing: "0.02em" }}
                >
                  {siteConfig.email}
                </a>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  );
}
