"use client";

import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { rooms, type Room } from "@/data/rooms";
import { type Locale, getBasePath } from "@/lib/utils";

/**
 * Homepage Rooms section — *hierarchised* edition (PR #?, replaces the
 * 4-identical-cards alternating layout that read like a catalogue).
 *
 * The signature pilotis bungalow gets a cinematic full-bleed hero block.
 * The 1930 wagon gets a magazine-style 7/5 editorial spread.
 * Superior + Familial share a flat compact tier — secondary citizens.
 *
 * This mirrors how Aman / Belmond / La Mamounia present their rooms:
 * one room earns the hero, one earns the spread, the rest are listed.
 * Anything more uniform reads as "all our rooms are the same" — which
 * is the *opposite* of what a hotel that sells a Pilotis Nuptial wants.
 *
 * `"use client"` is kept because the section header still uses
 * ScrollReveal (IntersectionObserver). All layout itself is static.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function RoomsGrid({ dict, locale }: { dict: any; locale: Locale }) {
  const basePath = getBasePath();

  const displayRooms = rooms.filter((r) => r.priceEUR && r.category !== "repos");
  const hero = displayRooms.find((r) => r.id === "pilotis");
  const editorial = displayRooms.find((r) => r.id === "wagon");
  const compact = displayRooms.filter((r) => !["pilotis", "wagon"].includes(r.id));

  return (
    <section id="rooms" className="py-32 md:py-40">
      {/* ─── Header — eyebrow + title centered ─────────────────────── */}
      <div className="max-w-2xl mx-auto text-center mb-20 px-6">
        <ScrollReveal>
          <span className="section-label">{dict.rooms.label}</span>
          <h2 className="mb-4">{dict.rooms.title}</h2>
          <p className="text-text-muted font-[family-name:var(--font-sub)] text-lg leading-relaxed">
            {dict.rooms.subtitle}
          </p>
          <div className="section-divider" />
        </ScrollReveal>
      </div>

      {/* ─── Hero room — full-bleed cinematic (Pilotis Nuptial) ────── */}
      {hero && <RoomHero room={hero} dict={dict} locale={locale} basePath={basePath} />}

      {/* ─── Editorial room — magazine spread (Wagon 1930) ─────────── */}
      {editorial && (
        <div className="max-w-[1400px] mx-auto px-6 mt-20 md:mt-32">
          <RoomEditorial room={editorial} dict={dict} locale={locale} basePath={basePath} />
        </div>
      )}

      {/* ─── Compact tier — flat editorial cards (Superior + Familial) ─ */}
      {compact.length > 0 && (
        <div className="max-w-[1400px] mx-auto px-6 mt-20 md:mt-28">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
            {compact.map((r, i) => (
              <RoomCompact
                key={r.id}
                room={r}
                dict={dict}
                locale={locale}
                basePath={basePath}
                delay={i * 100}
              />
            ))}
          </div>
        </div>
      )}

      {/* ─── View all — minimal CTA ────────────────────────────────── */}
      <div className="text-center mt-20 px-6">
        <ScrollReveal>
          <Link href={`/${locale}/hebergements/`} className="btn btn--minimal">
            {dict.rooms.viewAll}
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// Sub-renderers — local to this file (no need for module-level exports).
// -----------------------------------------------------------------------------

interface RoomBlockProps {
  room: Room;
  dict: any;
  locale: Locale;
  basePath: string;
  delay?: number;
}

/**
 * Full-bleed cinematic block. Photo as background, text overlay bottom-left
 * (desktop) or stacked beneath the photo (mobile, where overlay would crush
 * the image). Accent: badge + name set big in Playfair, white-on-photo with
 * a soft scrim.
 */
function RoomHero({ room, dict, locale, basePath }: RoomBlockProps) {
  const img = room.images[0] ?? "/images/hero/hero-pilotis.jpg";
  const href = `/${locale}/hebergements/`;
  return (
    <ScrollReveal>
      <div className="relative w-full h-[80vh] min-h-[560px] md:min-h-[640px] overflow-hidden">
        <img
          src={`${basePath}${img}`}
          alt={room.name[locale]}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        {/* Cinematic gradient — dark from bottom-left, transparent top-right */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.35) 40%, transparent 70%)",
          }}
        />

        <div className="relative h-full flex items-end px-6 md:px-12 lg:px-20 pb-16 md:pb-20">
          <div className="max-w-xl text-white">
            {room.badge && (
              <span className="inline-block text-[0.6rem] font-medium uppercase tracking-[0.3em] text-gold mb-5">
                {room.badge}
              </span>
            )}
            <h3
              className="font-[family-name:var(--font-heading)] text-3xl md:text-5xl text-white leading-[1.05] mb-5"
              style={{ textShadow: "0 2px 24px rgba(0,0,0,0.35)" }}
            >
              {room.name[locale]}
            </h3>
            <p
              className="text-white/85 text-base md:text-lg leading-relaxed mb-8 max-w-md"
              style={{ textShadow: "0 1px 8px rgba(0,0,0,0.35)" }}
            >
              {room.description[locale]}
            </p>

            {/* Price ratecard + CTA */}
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2 mb-7 tabular-nums [font-variant-numeric:lining-nums_proportional-nums]">
              <span className="text-[0.6rem] uppercase tracking-[0.2em] text-white/60">
                {dict.rooms.from}
              </span>
              <span className="text-2xl md:text-3xl font-medium text-white">
                {`\u20AC${room.priceEUR}`}
              </span>
              <span className="text-[0.65rem] uppercase tracking-[0.15em] text-white/60">
                / {dict.rooms.night.replace(/^\s*\/\s*/, "")}
              </span>
            </div>

            <Link href={href} className="btn btn--glass">
              {dict.rooms.book}
            </Link>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}

/**
 * Magazine-style 7/5 spread. Big portrait-ish photo on the left, narrative
 * column on the right. The photo aspect goes 4/5 (vertical) to break the
 * landscape rhythm of the hero — feels like turning a page.
 */
function RoomEditorial({ room, dict, locale, basePath }: RoomBlockProps) {
  const img = room.images[0] ?? "/images/hero/hero-pilotis.jpg";
  const href = `/${locale}/hebergements/`;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
      <ScrollReveal className="lg:col-span-7">
        <div className="overflow-hidden rounded-md">
          <img
            src={`${basePath}${img}`}
            alt={room.name[locale]}
            className="w-full aspect-[4/5] md:aspect-[5/6] lg:aspect-[4/5] object-cover transition-transform duration-[1.5s] hover:scale-[1.03]"
            loading="lazy"
          />
        </div>
      </ScrollReveal>

      <ScrollReveal className="lg:col-span-5" delay={150}>
        {room.badge && (
          <span className="inline-block text-[0.6rem] font-medium uppercase tracking-[0.3em] text-gold mb-4">
            {room.badge}
          </span>
        )}
        <span className="block text-[0.6rem] text-text-muted uppercase tracking-[0.25em] mb-3">
          {room.type[locale]}
        </span>
        <h3 className="text-2xl md:text-4xl mb-5 leading-tight">{room.name[locale]}</h3>
        <div className="w-10 h-[1.5px] bg-gold mb-7" />
        <p className="text-text-body leading-[1.95] mb-8 text-base">
          {room.description[locale]}
        </p>

        {/* Spec line — 1 unit · 30 m · capacity 2 (when applicable) */}
        <div className="flex flex-wrap gap-x-5 gap-y-1 mb-8 text-[0.65rem] uppercase tracking-[0.2em] text-text-muted">
          <span>
            {room.units} {dict.rooms.units}
          </span>
          {room.surface && <span>{room.surface}</span>}
          <span>· {room.capacity} pax</span>
        </div>

        {/* Price ratecard + CTA */}
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2 mb-8 tabular-nums [font-variant-numeric:lining-nums_proportional-nums]">
          <span className="text-[0.6rem] text-text-muted uppercase tracking-[0.2em]">
            {dict.rooms.from}
          </span>
          <span className="text-2xl md:text-3xl text-brown-deep font-medium">
            {`\u20AC${room.priceEUR}`}
          </span>
          <span className="text-[0.65rem] text-text-muted uppercase tracking-[0.15em]">
            / {dict.rooms.night.replace(/^\s*\/\s*/, "")}
          </span>
        </div>

        <Link href={href} className="btn btn--minimal">
          {dict.rooms.book}
        </Link>
      </ScrollReveal>
    </div>
  );
}

/**
 * Compact tier — image on top, text below, no card chrome. Feels editorial
 * because there's no border, no glass, no shadow — just a photo and a
 * caption-as-content. Two of these sit side-by-side on desktop.
 */
function RoomCompact({ room, dict, locale, basePath, delay = 0 }: RoomBlockProps) {
  const img = room.images[0] ?? "/images/hero/hero-pilotis.jpg";
  const href = `/${locale}/hebergements/`;
  return (
    <ScrollReveal delay={delay}>
      <article className="group">
        <Link href={href} className="block overflow-hidden rounded-md mb-6">
          <img
            src={`${basePath}${img}`}
            alt={room.name[locale]}
            className="w-full aspect-[16/10] object-cover transition-transform duration-[1.2s] group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {room.badge && (
          <span className="inline-block text-[0.6rem] font-medium uppercase tracking-[0.3em] text-gold mb-2">
            {room.badge}
          </span>
        )}
        <span className="block text-[0.6rem] text-text-muted uppercase tracking-[0.25em] mb-2">
          {room.type[locale]}
        </span>
        <h3 className="text-xl md:text-2xl mb-3 leading-tight">
          <Link href={href} className="hover:text-gold transition-colors">
            {room.name[locale]}
          </Link>
        </h3>
        <p className="text-text-body leading-[1.8] mb-5 text-sm md:text-base">
          {room.description[locale]}
        </p>

        <div className="flex items-baseline justify-between pt-4 border-t border-border">
          <div className="flex items-baseline gap-2 tabular-nums [font-variant-numeric:lining-nums_proportional-nums]">
            <span className="text-[0.55rem] text-text-muted uppercase tracking-[0.2em]">
              {dict.rooms.from}
            </span>
            <span className="text-xl md:text-2xl text-brown-deep font-medium">
              {`\u20AC${room.priceEUR}`}
            </span>
            <span className="text-[0.6rem] text-text-muted uppercase tracking-[0.15em]">
              / {dict.rooms.night.replace(/^\s*\/\s*/, "")}
            </span>
          </div>
          <Link href={href} className="text-[0.65rem] uppercase tracking-[0.25em] text-brown-deep hover:text-gold transition-colors border-b border-current pb-0.5">
            {dict.rooms.book}
          </Link>
        </div>
      </article>
    </ScrollReveal>
  );
}
