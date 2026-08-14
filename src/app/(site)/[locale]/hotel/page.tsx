import { getDictionary } from "@/i18n/getDictionary";
import { locales, type Locale, getBasePath } from "@/lib/utils";
import PanoramaHero from "@/components/ui/PanoramaHero";
import EditorialSplit from "@/components/ui/EditorialSplit";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { Icon } from "@/components/ui/Icon";
import { alt } from "@/lib/alt";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema-org";
import { buildBreadcrumb } from "@/lib/seo/breadcrumbs";
import { pageAlternates } from "@/lib/seo/alternates";

const basePath = getBasePath();

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return {
    title: dict.hotel.heroTitle,
    description: dict.hotel.heroSubtitle,
    alternates: pageAlternates(locale as Locale, "hotel"),
  };
}

/**
 * Clés en attente de fusion dans les dictionnaires (delta déposé dans
 * scratchpad/dict-deltas/hotel.json). Les fallbacks ci-dessous sont
 * identiques au delta : la page est correcte avant ET après la fusion.
 */
type HotelDictExtras = {
  equipeCta?: string;
  rse?: { threeMenusLabel?: string; threeMenus?: string };
  reserveBand?: { label?: string; title?: string; button?: string };
};

const EXTRAS_FALLBACK: Record<
  Locale,
  {
    equipeCta: string;
    rse: { threeMenusLabel: string; threeMenus: string };
    reserveBand: { label: string; title: string; button: string };
  }
> = {
  fr: {
    equipeCta: "Rencontrer l'équipe",
    rse: {
      threeMenusLabel: "Zéro gaspillage",
      threeMenus:
        "Au restaurant, trois menus seulement par service : une cuisine juste, pensée contre le gaspillage alimentaire et nourrie par le circuit court de Sahambavy.",
    },
    reserveBand: {
      label: "Réservation",
      title: "Écrivez votre chapitre au bord du lac",
      button: "Réserver votre séjour",
    },
  },
  en: {
    equipeCta: "Meet the team",
    rse: {
      threeMenusLabel: "Zero waste",
      threeMenus:
        "In the restaurant, just three menus per service: honest cooking designed to prevent food waste, nourished by Sahambavy's short supply chain.",
    },
    reserveBand: {
      label: "Booking",
      title: "Write your own chapter by the lake",
      button: "Book your stay",
    },
  },
  es: {
    equipeCta: "Conozca al equipo",
    rse: {
      threeMenusLabel: "Cero desperdicio",
      threeMenus:
        "En el restaurante, solo tres menús por servicio: una cocina justa, concebida contra el desperdicio alimentario y abastecida por el circuito corto de Sahambavy.",
    },
    reserveBand: {
      label: "Reservas",
      title: "Escriba su capítulo a orillas del lago",
      button: "Reserve su estancia",
    },
  },
};

export default async function HotelPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const loc = locale as Locale;

  const hotelDict = dict.hotel as typeof dict.hotel & HotelDictExtras;
  const fallback = EXTRAS_FALLBACK[loc];
  const equipeCta = hotelDict.equipeCta ?? fallback.equipeCta;
  const threeMenusLabel = hotelDict.rse?.threeMenusLabel ?? fallback.rse.threeMenusLabel;
  const threeMenus = hotelDict.rse?.threeMenus ?? fallback.rse.threeMenus;
  const reserveBand = {
    label: hotelDict.reserveBand?.label ?? fallback.reserveBand.label,
    title: hotelDict.reserveBand?.title ?? fallback.reserveBand.title,
    button: hotelDict.reserveBand?.button ?? fallback.reserveBand.button,
  };

  const founders = [
    {
      src: `${basePath}/images/founders/maggie-leong.jpg`,
      name: "Maggie Leong",
      alt: alt(
        {
          fr: "Maggie Leong, co-dirigeante du Lac Hôtel",
          en: "Maggie Leong, co-manager of Lac Hôtel",
          es: "Maggie Leong, codirectora del Lac Hôtel",
        },
        loc,
      ),
    },
    {
      src: `${basePath}/images/founders/sergi-formentin.jpg`,
      name: "Sergi Formentin",
      alt: alt(
        {
          fr: "Sergi Formentin, co-dirigeant du Lac Hôtel",
          en: "Sergi Formentin, co-manager of Lac Hôtel",
          es: "Sergi Formentin, codirector del Lac Hôtel",
        },
        loc,
      ),
    },
  ];

  const ecoPillars = dict.hotel.ecoPillars as { icon: string; title: string; desc: string }[];

  return (
    <>
      <JsonLd schemas={[breadcrumbSchema(buildBreadcrumb(loc, "hotel"))]} />

      {/* 1. Hero Panorama : lever de soleil au drone, LE plan d'ensemble du domaine */}
      <PanoramaHero
        image={`${basePath}/images/hero/hero-drone-sunrise.jpg`}
        imageAlt={alt(
          {
            fr: "Le domaine du Lac Hôtel au bord du lac Sahambavy, au lever du soleil, vu du ciel",
            en: "The Lac Hôtel grounds beside Lake Sahambavy at sunrise, seen from the air",
            es: "El recinto del Lac Hôtel junto al lago Sahambavy al amanecer, visto desde el aire",
          },
          loc,
        )}
        label={dict.hero.eyebrow}
        title={dict.hotel.heroTitle}
        kicker={dict.hotel.heroSubtitle}
      />

      {/* 2. Notre philosophie : tourisme responsable, production maison */}
      <section id="philosophie" className="scroll-mt-24 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <EditorialSplit
            as="h2"
            image={`${basePath}/images/hotel/hotel-gardens.jpg`}
            imageAlt={alt(
              {
                fr: "Le bâtiment principal au toit de chaume, dominant les jardins fleuris de l'hôtel",
                en: "The thatched main building overlooking the hotel's flowering gardens",
                es: "El edificio principal con techo de paja, que domina los jardines floridos del hotel",
              },
              loc,
            )}
            label={dict.hotel.philosophyLabel}
            title={dict.hotel.philosophyTitle}
          >
            <p>{dict.hotel.philosophyP1}</p>
            <p>{dict.hotel.philosophyP2}</p>
          </EditorialSplit>

          {/* Les 7 piliers éco-responsables, en grille à filets fins */}
          <div className="mt-10 grid grid-cols-1 gap-px border border-hairline bg-hairline sm:grid-cols-2 md:mt-14 lg:grid-cols-3">
            {ecoPillars.map((pillar, i) => (
              <ScrollReveal key={pillar.icon} delay={i * 60} className="h-full">
                <div className="flex h-full flex-col bg-paper p-6 md:p-8">
                  <span className="mb-5 text-terracotta">
                    <Icon name={pillar.icon} size={28} weight="light" />
                  </span>
                  {/* h3 et non h4 : ces piliers dépendent du h2 « Tourisme
                      responsable », il n'y a pas de niveau intermédiaire. */}
                  <h3 className="mb-2 !text-[1.2rem] !font-normal">{pillar.title}</h3>
                  <p className="text-sm leading-relaxed text-body">{pillar.desc}</p>
                </div>
              </ScrollReveal>
            ))}
            {/* Cellules de complétion : la grille reste pleine à 2 et 3 colonnes */}
            <div aria-hidden className="hidden bg-paper sm:block" />
            <div aria-hidden className="hidden bg-paper lg:block" />
          </div>
        </div>
      </section>

      {/* 3. La petite histoire : de la cabane de retraite au jardin d'Éden */}
      <section id="histoire" className="scroll-mt-24 pb-16 md:pb-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <EditorialSplit
            as="h2"
            image={`${basePath}/images/hero/hero-pilotis.jpg`}
            imageAlt={alt(
              {
                fr: "Allée pavée bordée de bungalows sur pilotis aux toits de chaume, sur le lac Sahambavy",
                en: "Stone walkway lined with thatched overwater bungalows on Lake Sahambavy",
                es: "Camino empedrado entre bungalows sobre pilotes con techo de paja, en el lago Sahambavy",
              },
              loc,
            )}
            label={dict.hotel.historyLabel}
            title={dict.hotel.historyTitle}
            reverse
          >
            <p>{dict.hotel.historyP1}</p>
            <p>{dict.hotel.historyP2}</p>
            {dict.hotel.historyP3 && <p>{dict.hotel.historyP3}</p>}
            {dict.hotel.historyP4 && <p className="font-medium text-ink">{dict.hotel.historyP4}</p>}
          </EditorialSplit>

          {/* Maggie & Sergi, la génération qui poursuit l'aventure */}
          <ScrollReveal className="mx-auto mt-12 max-w-xl md:mt-16">
            <div className="grid grid-cols-2 gap-6 md:gap-8">
              {founders.map((p) => (
                <figure key={p.name}>
                  <div className="overflow-hidden border border-hairline">
                    <img
                      src={p.src}
                      alt={p.alt}
                      loading="lazy"
                      className="aspect-[3/4] w-full object-cover"
                    />
                  </div>
                  <figcaption className="mt-4 text-center">
                    <span className="ge-label">{p.name}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 4. RSE : recrutement local, économie circulaire, engagements concrets */}
      <section id="rse" className="scroll-mt-24 bg-mist-bg py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <ScrollReveal>
            <span className="ge-label mb-3">{dict.hotel.ecoLabel}</span>
            <h2 className="mb-5" style={{ textWrap: "balance" }}>
              {dict.hotel.ecoTitle}
            </h2>
            <p className="ge-measure leading-relaxed text-body">{dict.hotel.ecoP1}</p>
          </ScrollReveal>

          <div className="mt-12 grid gap-12 md:mt-16 md:grid-cols-2 md:gap-14">
            <ScrollReveal>
              <span className="ge-label mb-3">{dict.equipe.economyLabel}</span>
              <h3 className="mb-4" style={{ textWrap: "balance" }}>
                {dict.equipe.economyTitle}
              </h3>
              <p className="text-[15px] leading-relaxed text-body">{dict.equipe.economyP}</p>

              {/* Restauration : trois menus seulement, contre le gaspillage */}
              <div className="mt-9 border-l-2 border-terracotta pl-5 md:pl-6">
                <span className="ge-label mb-2">{threeMenusLabel}</span>
                <p className="text-[15px] leading-relaxed text-body">{threeMenus}</p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={120}>
              <span className="ge-label mb-4">{dict.equipe.rseLabel}</span>
              <ul className="border-t border-hairline">
                {(dict.equipe.rseItems as string[]).map((item, i) => (
                  <li key={i} className="flex items-baseline gap-4 border-b border-hairline py-3.5">
                    <span className="text-xs font-semibold tabular-nums text-terracotta">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[15px] leading-relaxed text-body">{item}</span>
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 5. Teaser équipe + bande réservation */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <EditorialSplit
            image={`${basePath}/images/team/team-staff.jpg`}
            imageAlt={alt(
              {
                fr: "Un jardinier de l'équipe, bêche à la main, dans les jardins de l'hôtel",
                en: "A gardener from the team, spade in hand, in the hotel gardens",
                es: "Un jardinero del equipo, pala en mano, en los jardines del hotel",
              },
              loc,
            )}
            label={dict.equipe.teamLabel}
            title={dict.equipe.introTitle}
            cta={{ href: `${basePath}/${loc}/notre-equipe/`, label: equipeCta }}
          >
            <p>{dict.equipe.introP}</p>
          </EditorialSplit>

          <ScrollReveal className="mt-16 md:mt-24">
            <div className="border-t border-hairline pt-12 text-center md:pt-16">
              <span className="ge-label mb-3">{reserveBand.label}</span>
              <h2 style={{ textWrap: "balance" }}>{reserveBand.title}</h2>
              <a href={`${basePath}/${loc}/contact/`} className="ge-cta mt-8">
                {reserveBand.button}
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
