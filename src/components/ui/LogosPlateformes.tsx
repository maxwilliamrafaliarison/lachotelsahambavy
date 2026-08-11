/**
 * Les trois marques d'avis, dessinées à leurs couleurs officielles.
 *
 * Elles vivaient dans AvisPlateformes.tsx ; le ruban de témoignages en a
 * besoin lui aussi, pour la pastille d'origine de chaque carte. Un seul
 * tracé pour les deux emplois : si Booking change de bleu, il n'y a qu'un
 * fichier à toucher.
 *
 * `taille` en pixels, 26 par défaut. Les tracés sont en viewBox 24 : ils
 * s'adaptent sans perte, contrairement à une image.
 */

type Props = { taille?: number };

export function LogoGoogle({ taille = 26 }: Props) {
  return (
    <svg viewBox="0 0 24 24" width={taille} height={taille} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.53 5.53 0 0 1-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A11.99 11.99 0 0 0 12 24Z"
      />
      <path fill="#FBBC05" d="M5.27 14.29a7.2 7.2 0 0 1 0-4.58V6.62H1.29a12 12 0 0 0 0 10.76l3.98-3.09Z" />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.7 0 3.99 2.47 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75Z"
      />
    </svg>
  );
}

export function LogoTripAdvisor({ taille = 26 }: Props) {
  /* La chouette : deux yeux cerclés de vert, pupilles noires, sourcil et
     bec. Même géométrie que la version monochrome du pied de page, portée
     ici au vert de la marque. */
  return (
    <svg viewBox="0 0 24 24" width={taille} height={taille} aria-hidden="true">
      <g fill="none" stroke="#00AA6C" strokeWidth="1.7">
        <circle cx="7.4" cy="14" r="3.5" />
        <circle cx="16.6" cy="14" r="3.5" />
        <path d="M3 10.6C4.6 8.7 8 7.4 12 7.4s7.4 1.3 9 3.2" strokeLinecap="round" />
      </g>
      <path d="M12 7.4 10.2 5.1h3.6L12 7.4Z" fill="#00AA6C" />
      <circle cx="7.4" cy="14" r="1.35" fill="#1B1B17" />
      <circle cx="16.6" cy="14" r="1.35" fill="#1B1B17" />
    </svg>
  );
}

export function LogoBooking({ taille = 26 }: Props) {
  return (
    <svg viewBox="0 0 24 24" width={taille} height={taille} aria-hidden="true">
      <rect x="0" y="0" width="24" height="24" rx="5" fill="#003580" />
      {/* Le « B » de la marque, tracé plutôt que composé en texte : aucune
          dépendance à une police, donc un rendu identique partout. */}
      <path
        d="M7.6 5.6h4.28c2.2 0 3.5 1.06 3.5 2.83 0 1.06-.5 1.9-1.36 2.35 1.2.4 1.9 1.36 1.9 2.66 0 2-1.46 3.16-3.86 3.16H7.6V5.6Zm2.28 4.42h1.8c.92 0 1.44-.44 1.44-1.2 0-.75-.5-1.16-1.42-1.16h-1.82v2.36Zm0 4.6h2.02c1 0 1.56-.48 1.56-1.3 0-.83-.56-1.3-1.6-1.3H9.88v2.6Z"
        fill="#FFFFFF"
      />
      <circle cx="17.6" cy="15.5" r="1.25" fill="#FEBA02" />
    </svg>
  );
}
