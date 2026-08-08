import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";
import RoomGallery from "@/components/rooms/RoomGallery";
import { roomsAffichees, type Room } from "@/data/rooms";
import { siteConfig } from "@/data/site";
import { type Locale, getBasePath } from "@/lib/utils";

const basePath = getBasePath();

/**
 * Hébergements — grille de cartes hairline « Panorama » (id="rooms" : ancre
 * du hero, scroll-mt-24 obligatoire).
 *
 * Cartes uniformes bg-white à filet fin : photo 3/2, nom, « à partir de »
 * prix AR + €, lien. Sous la grille, bandeau de réassurance style Radisson :
 * les trois notes (Booking / Google / TripAdvisor) en chips hairline,
 * données de siteConfig.ratings.
 *
 * Server Component — le compteur/carrousel a disparu, plus besoin de client.
 */

/** 360000 → « 360 000 » (espace fine insécable, déterministe SSR/CSR). */
function formatAr(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

/** 9 → « 9,0 » (fr/es) ou « 9.0 » (en). */
function formatScore(n: number, locale: Locale): string {
  const s = n.toFixed(1);
  return locale === "en" ? s : s.replace(".", ",");
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function RoomsGrid({ dict, locale }: { dict: any; locale: Locale }) {
  /* L'ordre et la sélection viennent de `roomsAffichees` (cf. src/data/rooms.ts) :
     hébergements courants du plus cher au moins cher, puis les deux
     hébergements d'exception, puis l'extension Le Repos. On n'exclut plus
     Le Repos — la direction veut la villa basse dans la grille, signalée par
     sa pastille de localisation. */
  const displayRooms = roomsAffichees;

  const ratings = [
    { name: "Booking.com", score: `${formatScore(siteConfig.ratings.booking.score, locale)}/10`, url: siteConfig.social.booking },
    { name: "Google", score: `${formatScore(siteConfig.ratings.google.score, locale)}/5`, url: siteConfig.social.google },
    { name: "TripAdvisor", score: `${formatScore(siteConfig.ratings.tripadvisor.score, locale)}/5`, url: siteConfig.social.tripadvisor },
  ];

  return (
    <section id="rooms" className="scroll-mt-24 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        {/* ─── En-tête ───────────────────────────────────────────────── */}
        <div className="mb-12 md:mb-16">
          <ScrollReveal>
            <span className="ge-label mb-4">{dict.rooms.label}</span>
            <h2 style={{ textWrap: "balance" }}>{dict.rooms.title}</h2>
            <p className="mt-4 max-w-[58ch] text-[15px] leading-relaxed text-muted">
              {dict.rooms.subtitle}
            </p>
          </ScrollReveal>
        </div>

        {/* ─── Grille de cartes hairline ─────────────────────────────── */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayRooms.map((room, i) => (
            <ScrollReveal key={room.id} delay={(i % 3) * 90} className="h-full">
              <RoomCard room={room} dict={dict} locale={locale} />
            </ScrollReveal>
          ))}
        </div>

        {/* ─── Réassurance — chips hairline (style Radisson) ─────────── */}
        <ScrollReveal>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            {ratings.map((r) => (
              <a
                key={r.name}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-baseline gap-2.5 rounded-full border border-hairline bg-white px-5 py-2.5 transition-colors hover:border-lake"
              >
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
                  {r.name}
                </span>
                <span className="text-sm font-semibold tabular-nums text-terracotta">{r.score}</span>
              </a>
            ))}
          </div>
        </ScrollReveal>

        {/* ─── Tous les hébergements ─────────────────────────────────── */}
        <div className="mt-10 text-center">
          <ScrollReveal>
            <Link href={`/${locale}/hebergements/`} className="ge-cta ge-cta--ghost">
              {dict.rooms.viewAll}
            </Link>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// Carte chambre — photo 3/2, nom, « à partir de » AR + €, lien. Filet fin,
// fond blanc, zéro glass / zéro ombre : la hiérarchie vient de la photo.
// -----------------------------------------------------------------------------

function RoomCard({ room, dict, locale }: { room: Room; dict: any; locale: Locale }) {
  const images = room.images.length ? room.images : ["/images/hero/hero-pilotis.jpg"];
  const href = `/${locale}/hebergements/`;
  const night = String(dict.rooms.night).replace(/^\s*\/\s*/, "");

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[3px] border border-hairline bg-white">
      {/* La photo n'est PLUS enveloppée dans un lien : les flèches de la
          galerie se trouveraient à l'intérieur, et chaque changement de vue
          déclencherait une navigation. Le nom de la chambre, juste dessous,
          porte déjà le lien.

          Le rapport est posé par ce conteneur et la galerie le remplit :
          passer `aspect-[3/2]` en classe à la galerie se heurterait à
          l'ordre des couches Tailwind (cf. la prop `remplir`). */}
      <div className="relative aspect-[3/2] w-full overflow-hidden">
        <RoomGallery
          images={images.map((src) => `${basePath}${src}`)}
          nom={room.name[locale]}
          remplir
          libelles={{
            precedent: dict.rooms.galPrev ?? "Photo précédente",
            suivant: dict.rooms.galNext ?? "Photo suivante",
            sur: dict.rooms.galOf ?? "photo {n}",
          }}
        />
      </div>

      <div className="flex flex-1 flex-col p-6 md:p-7">
        <div className="mb-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-[10px] uppercase tracking-[0.24em] text-muted">
            {room.type[locale]}
          </span>
          {room.badge && <span className="ge-label !text-[10px]">{room.badge}</span>}
        </div>

        <h3 className="text-[1.35rem]">
          <Link href={href} className="transition-colors hover:text-lake">
            {room.name[locale]}
          </Link>
        </h3>

        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-body">
          {room.description[locale]}
        </p>

        <div className="mt-auto pt-6" />
        <div className="flex items-baseline justify-between gap-4 border-t border-hairline pt-5">
          <div className="tabular-nums">
            <span className="block text-[10px] uppercase tracking-[0.2em] text-muted">
              {dict.rooms.from}
            </span>
            {/* Le bungalow Tarzan n'a pas d'équivalent en euros dans la grille
                officielle : sans cette garde, on affichait « 150 000 Ar ·  € ». */}
            <span className="text-[15px] font-semibold text-ink">
              {formatAr(room.priceAR)}&nbsp;Ar
              <span className="font-normal text-muted">
                {room.priceEUR ? ` · ${room.priceEUR} € / ${night}` : ` / ${night}`}
              </span>
            </span>
          </div>
          <Link
            href={href}
            className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.2em] text-terracotta transition-colors hover:text-lake-deep"
          >
            {dict.rooms.book}
          </Link>
        </div>
      </div>
    </article>
  );
}
