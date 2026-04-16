/**
 * Email transactionnel envoyé au voyageur après soumission du formulaire.
 * Cf. Phase 7 §7.4 — Workflow emails.
 *
 * Template React Email → HTML universellement compatible (Gmail, Outlook, iOS Mail).
 * Localisé FR/EN/ES. Pas de CTA de paiement (paiement à l'arrivée).
 */

import {
  Body,
  Button,
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
import { siteConfig } from "@/data/site";

export interface BookingConfirmationProps {
  booking: BookingFormValues;
}

function formatDate(iso: string, locale: string): string {
  try {
    return new Date(iso).toLocaleDateString(locale, {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export function BookingConfirmation({ booking }: BookingConfirmationProps) {
  const locale = booking.locale;
  const t = EMAIL_COPY[locale];
  const nights = computeNights(booking.checkin, booking.checkout);
  const roomLabel = LABELS.room[locale][booking.room];
  const pensionLabel = LABELS.pension[locale][booking.pension];
  const rateLabel = LABELS.rate[locale][booking.rate];
  const transferLabel = LABELS.transfer[locale][booking.transfer];

  const previewText = `${t.receivedTitle} — ${formatDate(booking.checkin, locale)} → ${formatDate(booking.checkout, locale)}`;

  return (
    <Html lang={locale}>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          {/* Header */}
          <Section style={headerStyle}>
            <Heading as="h1" style={brandStyle}>
              Lac Hôtel Sahambavy
            </Heading>
            <Text style={tagStyle}>Madagascar · Sahambavy</Text>
          </Section>

          <Section style={contentStyle}>
            <Heading as="h2" style={h2Style}>
              {t.receivedTitle}
            </Heading>
            <Text style={paragraphStyle}>
              {t.greeting} <strong>{booking.name}</strong>,
            </Text>
            <Text style={paragraphStyle}>{t.receivedP1}</Text>

            {/* Récapitulatif */}
            <Section style={summaryBoxStyle}>
              <Heading as="h3" style={h3Style}>
                {t.summaryTitle}
              </Heading>

              <Row label={t.checkin} value={formatDate(booking.checkin, locale)} />
              <Row label={t.checkout} value={formatDate(booking.checkout, locale)} />
              <Row
                label={nights > 1 ? t.nightsPlural : t.nights}
                value={String(nights)}
                emphasis
              />
              <Row
                label={t.guests}
                value={formatOccupancy(locale, {
                  guests: booking.guests,
                  adults: booking.adults,
                  children: booking.children,
                  rooms: booking.rooms,
                })}
              />
              <Row label={t.room} value={roomLabel} />
              <Row label={t.pension} value={pensionLabel} />
              <Row label={t.rate} value={rateLabel} />
              <Row label={t.transfer} value={transferLabel} />
              {booking.arrivalTime ? (
                <Row label={t.arrivalTime} value={booking.arrivalTime} />
              ) : null}
            </Section>

            {/* Message */}
            {booking.message ? (
              <Section style={messageBoxStyle}>
                <Text style={messageLabelStyle}>{t.messageTitle}</Text>
                <Text style={messageTextStyle}>{booking.message}</Text>
              </Section>
            ) : null}

            {/* Next steps */}
            <Heading as="h3" style={h3Style}>
              {t.nextStepsTitle}
            </Heading>
            {t.nextSteps.map((step: string, i: number) => (
              <Text key={i} style={stepStyle}>
                <span style={bulletStyle}>●</span> {step}
              </Text>
            ))}

            {/* WhatsApp CTA */}
            <Section style={{ textAlign: "center", marginTop: "32px" }}>
              <Button
                href={`https://wa.me/${siteConfig.whatsapp.replace(/^\+/, "")}`}
                style={buttonStyle}
              >
                {t.contactWhatsapp}
              </Button>
            </Section>

            <Hr style={hrStyle} />

            {/* Signature */}
            <Text style={signatureStyle}>{t.signature}</Text>
            <Text style={contactLineStyle}>
              <Link href={`mailto:${siteConfig.email}`} style={linkStyle}>
                {siteConfig.email}
              </Link>{" "}
              · {siteConfig.phone}
            </Text>

            {/* Footer */}
            <Text style={footerStyle}>{t.footerLegal}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

/* ───── Helper sub-component ─────────────────────────────── */
function Row({
  label,
  value,
  emphasis,
}: {
  label: string;
  value: string;
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
  backgroundColor: EMAIL_COLORS.cream,
  fontFamily: EMAIL_FONTS.body,
  margin: 0,
  padding: "32px 16px",
} as const;

const containerStyle = {
  maxWidth: "600px",
  margin: "0 auto",
  backgroundColor: EMAIL_COLORS.white,
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: "0 4px 20px rgba(44,24,16,0.08)",
} as const;

const headerStyle = {
  backgroundColor: EMAIL_COLORS.brown,
  padding: "32px 24px",
  textAlign: "center" as const,
};

const brandStyle = {
  color: EMAIL_COLORS.cream,
  fontFamily: EMAIL_FONTS.heading,
  fontSize: "28px",
  fontWeight: 400,
  margin: 0,
  letterSpacing: "0.02em",
};

const tagStyle = {
  color: EMAIL_COLORS.goldLight,
  fontSize: "12px",
  letterSpacing: "0.15em",
  textTransform: "uppercase" as const,
  margin: "8px 0 0",
};

const contentStyle = { padding: "32px 28px" };

const h2Style = {
  color: EMAIL_COLORS.brown,
  fontFamily: EMAIL_FONTS.heading,
  fontSize: "22px",
  fontWeight: 400,
  margin: "0 0 16px",
};

const h3Style = {
  color: EMAIL_COLORS.brown,
  fontFamily: EMAIL_FONTS.heading,
  fontSize: "18px",
  fontWeight: 400,
  margin: "24px 0 12px",
};

const paragraphStyle = {
  color: EMAIL_COLORS.muted,
  fontSize: "15px",
  lineHeight: 1.65,
  margin: "0 0 14px",
};

const summaryBoxStyle = {
  backgroundColor: EMAIL_COLORS.cream,
  border: `1px solid ${EMAIL_COLORS.border}`,
  borderRadius: "8px",
  padding: "20px 22px",
  margin: "20px 0",
};

const rowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "baseline",
  margin: "6px 0",
  fontSize: "14px",
  lineHeight: 1.5,
};

const labelStyle = {
  color: EMAIL_COLORS.muted,
  flex: "0 0 auto",
  marginRight: "16px",
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
  padding: "8px 16px",
  margin: "16px 0",
  backgroundColor: "#FAFAF6",
};

const messageLabelStyle = {
  color: EMAIL_COLORS.gold,
  fontSize: "11px",
  letterSpacing: "0.12em",
  textTransform: "uppercase" as const,
  margin: "0 0 4px",
  fontWeight: 600,
};

const messageTextStyle = {
  color: EMAIL_COLORS.muted,
  fontSize: "14px",
  lineHeight: 1.6,
  margin: 0,
  fontStyle: "italic",
};

const stepStyle = {
  color: EMAIL_COLORS.muted,
  fontSize: "14px",
  lineHeight: 1.6,
  margin: "8px 0",
  paddingLeft: "16px",
};

const bulletStyle = {
  color: EMAIL_COLORS.gold,
  marginRight: "8px",
};

const buttonStyle = {
  backgroundColor: "#25D366",
  color: EMAIL_COLORS.white,
  fontSize: "14px",
  fontWeight: 600,
  padding: "14px 28px",
  borderRadius: "999px",
  textDecoration: "none",
  display: "inline-block",
};

const hrStyle = {
  border: "none",
  borderTop: `1px solid ${EMAIL_COLORS.border}`,
  margin: "28px 0 20px",
};

const signatureStyle = {
  color: EMAIL_COLORS.brown,
  fontFamily: EMAIL_FONTS.heading,
  fontSize: "15px",
  fontStyle: "italic",
  margin: "0 0 4px",
};

const contactLineStyle = {
  color: EMAIL_COLORS.muted,
  fontSize: "13px",
  margin: "0 0 20px",
};

const linkStyle = {
  color: EMAIL_COLORS.gold,
  textDecoration: "none",
};

const footerStyle = {
  color: "#8A8580",
  fontSize: "11px",
  lineHeight: 1.5,
  margin: "20px 0 0",
  borderTop: `1px solid ${EMAIL_COLORS.border}`,
  paddingTop: "16px",
  fontStyle: "italic",
};

export default BookingConfirmation;
