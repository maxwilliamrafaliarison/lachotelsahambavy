import type { Metadata } from "next";
import RootShell from "@/app/root-shell";

/**
 * Chrome commun de l'espace équipe (français uniquement, outil interne).
 * La garde d'authentification vit dans le groupe (protege)/ ; la page de
 * connexion reste accessible. Espace exclu de l'export statique GitHub Pages.
 */
export const metadata: Metadata = {
  title: { default: "Espace équipe · Lac Hôtel Sahambavy", template: "%s · Espace équipe Lac Hôtel" },
  robots: { index: false, follow: false },
};

/** Layout RACINE de l'espace équipe : il rend son propre <html>, l'outil
 *  étant hors du segment [locale]. Français uniquement, comme l'interface. */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RootShell lang="fr">
      <div className="min-h-screen bg-paper">{children}</div>
    </RootShell>
  );
}
