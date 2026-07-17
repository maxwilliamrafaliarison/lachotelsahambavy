import { getDictionary } from "@/i18n/getDictionary";
import { locales, type Locale, getBasePath } from "@/lib/utils";
import PanoramaHero from "@/components/ui/PanoramaHero";
import EditorialSplit from "@/components/ui/EditorialSplit";
import RecapRows from "@/components/ui/RecapRows";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { siteConfig } from "@/data/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema-org";

const basePath = getBasePath();

/* ── Textes FR par défaut — remplacés par le dictionnaire dès fusion des
      deltas (dict-deltas/localisation.json). Garantit un rendu complet même
      avant la fusion. Source : Maggie, « CONTACTEZ NOUS LOCALISATION ». ── */
const FR = {
  heroLabel: "Venir au Lac Hôtel",
  heroTitle: "Localisation & accès",
  heroSubtitle:
    "Au bord du lac de Sahambavy, entre rizières et plantations de thé — à 40 minutes de Fianarantsoa et à 2 minutes de la gare.",
  heroAlt: "Vue aérienne des rizières en terrasses et du lac de Sahambavy",
  metaTitle: "Localisation & accès",
  metaDescription:
    "Comment venir au Lac Hôtel Sahambavy : à 2 minutes de la gare (ligne Fianarantsoa–Manakara), à 40 minutes de Fianarantsoa par la route via la RN7, navette de l'hôtel et transfert privé 4x4 sur demande.",
  introLabel: "Comment venir",
  introTitle: "Deux façons de nous rejoindre",
  introP:
    "Par le rail ou par la route, le chemin vers Sahambavy fait déjà partie du voyage : collines de thé, rizières en terrasses et villages betsileo accompagnent votre arrivée au bord du lac.",
  train: {
    label: "Par le train",
    title: "À 2 minutes de la gare de Sahambavy",
    p1: "Le Lac Hôtel se trouve à 2 minutes de la gare de Sahambavy, sur la mythique ligne Fianarantsoa–Manakara (FCE).",
    p2: "Descendez sur le quai : l'hôtel vous attend au bord du lac, à quelques pas seulement. Une arrivée comme autrefois, au rythme du train des hautes terres.",
    alt: "La micheline bleue à quai en gare de Sahambavy",
  },
  route: {
    label: "Par la route",
    title: "À 40 minutes de Fianarantsoa",
    p1: "L'hôtel est à 40 minutes du centre-ville de Fianarantsoa. Depuis Tananarive, suivez la RN7 puis bifurquez à gauche au village d'Ambalakely (station Shell) : la route vous mène directement à Sahambavy.",
    p2: "Une navette payante de l'hôtel est disponible, ainsi qu'un transfert privé en 4x4 entre le Lac Hôtel et Fianarantsoa (120 000 Ar · 25 €).",
    alt: "Vue aérienne du Lac Hôtel et de son écrin de verdure au bord du lac",
    cta: "Organiser mon transfert",
  },
  recap: {
    label: "Aperçu",
    title: "L'accès en un coup d'œil",
    rows: [
      { label: "Gare de Sahambavy", value: "À 2 minutes de l'hôtel" },
      { label: "Ligne ferroviaire", value: "Fianarantsoa–Manakara (FCE)" },
      { label: "Fianarantsoa (centre-ville)", value: "À 40 minutes par la route" },
      { label: "Depuis Tananarive", value: "RN7, bifurcation à gauche à Ambalakely (station Shell)" },
      { label: "Navette de l'hôtel", value: "Payante, sur demande" },
      { label: "Transfert privé 4x4 Lac Hôtel / Fianarantsoa", value: "120 000 Ar · 25 €" },
    ],
    footnote: "Contactez la réception pour organiser votre navette ou votre transfert.",
  },
  map: {
    title: "Nous trouver",
    iframeTitle: "Carte — Lac Hôtel Sahambavy, Madagascar",
    openLink: "Ouvrir dans Google Maps",
  },
  ctaTitle: "Besoin d'aide pour organiser votre trajet ?",
  cta: "Contactez-nous",
};

const BREADCRUMB_HOME: Record<Locale, string> = {
  fr: "Accueil",
  en: "Home",
  es: "Inicio",
};

const BREADCRUMB_PAGE: Record<Locale, string> = {
  fr: "Localisation",
  en: "Location",
  es: "Ubicación",
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/* eslint-disable @typescript-eslint/no-explicit-any */

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const ld = (dict as any).localisation ?? {};
  return {
    title: `${ld.metaTitle ?? FR.metaTitle} — ${siteConfig.name}`,
    description: ld.metaDescription ?? FR.metaDescription,
  };
}

export default async function LocalisationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const loc = locale as Locale;

  const ld = (dict as any).localisation ?? {};
  const t: typeof FR = {
    ...FR,
    ...ld,
    train: { ...FR.train, ...(ld.train ?? {}) },
    route: { ...FR.route, ...(ld.route ?? {}) },
    recap: { ...FR.recap, ...(ld.recap ?? {}) },
    map: { ...FR.map, ...(ld.map ?? {}) },
  };

  const contactHref = `${basePath}/${loc}/contact/`;

  const crumbs = [
    { name: BREADCRUMB_HOME[loc], url: `${siteConfig.url}/${loc}/` },
    { name: BREADCRUMB_PAGE[loc], url: `${siteConfig.url}/${loc}/localisation/` },
  ];

  return (
    <>
      <JsonLd schemas={[breadcrumbSchema(crumbs)]} />

      <PanoramaHero
        image={`${basePath}/images/village/rizieres-sahambavy-vue-aerienne.jpg`}
        imageAlt={t.heroAlt}
        label={t.heroLabel}
        title={t.heroTitle}
        kicker={t.heroSubtitle}
      />

      {/* ──── #acces — train & route ──── */}
      <section id="acces" className="scroll-mt-24 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <ScrollReveal>
            <span className="ge-label mb-3">{t.introLabel}</span>
            <h2 className="mb-6" style={{ textWrap: "balance" }}>
              {t.introTitle}
            </h2>
            <p className="ge-measure text-[15px] leading-relaxed text-body md:text-base">
              {t.introP}
            </p>
          </ScrollReveal>

          <div className="mt-12 flex flex-col gap-10 md:mt-16 md:gap-14">
            <EditorialSplit
              id="train"
              image={`${basePath}/images/train/micheline-bleue-quai-gare.jpg`}
              imageAlt={t.train.alt}
              label={t.train.label}
              title={t.train.title}
            >
              <p>{t.train.p1}</p>
              <p>{t.train.p2}</p>
            </EditorialSplit>

            <EditorialSplit
              id="route"
              image={`${basePath}/images/hotel/hotel-aerial-overview.jpg`}
              imageAlt={t.route.alt}
              label={t.route.label}
              title={t.route.title}
              cta={{ href: contactHref, label: t.route.cta }}
              reverse
            >
              <p>{t.route.p1}</p>
              <p>{t.route.p2}</p>
            </EditorialSplit>
          </div>
        </div>
      </section>

      {/* ──── #carte — récapitulatif accès + carte ──── */}
      <section id="carte" className="scroll-mt-24 border-y border-hairline bg-mist-bg py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
            <ScrollReveal>
              <span className="ge-label mb-3">{t.recap.label}</span>
              <h2 className="mb-8" style={{ textWrap: "balance" }}>
                {t.recap.title}
              </h2>
              <RecapRows rows={t.recap.rows} footnote={t.recap.footnote} />
            </ScrollReveal>

            <ScrollReveal delay={120}>
              <div className="overflow-hidden rounded-[3px] border border-hairline bg-white">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3774.5!2d47.25!3d-21.0667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sSahambavy!5e0!3m2!1sfr!2smg!4v1"
                  width="100%"
                  height="450"
                  style={{ border: 0, display: "block" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={t.map.iframeTitle}
                />
              </div>
              <div className="mt-4 flex items-center justify-between gap-4">
                <p className="text-xs text-muted">{siteConfig.address}</p>
                <a
                  href={siteConfig.social.google}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold uppercase tracking-[0.18em] text-tea hover:underline"
                >
                  {t.map.openLink}
                </a>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ──── CTA final ──── */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 text-center md:px-10">
          <ScrollReveal>
            <h2 className="mb-8" style={{ textWrap: "balance" }}>
              {t.ctaTitle}
            </h2>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a href={contactHref} className="ge-cta">
                {t.cta}
              </a>
              <a
                href={`https://wa.me/${siteConfig.whatsapp.replace(/^\+/, "")}?text=${encodeURIComponent(dict.whatsappMessage ?? "")}`}
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
