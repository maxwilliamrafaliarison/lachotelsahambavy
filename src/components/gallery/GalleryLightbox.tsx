"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";

interface Photo {
  src: string;
  alt: string;
}

interface Props {
  photos: Photo[];
  index: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
  /** Libellés d'accessibilité, résolus dans la langue de la page. */
  libelles: { galerie: string; fermer: string; precedente: string; suivante: string; glisser: string };
}

const SWIPE_THRESHOLD = 64; // px au-delà desquels on change d'image
const RUBBER_BAND = 0.32; // résistance au drag aux extrémités (Apple)

/**
 * Lightbox plein écran avec swipe horizontal façon Photos iOS :
 * - Pointer Events unifient tactile + souris
 * - Drag fluide avec résistance ("rubber band") aux extrémités
 * - Snap animé vers image suivante / précédente au-delà d'un seuil
 * - Clavier ← → + Échap
 * - Tap sur fond = close, tap sur image = non
 *
 * Architecture : strip horizontal de toutes les photos, translateX = index
 * × 100vw. Le delta de drag s'ajoute pendant le geste, puis se résorbe au
 * relâchement. Évite de recréer les <img> à chaque navigation (cache navigateur).
 */
export default function GalleryLightbox({ photos, index, onClose, onIndexChange, libelles }: Props) {
  const [drag, setDrag] = useState(0); // delta en px pendant le geste
  const [dragging, setDragging] = useState(false);
  const [vpWidth, setVpWidth] = useState(0);
  const stripRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const pointerId = useRef<number | null>(null);
  const startX = useRef(0);
  const startIndex = useRef(index);

  // Mémorise la largeur viewport pour le calcul du translateX.
  // On écoute resize pour rester correct en rotation mobile.
  useEffect(() => {
    const update = () => setVpWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Verrouille le scroll du body pendant que la lightbox est ouverte
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  /* Gestion du focus, que réclame aria-modal : sans elle le focus clavier
     reste sur la vignette du dessous et la tabulation parcourt la page
     masquée au lieu de la visionneuse. On mémorise l'élément actif à
     l'ouverture, on donne le focus au bouton « Fermer », on boucle Tab et
     Maj+Tab sur les commandes de la boîte de dialogue, puis on rend le focus
     à son point de départ à la fermeture. */
  useEffect(() => {
    const precedent = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const onTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const boite = dialogRef.current;
      if (!boite) return;
      const focusables = Array.from(
        boite.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focusables.length === 0) return;
      const premier = focusables[0];
      const dernier = focusables[focusables.length - 1];
      const actif = document.activeElement;
      const dedans = boite.contains(actif);
      if (e.shiftKey) {
        if (!dedans || actif === premier) {
          e.preventDefault();
          dernier.focus();
        }
      } else if (!dedans || actif === dernier) {
        e.preventDefault();
        premier.focus();
      }
    };

    document.addEventListener("keydown", onTab);
    return () => {
      document.removeEventListener("keydown", onTab);
      precedent?.focus?.();
    };
  }, []);

  const canPrev = index > 0;
  const canNext = index < photos.length - 1;

  const goPrev = useCallback(() => {
    if (canPrev) onIndexChange(index - 1);
  }, [canPrev, index, onIndexChange]);

  const goNext = useCallback(() => {
    if (canNext) onIndexChange(index + 1);
  }, [canNext, index, onIndexChange]);

  // Clavier
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, goPrev, goNext]);

  // ─── Pointer handlers ────────────────────────────────────────
  function onPointerDown(e: React.PointerEvent) {
    // Ignore les clics droits / milieu + on n'interfère pas avec les boutons
    if (e.button !== 0) return;
    pointerId.current = e.pointerId;
    startX.current = e.clientX;
    startIndex.current = index;
    setDragging(true);
    setDrag(0);
    // Capture le pointeur pour éviter que le geste "échappe" au strip
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (pointerId.current !== e.pointerId || !dragging) return;
    let dx = e.clientX - startX.current;
    // Rubber band aux extrémités : résistance progressive façon iOS
    if ((!canPrev && dx > 0) || (!canNext && dx < 0)) {
      dx *= RUBBER_BAND;
    }
    setDrag(dx);
  }

  function onPointerEnd(e: React.PointerEvent) {
    if (pointerId.current !== e.pointerId) return;
    pointerId.current = null;
    setDragging(false);
    const dx = drag;
    setDrag(0);
    // Décide si on change d'index en fonction du seuil
    if (dx > SWIPE_THRESHOLD && canPrev) {
      onIndexChange(index - 1);
    } else if (dx < -SWIPE_THRESHOLD && canNext) {
      onIndexChange(index + 1);
    }
    // Sinon : drag = 0 fera revenir à l'index courant avec transition
  }

  // ─── Render ──────────────────────────────────────────────────
  const translateX = vpWidth
    ? `calc(${-index * 100}vw + ${drag}px)`
    : `${-index * (vpWidth || 0) + drag}px`;

  return (
    <div
      ref={dialogRef}
      className="fixed inset-0 z-[2000] bg-black/95 backdrop-blur-xl flex flex-col"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={libelles.galerie}
    >
      {/* Header */}
      <div className="relative flex items-center justify-between px-5 md:px-8 py-4 md:py-5 z-10">
        <span className="text-white/70 text-sm font-mono tabular-nums">
          {String(index + 1).padStart(2, "0")}
          {" / "}
          {String(photos.length).padStart(2, "0")}
        </span>
        <button
          ref={closeRef}
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-colors flex items-center justify-center"
          aria-label={libelles.fermer}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Strip + swipe container */}
      <div
        className="relative flex-1 overflow-hidden select-none"
        onClick={(e) => e.stopPropagation()}
        style={{ touchAction: "pan-y" }}
      >
        <div
          ref={stripRef}
          className="absolute inset-0 flex items-center"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerEnd}
          onPointerCancel={onPointerEnd}
          style={{
            transform: `translate3d(${translateX}, 0, 0)`,
            transition: dragging ? "none" : "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)",
            willChange: "transform",
            cursor: dragging ? "grabbing" : "grab",
          }}
        >
          {photos.map((p, i) => (
            <div
              key={p.src}
              className="flex-shrink-0 w-screen h-full flex items-center justify-center px-4 md:px-10"
              aria-hidden={i !== index}
            >
              <img
                src={p.src}
                alt={p.alt}
                draggable={false}
                className="max-w-full max-h-full object-contain rounded-[3px] shadow-2xl pointer-events-none"
                style={{
                  // Petite mise en échelle des photos hors écran pour un
                  // effet de profondeur subtil au swipe (Apple Photos).
                  transform: i === index ? "scale(1)" : "scale(0.95)",
                  opacity: i === index ? 1 : 0.65,
                  transition: dragging ? "none" : "transform 0.45s ease, opacity 0.45s ease",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Prev / Next : fallback desktop */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          goPrev();
        }}
        disabled={!canPrev}
        className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-colors items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed z-10"
        aria-label={libelles.precedente}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          goNext();
        }}
        disabled={!canNext}
        className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-colors items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed z-10"
        aria-label={libelles.suivante}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      {/* Caption & hint */}
      <div
        className="relative px-5 md:px-10 py-4 md:py-6 text-center z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-white/80 text-sm md:text-base font-[family-name:var(--font-sub)] italic mb-2 line-clamp-2">
          {photos[index]?.alt}
        </p>
        {/* Hint swipe : visible uniquement sur mobile/tactile, s'estompe au 1er drag */}
        <div className="md:hidden flex items-center justify-center gap-2 text-white/40 text-[0.65rem] uppercase tracking-[0.25em]">
          <Icon name="arrow" size={12} weight="regular" className="rotate-180" />
          <span>{libelles.glisser}</span>
          <Icon name="arrow" size={12} weight="regular" />
        </div>
      </div>
    </div>
  );
}
