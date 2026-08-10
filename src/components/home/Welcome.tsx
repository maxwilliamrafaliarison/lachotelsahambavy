import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";
import RecapRows from "@/components/ui/RecapRows";
import AmbientVideo from "@/components/ui/AmbientVideo";
import { getBasePath, type Locale } from "@/lib/utils";

/**
 * Welcome : intro éditoriale « Panorama » avec la vidéo d'ambiance à gauche,
 * la prose en mesure de lecture à droite, les 3 stats en filets fins
 * (50+ bungalows · 520 ha · 28 ans) et CTA contour encre.
 *
 * LE TITRAGE A ÉTÉ REMPLACÉ PAR LA VIDÉO (demande du 08/08/2026)
 *
 * La colonne de gauche portait trois lignes : « Bienvenue au Lac Hôtel »,
 * « Un éco-lodge d'exception face au lac Sahambavy », « Charme & Confort au
 * cœur de la nature… ». La troisième reprenait mot pour mot le titre du
 * hero situé juste au-dessus. La vidéo verticale les remplace.
 *
 * Ce que cela coûterait en référencement si on n'y prenait pas garde : un
 * moteur ne lit pas une vidéo. Supprimer le <h2> d'une section, c'est
 * supprimer le seul repère de structure que Google y trouve. Trois parades,
 * toutes appliquées :
 *
 *   1. Le <h2> reste dans le document, en `sr-only`. Il n'est pas masqué
 *      pour tromper qui que ce soit : il décrit exactement la section, il
 *      est lu par les lecteurs d'écran, et il maintient la hiérarchie
 *      h1 → h2 du document. Ce que l'œil perd, la structure le garde.
 *   2. La prose de Maggie (colonne de droite) n'a pas bougé d'une ligne.
 *      C'est là que vit le texte indexable, et il est plus riche que les
 *      trois lignes retirées.
 *   3. Un balisage VideoObject est désormais émis sur l'accueil, ce qui
 *      rend la page éligible aux résultats enrichis vidéo. Le schéma
 *      existait dans le code mais ne décrivait aucune vidéo réellement
 *      présente. Il pointe maintenant sur celle-ci. Net, l'opération fait
 *      gagner du référencement plutôt qu'elle n'en fait perdre.
 *
 * Server Component : la vidéo est un îlot client isolé (AmbientVideo).
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function Welcome({ dict, locale }: { dict: any; locale: Locale }) {
  const basePath = getBasePath();
  const stats = [
    { label: dict.welcome.stat1, value: dict.welcome.stat1Value },
    { label: dict.welcome.stat2, value: dict.welcome.stat2Value },
    { label: dict.welcome.stat3, value: dict.welcome.stat3Value },
  ];

  return (
    <section id="welcome" className="scroll-mt-24 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid gap-10 md:grid-cols-12 md:gap-14">
          {/* Colonne vidéo : le titrage vit désormais en sr-only (cf. en-tête) */}
          <div className="md:col-span-5">
            <h2 className="sr-only">{dict.welcome.title}</h2>
            <ScrollReveal>
              <AmbientVideo
                src={`${basePath}/videos/bienvenue-lac-hotel.mp4`}
                poster={`${basePath}/videos/bienvenue-lac-hotel.jpg`}
                legende={dict.welcome.videoLegende}
                libelles={{
                  lire: dict.welcome.videoLire,
                  pause: dict.welcome.videoPause,
                }}
                className="mx-auto aspect-[9/16] w-full max-w-[340px] shadow-[0_18px_50px_-18px_rgba(27,27,23,0.45)] md:mx-0 md:max-w-none"
              />
            </ScrollReveal>
          </div>

          {/* Colonne prose + stats + CTA */}
          <div className="md:col-span-7">
            <ScrollReveal delay={120}>
              <div className="ge-measure space-y-5 text-[15px] leading-relaxed text-body md:text-base">
                {dict.welcome.intro && <p>{dict.welcome.intro}</p>}
                <p>{dict.welcome.p1}</p>
                <p>{dict.welcome.p2}</p>
                {dict.welcome.p3 && <p>{dict.welcome.p3}</p>}
              </div>

              <RecapRows className="mt-10 max-w-md" rows={stats} />

              <div className="mt-10">
                <Link href={`/${locale}/hebergements/`} className="ge-cta ge-cta--ghost">
                  {dict.welcome.cta}
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
