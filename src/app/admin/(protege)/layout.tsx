import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/admin/auth";

/** Garde : toute page du groupe exige une session. */
export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/admin/connexion");

  return (
    <>
      <header className="border-b border-hairline bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-6">
          <Link href="/admin" className="flex items-baseline gap-2.5 text-ink">
            <span className="font-[family-name:var(--font-display)] text-[15px] font-light tracking-[0.16em]">
              LAC HÔTEL
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-[0.24em] text-tea">
              Espace équipe
            </span>
          </Link>
          <nav className="ml-auto flex items-center gap-5 text-[13px] text-body">
            <Link href="/admin/proforma" className="transition-colors hover:text-tea">
              Facture proforma
            </Link>
            <Link href="/admin/aide" className="transition-colors hover:text-tea">
              Aide
            </Link>
            <span className="hidden text-muted sm:inline">{session.user.name}</span>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/admin/connexion" });
              }}
            >
              <button
                type="submit"
                className="rounded-full border border-hairline px-3.5 py-1.5 text-[12px] text-body transition-colors hover:border-tea hover:text-tea"
              >
                Déconnexion
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </>
  );
}
