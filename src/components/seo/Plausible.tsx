import Script from "next/script";

/**
 * Plausible Analytics — cookie-less / RGPD by design.
 * Cf. Phase 5 §5.7 (Monitoring) + Phase 8 §8.7.2.
 *
 * Tracking automatique :
 *   - Pageviews
 *   - Outbound links (data-domain="lachotel.com" requis)
 *   - Tagged events via class="plausible-event-name=Booking+Submitted"
 *
 * Activation conditionnelle :
 *   - Désactivé si NEXT_PUBLIC_PLAUSIBLE_DOMAIN absent (dev / preview)
 *   - Domaine self-hosted possible via NEXT_PUBLIC_PLAUSIBLE_HOST
 */
export function Plausible() {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  if (!domain) return null;

  const host = process.env.NEXT_PUBLIC_PLAUSIBLE_HOST || "https://plausible.io";

  return (
    <Script
      defer
      data-domain={domain}
      src={`${host}/js/script.outbound-links.tagged-events.js`}
      strategy="afterInteractive"
    />
  );
}
