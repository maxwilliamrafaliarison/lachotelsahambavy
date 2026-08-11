import { getDictionary } from "@/i18n/getDictionary";
import { locales, type Locale, getBasePath } from "@/lib/utils";
import PanoramaHero from "@/components/ui/PanoramaHero";
import EditorialSplit from "@/components/ui/EditorialSplit";
import RecapRows from "@/components/ui/RecapRows";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { extras } from "@/data/rooms";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { restaurantSchema, breadcrumbSchema } from "@/lib/schema-org";
import { buildBreadcrumb } from "@/lib/seo/breadcrumbs";
import { pageAlternates } from "@/lib/seo/alternates";

const basePath = getBasePath();

/* Taux implicite de la carte des tarifs officiels : 70 000 Ar = 14 €,
   40 000 Ar = 8 €, 8 000 Ar = 1,6 €, soit exactement 5 000 Ar/€.
   À noter : ce n'est PAS le taux de la grille d'hébergement du même
   document, qui tourne entre 7 000 et 8 300 Ar/€. On respecte ici le
   chiffre publié pour la restauration plutôt que d'imposer un taux unique. */
const AR_PER_EUR = 5000;
const ar = (v: number) => `${v.toLocaleString("fr-FR")} Ar`;
const eur = (v: number) => `${Math.round(v / AR_PER_EUR)} €`;

/* Textes nouveaux de la refonte : fallbacks locaux en attendant la fusion
   des deltas dictionnaire (scratchpad/dict-deltas/restaurant.json). Si la
   clé existe déjà dans dict.restaurantSection, elle est prioritaire. */
const extraTexts = {
  fr: {
    sourcingP:
      "Nos fruits, légumes et herbes aromatiques viennent du potager de l'hôtel, complétés par les récoltes des agriculteurs du village de Sahambavy.",
    signaturesLabel: "Nos signatures",
    signaturesTitle: "Canard sauvage & tilapia du lac",
    signaturesP:
      "Deux plats racontent Sahambavy mieux que tout : le canard sauvage chassé par Kim, le fondateur, et le tilapia du lac relevé au gingembre frais.",
    breakfastTitle: "Les matins au bord de l'eau",
    breakfastP:
      "Pains, yaourts, fromages, confitures et miel sont faits maison, servis au petit-déjeuner face au lac ou au bord de la piscine.",
    barLabel: "Le bar",
    barTitle: "L'heure dorée sur le lac",
    barP:
      "Jus de fruits frais, cocktails et thé de Sahambavy se savourent au bar ou sur nos terrasses ombragées, quand le soleil descend sur le lac.",
    pricesLabel: "Tarifs",
    pricesTitle: "Nos formules",
    pricesFootnote: "Prix par personne. Montants en euros indicatifs : conversion au taux du jour du paiement.",
    glassBottlesP: "Dans les chambres, elle vous attend en bouteilles de verre.",
  },
  en: {
    sourcingP:
      "Our fruit, vegetables and aromatic herbs come from the hotel's kitchen garden, joined by the harvests of farmers from Sahambavy village.",
    signaturesLabel: "Our signatures",
    signaturesTitle: "Wild duck & lake tilapia",
    signaturesP:
      "Two dishes tell the story of Sahambavy better than any other: wild duck hunted by Kim, our founder, and lake tilapia lifted with fresh ginger.",
    breakfastTitle: "Mornings by the water",
    breakfastP:
      "Breads, yoghurts, cheeses, jams and honey are all made in-house, served at breakfast facing the lake or beside the pool.",
    barLabel: "The bar",
    barTitle: "Golden hour over the lake",
    barP:
      "Fresh fruit juices, cocktails and Sahambavy tea are best enjoyed at the bar or on our shaded terraces, as the sun sinks over the lake.",
    pricesLabel: "Rates",
    pricesTitle: "Our dining options",
    pricesFootnote: "Prices per person. Euro amounts are indicative: conversion at the rate on the day of payment.",
    glassBottlesP: "In the rooms, it awaits you in glass bottles.",
  },
  es: {
    sourcingP:
      "Nuestras frutas, verduras y hierbas aromáticas proceden del huerto del hotel, completadas con las cosechas de los agricultores del pueblo de Sahambavy.",
    signaturesLabel: "Nuestras especialidades",
    signaturesTitle: "Pato salvaje y tilapia del lago",
    signaturesP:
      "Dos platos cuentan Sahambavy mejor que nada: el pato salvaje cazado por Kim, el fundador, y la tilapia del lago realzada con jengibre fresco.",
    breakfastTitle: "Mañanas junto al agua",
    breakfastP:
      "Panes, yogures, quesos, mermeladas y miel son de elaboración propia, servidos en el desayuno frente al lago o junto a la piscina.",
    barLabel: "El bar",
    barTitle: "La hora dorada sobre el lago",
    barP:
      "Zumos de fruta fresca, cócteles y té de Sahambavy se disfrutan en el bar o en nuestras terrazas sombreadas, mientras el sol desciende sobre el lago.",
    pricesLabel: "Tarifas",
    pricesTitle: "Nuestras fórmulas",
    pricesFootnote: "Precios por persona. Importes en euros orientativos: conversión al tipo del día del pago.",
    glassBottlesP: "En las habitaciones, le espera en botellas de vidrio.",
  },
} as const;

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return {
    // Idem hébergements : le gabarit racine appose déjà la marque.
    title: dict.restaurantSection.heroTitle,
    description: dict.restaurantSection.subtitle,
    alternates: pageAlternates(locale as Locale, "restaurant"),
  };
}

export default async function RestaurantPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const loc = locale as Locale;
  const rs = dict.restaurantSection;

  /* Clé du dict si déjà fusionnée, sinon fallback local (même texte). */
  const rsAny = rs as Record<string, unknown>;
  const xt = Object.fromEntries(
    Object.entries(extraTexts[loc]).map(([k, v]) => [
      k,
      typeof rsAny[k] === "string" ? (rsAny[k] as string) : v,
    ]),
  ) as { [K in keyof (typeof extraTexts)["fr"]]: string };

  const priceRows = [
    { label: rs.breakfast, value: `${ar(extras.breakfast.priceAR)} · ${eur(extras.breakfast.priceAR)}` },
    { label: rs.menu, value: `${ar(extras.menu.priceAR)} · ${eur(extras.menu.priceAR)}` },
    { label: rs.picnic, value: `${ar(extras.picnic.priceAR)} · ${eur(extras.picnic.priceAR)}` },
  ];

  return (
    <>
      <JsonLd
        schemas={[
          restaurantSchema(loc),
          breadcrumbSchema(buildBreadcrumb(loc, "restaurant")),
        ]}
      />

      {/* Hero Panorama : façade du restaurant depuis les jardins */}
      <PanoramaHero
        image={`${basePath}/images/restaurant/restaurant-facade.jpg`}
        imageAlt={
          loc === "fr"
            ? "Façade du restaurant panoramique du Lac Hôtel Sahambavy, vue depuis les jardins"
            : loc === "es"
              ? "Fachada del restaurante panorámico del Lac Hôtel Sahambavy vista desde los jardines"
              : "Facade of the Lac Hôtel Sahambavy panoramic restaurant seen from the gardens"
        }
        label={rs.label}
        title={rs.heroTitle}
        kicker={rs.heroSubtitle}
      />

      {/* Déclaration : « Chez nous, la qualité commence à la source » */}
      <section id="philosophie" className="scroll-mt-24 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <ScrollReveal>
            <span className="ge-label mb-4">{dict.philosophy.label}</span>
            <h2 className="max-w-[24ch]" style={{ textWrap: "balance" }}>
              {rs.qualityQuote}
            </h2>
            <div className="ge-measure mt-6 space-y-4 text-[15px] leading-relaxed text-body md:text-base">
              <p>{rs.p2}</p>
              <p>{xt.sourcingP}</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Blocs éditoriaux alternés : cuisine, potager, signatures, petit-déj, bar */}
      <section className="pb-16 md:pb-24">
        <div className="mx-auto max-w-7xl space-y-8 px-6 md:space-y-12 md:px-10">
          <EditorialSplit
            id="cuisine"
            image={`${basePath}/images/restaurant/salle-restaurant-tables-dressees.jpg`}
            imageAlt={
              loc === "fr"
                ? "Salle du restaurant panoramique, tables rondes dressées sous la charpente en bois"
                : loc === "es"
                  ? "Sala del restaurante panorámico, mesas redondas puestas bajo la techumbre de madera"
                  : "The panoramic restaurant dining room, round tables set beneath the timber roof"
            }
            label={rs.label}
            title={rs.title}
          >
            <p>{rs.p1}</p>
          </EditorialSplit>

          <EditorialSplit
            id="potager"
            reverse
            image={`${basePath}/images/restaurant/plat-croustillant-salade-vue-jardin.jpg`}
            imageAlt={
              loc === "fr"
                ? "Plat croustillant et salade fraîche du potager, servis face au jardin"
                : loc === "es"
                  ? "Plato crujiente y ensalada fresca del huerto, servidos frente al jardín"
                  : "Crispy dish and fresh garden salad served overlooking the garden"
            }
            label={rs.herbsLabel}
            title={rs.herbsTitle}
          >
            <p>{rs.herbsIntro}</p>
            <p>{xt.sourcingP}</p>
            <ul className="flex flex-wrap gap-2 pt-1">
              {(rs.herbs as string[]).map((h: string) => (
                <li
                  key={h}
                  className="rounded-full border border-hairline px-3.5 py-1.5 text-[13px] text-body"
                >
                  {h}
                </li>
              ))}
            </ul>
          </EditorialSplit>

          <EditorialSplit
            id="signatures"
            image={`${basePath}/images/restaurant/brochettes-viande-grillee-salade.jpg`}
            imageAlt={
              loc === "fr"
                ? "Brochettes de viande grillée accompagnées de salade fraîche"
                : loc === "es"
                  ? "Brochetas de carne a la parrilla acompañadas de ensalada fresca"
                  : "Grilled meat skewers served with fresh salad"
            }
            label={xt.signaturesLabel}
            title={xt.signaturesTitle}
          >
            <p>{xt.signaturesP}</p>
            <ul className="space-y-2.5 pt-1">
              {(rs.specialties as string[]).map((dish: string) => (
                <li key={dish} className="flex items-start gap-3">
                  <span className="mt-[9px] h-1 w-1 flex-shrink-0 rounded-full bg-terracotta/70" />
                  <span>{dish}</span>
                </li>
              ))}
            </ul>
          </EditorialSplit>

          <EditorialSplit
            id="petit-dejeuner"
            reverse
            image={`${basePath}/images/restaurant/breakfast-poolside.jpg`}
            imageAlt={
              loc === "fr"
                ? "Petit-déjeuner servi au bord de la piscine, face au lac de Sahambavy"
                : loc === "es"
                  ? "Desayuno servido junto a la piscina, frente al lago de Sahambavy"
                  : "Breakfast served beside the pool, overlooking Lake Sahambavy"
            }
            label={rs.philosophyMaison}
            title={xt.breakfastTitle}
            rows={[
              {
                label: rs.breakfast,
                value: `${ar(extras.breakfast.priceAR)} · ${eur(extras.breakfast.priceAR)}`,
              },
            ]}
          >
            <p>{xt.breakfastP}</p>
          </EditorialSplit>

          <EditorialSplit
            id="bar"
            image={`${basePath}/images/restaurant/restaurant-01.jpg`}
            imageAlt={
              loc === "fr"
                ? "Cheminée en pierre et tables dressées du restaurant, à la tombée du soir"
                : loc === "es"
                  ? "Chimenea de piedra y mesas puestas del restaurante, al caer la noche"
                  : "Stone fireplace and set tables in the restaurant at dusk"
            }
            label={xt.barLabel}
            title={xt.barTitle}
          >
            <p>{xt.barP}</p>
          </EditorialSplit>
        </div>
      </section>

      {/* Aperçu tarifs, en filets fins */}
      <section id="tarifs" className="scroll-mt-24 border-y border-hairline bg-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="mx-auto max-w-2xl">
            <ScrollReveal>
              <span className="ge-label mb-3">{xt.pricesLabel}</span>
              <h2 className="mb-8">{xt.pricesTitle}</h2>
              <RecapRows rows={priceRows} footnote={xt.pricesFootnote} />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Bandeau éco-responsable : eau filtrée & bouteilles en verre */}
      <section id="eau-filtree" className="scroll-mt-24 bg-mist-bg py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <ScrollReveal>
            <div className="mx-auto max-w-2xl text-center">
              <span className="ge-label mb-4">{rs.waterRefillLabel}</span>
              <h2 className="mb-5">{rs.waterRefillTitle}</h2>
              <p className="text-[15px] leading-relaxed text-body md:text-base">
                {rs.waterRefillP}
              </p>
              <p className="mt-3 text-[15px] leading-relaxed text-body md:text-base">
                {xt.glassBottlesP}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA final, vers le contact */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <ScrollReveal>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="mb-4">{dict.contact.title}</h2>
              <p className="mb-8 text-[15px] leading-relaxed text-body md:text-base">
                {dict.contact.subtitle}
              </p>
              <Link href={`/${locale}/contact/`} className="ge-cta">
                {dict.rooms.book}
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
