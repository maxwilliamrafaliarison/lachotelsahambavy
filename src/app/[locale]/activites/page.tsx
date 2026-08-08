import { getDictionary } from "@/i18n/getDictionary";
import { locales, type Locale, getBasePath } from "@/lib/utils";
import PanoramaHero from "@/components/ui/PanoramaHero";
import EditorialSplit from "@/components/ui/EditorialSplit";
import RecapRows from "@/components/ui/RecapRows";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { siteConfig } from "@/data/site";
import Link from "next/link";

const basePath = getBasePath();

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return {
    title: `${dict.loisirs.heroTitle} — ${siteConfig.name}`,
    description: dict.loisirs.heroSubtitle,
  };
}

/* eslint-disable @typescript-eslint/no-explicit-any */

/** « Inclus : a, b, c » → ["Inclus", "a, b, c"] (fonctionne fr/en/es). */
function splitRecap(s: string): [string, string] {
  const i = s.indexOf(":");
  return i === -1 ? [s, ""] : [s.slice(0, i).trim(), s.slice(i + 1).trim()];
}

/** « Jour 1 : Immersion… » → ["Jour 1", "Immersion…"]. */
function splitDayTitle(s: string): [string, string] {
  const i = s.indexOf(":");
  return i === -1 ? ["", s] : [s.slice(0, i).trim(), s.slice(i + 1).trim()];
}

export default async function ActivitesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  const circuits = [
    dict.loisirs.discovery,
    dict.loisirs.cultural,
    dict.loisirs.leisure,
  ];

  const poolP2 = ((dict.loisirs as any).poolP2 as string | undefined) ??
    "Espace zen, chaises longues et vue sur les jardins : le bord de la piscine se prête autant à la baignade qu'à la méditation.";
  const ctaTitle = ((dict.loisirs as any).ctaTitle as string | undefined) ??
    "Composez vos journées au bord du lac";
  const programLabel = locale === "fr" ? "Au programme" : locale === "en" ? "Programme" : "Programa";
  const recapTitle = locale === "fr" ? "Aperçu" : locale === "en" ? "At a glance" : "De un vistazo";

  const [avIncLabel, avIncValue] = splitRecap(dict.loisirs.aventureIncludes);
  const [avExcLabel, avExcValue] = splitRecap(dict.loisirs.aventureExcludes);
  const [trekIncLabel, trekIncValue] = splitRecap(dict.loisirs.trekkingIncludes);
  const [trekExcLabel, trekExcValue] = splitRecap(dict.loisirs.trekkingExcludes);

  const trekkingDays = [dict.loisirs.trekkingDay1, dict.loisirs.trekkingDay2] as Array<{
    title: string;
    items: string[];
  }>;

  const wrapValue = (value: string) => (
    <span className="block max-w-[34ch] whitespace-normal text-right">{value}</span>
  );

  return (
    <>
      <PanoramaHero
        image={`${basePath}/images/pool/piscine-jardin-palmiers-jour.jpg`}
        imageAlt="La piscine en ardoise du Lac Hôtel au milieu des jardins et des palmiers"
        label={dict.loisirs.introLabel}
        title={dict.loisirs.heroTitle}
        kicker={dict.loisirs.heroSubtitle}
      />

      {/* ──── INTRO ──── */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <ScrollReveal>
            <span className="ge-label mb-3">{dict.loisirs.introLabel}</span>
            <h2 className="max-w-[24ch]" style={{ textWrap: "balance" }}>
              {dict.loisirs.introTitle}
            </h2>
            <p className="ge-measure mt-5 text-[15px] leading-relaxed text-body md:text-base">
              {dict.loisirs.introP}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ──── CIRCUITS AUTOUR DE SAHAMBAVY ──── */}
      <section id="circuits" className="scroll-mt-24 bg-mist-bg py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <ScrollReveal>
            <span className="ge-label mb-3">{dict.loisirs.circuitsLabel}</span>
            <h2 className="max-w-[24ch]" style={{ textWrap: "balance" }}>
              {dict.loisirs.circuitsTitle}
            </h2>
          </ScrollReveal>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {circuits.map((circuit: any, ci: number) => (
              <ScrollReveal key={ci} delay={ci * 120} className="h-full">
                <article className="flex h-full flex-col rounded-[3px] border border-hairline bg-white p-7 md:p-8">
                  <h3 className="mb-5 text-[1.3rem]" style={{ textWrap: "balance" }}>
                    {circuit.title}
                  </h3>
                  <ul className="flex-1 space-y-3">
                    {(circuit.items as string[]).map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-body">
                        <span className="mt-[0.55rem] h-1 w-1 flex-shrink-0 rounded-full bg-lake" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-6 border-t border-hairline pt-4 text-[13px] font-medium text-terracotta">
                    {circuit.ideal}
                  </p>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ──── PISCINE ──── */}
      <section id="piscine" className="scroll-mt-24 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <EditorialSplit
            image={`${basePath}/images/pool/pool-night.jpg`}
            imageAlt="La piscine en ardoise à eau salée illuminée à la tombée de la nuit"
            label={dict.loisirs.poolLabel}
            title={dict.loisirs.poolTitle}
          >
            <p>{dict.loisirs.poolP}</p>
            <p>{poolP2}</p>
          </EditorialSplit>
        </div>
      </section>

      {/* ──── MASSAGES & BIEN-ÊTRE ──── */}
      <section id="massage" className="scroll-mt-24 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <EditorialSplit
            image={`${basePath}/images/activities/salon-detente-vue-lac.jpg`}
            imageAlt="Salon de détente ouvert sur le lac Sahambavy, fauteuils et terrasse au bord de l'eau"
            label={dict.loisirs.massageLabel}
            title={dict.loisirs.massageTitle}
            cta={{ href: `/${locale}/contact/`, label: dict.loisirs.cta }}
            reverse
          >
            <p>{dict.loisirs.massageP}</p>
          </EditorialSplit>
        </div>
      </section>

      {/* ──── CIRCUIT AVENTURE — RIVIÈRE MATSIATRA ──── */}
      <section id="riviere-matsiatra" className="scroll-mt-24 bg-mist-bg py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <ScrollReveal>
            <span className="ge-label mb-3">{dict.loisirs.aventureLabel}</span>
            <h2 className="max-w-[24ch]" style={{ textWrap: "balance" }}>
              {dict.loisirs.aventureTitle}
            </h2>
            <p className="ge-measure mt-5 text-[15px] leading-relaxed text-body md:text-base">
              {dict.loisirs.aventureP}
            </p>
          </ScrollReveal>

          <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-14">
            <ScrollReveal>
              <p className="ge-label mb-4">{programLabel}</p>
              <ol className="ge-rows">
                {(dict.loisirs.aventureProgram as string[]).map((step: string, i: number) => (
                  <li key={i} className="flex items-baseline gap-5 border-b border-hairline py-4">
                    <span className="text-xs font-semibold tabular-nums text-terracotta">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[15px] leading-relaxed text-body">{step}</span>
                  </li>
                ))}
              </ol>
            </ScrollReveal>

            <ScrollReveal delay={150}>
              <img
                src={`${basePath}/images/activities/pedalos-colores-ponton.jpg`}
                alt="Embarcations au ponton du Lac Hôtel, point de départ des excursions"
                loading="lazy"
                className="aspect-[4/3] w-full rounded-[3px] border border-hairline object-cover"
              />
              <RecapRows
                className="mt-8"
                title={recapTitle}
                rows={[
                  { label: avIncLabel, value: wrapValue(avIncValue) },
                  { label: avExcLabel, value: wrapValue(avExcValue) },
                ]}
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ──── CIRCUIT TREKKING — FALAISE BLANCHE ──── */}
      <section id="trekking" className="scroll-mt-24 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <ScrollReveal>
            <span className="ge-label mb-3">{dict.loisirs.trekkingLabel}</span>
            <h2 className="max-w-[24ch]" style={{ textWrap: "balance" }}>
              {dict.loisirs.trekkingTitle}
            </h2>
            <p className="ge-measure mt-5 text-[15px] leading-relaxed text-body md:text-base">
              {dict.loisirs.trekkingP}
            </p>
          </ScrollReveal>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {trekkingDays.map((day, di) => {
              const [dayLabel, dayTitle] = splitDayTitle(day.title);
              return (
                <ScrollReveal key={di} delay={di * 120} className="h-full">
                  <article className="flex h-full flex-col rounded-[3px] border border-hairline bg-white p-7 md:p-9">
                    {dayLabel && <span className="ge-label mb-3">{dayLabel}</span>}
                    <h3 className="mb-6 text-[1.3rem]" style={{ textWrap: "balance" }}>
                      {dayTitle}
                    </h3>
                    <ol className="flex-1">
                      {day.items.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-baseline gap-4 border-t border-hairline py-3"
                        >
                          <span className="text-xs font-semibold tabular-nums text-terracotta">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="text-sm leading-relaxed text-body">{item}</span>
                        </li>
                      ))}
                    </ol>
                  </article>
                </ScrollReveal>
              );
            })}
          </div>

          <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-14">
            <ScrollReveal>
              <RecapRows
                title={recapTitle}
                rows={[
                  { label: trekIncLabel, value: wrapValue(trekIncValue) },
                  { label: trekExcLabel, value: wrapValue(trekExcValue) },
                ]}
              />
            </ScrollReveal>
            <ScrollReveal delay={120}>
              <p className="border-l-2 border-terracotta bg-mist-bg p-5 text-sm leading-relaxed text-body">
                {dict.loisirs.trekkingAdvice}
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ──── CTA ──── */}
      <section className="bg-mist-bg py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10 text-center">
          <ScrollReveal>
            <h2 className="mx-auto max-w-[22ch]" style={{ textWrap: "balance" }}>
              {ctaTitle}
            </h2>
            <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href={`/${locale}/contact/`} className="ge-cta">
                {dict.loisirs.cta}
              </Link>
              <a
                href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(dict.whatsappMessage ?? "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ge-cta ge-cta--ghost"
              >
                WhatsApp
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
