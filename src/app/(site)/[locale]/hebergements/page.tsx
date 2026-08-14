import { getDictionary } from "@/i18n/getDictionary";
import { locales, type Locale, getBasePath } from "@/lib/utils";
import PanoramaHero from "@/components/ui/PanoramaHero";
import EditorialSplit from "@/components/ui/EditorialSplit";
import RoomGallery from "@/components/rooms/RoomGallery";
import RecapRows from "@/components/ui/RecapRows";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { Icon } from "@/components/ui/Icon";
import { rooms, roomsAffichees, extras, type Room } from "@/data/rooms";
import { alt, type TexteAlternatif } from "@/lib/alt";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { hotelRoomSchema, breadcrumbSchema } from "@/lib/schema-org";
import { buildBreadcrumb } from "@/lib/seo/breadcrumbs";
import { pageAlternates } from "@/lib/seo/alternates";
import { siteConfig } from "@/data/site";

const basePath = getBasePath();

/* Clés de dictionnaire propres à cette page. Les valeurs ci-dessous servent
   de repli tant que le delta (scratchpad/dict-deltas/hebergements.json) n'est
   pas fusionné dans src/i18n/dictionaries. Après fusion, dict.rooms.* prime. */
type RoomsPageStrings = {
  nightOnLake: string;
  pilotisTagline: string;
  wagonTagline: string;
  comingSoon: string;
  galPrev: string;
  galNext: string;
  galOf: string;
  discoverRepos: string;
  extrasTitle: string;
  restaurationTitle: string;
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
      "Dormir dans un wagon centenaire de la ligne FCE, face au lac. Une expérience introuvable ailleurs.",
    comingSoon: "En images prochainement",
    galPrev: "Photo précédente",
    galNext: "Photo suivante",
    galOf: "photo {n}",
    discoverRepos: "Découvrir Le Repos",
    extrasTitle: "Suppléments & services",
    restaurationTitle: "Restauration",
    currencyNote:
      "Tarifs publics en ariary, vignette touristique en sus. Les montants en euros sont donnés à titre indicatif : la conversion s’applique au taux en vigueur le jour du paiement.",
    rowRate: "Tarif",
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
      "Portes en bois sculpté, linge brodé à la main, vasques et salles de bains façonnées par des artisans de la région. Dans chaque salle de bains, des savons bio saponifiés à froid.",
    tarzanText:
      "Perchés dans les arbres du jardin tropical, nos deux bungalows « Tarzan » sont réservés aux enfants, en single ou en double, pour une nuit d'aventure à quelques pas du bungalow des parents.",
  },
  en: {
    nightOnLake: "A night on the lake",
    pilotisTagline: "sleeping on the water",
    wagonTagline:
      "Sleep in a century-old carriage from the FCE railway line, facing the lake. An experience found nowhere else.",
    comingSoon: "Photos coming soon",
    galPrev: "Previous photo",
    galNext: "Next photo",
    galOf: "photo {n}",
    discoverRepos: "Discover Le Repos",
    extrasTitle: "Extras & services",
    restaurationTitle: "Dining",
    currencyNote:
      "Public rates in ariary, tourist levy not included. Euro amounts are indicative only: conversion applies at the rate in force on the day of payment.",
    rowRate: "Rate",
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
      "Carved wooden doors, hand-embroidered linens, basins and bathrooms shaped by artisans from the region. In every bathroom, cold-process organic soaps.",
    tarzanText:
      "Perched in the trees of the tropical garden, our two “Tarzan” bungalows are reserved for children. Single or double, they offer a night of adventure just steps from their parents' bungalow.",
  },
  es: {
    nightOnLake: "Noche en el lago",
    pilotisTagline: "dormir sobre el agua",
    wagonTagline:
      "Dormir en un vagón centenario de la línea FCE, frente al lago. Una experiencia que no existe en ningún otro lugar.",
    comingSoon: "Próximamente en imágenes",
    galPrev: "Foto anterior",
    galNext: "Foto siguiente",
    galOf: "foto {n}",
    discoverRepos: "Descubrir Le Repos",
    extrasTitle: "Suplementos y servicios",
    restaurationTitle: "Restauración",
    currencyNote:
      "Tarifas públicas en ariary, tasa turística no incluida. Los importes en euros son orientativos: la conversión se aplica al tipo vigente el día del pago.",
    rowRate: "Tarifa",
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
      "Puertas de madera tallada, ropa de cama bordada a mano, lavabos y baños creados por artesanos de la región. En cada baño, jabones ecológicos de saponificación en frío.",
    tarzanText:
      "Encaramados en los árboles del jardín tropical, nuestros dos bungalows «Tarzán» están reservados a los niños, en single o doble, para una noche de aventura a pocos pasos del bungalow de los padres.",
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
    alternates: pageAlternates(locale as Locale, "hebergements"),
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

  /**
   * Galerie d'une chambre, façon « Types de chambre » de Radisson Blu : le
   * visiteur voit d'emblée combien de vues l'attendent et feuillette sur
   * place. Une seule photo par hébergement n'en donnait aucune idée.
   *
   * `prioritaire` n'est vrai que pour la première chambre de la page : au
   * -delà, les galeries se chargent paresseusement.
   */
  const galerie = (room: Room, prioritaire = false) => (
    <RoomGallery
      images={room.images.map((src) => `${basePath}${src}`)}
      nom={room.name[loc]}
      prioritaire={prioritaire}
      remplir
      libelles={{ precedent: rx.galPrev, suivant: rx.galNext, sur: rx.galOf }}
    />
  );

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

  /* Les hébergements présentés par la page, dans l'ordre où ils y figurent.
     Chaque section porte `room.slug` comme id : faute de route de détail,
     c'est cette ancre que le JSON-LD publie en `url` et en `@id` (cf.
     hotelRoomSchema) et que le méga-menu de src/data/site.ts vise. Une seule
     source, donc, pour le sommaire, les id de sections et le balisage.

     Publier un hébergement sans lui donner de section reviendrait à baliser
     une ancre qui n'existe pas, exactement l'incohérence que la page vient
     de corriger. Le cas se posera le jour où la Lake Suite recevra son
     `groupe` (cf. src/data/rooms.ts) : mieux vaut casser le build que servir
     des données structurées fausses sur les trois locales. */
  const sections: { room: Room; label: string }[] = [
    { room: pilotis, label: pilotis.name[loc] },
    { room: superior, label: superior.name[loc] },
    { room: standard, label: standard.name[loc] },
    { room: wagon, label: wagon.name[loc] },
    { room: arbre, label: arbre.name[loc] },
    { room: villaRepos, label: rx.familyTitle },
  ];

  const sansSection = roomsAffichees.filter((r) => !sections.some((s) => s.room.id === r.id));
  if (sansSection.length > 0) {
    throw new Error(
      `Hébergements publiés sans section sur /hebergements : ${sansSection
        .map((r) => r.id)
        .join(", ")}. Le JSON-LD pointerait sur une ancre inexistante.`,
    );
  }

  const anchors = sections.map((s) => ({ href: `#${s.room.slug}`, label: s.label }));

  /* JSON-LD : ItemList de HotelRoom (un item par type d'hébergement).
     Bâtie sur `roomsAffichees` et NON sur `rooms` : ce dernier contient les
     catégories non publiées. La Lake Suite y était servie avec son tarif
     2027 (420 000 Ar, availability InStock) sur les trois locales, dans le
     format même que Google reprend en résultat enrichi, alors que la
     direction a décidé de publier la grille 2026. On ne balise que ce que
     la page montre. */
  const roomsItemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${siteConfig.url}/${loc}/hebergements/#rooms-list`,
    name: dict.rooms.title,
    numberOfItems: roomsAffichees.length,
    itemListElement: roomsAffichees.map((room, index) => ({
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

      {/* Hero Panorama, le seul h1 de la page */}
      <PanoramaHero
        image={`${basePath}/images/rooms/allee-pierre-bungalows-pilotis.jpg`}
        imageAlt={alt(
          {
            fr: "Allée pavée menant aux bungalows sur pilotis, au-dessus du lac Sahambavy",
            en: "Stone causeway leading to the overwater bungalows above Lake Sahambavy",
            es: "Camino empedrado que se adentra en el lago Sahambavy hacia los bungalows sobre pilotes",
          },
          loc,
        )}
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
                  className="text-ink underline decoration-lake/50 underline-offset-4 transition-colors hover:decoration-lake"
                >
                  {a.label}
                </a>
              ))}
            </nav>
          </ScrollReveal>
        </div>
      </section>

      {/* Pilotis Nuptial : monde « Nuit sur le lac » */}
      <section className="ge-night py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <EditorialSplit
            night
            id={pilotis.slug}
            media={galerie(pilotis, true)}
            image={`${basePath}/images/rooms/pilotis-crepuscule-rose-lac.jpg`}
            imageAlt={alt(
              {
                fr: "Les bungalows sur pilotis se reflétant dans le lac Sahambavy au crépuscule",
                en: "The overwater bungalows mirrored in Lake Sahambavy at dusk",
                es: "Los bungalows sobre pilotes reflejados en el lago Sahambavy al anochecer",
              },
              loc,
            )}
            label={rx.nightOnLake}
            title={
              <>
                {pilotis.name[loc]}, <em>{rx.pilotisTagline}</em>
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
            id={superior.slug}
            media={galerie(superior)}
            image={`${basePath}/images/gallery/gallery-lake-view-interior.jpg`}
            imageAlt={alt(
              {
                fr: "Superior Lake View Room : baie vitrée grand angle ouverte sur le lac et les bambous",
                en: "Superior Lake View Room: wide picture window opening onto bamboo and the lake beyond",
                es: "Habitación Superior Vista al Lago: gran ventanal abierto al lago y a los bambúes",
              },
              loc,
            )}
            label={superior.type[loc]}
            title={superior.name[loc]}
            rows={[
              { label: rx.rowRate, value: price(superior) },
              { label: rx.rowCapacity, value: `${superior.capacity} ${rx.persons}` },
              { label: rx.rowSurface, value: superior.surface ?? "n/c" },
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
            id={standard.slug}
            media={galerie(standard)}
            image={`${basePath}/images/rooms/bungalows-colores-annexe.jpg`}
            imageAlt={alt(
              {
                fr: "Bungalows standard aux façades colorées, dans les jardins paysagers du Lac Hôtel",
                en: "Standard Bungalows with brightly coloured façades in the landscaped gardens",
                es: "Bungalows Estándar de fachadas de colores en los jardines del Lac Hôtel",
              },
              loc,
            )}
            label={standard.type[loc]}
            title={standard.name[loc]}
            rows={[
              { label: rx.rowRate, value: price(standard) },
              { label: rx.rowBeds, value: standard.type[loc] },
              { label: rx.rowSurface, value: standard.surface ?? "n/c" },
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
            {([
              {
                src: "/images/rooms/porte-bois-sculpte-heurtoir-lion.jpg",
                alt: {
                  fr: "Porte en bois sculpté à heurtoir de lion, artisanat malgache",
                  en: "Carved wooden door with a brass lion-head knocker, Malagasy craftsmanship",
                  es: "Puerta de madera tallada con aldaba de cabeza de león, artesanía malgache",
                },
              },
              {
                src: "/images/rooms/salle-de-bain-pilotis-double-vasque.jpg",
                alt: {
                  fr: "Salle de bains du Pilotis Nuptial : double vasque posée sur un pied en racine",
                  en: "Honeymoon Overwater Bungalow bathroom: twin basins on a tree-root stand",
                  es: "Baño del Bungalow Nupcial sobre Pilotes: doble lavabo sobre un pie de raíz de árbol",
                },
              },
              {
                src: "/images/rooms/meridienne-mur-ocre-detail-deco.jpg",
                alt: {
                  fr: "Méridienne au bois sculpté devant un mur ocre, dans une chambre",
                  en: "Carved chaise longue set against an ochre wall in a guest room",
                  es: "Meridiana de madera tallada ante una pared ocre, en una habitación",
                },
              },
            ] satisfies { src: string; alt: TexteAlternatif }[]).map((img, i) => (
              <ScrollReveal key={img.src} delay={i * 90}>
                <div className="overflow-hidden rounded-[3px] border border-hairline">
                  <img
                    src={`${basePath}${img.src}`}
                    alt={alt(img.alt, loc)}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover"
                  />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Wagon Nuptial : monde « Nuit sur le lac » */}
      <section className="ge-night py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <EditorialSplit
            night
            reverse
            id={wagon.slug}
            media={galerie(wagon)}
            image={`${basePath}/images/rooms/wagon-exterior.jpg`}
            imageAlt={alt(
              {
                fr: "Wagon Nuptial 1930, voiture verte et blanche posée sur ses rails dans le jardin fleuri",
                en: "1930 Honeymoon Wagon, a green and white carriage on its rails in the flowered garden",
                es: "Vagón Nupcial 1930, coche verde y blanco sobre sus raíles en el jardín florido",
              },
              loc,
            )}
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
            id={arbre.slug}
            media={galerie(arbre)}
            reverse
            image={`${basePath}/images/rooms/bungalow-tarzan-cabane-arbre.jpg`}
            imageAlt={alt(
              {
                fr: "Bungalow Tarzan sur Arbre : cabane en bois sculpté perchée au-dessus du jardin tropical",
                en: "Tarzan Treehouse Bungalow: a carved wooden cabin perched above the tropical garden",
                es: "Bungalow Tarzán en el Árbol: cabaña de madera tallada sobre el jardín tropical",
              },
              loc,
            )}
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

      {/* Familles & longs séjours : extension Le Repos */}
      <section className="pb-16 md:pb-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <EditorialSplit
            id={villaRepos.slug}
            media={galerie(villaRepos)}
            image={`${basePath}/images/rooms/le-repos-exterior.jpg`}
            imageAlt={alt(
              {
                fr: "Maisons de l'extension Le Repos, façades ocre et toits verts, parmi les pins",
                en: "Houses at the Le Repos extension, ochre façades and green roofs among the pines",
                es: "Casas de la extensión Le Repos, fachadas ocres y tejados verdes entre los pinos",
              },
              loc,
            )}
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
            {/* Restauration et services connexes, repris de la grille
                officielle 2027. Les euros affichés sont ceux que le
                document publie. Ils ne sont pas recalculés : `eur()` ne
                fait que mettre en forme. Là où la grille ne donne pas
                d'équivalent (transferts, salle, draisine), on n'en invente
                pas et l'ariary reste seul. */}
            <ScrollReveal delay={120}>
              <RecapRows
                title={rx.restaurationTitle}
                rows={[
                  { label: extras.breakfast.label[loc], value: `${ar(extras.breakfast.priceAR)} · ${eur(8)}` },
                  { label: extras.menu.label[loc], value: `${ar(extras.menu.priceAR)} · ${eur(14)}` },
                  { label: extras.picnic.label[loc], value: `${ar(extras.picnic.priceAR)} · ${eur(8)}` },
                  { label: extras.repasGuide.label[loc], value: `${ar(extras.repasGuide.priceAR)} · ${eur(1.6)}` },
                ]}
              />
              <RecapRows
                className="mt-10"
                title={rx.extrasTitle}
                rows={[
                  { label: extras.taxeSejour.label[loc], value: `${ar(extras.taxeSejour.priceAR)} · ${eur(1)}` },
                  { label: extras.extraBed.label[loc], value: ar(extras.extraBed.priceAR) },
                  { label: extras.transfer.label[loc], value: ar(extras.transfer.priceAR) },
                  { label: extras.transferAmbalakely.label[loc], value: ar(extras.transferAmbalakely.priceAR) },
                  { label: extras.conference.label[loc], value: ar(extras.conference.priceAR) },
                  { label: extras.draisine.label[loc], value: ar(extras.draisine.priceAR) },
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
