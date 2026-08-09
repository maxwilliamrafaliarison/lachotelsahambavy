import { getDictionary } from "@/i18n/getDictionary";
import { locales, type Locale, getBasePath } from "@/lib/utils";
import PanoramaHero from "@/components/ui/PanoramaHero";
import EditorialSplit from "@/components/ui/EditorialSplit";
import RecapRows from "@/components/ui/RecapRows";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema-org";
import { buildBreadcrumb } from "@/lib/seo/breadcrumbs";
import LeReposSignupForm from "./LeReposSignupForm";

const basePath = getBasePath();

/**
 * Copie « Le Repos » — les clés proviennent du delta dictionnaire
 * (dict-deltas/repos.json) fusionné dans fr/en/es.json. Le cast local permet
 * de typer la page avant fusion sans toucher aux JSON du repo.
 */
type ReposCopy = {
  heroLabel: string;
  heroTitle: string;
  heroSubtitle: string;
  heroKicker: string;
  heroCta: string;
  introLabel: string;
  introTitle: string;
  introP: string;
  spiritLabel: string;
  spiritTitle: string;
  spiritP1: string;
  spiritP2: string;
  bungalowsLabel: string;
  bungalowsTitle: string;
  bungalowsP1: string;
  bungalowsP2: string;
  bungalowsRowStyleLabel: string;
  bungalowsRowStyleValue: string;
  bungalowsRowWifiLabel: string;
  bungalowsRowWifiValue: string;
  natureLabel: string;
  natureTitle: string;
  natureP1: string;
  natureP2: string;
  ratesLabel: string;
  ratesTitle: string;
  ratesP: string;
  ratesRecapTitle: string;
  ratesRowNightLabel: string;
  ratesRowNightValue: string;
  ratesRowWifiLabel: string;
  ratesRowWifiValue: string;
  ratesRowDistanceLabel: string;
  ratesRowDistanceValue: string;
  ratesFootnote: string;
  ratesCta: string;
  formLabel: string;
  formTitle: string;
  formIntro: string;
  formNote: string;
  altHero: string;
  altAllee: string;
  altChalets: string;
  altForet: string;
  altNature: string;
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return {
    title: dict.repos.heroTitle,
    description: dict.repos.heroSubtitle,
  };
}

export default async function LeReposPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const loc = locale as Locale;
  const r = dict.repos as unknown as ReposCopy;

  return (
    <>
      <JsonLd schemas={[breadcrumbSchema(buildBreadcrumb(loc, "le-repos"))]} />

      <PanoramaHero
        image={`${basePath}/images/rooms/le-repos-exterior.jpg`}
        imageAlt={r.altHero}
        label={r.heroLabel}
        title={r.heroTitle}
        kicker={r.heroKicker}
        cta={{ href: "#esprit", label: r.heroCta }}
      />

      {/* Intro — l'esprit du lieu, prose courte en mesure lisible */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <ScrollReveal>
            <span className="ge-label mb-3 block">{r.introLabel}</span>
            <h2 className="mb-5" style={{ textWrap: "balance" }}>
              {r.introTitle}
            </h2>
            <p className="ge-measure text-[15px] leading-relaxed text-body md:text-base">
              {r.introP}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Trois splits éditoriaux alternés — pour qui / les bungalows / la nature */}
      <section className="pb-16 md:pb-24">
        <div className="mx-auto max-w-7xl space-y-10 px-6 md:space-y-14 md:px-10">
          <EditorialSplit
            id="esprit"
            image={`${basePath}/images/repos/le-repos-allee-chalets-pins.jpg`}
            imageAlt={r.altAllee}
            label={r.spiritLabel}
            title={r.spiritTitle}
          >
            <p>{r.spiritP1}</p>
            <p>{r.spiritP2}</p>
          </EditorialSplit>

          <EditorialSplit
            id="bungalows"
            reverse
            image={`${basePath}/images/repos/le-repos-chalets-sentier.jpg`}
            imageAlt={r.altChalets}
            label={r.bungalowsLabel}
            title={r.bungalowsTitle}
            rows={[
              { label: r.bungalowsRowStyleLabel, value: r.bungalowsRowStyleValue },
              { label: r.bungalowsRowWifiLabel, value: r.bungalowsRowWifiValue },
            ]}
          >
            <p>{r.bungalowsP1}</p>
            <p>{r.bungalowsP2}</p>
          </EditorialSplit>

          <EditorialSplit
            id="nature"
            image={`${basePath}/images/repos/le-repos-sentier-foret-pins.jpg`}
            imageAlt={r.altForet}
            label={r.natureLabel}
            title={r.natureTitle}
          >
            <p>{r.natureP1}</p>
            <p>{r.natureP2}</p>
          </EditorialSplit>
        </div>
      </section>

      {/* Tarif doux — récapitulatif à filets fins + photo d'ambiance */}
      <section id="tarifs" className="scroll-mt-24 bg-mist-bg py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
            <ScrollReveal>
              <span className="ge-label mb-3 block">{r.ratesLabel}</span>
              <h2 className="mb-4" style={{ textWrap: "balance" }}>
                {r.ratesTitle}
              </h2>
              <p className="ge-measure mb-8 text-[15px] leading-relaxed text-body md:text-base">
                {r.ratesP}
              </p>
              <RecapRows
                title={r.ratesRecapTitle}
                rows={[
                  { label: r.ratesRowNightLabel, value: r.ratesRowNightValue },
                  { label: r.ratesRowWifiLabel, value: r.ratesRowWifiValue },
                  { label: r.ratesRowDistanceLabel, value: r.ratesRowDistanceValue },
                ]}
                footnote={r.ratesFootnote}
              />
              <div className="mt-8">
                <Link href={`/${locale}/contact/`} className="ge-cta">
                  {r.ratesCta}
                </Link>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={150}>
              <div className="overflow-hidden rounded-[3px] border border-hairline">
                <img
                  src={`${basePath}/images/rooms/le-repos-nature.jpg`}
                  alt={r.altNature}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Avant-première — le formulaire d'inscription existant, restylé */}
      <section id="avant-premiere" className="scroll-mt-24 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="grid items-start gap-10 md:grid-cols-2 md:gap-16">
            <ScrollReveal>
              <span className="ge-label mb-3 block">{r.formLabel}</span>
              <h2 className="mb-4" style={{ textWrap: "balance" }}>
                {r.formTitle}
              </h2>
              <p className="ge-measure text-[15px] leading-relaxed text-body md:text-base">
                {r.formIntro}
              </p>
              <p className="mt-4 text-xs text-muted">{r.formNote}</p>
            </ScrollReveal>
            <ScrollReveal delay={150}>
              <div className="rounded-[3px] border border-hairline bg-white p-6 md:p-9">
                <LeReposSignupForm dict={dict} />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  );
}
