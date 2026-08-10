import RootShell from "@/app/root-shell";

/**
 * Layout racine de « / », la seule route hors du segment [locale].
 * La page qu'il enveloppe ne fait que rediriger vers /fr/ et n'affiche
 * rien, mais Next exige qu'une page ait un layout racine rendant <html>.
 */
export default function RacineLayout({ children }: { children: React.ReactNode }) {
  return <RootShell lang="fr">{children}</RootShell>;
}
