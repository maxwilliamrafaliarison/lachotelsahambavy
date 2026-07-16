import type { Metadata } from "next";

/**
 * Chrome commun de l'espace équipe (français uniquement — outil interne).
 * La garde d'authentification vit dans le groupe (protege)/ ; la page de
 * connexion reste accessible. Espace exclu de l'export statique GitHub Pages.
 */
export const metadata: Metadata = {
  title: { default: "Espace équipe — Lac Hôtel Sahambavy", template: "%s · Espace équipe Lac Hôtel" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-paper">{children}</div>;
}
