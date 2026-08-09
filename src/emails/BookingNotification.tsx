/**
 * Email interne envoyé à booking@lachotel.com (CC lachotelsahambavy@gmail.com).
 * Cf. Phase 7 §7.4 — Workflow emails.
 *
 * Format : action-oriented — "Répondre directement" + "Ajouter au CRM".
 * Locale = toujours FR (équipe hôtel).
 */

import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { BookingFormValues } from "@/lib/booking/schema";
import { LABELS, computeNights } from "@/lib/booking/schema";
import { EMAIL_COLORS, EMAIL_COPY, EMAIL_FONTS, formatOccupancy } from "./shared";

export interface BookingNotificationProps {
  booking: BookingFormValues;
  receivedAt?: string;
}

export function BookingNotification({ booking, receivedAt }: BookingNotificationProps) {
  const t = EMAIL_COPY.fr;
  const nights = computeNights(booking.checkin, booking.checkout);
  const locale = booking.locale;
  const roomLabel = LABELS.room.fr[booking.room];
  const pensionLabel = LABELS.pension.fr[booking.pension];
  const rateLabel = LABELS.rate.fr[booking.rate];
  const transferLabel = LABELS.transfer.fr[booking.transfer];

  const nowStr = receivedAt
    ? new Date(receivedAt).toLocaleString("fr-FR", {
        dateStyle: "long",
        timeStyle: "short",
      })
    : new Date().toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" });

  return (
    <Html lang="fr">
      <Head />
      <Preview>{`Nouvelle résa : ${booking.name} · ${booking.checkin} → ${booking.checkout} (${nights}n)`}</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Section style={headerStyle}>
            <Text style={tagStyle}>[Lac Hôtel · Réservation]</Text>
            <Heading as="h1" style={h1Style}>
              {t.internalTitle}
            </Heading>
            <Text style={metaStyle}>
              {t.internalMeta} {nowStr} · Langue : <strong>{locale.toUpperCase()}</strong>
            </Text>
          </Section>

          <Section style={contentStyle}>
            {/* Contact voyageur */}
            <Heading as="h2" style={h2Style}>
              {t.contactBlock}
            </Heading>
            <Section style={boxStyle}>
              <Row label="Nom" value={booking.name} />
              <Row
                label="Email"
                value={
                  <Link href={`mailto:${booking.email}`} style={linkStyle}>
                    {booking.email}
                  </Link>
                }
              />
              <Row
                label="Téléphone"
                value={
                  <Link href={`tel:${booking.phone.replace(/\s/g, "")}`} style={linkStyle}>
                    {booking.phone}
                  </Link>
                }
              />
              <Row label="Nationalité" value={booking.nationality} />
            </Section>

            {/* Détails séjour */}
            <Heading as="h2" style={h2Style}>
              {t.stayBlock}
            </Heading>
            <Section style={boxStyle}>
              <Row label="Check-in" value={booking.checkin} />
              <Row label="Check-out" value={booking.checkout} />
              <Row label="Nuits" value={String(nights)} emphasis />
              <Row
                label="Personnes"
                value={formatOccupancy("fr", {
                  guests: booking.guests,
                  adults: booking.adults,
                  children: booking.children,
                  rooms: booking.rooms,
                })}
              />
              <Row label="Hébergement" value={roomLabel} />
              <Row label="Pension" value={pensionLabel} />
              <Row label="Tarif" value={rateLabel} emphasis />
              <Row label="Transfert" value={transferLabel} />
              {booking.arrivalTime ? <Row label="Arrivée" value={booking.arrivalTime} /> : null}
            </Section>

            {booking.message ? (
              <Section style={messageBoxStyle}>
                <Text style={messageLabelStyle}>Message du voyageur</Text>
                <Text style={messageTextStyle}>{booking.message}</Text>
              </Section>
            ) : null}

            <Hr style={hrStyle} />

            {/* Actions */}
            <Section style={{ textAlign: "center" }}>
              <Link
                href={`mailto:${booking.email}?subject=${encodeURIComponent(`Re: Votre réservation au Lac Hôtel (${booking.checkin})`)}`}
                style={ctaPrimaryStyle}
              >
                {t.replyTo}
              </Link>
            </Section>

            <Text style={footerStyle}>
              Cet email est généré automatiquement par le formulaire de réservation lachotel.com.
              <br />
              Les données sont stockées dans le Google Sheet CRM (si configuré). L&apos;IP du voyageur est
              hashée SHA-256 salée pour conformité RGPD.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

function Row({
  label,
  value,
  emphasis,
}: {
  label: string;
  value: React.ReactNode;
  emphasis?: boolean;
}) {
  return (
    <Text style={rowStyle}>
      <span style={labelStyle}>{label}</span>
      <span style={emphasis ? valueEmphasisStyle : valueStyle}>{value}</span>
    </Text>
  );
}

// ────────────────── Styles ──────────────────
const bodyStyle = {
  backgroundColor: "#F5F5F0",
  fontFamily: EMAIL_FONTS.body,
  margin: 0,
  padding: "20px 16px",
} as const;

const containerStyle = {
  maxWidth: "640px",
  margin: "0 auto",
  backgroundColor: EMAIL_COLORS.white,
  borderRadius: "8px",
  overflow: "hidden",
  border: `1px solid ${EMAIL_COLORS.border}`,
};

const headerStyle = {
  backgroundColor: EMAIL_COLORS.brown,
  padding: "24px",
  textAlign: "center" as const,
};

const tagStyle = {
  color: EMAIL_COLORS.gold,
  fontSize: "11px",
  letterSpacing: "0.15em",
  textTransform: "uppercase" as const,
  margin: "0 0 6px",
  fontWeight: 600,
};

const h1Style = {
  color: EMAIL_COLORS.cream,
  fontFamily: EMAIL_FONTS.heading,
  fontSize: "22px",
  fontWeight: 400,
  margin: 0,
};

const metaStyle = {
  color: EMAIL_COLORS.goldLight,
  fontSize: "12px",
  margin: "6px 0 0",
};

const contentStyle = { padding: "24px 24px 20px" };

const h2Style = {
  color: EMAIL_COLORS.brown,
  fontFamily: EMAIL_FONTS.heading,
  fontSize: "16px",
  fontWeight: 500,
  margin: "16px 0 8px",
  borderBottom: `2px solid ${EMAIL_COLORS.gold}`,
  paddingBottom: "4px",
  display: "inline-block",
};

const boxStyle = {
  backgroundColor: "#FAFAF6",
  border: `1px solid ${EMAIL_COLORS.border}`,
  borderRadius: "6px",
  padding: "14px 18px",
  margin: "0 0 18px",
};

const rowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "baseline",
  margin: "4px 0",
  fontSize: "13px",
  lineHeight: 1.5,
};

const labelStyle = {
  color: EMAIL_COLORS.muted,
  flex: "0 0 auto",
  marginRight: "16px",
  minWidth: "110px",
};

const valueStyle = {
  color: EMAIL_COLORS.text,
  fontWeight: 500,
  textAlign: "right" as const,
};

const valueEmphasisStyle = {
  color: EMAIL_COLORS.gold,
  fontWeight: 600,
  textAlign: "right" as const,
};

const messageBoxStyle = {
  borderLeft: `3px solid ${EMAIL_COLORS.gold}`,
  padding: "10px 16px",
  margin: "14px 0 18px",
  backgroundColor: "#FAFAF6",
};

const messageLabelStyle = {
  color: EMAIL_COLORS.gold,
  fontSize: "11px",
  letterSpacing: "0.12em",
  textTransform: "uppercase" as const,
  margin: "0 0 6px",
  fontWeight: 600,
};

const messageTextStyle = {
  color: EMAIL_COLORS.text,
  fontSize: "13px",
  lineHeight: 1.6,
  margin: 0,
  whiteSpace: "pre-wrap" as const,
};

const hrStyle = {
  border: "none",
  borderTop: `1px dashed ${EMAIL_COLORS.border}`,
  margin: "20px 0",
};

const linkStyle = {
  color: EMAIL_COLORS.gold,
  textDecoration: "none",
  fontWeight: 500,
};

const ctaPrimaryStyle = {
  backgroundColor: EMAIL_COLORS.gold,
  color: EMAIL_COLORS.white,
  fontSize: "13px",
  fontWeight: 600,
  padding: "12px 24px",
  borderRadius: "6px",
  textDecoration: "none",
  display: "inline-block",
  letterSpacing: "0.05em",
};

const footerStyle = {
  color: "#8A8580",
  fontSize: "11px",
  lineHeight: 1.5,
  margin: "20px 0 0",
  borderTop: `1px solid ${EMAIL_COLORS.border}`,
  paddingTop: "12px",
  fontStyle: "italic",
  textAlign: "center" as const,
};

export default BookingNotification;
