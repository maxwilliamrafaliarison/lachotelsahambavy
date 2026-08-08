import Image from "next/image";
import type { ReactNode } from "react";
import ScrollReveal from "@/components/ui/ScrollReveal";

/**
 * Bloc éditorial alterné photo / texte — rythme de section signature de la
 * refonte (transposé des blocs Glacier Express).
 *
 * `image` : URL déjà préfixée basePath (convention du repo).
 * `reverse` : photo à droite. `night` : à poser DANS un parent `.ge-night`
 * (le composant n'applique pas le fond, seulement les surfaces internes).
 * `rows` : récapitulatif à filets fins sous le texte (tarifs, prestations).
 */
type EditorialSplitProps = {
  image: string;
  imageAlt?: string;
  /** Remplace la photo fixe par un média libre — une galerie, par exemple.
   *  `image` reste requis et sert de repli si `media` n'est pas fourni. */
  media?: ReactNode;
  label?: string;
  title: ReactNode;
  children?: ReactNode;
  rows?: Array<{ label: ReactNode; value: ReactNode }>;
  cta?: { href: string; label: string; night?: boolean };
  reverse?: boolean;
  night?: boolean;
  id?: string;
};

export default function EditorialSplit({
  image,
  imageAlt = "",
  media,
  label,
  title,
  children,
  rows,
  cta,
  reverse = false,
  night = false,
  id,
}: EditorialSplitProps) {
  return (
    <div
      id={id}
      className={`grid overflow-hidden rounded-[3px] md:grid-cols-2 ${
        night ? "border border-night-hairline bg-night-soft" : "border border-hairline bg-white"
      } ${id ? "scroll-mt-24" : ""}`}
    >
      <div
        className={`relative min-h-[260px] md:min-h-[420px] ${reverse ? "md:order-2" : ""}`}
      >
        {media ?? (
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        )}
      </div>
      <div className={`flex flex-col justify-center px-6 py-10 md:px-11 md:py-14 ${reverse ? "md:order-1" : ""}`}>
        <ScrollReveal>
          {label && <span className="ge-label mb-3">{label}</span>}
          <h3
            className={`mb-4 ${night ? "" : "text-ink"}`}
            style={{ textWrap: "balance" }}
          >
            {title}
          </h3>
          <div className={`space-y-4 text-[15px] leading-relaxed ${night ? "text-night-body" : "text-body"}`}>
            {children}
          </div>
          {rows && rows.length > 0 && (
            <div className="ge-rows mt-6">
              {rows.map((r, i) => (
                <div key={i} className="ge-row">
                  <span>{r.label}</span>
                  <span>{r.value}</span>
                </div>
              ))}
            </div>
          )}
          {cta && (
            <div className="mt-7">
              <a
                href={cta.href}
                className={`ge-cta ${cta.night || night ? "ge-cta--night" : ""}`}
              >
                {cta.label}
              </a>
            </div>
          )}
        </ScrollReveal>
      </div>
    </div>
  );
}
