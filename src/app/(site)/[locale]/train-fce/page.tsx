import { getDictionary } from "@/i18n/getDictionary";
import { locales, type Locale, getBasePath } from "@/lib/utils";
import PanoramaHero from "@/components/ui/PanoramaHero";
import AvisService from "@/components/ui/AvisService";
import EditorialSplit from "@/components/ui/EditorialSplit";
import RecapRows from "@/components/ui/RecapRows";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { Icon } from "@/components/ui/Icon";
import { siteConfig } from "@/data/site";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, touristAttractionSchema } from "@/lib/schema-org";
import { buildBreadcrumb } from "@/lib/seo/breadcrumbs";

const basePath = getBasePath();

/**
 * Clés ajoutées au dictionnaire via le protocole de deltas
 * (scratchpad/dict-deltas/train.json) — optionnelles tant que la fusion
 * n'a pas eu lieu, avec repli français inline.
 */
type TrainExtras = {
  infoLabels?: {
    route: string;
    distance: string;
    duration: string;
    altitude: string;
    station: string;
    booking: string;
  };
  stationCaption?: string;
  routesLabel?: string;
  routesTitle?: string;
  routeNotes?: string[];
  departuresLabel?: string;
  departuresValue?: string;
  ratesLabel?: string;
  ratesValue?: string;
  projectLabel?: string;
  projectTitle?: string;
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return {
    title: dict.train.heroTitle,
    description: dict.train.heroSubtitle,
  };
}

export default async function TrainFCEPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const loc = locale as Locale;
  const t = dict.train as typeof dict.train & TrainExtras;

  const attractionTrain = touristAttractionSchema({
    locale: loc,
    chemin: "train-fce",
    name: dict.train.heroTitle as string,
    description: dict.train.heroSubtitle as string,
    image: "/images/train/train-classique-corridor-foret.jpg",
  });

  // Mapping options train → icônes (Micheline / Draisine privée / Train classique)
  const optionIcons = ["train", "people", "culture"];

  const infoLabels = t.infoLabels ?? {
    route: "Trajet",
    distance: "Distance",
    duration: "Durée",
    altitude: "Altitude",
    station: "Gare",
    booking: "Réservation",
  };

  const routeNotes = t.routeNotes ?? [
    "Vers le corridor de forêt primaire",
    "Au cœur de la ligne FCE",
    "Jusqu'à l'océan Indien",
  ];

  const routeRows = [
    ...dict.train.draisineRoutes.map((route, i) => ({
      label: route,
      value: routeNotes[i] ?? "",
    })),
    {
      label: t.departuresLabel ?? "Départs",
      value: t.departuresValue ?? "Fianarantsoa ou Sahambavy, en face de l'hôtel",
    },
    {
      label: t.ratesLabel ?? "Tarifs",
      value: t.ratesValue ?? "Sur demande",
    },
  ];

  return (
    <>
      <JsonLd
        schemas={[attractionTrain, breadcrumbSchema(buildBreadcrumb(loc, "train-fce"))]}
      />

      {/* Le train dans le corridor de forêt primaire, voyageurs aux
          fenêtres — bien plus parlant que la draisine à quai qui tenait
          cette place : c'est le trajet qu'on vient chercher, pas le
          matériel. La draisine reste illustrée dans sa propre section. */}
      <PanoramaHero
        image={`${basePath}/images/train/train-classique-corridor-foret.jpg`}
        imageAlt="Le train classique de la ligne FCE longeant le corridor de forêt primaire, voyageurs accoudés aux fenêtres"
        label={dict.train.introLabel}
        title={dict.train.heroTitle}
        kicker={dict.train.heroSubtitle}
        cta={{ href: "#draisine", label: dict.train.draisineLabel }}
      />

      {/* Avis de service — posé juste sous le hero, avant toute lecture du
          contenu. La page reste entière et consultable : le visiteur doit
          pouvoir se projeter sur le trajet, il doit simplement savoir
          d'emblée qu'il faut nous consulter avant de compter dessus. */}
      <section className="pt-8 md:pt-10">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <AvisService pastille={dict.train.avisPastille}>
            <p>
              {dict.train.avisTexte}{" "}
              <Link href={`/${locale}/contact/`}>{dict.train.avisLien}</Link>.
            </p>
          </AvisService>
        </div>
      </section>

      {/* ──── #ligne-fce — la ligne Fianarantsoa–Côte Est ──── */}
      <section id="ligne-fce" className="scroll-mt-24 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          {/* Intro éditoriale */}
          <ScrollReveal>
            <div className="grid gap-8 md:grid-cols-12 md:gap-14">
              <div className="md:col-span-5">
                <span className="ge-label mb-3">{dict.train.introLabel}</span>
                <h2 style={{ textWrap: "balance" }}>{dict.train.introTitle}</h2>
              </div>
              <div className="md:col-span-7">
                <div className="ge-measure space-y-4 text-[15px] leading-relaxed text-body md:text-base">
                  <p>{dict.train.introP1}</p>
                  <p>{dict.train.introP2}</p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Bande photo — l'hôtel face à la gare */}
          <ScrollReveal className="mt-14 md:mt-20">
            <figure>
              <div className="overflow-hidden rounded-[3px] border border-hairline">
                <img
                  src={`${basePath}/images/train/train-hotel.jpg`}
                  alt="Le train FCE marquant l'arrêt en gare de Sahambavy, face au Lac Hôtel"
                  loading="lazy"
                  className="aspect-[16/7] w-full object-cover"
                />
              </div>
              <figcaption className="mt-3 text-xs text-muted">
                {t.stationCaption ??
                  "Le Lac Hôtel Sahambavy, à deux minutes à pied de la gare de Sahambavy : le point de départ idéal sur la ligne FCE."}
              </figcaption>
            </figure>
          </ScrollReveal>

          {/* Trois façons de vivre le rail */}
          <div className="mt-16 md:mt-24">
            <ScrollReveal>
              <span className="ge-label mb-3">{dict.train.optionsLabel}</span>
              <h2 style={{ textWrap: "balance" }}>{dict.train.optionsTitle}</h2>
            </ScrollReveal>
            <div className="mt-10 grid gap-5 md:grid-cols-3 md:gap-6">
              {dict.train.options.map((opt, i) => (
                <ScrollReveal key={opt.name} delay={i * 120} className="h-full">
                  <div className="flex h-full flex-col rounded-[3px] border border-hairline bg-white p-7 md:p-8">
                    <Icon
                      name={optionIcons[i] ?? "train"}
                      size={26}
                      weight="light"
                      className="text-terracotta"
                    />
                    <h3 className="mt-5 mb-3 text-ink">{opt.name}</h3>
                    <p className="text-[15px] leading-relaxed text-body">{opt.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ──── Informations pratiques — Aperçu à filets fins ──── */}
      <section className="bg-mist-bg py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="grid gap-10 md:grid-cols-2 md:gap-16">
            <ScrollReveal>
              <span className="ge-label mb-3">{dict.train.infoLabel}</span>
              <h2 style={{ textWrap: "balance" }}>{dict.train.infoTitle}</h2>
              <div className="mt-8 overflow-hidden rounded-[3px] border border-hairline">
                <img
                  src={`${basePath}/images/train/micheline-bleue-quai-gare.jpg`}
                  alt="La Micheline bleue à quai, autorail historique de la ligne FCE"
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
            </ScrollReveal>
            <ScrollReveal delay={120}>
              <RecapRows
                rows={[
                  { label: infoLabels.route, value: dict.train.infoItems.route },
                  { label: infoLabels.distance, value: dict.train.infoItems.distance },
                  { label: infoLabels.duration, value: dict.train.infoItems.duration },
                  { label: infoLabels.altitude, value: dict.train.infoItems.altitude },
                  { label: infoLabels.station, value: dict.train.infoItems.station },
                  { label: infoLabels.booking, value: dict.train.infoItems.booking },
                ]}
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ──── #draisine — location privative de la draisine ──── */}
      <section id="draisine" className="scroll-mt-24 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="space-y-6 md:space-y-8">
            <EditorialSplit
              image={`${basePath}/images/train/draisine-fce-embarquement-voyageurs.jpg`}
              imageAlt="Voyageurs embarquant à bord de la draisine privative sur la ligne FCE"
              label={dict.train.draisineLabel}
              title={dict.train.draisineTitle}
              cta={{ href: `${basePath}/${locale}/contact/`, label: dict.train.cta }}
            >
              <p>{dict.train.draisineP}</p>
            </EditorialSplit>

            <EditorialSplit
              reverse
              image={`${basePath}/images/train/train-fce-foret-corridor.jpg`}
              imageAlt="La ligne FCE traversant le corridor de forêt primaire vers Andrambovato"
              label={t.projectLabel ?? "Projet de préservation"}
              title={t.projectTitle ?? "Andrambovato, corridor de forêt primaire"}
            >
              <p>{dict.train.draisineProject}</p>
            </EditorialSplit>
          </div>

          {/* Trajets en location privative */}
          <div className="mt-16 grid gap-10 md:mt-24 md:grid-cols-12 md:gap-16">
            <ScrollReveal className="md:col-span-5">
              <span className="ge-label mb-3">{t.routesLabel ?? "Trajets"}</span>
              <h2 style={{ textWrap: "balance" }}>
                {t.routesTitle ?? "Trois itinéraires au départ de Sahambavy"}
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={120} className="md:col-span-7">
              <RecapRows rows={routeRows} footnote={dict.train.draisineContact} />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ──── CTA final ──── */}
      <section className="border-t border-hairline py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-6 text-center md:px-10">
          <ScrollReveal>
            <h2 style={{ textWrap: "balance" }}>{dict.train.ctaTitle}</h2>
            <p className="mx-auto mt-4 max-w-[52ch] text-[15px] leading-relaxed text-body md:text-base">
              {dict.train.ctaP}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href={`/${locale}/contact/`} className="ge-cta">
                {dict.train.cta}
              </Link>
              <a
                href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
                  loc === "fr"
                    ? "Bonjour, je souhaite réserver le train FCE / une draisine privée depuis le Lac Hôtel."
                    : loc === "en"
                      ? "Hello, I would like to book the FCE train / a private draisine from Lac Hôtel."
                      : "Hola, me gustaría reservar el tren FCE / una dresina privada desde Lac Hôtel."
                )}`}
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
