import EditorialSplit from "@/components/ui/EditorialSplit";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { type Locale, getBasePath } from "@/lib/utils";

const basePath = getBasePath();

/**
 * Teaser destinations, trois EditorialSplit alternés (LE rythme de section
 * du site) : Plantation de thé, Train FCE, Le Repos. Textes de
 * dict.destinations, photos signature de chaque univers.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function DestinationsTeaser({ dict, locale }: { dict: any; locale: Locale }) {
  const items = [
    {
      key: "plantation",
      data: dict.destinations.plantation,
      image: `${basePath}/images/tea/plantation-cinematic.jpg`,
      imageAlt: "Cueilleuses dans la plantation de thé de Sahambavy",
      href: `/${locale}/plantation-de-the/`,
    },
    {
      key: "train",
      data: dict.destinations.train,
      image: `${basePath}/images/train/draisine-fce-embarquement-voyageurs.jpg`,
      imageAlt: "Embarquement des voyageurs sur la draisine de la ligne FCE",
      href: `/${locale}/train-fce/`,
    },
    {
      key: "repos",
      data: dict.destinations.repos,
      image: `${basePath}/images/repos/le-repos-allee-chalets-pins.jpg`,
      imageAlt: "Allée de chalets sous les pins à l'extension Le Repos",
      href: `/${locale}/le-repos/`,
    },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        {/* ─── En-tête de section ────────────────────────────────────── */}
        <div className="mb-12 md:mb-16">
          <ScrollReveal>
            <span className="ge-label mb-4">
              {dict.destinations.sectionLabel ?? "La destination"}
            </span>
            <h2 style={{ textWrap: "balance" }}>
              {dict.destinations.sectionTitle ?? "Trois expériences autour du lac"}
            </h2>
          </ScrollReveal>
        </div>

        {/* ─── 3 blocs éditoriaux alternés ───────────────────────────── */}
        <div className="space-y-8 md:space-y-12">
          {items.map((item, i) => (
            <EditorialSplit
              key={item.key}
              image={item.image}
              imageAlt={item.imageAlt}
              label={item.data.label}
              title={item.data.title}
              reverse={i % 2 === 1}
              cta={{ href: item.href, label: item.data.cta }}
            >
              <p>{item.data.desc}</p>
            </EditorialSplit>
          ))}
        </div>
      </div>
    </section>
  );
}
