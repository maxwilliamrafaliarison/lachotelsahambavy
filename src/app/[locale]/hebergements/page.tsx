import { getDictionary } from "@/i18n/getDictionary";
import { locales, type Locale, getBasePath } from "@/lib/utils";
import PanoramaHero from "@/components/ui/PanoramaHero";
import EditorialSplit from "@/components/ui/EditorialSplit";
import RecapRows from "@/components/ui/RecapRows";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { Icon } from "@/components/ui/Icon";
import { rooms, extras, type Room } from "@/data/rooms";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { hotelRoomSchema, breadcrumbSchema } from "@/lib/schema-org";
import { buildBreadcrumb } from "@/lib/seo/breadcrumbs";
import { siteConfig } from "@/data/site";

const basePath = getBasePath();

/* Clés de dictionnaire propres à cette page. Les valeurs ci-dessous servent
   de repli tant que le delta (scratchpad/dict-deltas/hebergements.json) n'est
   pas fusionné dans src/i18n/dictionaries — après fusion, dict.rooms.* prime. */
type RoomsPageStrings = {
  nightOnLake: string;
  pilotisTagline: string;
  wagonTagline: string;
  comingSoon: string;
  discoverRepos: string;
  extrasTitle: string;
  currencyNote: string;
  rowRate: string;
  rowBeds: string;
  rowCapacity: string;
  rowUnits: string;
  rowSurface: string;
  rowServices: string;
  persons: string;
  familyLabel: string;
  familyTitle: string;
  familyDesc: string;
  craftTitle: string;
  craftText: string;
  tarzanText: string;
};

const fallbackStrings: Record<Locale, RoomsPageStrings> = {
  fr: {
    nightOnLake: "Nuit sur le lac",
    pilotisTagline: "dormir sur l'eau",
    wagonTagline:
      "Dormir dans un wagon centenaire de la ligne FCE, face au lac — une expérience introuvable ailleurs.",
    comingSoon: "En images prochainement",
    discoverRepos: "Découvrir Le Repos",
    extrasTitle: "Suppléments & services",
    currencyNote: "Taux de référence : 1 € = 4 900 Ar",
    rowRate: "Tarif 2026",
    rowBeds: "Lits",
    rowCapacity: "Capacité",
    rowUnits: "Unités",
    rowSurface: "Surface",
    rowServices: "Prestations",
    persons: "personnes",
    familyLabel: "Extension « Le Repos »",
    familyTitle: "Familles & longs séjours",
    familyDesc:
      "L'extension « Le Repos » compte quatre maisons en duplex entièrement équipées pour les longs séjours : kitchenette avec plaque de cuisson, réfrigérateur et vaisselle complète. L'adresse idéale des familles et des voyageurs qui prennent leur temps.",
    craftTitle: "Le détail artisanal",
    craftText:
      "Portes en bois sculpté, linge brodé à la main, vasques et salles de bains façonnées par des artisans de la région — et, dans chaque salle de bains, des savons bio saponifiés à froid.",
    tarzanText:
      "Perchés dans les arbres du jardin tropical, nos deux bungalows « Tarzan » sont réservés aux enfants — en single ou en double, pour une nuit d'aventure à quelques pas du bungalow des parents.",
  },
  en: {
    nightOnLake: "A night on the lake",
    pilotisTagline: "sleeping on the water",
    wagonTagline:
      "Sleep in a century-old carriage from the FCE railway line, facing the lake — an experience found nowhere else.",
    comingSoon: "Photos coming soon",
    discoverRepos: "Discover Le Repos",
    extrasTitle: "Extras & services",
    currencyNote: "Reference rate: €1 = 4,900 Ar",
    rowRate: "2026 rate",
    rowBeds: "Beds",
    rowCapacity: "Capacity",
    rowUnits: "Units",
    rowSurface: "Size",
    rowServices: "Services",
    persons: "people",
    familyLabel: "“Le Repos” extension",
    familyTitle: "Families & longer stays",
    familyDesc:
      "The “Le Repos” extension offers four duplex houses fully equipped for extended stays: a kitchenette with hob, refrigerator and full crockery. The ideal address for families and travellers taking their time.",
    craftTitle: "Artisan details",
    craftText:
      "Carved wooden doors, hand-embroidered linens, basins and bathrooms shaped by artisans from the region — and, in every bathroom, cold-process organic soaps.",
    tarzanText:
      "Perched in the trees of the tropical garden, our two “Tarzan” bungalows are reserved for children — single or double, for a night of adventure just steps from their parents' bungalow.",
  },
  es: {
    nightOnLake: "Noche en el lago",
    pilotisTagline: "dormir sobre el agua",
    wagonTagline:
      "Dormir en un vagón centenario de la línea FCE, frente al lago — una experiencia que no existe en ningún otro lugar.",
    comingSoon: "Próximamente en imágenes",
    discoverRepos: "Descubrir Le Repos",
    extrasTitle: "Suplementos y servicios",
    currencyNote: "Tipo de cambio de referencia: 1 € = 4900 Ar",
    rowRate: "Tarifa 2026",
    rowBeds: "Camas",
    rowCapacity: "Capacidad",
    rowUnits: "Unidades",
    rowSurface: "Superficie",
    rowServices: "Prestaciones",
    persons: "personas",
    familyLabel: "Extensión «Le Repos»",
    familyTitle: "Familias y estancias largas",
    familyDesc:
      "La extensión «Le Repos» cuenta con cuatro casas dúplex totalmente equipadas para estancias prolongadas: cocina americana con placa de cocción, nevera y vajilla completa. La dirección ideal para familias y viajeros sin prisa.",
    craftTitle: "El detalle artesanal",
    craftText:
      "Puertas de madera tallada, ropa de cama bordada a mano, lavabos y baños creados por artesanos de la región — y, en cada baño, jabones ecológicos de saponificación en frío.",
    tarzanText:
      "Encaramados en los árboles del jardín tropical, nuestros dos bungalows «Tarzán» están reservados a los niños — en single o doble, para una noche de aventura a pocos pasos del bungalow de los padres.",
  },
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return {
    // Le gabarit racine (« %s · Lac Hôtel Sahambavy ») ajoute déjà la marque :
    // l'écrire ici la faisait apparaître deux fois dans le même onglet.
    title: dict.rooms.title,
    description: dict.rooms.subtitle,
  };
}

export default async function HebergementsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const loc = locale as Locale;
  const rx: RoomsPageStrings = {
    ...fallbackStrings[loc],
    ...(dict.rooms as unknown as Partial<RoomsPageStrings>),
  };

  const byId = (id: string): Room => {
    const room = rooms.find((r) => r.id === id);
    if (!room) throw new Error(`Room introuvable : ${id}`);
    return room;
  };
  const pilotis = byId("pilotis");
  const familial = byId("familial");
  const superior = byId("superior");
  const standard = byId("standard");
  const wagon = byId("wagon");
  const arbre = byId("arbre");
  const villaRepos = byId("villa-repos");

  const nf = new Intl.NumberFormat(loc === "en" ? "en-GB" : loc === "es" ? "es-ES" : "fr-FR");
  const ar = (n: number) => `${nf.format(n)} Ar`;
  const eur = (n: number) => (loc === "en" ? `€${n}` : `${n} €`);
  const price = (room: Room) =>
    room.priceEUR ? `${ar(room.priceAR)} · ${eur(room.priceEUR)}` : ar(room.priceAR);

  const paragraphs = (room: Room) =>
    (room.longDescription ? room.longDescription[loc] : room.description[loc])
      .split("\n\n")
      .map((p, i) => <p key={i}>{p}</p>);

  const wagonServices = wagon.amenities
    .filter((a) => ["utensils", "drinks", "flower"].includes(a.icon))
    .map((a) => a.label[loc])
    .join(" · ");

  const contactHref = `${basePath}/${locale}/contact/`;

  const anchors: { href: string; label: string }[] = [
    { href: "#pilotis-nuptial", label: pilotis.name[loc] },
    { href: "#superior-lake-view", label: superior.name[loc] },
    { href: "#bungalow-standard", label: standard.name[loc] },
    { href: "#wagon-nuptial", label: wagon.name[loc] },
    { href: "#bungalow-tarzan", label: arbre.name[loc] },
    { href: "#familles", label: rx.familyTitle },
  ];

  // JSON-LD : ItemList de HotelRoom (un item par type d'hébergement)
  const roomsItemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${siteConfig.url}/${loc}/hebergements/#rooms-list`,
    name: dict.rooms.title,
    numberOfItems: rooms.length,
    itemListElement: rooms.map((room, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: hotelRoomSchema(room, loc),
    })),
  };

  return (
    <>
      <JsonLd
        schemas={[
          roomsItemList,
          breadcrumbSchema(buildBreadcrumb(loc, "hebergements")),
        ]}
      />

      {/* Hero Panorama — le seul h1 de la page */}
      <PanoramaHero
        image={`${basePath}/images/rooms/allee-pierre-bungalows-pilotis.jpg`}
        imageAlt="Allée pavée menant aux bungalows sur pilotis, au-dessus du lac Sahambavy"
        label={dict.rooms.label}
        title={dict.rooms.title}
        kicker={dict.rooms.intro}
      />

      {/* Lead + sommaire ancré */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <ScrollReveal>
            <p className="ge-label mb-3">{dict.rooms.label}</p>
            <h2 className="mb-4" style={{ textWrap: "balance" }}>
              {dict.rooms.tableTitle}
            </h2>
            <p className="ge-measure text-[15px] leading-relaxed text-body md:text-base">
              {dict.rooms.subtitle}
            </p>
            <nav
              aria-label={dict.rooms.title}
              className="mt-8 flex flex-wrap gap-x-7 gap-y-3 border-t border-hairline pt-6 text-sm"
            >
              {anchors.map((a) => (
                <a
                  key={a.href}
                  href={a.href}
                  className="text-terracotta underline decoration-hairline underline-offset-4 transition-colors hover:decoration-lake"
                >
                  {a.label}
                </a>
              ))}
            </nav>
          </ScrollReveal>
        </div>
      </section>

      {/* Pilotis Nuptial — monde « Nuit sur le lac » */}
      <section className="ge-night py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <EditorialSplit
            night
            id="pilotis-nuptial"
            image={`${basePath}/images/rooms/pilotis-crepuscule-rose-lac.jpg`}
            imageAlt="Les bungalows sur pilotis se reflétant dans le lac Sahambavy au crépuscule"
            label={rx.nightOnLake}
            title={
              <>
                {pilotis.name[loc]} — <em>{rx.pilotisTagline}</em>
              </>
            }
            rows={[
              { label: rx.rowRate, value: price(pilotis) },
              { label: rx.rowBeds, value: pilotis.type[loc] },
              { label: rx.rowUnits, value: String(pilotis.units) },
              {
                label: familial.name[loc],
                value: `${price(familial)} · ${familial.capacity} ${rx.persons}`,
              },
            ]}
            cta={{ href: contactHref, label: dict.rooms.book }}
          >
            {paragraphs(pilotis)}
          </EditorialSplit>
        </div>
      </section>

      {/* Superior Lake View */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <EditorialSplit
            reverse
            id="superior-lake-view"
            image={`${basePath}/images/gallery/gallery-lake-view-interior.jpg`}
            imageAlt="Superior Lake View Room : baie vitrée grand angle ouverte sur le lac et les bambous"
            label={superior.type[loc]}
            title={superior.name[loc]}
            rows={[
              { label: rx.rowRate, value: price(superior) },
              { label: rx.rowCapacity, value: `${superior.capacity} ${rx.persons}` },
              { label: rx.rowSurface, value: superior.surface ?? "—" },
              { label: rx.rowUnits, value: String(superior.units) },
            ]}
            cta={{ href: contactHref, label: dict.rooms.book }}
          >
            {paragraphs(superior)}
          </EditorialSplit>
        </div>
      </section>

      {/* Bungalow Standard */}
      <section className="pb-16 md:pb-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <EditorialSplit
            id="bungalow-standard"
            image={`${basePath}/images/rooms/bungalows-colores-annexe.jpg`}
            imageAlt="Bungalows standard aux façades colorées, dans les jardins paysagers du Lac Hôtel"
            label={standard.type[loc]}
            title={standard.name[loc]}
            rows={[
              { label: rx.rowRate, value: price(standard) },
              { label: rx.rowBeds, value: standard.type[loc] },
              { label: rx.rowSurface, value: standard.surface ?? "—" },
              { label: rx.rowUnits, value: String(standard.units) },
            ]}
            cta={{ href: contactHref, label: dict.rooms.book }}
          >
            {paragraphs(standard)}
          </EditorialSplit>
        </div>
      </section>

      {/* Bande « détail artisanal » */}
      <section className="bg-mist-bg py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <ScrollReveal>
            <p className="ge-label mb-3">{rx.craftTitle}</p>
            <p className="ge-measure mb-10 text-[15px] leading-relaxed text-body md:text-base">
              {rx.craftText}
            </p>
          </ScrollReveal>
          <div className="grid gap-4 md:grid-cols-3 md:gap-6">
            {[
              {
                src: "/images/rooms/porte-bois-sculpte-heurtoir-lion.jpg",
                alt: "Porte en bois sculpté à heurtoir de lion, artisanat malgache",
              },
              {
                src: "/images/rooms/salle-de-bain-pilotis-double-vasque.jpg",
                alt: "Salle de bains du Pilotis Nuptial avec double vasque artisanale",
              },
              {
                src: "/images/rooms/meridienne-mur-ocre-detail-deco.jpg",
                alt: "Méridienne devant un mur ocre, détail de décoration d'une chambre",
              },
            ].map((img, i) => (
              <ScrollReveal key={img.src} delay={i * 90}>
                <div className="overflow-hidden rounded-[3px] border border-hairline">
                  <img
                    src={`${basePath}${img.src}`}
                    alt={img.alt}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover"
                  />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Wagon Nuptial — monde « Nuit sur le lac » */}
      <section className="ge-night py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <EditorialSplit
            night
            reverse
            id="wagon-nuptial"
            image={`${basePath}/images/rooms/wagon-exterior.jpg`}
            imageAlt="Wagon Nuptial 1930 de la ligne FCE posé face au lac Sahambavy"
            label={rx.nightOnLake}
            title={wagon.name[loc]}
            rows={[
              { label: rx.rowRate, value: price(wagon) },
              { label: rx.rowCapacity, value: `${wagon.capacity} ${rx.persons}` },
              { label: rx.rowServices, value: wagonServices },
              { label: rx.rowUnits, value: String(wagon.units) },
            ]}
            cta={{ href: contactHref, label: dict.rooms.book }}
          >
            <p>
              <em>{rx.wagonTagline}</em>
            </p>
            {paragraphs(wagon)}
          </EditorialSplit>
        </div>
      </section>

      {/* Bungalow Tarzan sur arbre */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <EditorialSplit
            id="bungalow-tarzan"
            reverse
            image={`${basePath}/images/rooms/bungalow-tarzan-cabane-arbre.jpg`}
            imageAlt="Bungalow Tarzan : cabane en bois sculpté perchée dans les arbres du jardin tropical, avec escalier en colimaçon"
            label={arbre.type[loc]}
            title={arbre.name[loc]}
            rows={[
              { label: rx.rowRate, value: price(arbre) },
              { label: rx.rowCapacity, value: `${arbre.capacity} ${rx.persons}` },
              { label: rx.rowUnits, value: String(arbre.units) },
            ]}
          >
            <p>{arbre.description[loc]}</p>
            <p>{rx.tarzanText}</p>
          </EditorialSplit>
        </div>
      </section>

      {/* Familles & longs séjours — extension Le Repos */}
      <section className="pb-16 md:pb-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <EditorialSplit
            id="familles"
            image={`${basePath}/images/rooms/le-repos-exterior.jpg`}
            imageAlt="Maisons en duplex de l'extension Le Repos, entourées de verdure"
            label={rx.familyLabel}
            title={rx.familyTitle}
            rows={[
              { label: rx.rowRate, value: price(villaRepos) },
              {
                label: rx.rowCapacity,
                value: villaRepos.amenities[2]?.label[loc] ?? `${villaRepos.capacity} ${rx.persons}`,
              },
              { label: rx.rowUnits, value: String(villaRepos.units) },
            ]}
            cta={{ href: `${basePath}/${locale}/le-repos/`, label: rx.discoverRepos }}
          >
            <p>{rx.familyDesc}</p>
            <p>{villaRepos.description[loc]}</p>
          </EditorialSplit>
        </div>
      </section>

      {/* Camping + suppléments */}
      <section className="bg-mist-bg py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="grid gap-12 md:grid-cols-2 md:gap-16">
            <ScrollReveal>
              <div className="mb-4">
                <Icon name="camping" size={32} weight="regular" className="text-terracotta" />
              </div>
              <h2 className="mb-4" style={{ textWrap: "balance" }}>
                {dict.rooms.camping}
              </h2>
              <p className="ge-measure mb-6 text-[15px] leading-relaxed text-body">
                {dict.rooms.campingDesc}
              </p>
              <RecapRows
                rows={[
                  {
                    label: extras.camping.label[loc],
                    value: `${ar(extras.camping.priceAR)} ${dict.rooms.night}`,
                  },
                ]}
              />
            </ScrollReveal>
            <ScrollReveal delay={120}>
              <RecapRows
                title={rx.extrasTitle}
                rows={[
                  { label: extras.taxeSejour.label[loc], value: `${ar(extras.taxeSejour.priceAR)} · ${eur(1)}` },
                  { label: extras.breakfast.label[loc], value: `${ar(extras.breakfast.priceAR)} · ${eur(8)}` },
                  { label: extras.menu.label[loc], value: `${ar(extras.menu.priceAR)} · ${eur(14)}` },
                  { label: extras.picnic.label[loc], value: ar(extras.picnic.priceAR) },
                  { label: extras.extraBed.label[loc], value: ar(extras.extraBed.priceAR) },
                  { label: extras.transfer.label[loc], value: `${ar(extras.transfer.priceAR)} · ${eur(25)}` },
                ]}
                footnote={`${dict.rooms.taxeSejour} · ${rx.currencyNote}`}
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-2xl px-6 text-center md:px-10">
          <ScrollReveal>
            <h2 className="mb-4" style={{ textWrap: "balance" }}>
              {dict.contact.title}
            </h2>
            <p className="mb-8 text-[15px] leading-relaxed text-body">{dict.contact.subtitle}</p>
            <Link href={`/${locale}/contact/`} className="ge-cta">
              {dict.rooms.book}
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
