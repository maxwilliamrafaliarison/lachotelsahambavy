import Link from "next/link";
import RootShell from "@/app/root-shell";
import { siteConfig } from "@/data/site";

/**
 * Page 404 du site.
 *
 * IL N'Y EN AVAIT PAS. Toute URL inconnue servait l'écran nu de Next,
 * « 404: This page could not be found. », en anglais, sans un lien pour
 * revenir. Sur un site trilingue dont le marché premier est francophone,
 * c'était une sortie de route sèche : le visiteur qui suivait un vieux
 * lien ou faisait une faute de frappe n'avait plus qu'à fermer l'onglet.
 *
 * ELLE REND SA PROPRE COQUE HTML. Le site a plusieurs layouts racines,
 * un par groupe de routes, pour que `<html lang>` porte la langue de la
 * page. Cette page-ci vit AU-DESSUS de ces groupes : aucun layout ne
 * l'enveloppe, elle doit donc passer par RootShell elle-même. C'est aussi
 * ce qui lui donne les polices et la feuille de styles.
 *
 * ELLE PARLE FRANÇAIS, faute de mieux. Une 404 déclenchée hors du segment
 * [locale] ne connaît pas la langue demandée : Next ne lui passe aucun
 * paramètre. Plutôt que de deviner, elle s'annonce en français, la langue
 * du marché premier, et propose les trois portes d'entrée. Le visiteur
 * anglophone ou hispanophone voit son drapeau et clique.
 *
 * ELLE NE PROPOSE PAS DE RECHERCHE, le site n'en ayant pas. Elle propose
 * ce qui existe : l'accueil dans les trois langues, et les deux pages
 * vers lesquelles vont la plupart des visiteurs égarés.
 */

export const metadata = {
  title: "Page introuvable · Lac Hôtel Sahambavy",
  robots: { index: false, follow: true },
};

const LANGUES = [
  { code: "fr", drapeau: "🇫🇷", nom: "Français" },
  { code: "en", drapeau: "🇬🇧", nom: "English" },
  { code: "es", drapeau: "🇪🇸", nom: "Español" },
] as const;

export default function PageIntrouvable() {
  return (
    <RootShell lang="fr">
      <main className="flex min-h-[100svh] flex-col items-center justify-center px-6 py-20 text-center">
        <span className="ge-label mb-5">Erreur 404</span>

        <h1 className="mb-5 text-[34px] leading-tight md:text-[44px]" style={{ textWrap: "balance" }}>
          Cette page n’existe pas
        </h1>

        <p className="ge-measure mb-10 text-[15px] leading-relaxed text-body md:text-base">
          Le lien que vous avez suivi est peut-être ancien, ou l’adresse comporte une
          coquille. Le lac, lui, n’a pas bougé.
        </p>

        <div className="mb-12 flex flex-col items-center gap-3 sm:flex-row">
          <Link href="/fr/" className="ge-cta">
            Retour à l’accueil
          </Link>
          <Link href="/fr/hebergements/" className="ge-cta ge-cta--ghost">
            Voir les hébergements
          </Link>
        </div>

        {/* Les trois portes d'entrée : c'est la seule façon, sans connaître
            la langue demandée, de ne pas laisser un visiteur anglophone ou
            hispanophone devant une page qu'il ne lit pas. */}
        <nav aria-label="Choisir la langue" className="flex items-center gap-5">
          {LANGUES.map(({ code, drapeau, nom }) => (
            <Link
              key={code}
              href={`/${code}/`}
              hrefLang={code}
              className="flex items-center gap-2 text-[13px] text-muted transition-colors hover:text-terracotta"
            >
              <span aria-hidden="true">{drapeau}</span>
              {nom}
            </Link>
          ))}
        </nav>

        <p className="mt-12 text-[12px] text-muted">
          Une question ?{" "}
          <a
            href={`mailto:${siteConfig.email}`}
            className="underline decoration-terracotta/40 underline-offset-2 transition-colors hover:text-terracotta"
          >
            {siteConfig.email}
          </a>
        </p>
      </main>
    </RootShell>
  );
}
