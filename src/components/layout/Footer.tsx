import { type Locale, getBasePath } from "@/lib/utils";
import { alt } from "@/lib/alt";
import { navigation, siteConfig } from "@/data/site";

/**
 * Footer « Nuit sur le lac » : le monde sombre C clôt chaque page.
 * Plan du site en colonnes fidèle à l'arborescence de Maggie (une colonne
 * par grande rubrique, sous-items dessous), pattern footer Glacier Express.
 */

/** "/hotel#philosophie" → "/fr/hotel/#philosophie" (trailing slash). */
function localizeHref(href: string, locale: string): string {
  const [path, hash] = href.split("#");
  const normalized = path === "/" ? `/${locale}/` : `/${locale}${path}/`;
  return hash ? `${normalized}#${hash}` : normalized;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function Footer({ locale, dict }: { locale: Locale; dict: any }) {
  const basePath = getBasePath();
  const year = new Date().getFullYear();

  const columns = navigation.filter((n) => n.primary !== false);
  const secondary = navigation.filter((n) => n.primary === false);

  return (
    <footer className="ge-night bg-night">
      <div className="mx-auto max-w-7xl px-6 pb-10 pt-16 md:px-10 md:pt-20">
        {/* Marque + tagline */}
        <div className="mb-14 flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
          {/* Emblème seul. Le lockup typographique qui l'accompagnait
              (« LAC HÔTEL » + « Sahambavy · Madagascar ») répétait ce que
              l'emblème écrit déjà ; le lieu reste porté par l'adresse
              complète juste en dessous et par la ligne de copyright.
              L'alt conserve le nom pour les lecteurs d'écran. */}
          <img
            src={`${basePath}/images/logo/logo-embleme-white.png`}
            alt="Lac Hôtel Sahambavy"
            className="h-24 w-auto opacity-90 md:h-28"
          />
          <p className="max-w-sm font-[family-name:var(--font-serif)] text-lg italic text-champagne/80">
            {dict.footer.tagline}
          </p>
        </div>

        {/* Plan du site : arborescence Maggie.

            Libellé localisé sur place via `alt()`, la forme { fr, en, es }
            du repo. La clé `dict.nav.aria.reseaux` porte bien ce texte
            (« Plan du site », « Site map », « Mapa del sitio »), mais son
            nom annonce les réseaux sociaux : la brancher ici, c'était
            garantir qu'un jour on la corrigerait pour les réseaux et qu'on
            renommerait ce bloc sans le savoir. */}
        <nav
          aria-label={alt(
            { fr: "Plan du site", en: "Site map", es: "Mapa del sitio" },
            locale,
          )}
          className="mb-14"
        >
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
            {columns.map((item) => (
              <div key={item.href}>
                <a
                  href={`${basePath}${localizeHref(item.href, locale)}`}
                  className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.2em] text-linen transition-colors hover:text-champagne"
                >
                  {item.label[locale]}
                </a>
                {item.children && (
                  <ul className="space-y-2">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <a
                          href={`${basePath}${localizeHref(child.href, locale)}`}
                          className="text-[13px] leading-snug text-night-body transition-colors hover:text-champagne"
                        >
                          {child.label[locale]}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </nav>

        <hr className="ge-hairline" />

        {/* Contacts + secondaires + réseaux */}
        <div className="flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2 text-[13.5px] text-night-body md:flex-row md:items-center md:gap-6">
            <a href={`mailto:${siteConfig.email}`} className="transition-colors hover:text-champagne">
              {siteConfig.email}
            </a>
            <a href={`tel:${siteConfig.whatsapp}`} className="transition-colors hover:text-champagne">
              {siteConfig.phone}
            </a>
            <span>{siteConfig.address}</span>
          </div>
          {/* `nav` et non `div` : posé sur une division neutre, un
              `aria-label` n'est annoncé par personne. Les trois liens
              sortent du site, ils méritent leur propre repère nommé.

              Le libellé passait par `dict.nav.aria.reseaux`, qui contient
              « Plan du site » : ce bloc s'annonçait donc comme le plan du
              site, dans les trois langues, et le repli en dur ne servait
              jamais. Nommé sur place, comme le bloc du dessus. */}
          <nav
            aria-label={alt(
              { fr: "Réseaux sociaux", en: "Social media", es: "Redes sociales" },
              locale,
            )}
            className="flex items-center gap-5"
          >
            <a
              href={siteConfig.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-night-body transition-colors hover:text-champagne"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M13.5 21v-8h2.7l.4-3.2h-3.1V7.7c0-.9.3-1.6 1.6-1.6h1.7V3.2c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.4H7.4V13h2.7v8h3.4Z" />
              </svg>
            </a>
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-night-body transition-colors hover:text-champagne"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4.2" />
                <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a
              href={siteConfig.social.tripadvisor}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TripAdvisor"
              className="text-night-body transition-colors hover:text-champagne"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <circle cx="7.5" cy="13.5" r="3.2" />
                <circle cx="16.5" cy="13.5" r="3.2" />
                <circle cx="7.5" cy="13.5" r="0.9" fill="currentColor" stroke="none" />
                <circle cx="16.5" cy="13.5" r="0.9" fill="currentColor" stroke="none" />
                <path d="M3.5 10.5C5 8.8 8.3 7.5 12 7.5s7 1.3 8.5 3M12 7.5l-1.5-2h3L12 7.5Z" />
              </svg>
            </a>
          </nav>
        </div>

        <hr className="ge-hairline" />

        {/* Légal */}
        <div className="flex flex-col gap-3 pt-6 text-[12px] text-night-body/70 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} Lac Hôtel Sahambavy · RCS {siteConfig.legal.rcs} · {dict.footer.copyright}
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {secondary.map((item) => (
              <a
                key={item.href}
                href={`${basePath}${localizeHref(item.href, locale)}`}
                className="transition-colors hover:text-champagne"
              >
                {item.label[locale]}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
