import { getDictionary } from "@/i18n/getDictionary";
import { locales, type Locale, getBasePath } from "@/lib/utils";
import PageHero from "@/components/ui/PageHero";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionHeader from "@/components/ui/SectionHeader";
import { siteConfig } from "@/data/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema-org";
import { buildBreadcrumb } from "@/lib/seo/breadcrumbs";
import { Icon } from "@/components/ui/Icon";

const basePath = getBasePath();

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return {
    title: `${dict.hotel.heroTitle} — ${siteConfig.name}`,
    description: dict.hotel.heroSubtitle,
  };
}

const teamPhotos = [
  { src: "/images/team/team-01.jpg", alt: "Membre de l'équipe" },
  { src: "/images/team/team-02.jpg", alt: "Membre de l'équipe" },
  { src: "/images/team/team-03.jpg", alt: "Membre de l'équipe" },
  { src: "/images/team/team-04.jpg", alt: "Membre de l'équipe" },
  { src: "/images/team/team-05.jpg", alt: "Membre de l'équipe" },
  { src: "/images/team/team-06.jpg", alt: "Membre de l'équipe" },
  { src: "/images/team/team-chef.jpg", alt: "Notre chef cuisinier" },
  { src: "/images/team/team-07.jpg", alt: "Membre de l'équipe" },
  { src: "/images/team/team-08.jpg", alt: "Membre de l'équipe" },
  { src: "/images/team/team-09.jpg", alt: "Membre de l'équipe" },
  { src: "/images/team/team-10.jpg", alt: "Membre de l'équipe" },
  { src: "/images/team/team-staff.jpg", alt: "L'équipe du Lac Hôtel" },
];

export default async function HotelPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const loc = locale as Locale;

  return (
    <>
      <JsonLd schemas={[breadcrumbSchema(buildBreadcrumb(loc, "hotel"))]} />
      <PageHero
        title={dict.hotel.heroTitle}
        subtitle={dict.hotel.heroSubtitle}
        image={`${basePath}/images/hotel/hotel-facade.jpg`}
      />

      {/* History */}
      <section className="py-24 bg-white">
        <div className="max-w-[900px] mx-auto px-4">
          <SectionHeader label={dict.hotel.historyLabel} title={dict.hotel.historyTitle} />

          {/* Texte — centré, lecture confortable */}
          <ScrollReveal>
            <div className="space-y-6 text-text-muted leading-relaxed max-w-[720px] mx-auto">
              <p>{dict.hotel.historyP1}</p>
              <p>{dict.hotel.historyP2}</p>
              {dict.hotel.historyP3 && <p>{dict.hotel.historyP3}</p>}
              {dict.hotel.historyP4 && (
                <p className="font-medium text-brown-deep italic">{dict.hotel.historyP4}</p>
              )}
            </div>
          </ScrollReveal>

          {/* Diptyque — Maggie & Sergi côte à côte */}
          <ScrollReveal delay={200}>
            <figure className="mt-14 md:mt-20 grid grid-cols-2 gap-4 sm:gap-6 md:gap-8 max-w-[640px] mx-auto">
              {[
                {
                  src: `${basePath}/images/founders/maggie-leong.jpg`,
                  name: "Maggie Leong",
                  alt:
                    loc === "fr"
                      ? "Maggie Leong, co-dirigeante du Lac Hôtel"
                      : loc === "es"
                      ? "Maggie Leong, codirectora del Lac Hôtel"
                      : "Maggie Leong, co-manager of Lac Hôtel",
                },
                {
                  src: `${basePath}/images/founders/sergi-formentin.jpg`,
                  name: "Sergi Formentin",
                  alt:
                    loc === "fr"
                      ? "Sergi Formentin, co-dirigeant du Lac Hôtel"
                      : loc === "es"
                      ? "Sergi Formentin, codirector del Lac Hôtel"
                      : "Sergi Formentin, co-manager of Lac Hôtel",
                },
              ].map((p) => (
                <div key={p.name} className="group">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-xl shadow-sm ring-1 ring-brown-deep/5">
                    <img
                      src={p.src}
                      alt={p.alt}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                    {/* Fine bordure dorée intérieure — touch "luxe" discret */}
                    <div
                      className="absolute inset-2 rounded-lg pointer-events-none"
                      style={{ border: "1px solid rgba(196, 150, 42, 0.18)" }}
                    />
                  </div>
                  <figcaption className="mt-3 md:mt-4 text-center">
                    <span className="block text-[0.65rem] tracking-[0.25em] uppercase text-gold mb-1">
                      &mdash;
                    </span>
                    <span className="text-sm md:text-base font-[family-name:var(--font-sub)] italic text-brown-deep">
                      {p.name}
                    </span>
                  </figcaption>
                </div>
              ))}
            </figure>
          </ScrollReveal>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-24 bg-cream">
        <div className="max-w-[800px] mx-auto px-4">
          <SectionHeader label={dict.hotel.philosophyLabel} title={dict.hotel.philosophyTitle} />
          <ScrollReveal>
            <div className="space-y-6 text-text-muted leading-relaxed">
              <p>{dict.hotel.philosophyP1}</p>
              <p>{dict.hotel.philosophyP2}</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Eco-responsibility / RSE — cartes liquid-glass avec icône filigrane.
          Le fond subtilement dégradé fait ressortir la translucidité des
          panneaux en verre. Chaque pilier = une icône Phosphor en filigrane
          derrière le texte, un picto net en haut à gauche. */}
      <section className="py-24 relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(180deg, #F8F5F0 0%, #FBFAF6 50%, #F8F5F0 100%)",
          }}
        />
        {/* Subtiles formes décoratives en arrière-plan pour donner du relief */}
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-green-tea/5 blur-3xl -z-10" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-gold/5 blur-3xl -z-10" />

        <div className="max-w-[1200px] mx-auto px-4 relative">
          <SectionHeader label={dict.hotel.ecoLabel} title={dict.hotel.ecoTitle} />

          <ScrollReveal>
            <p className="text-text-muted leading-relaxed mb-14 max-w-[780px] mx-auto text-center">
              {dict.hotel.ecoP1}
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {(dict.hotel.ecoPillars as { icon: string; title: string; desc: string }[]).map(
              (pillar, i) => (
                <ScrollReveal key={pillar.icon} delay={i * 80}>
                  <div className="eco-card h-full p-7 pb-24">
                    {/* Grande icône en filigrane (bottom-right) */}
                    <div className="eco-card__watermark">
                      <Icon name={pillar.icon} size={180} weight="regular" />
                    </div>

                    {/* Picto net top-left */}
                    <div className="eco-card__icon relative mb-5">
                      <div
                        className="inline-flex items-center justify-center w-12 h-12 rounded-2xl"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(74,122,90,0.12) 0%, rgba(196,150,42,0.08) 100%)",
                          boxShadow:
                            "inset 0 1px 0 rgba(255,255,255,0.6), 0 2px 8px rgba(74,122,90,0.08)",
                        }}
                      >
                        <Icon name={pillar.icon} size={24} weight="regular" />
                      </div>
                    </div>

                    {/* Titre + description */}
                    <div className="relative">
                      <h3 className="text-lg font-semibold text-text-dark mb-2 leading-tight">
                        {pillar.title}
                      </h3>
                      <p className="text-text-muted text-sm leading-relaxed">
                        {pillar.desc}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Team Photo Grid */}
      <section className="py-24 bg-cream">
        <div className="max-w-[1200px] mx-auto px-4">
          <SectionHeader
            label={dict.equipe.teamLabel}
            title={dict.equipe.teamTitle}
          />
          <ScrollReveal>
            <p className="text-center text-text-muted leading-relaxed max-w-2xl mx-auto mb-12">
              {dict.equipe.introP}
            </p>
          </ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {teamPhotos.map((photo, i) => (
              <ScrollReveal key={i} delay={i * 50}>
                <div className="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 group">
                  <div
                    className="aspect-square bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                    style={{ backgroundImage: `url(${basePath}${photo.src})` }}
                    role="img"
                    aria-label={photo.alt}
                  />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
