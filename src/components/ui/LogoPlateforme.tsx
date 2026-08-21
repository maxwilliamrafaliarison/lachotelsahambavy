import { getBasePath } from "@/lib/utils";
import type { Plateforme } from "@/data/testimonials";

const basePath = getBasePath();

/**
 * Logotypes officiels des trois plateformes, servis TELS QUELS.
 *
 * POURQUOI CE COMPOSANT EXISTE. Le site dessinait ses propres logos : un
 * carré bleu avec un « B » tracé à la main pour Booking, une chouette
 * redessinée pour Tripadvisor. Une imitation de marque est plus exposée
 * qu'un nom écrit en toutes lettres, et les couleurs employées n'étaient
 * même plus les bonnes (#003580 et #FEBA02 pour Booking, dont la palette
 * est passée à #003B95 et #FFB700).
 *
 * LES FICHIERS SONT CEUX DES PLATEFORMES, à l'octet près, déposés dans
 * public/images/logos/ et relevés le 21/08/2026 sur leurs propres
 * domaines :
 *   - booking-com.svg   ← news.booking.com/media-assets, 8 441 o
 *   - tripadvisor.svg   ← tripadvisor.mediaroom.com/logo-guidelines, 4 983 o
 *   - google.svg        ← gstatic.com, CDN officiel de Google, 1 660 o
 * Aucun n'a été retouché : c'est la seule position tenable face à des
 * chartes qui interdisent toutes de recréer ou d'altérer un logo.
 *
 * VINGT PIXELS DE HAUT, et ce n'est pas un choix esthétique. Tripadvisor
 * impose un minimum de 20 px de HAUT ; Booking impose 120 px de LARGE.
 * Le logotype Booking ayant un rapport de 6 pour 1 exactement, 20 px de
 * haut lui font 120 px de large : les deux minimums se rejoignent sur la
 * même valeur. C'est cette coïncidence qui rend un alignement uniforme
 * possible sans manquer à l'une ou à l'autre.
 *
 * LES LARGEURS DIFFÈRENT, et c'est normal : 120 px pour Booking, 131 pour
 * Tripadvisor, 62 pour Google. Aligner des logos à hauteur optique égale
 * en laissant les largeurs libres est la façon dont on range des marques
 * côte à côte ; les forcer à une largeur commune reviendrait à les
 * déformer, ce que les trois chartes interdisent.
 *
 * Servis en <img> et non en SVG inline : la piste des témoignages répète
 * le logo Tripadvisor vingt-huit fois, et cinq kilo-octets de tracé
 * répétés autant de fois pèseraient plus lourd que la photo qu'ils
 * accompagnent. Un fichier, une requête, un cache.
 */

const LOGOS: Record<Plateforme, { fichier: string; rapport: number; nom: string }> = {
  booking: { fichier: "booking-com.svg", rapport: 180 / 30, nom: "Booking.com" },
  google: { fichier: "google.svg", rapport: 74 / 24, nom: "Google" },
  tripadvisor: { fichier: "tripadvisor.svg", rapport: 7674.86 / 1173.72, nom: "Tripadvisor" },
};

export default function LogoPlateforme({
  plateforme,
  hauteur = 20,
  className,
}: {
  plateforme: Plateforme;
  hauteur?: number;
  /** Vide quand le nom de la plateforme est déjà écrit à côté. */
  className?: string;
}) {
  const { fichier, rapport, nom } = LOGOS[plateforme];
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={`${basePath}/images/logos/${fichier}`}
      alt={nom}
      width={Math.round(hauteur * rapport)}
      height={hauteur}
      loading="lazy"
      decoding="async"
      className={className}
    />
  );
}
