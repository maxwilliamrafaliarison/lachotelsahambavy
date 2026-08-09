/**
 * Page de confirmation post-envoi — COMPOSANT SERVEUR.
 *
 * Dernière page du site à rester cliente : son HTML ne contenait aucun
 * titre, et le visiteur voyait « … » le temps que le dictionnaire arrive.
 * Sur l'écran qui suit immédiatement une demande de réservation, c'était
 * le pire moment pour un blanc.
 *
 * Rien n'imposait le client : les paramètres d'URL se lisent en prop
 * `searchParams` côté serveur, et le noindex passe par generateMetadata
 * au lieu d'une balise injectée à la main dans le <head>.
 */

import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { getDictionary } from "@/i18n/getDictionary";
import { locales, type Locale } from "@/lib/utils";
import { siteConfig } from "@/data/site";
import RecapSejour from "@/components/booking/RecapSejour";

/* eslint-disable @typescript-eslint/no-explicit-any */


export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return {
    title: dict.booking?.confirmation?.title ?? "Demande reçue",
    /* Le noindex venait d'une balise créée à la main dans un useEffect,
       parce que l'API metadata ne s'applique pas aux pages clientes.
       La page étant redevenue serveur, il repasse par l'API. */
    robots: { index: false, follow: false },
  };
}

function ConfirmationContent({ locale, dict }: { locale: Locale; dict: any }) {
  const c = dict.booking?.confirmation ?? {};


  return (
    <main className="min-h-[80vh] bg-paper flex items-center justify-center px-4 py-24">
      <div className="max-w-[640px] w-full text-center">
        {/* Success badge */}
        <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-gold/15 flex items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-10 h-10 text-gold"
            aria-hidden
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>

        <h1 className="text-3xl md:text-4xl text-ink mb-3 font-normal">
          {c.title || "Demande reçue !"}
        </h1>
        {/* Suspense OBLIGATOIRE : `useSearchParams` dans une page prérendue
            fait échouer le prérendu sans lui — « couldn't be rendered
            statically ». Le repli réserve la même hauteur que les deux
            lignes qu'il remplace, pour que rien ne saute à l'hydratation. */}
        <Suspense fallback={<div className="mb-10 h-[3.5rem]" />}>
          <RecapSejour
            locale={locale}
            gabaritSousTitre={c.subtitle || "Merci {name}"}
            gabaritSejour={c.stayInfo || "Séjour : {checkin} → {checkout}"}
          />
        </Suspense>

        {/* Next-steps card */}
        <div className="bg-white rounded-[3px] p-6 md:p-8 text-left shadow-sm border border-ink/5 space-y-4">
          <p className="text-sm text-muted leading-relaxed">{c.p1 || ""}</p>
          <p className="text-sm text-muted leading-relaxed">{c.p2 || ""}</p>
          <p className="text-sm text-muted leading-relaxed">{c.p3 || ""}</p>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center mt-10">
          <a
            href={`https://wa.me/${siteConfig.whatsapp.replace(/^\+/, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] text-white px-7 py-3 rounded-full text-sm font-semibold hover:bg-[#20bd5a] transition-colors shadow-md"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
            </svg>
            {c.whatsappCta || "Contacter par WhatsApp"}
          </a>
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 border border-ink/20 text-ink px-7 py-3 rounded-full text-sm font-medium hover:bg-ink/5 transition-colors"
          >
            {c.backHome || "Retour à l'accueil"}
          </Link>
        </div>
      </div>
    </main>
  );
}

export default async function ReservationConfirmationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return <ConfirmationContent locale={locale as Locale} dict={dict} />;
}
