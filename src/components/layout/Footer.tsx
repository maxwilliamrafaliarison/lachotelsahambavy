import Link from "next/link";
import { type Locale, getBasePath } from "@/lib/utils";
import { navigation, siteConfig } from "@/data/site";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function Footer({ locale, dict }: { locale: Locale; dict: any }) {
  const basePath = getBasePath();
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden">
      {/* Glass-dark background */}
      <div className="bg-[#1A1410]">
        <div className="max-w-[1200px] mx-auto px-6 pt-20 pb-8">
          {/* Top section — logo + tagline */}
          <div className="flex flex-col items-center text-center mb-16">
            <img
              src={`${basePath}/images/logo/logo-white.png`}
              alt="Lac Hotel Sahambavy"
              className="h-28 md:h-32 w-auto mb-6 opacity-85"
            />
            <p className="text-cream/40 font-[family-name:var(--font-sub)] italic text-lg max-w-md">
              {dict.footer.tagline}
            </p>
          </div>

          {/* Navigation — single row, centered */}
          <div className="flex flex-wrap justify-center gap-8 mb-16">
            {navigation
              .filter((n) => n.href !== "/")
              .map((item) => (
                <Link
                  key={item.href}
                  href={`/${locale}${item.href}/`}
                  className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-cream/40 hover:text-gold transition-colors duration-300"
                >
                  {item.label[locale]}
                </Link>
              ))}
          </div>

          {/* Contact info — minimal row */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12 mb-16 text-sm">
            <a
              href={`mailto:${siteConfig.email}`}
              className="text-cream/50 hover:text-gold transition-colors"
            >
              {siteConfig.email}
            </a>
            <span className="hidden md:block w-[1px] h-4 bg-cream/15" />
            <a
              href={`tel:${siteConfig.whatsapp}`}
              className="text-cream/50 hover:text-gold transition-colors"
            >
              {siteConfig.phone}
            </a>
            <span className="hidden md:block w-[1px] h-4 bg-cream/15" />
            <span className="text-cream/55 text-center">{siteConfig.address}</span>
          </div>

          {/* Social icons */}
          <div className="flex justify-center gap-6 mb-16">
            <a
              href={siteConfig.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cream/50 hover:text-gold transition-colors"
              aria-label="Facebook"
            >
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cream/50 hover:text-gold transition-colors"
              aria-label="Instagram"
            >
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </a>
            <a
              href={siteConfig.social.tripadvisor}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cream/50 hover:text-gold transition-colors"
              aria-label="TripAdvisor"
            >
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.006 4.295c-2.67 0-5.338.784-7.645 2.353H0l1.963 2.135a5.997 5.997 0 004.04 10.43 5.976 5.976 0 004.015-1.536L12.006 20l1.988-2.323a5.997 5.997 0 008.055-8.894L24 6.648h-4.35a13.573 13.573 0 00-7.644-2.353zM6.003 17.213a3.997 3.997 0 11.002-7.994 3.997 3.997 0 01-.002 7.994zm11.994 0a3.997 3.997 0 110-7.994 3.997 3.997 0 010 7.994zM6.003 11.219a1.998 1.998 0 100 3.996 1.998 1.998 0 000-3.996zm11.994 0a1.998 1.998 0 100 3.996 1.998 1.998 0 000-3.996z" />
              </svg>
            </a>
          </div>

          {/* Divider */}
          <div className="h-[1px] bg-cream/8 mb-8" />

          {/* Legal links row — booking conditions, privacy, etc. */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-6 text-[0.65rem] text-cream/40 uppercase tracking-[0.15em]">
            <Link
              href={`/${locale}/conditions-reservation/`}
              className="hover:text-gold transition-colors"
            >
              {dict.footer.bookingConditions}
            </Link>
          </div>

          {/* Bottom bar — minimal */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[0.6rem] text-cream/25 uppercase tracking-wider">
            <p>&copy; {year} {dict.footer.copyright}</p>
            <p>RCS {siteConfig.legal.rcs}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
