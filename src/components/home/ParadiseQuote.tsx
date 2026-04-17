import ScrollReveal from "@/components/ui/ScrollReveal";
import { getBasePath } from "@/lib/utils";

/**
 * Pull-quote Madagascar — transition poétique entre le HeroSlider (qui
 * vend l'hôtel) et le Welcome (qui raconte la maison).
 *
 * Plein cadre cinématique, photo drone sunrise en fond avec un léger
 * effet Ken Burns qui fait respirer l'image, overlay dégradé pour la
 * lisibilité, citation en Cormorant Garamond italique centrée. Le silence
 * compte : pas de CTA, pas de sous-texte bavard — juste la phrase et le
 * nom du pays en label discret.
 *
 * Ton : Aman Maldives, Belmond Andean Explorer. Un arrêt sur image, pas
 * une section d'information.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export default function ParadiseQuote({ dict }: { dict: any }) {
  const basePath = getBasePath();

  return (
    <section
      aria-label={dict.paradise.caption}
      className="relative w-full min-h-[70vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden"
    >
      {/* Background : drone sunrise, Ken Burns lent pour faire respirer */}
      <img
        src={`${basePath}/images/hero/hero-drone-sunrise.jpg`}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover animate-kenburns"
        loading="lazy"
      />

      {/* Dégradé sombre — contraste texte + émotionnel (plus sombre en haut
          et en bas pour créer un anneau de lumière au centre) */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/30 to-black/55" />

      {/* Citation */}
      <div className="relative z-10 text-center px-6 max-w-[900px]">
        <ScrollReveal>
          <p
            className="font-[family-name:var(--font-sub)] italic leading-[1.15] text-white"
            style={{
              fontSize: "clamp(2rem, 5.5vw, 4.25rem)",
              textShadow: "0 2px 24px rgba(0,0,0,0.4)",
              letterSpacing: "-0.01em",
            }}
          >
            {"\u00AB\u202F"}
            {dict.paradise.quote}
            {"\u202F\u00BB"}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={250}>
          <div className="mt-10 flex items-center justify-center gap-4">
            <span className="h-px w-12 bg-gold-light/70" />
            <span className="text-gold-light text-xs md:text-sm tracking-[0.35em] uppercase font-medium">
              {dict.paradise.caption}
            </span>
            <span className="h-px w-12 bg-gold-light/70" />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
