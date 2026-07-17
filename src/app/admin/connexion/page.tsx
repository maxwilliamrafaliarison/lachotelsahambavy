"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { signIn } from "next-auth/react";

/**
 * N'autorise qu'une destination interne (chemin relatif same-origin) : bloque
 * l'open redirect via ?callbackUrl=https://evil.com ou //evil.com (phishing
 * post-connexion). Cf. revue sécurité 16/07/2026.
 */
function safeCallback(cb: string | null): string {
  if (cb && cb.startsWith("/") && !cb.startsWith("//") && !cb.startsWith("/\\")) return cb;
  return "/admin";
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await signIn("credentials", { email, password, redirect: false });
    setBusy(false);
    if (res?.error) {
      setError("E-mail ou mot de passe incorrect.");
      return;
    }
    router.push(safeCallback(params.get("callbackUrl")));
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-sm">
      <p className="ge-label mb-2">Espace équipe</p>
      <h1 className="mb-2 !text-[34px]">Connexion</h1>
      <p className="mb-8 text-[14px] text-muted">
        Outil interne du Lac Hôtel Sahambavy — accès réservé à l&apos;équipe.
      </p>

      <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.14em] text-body">
        E-mail
      </label>
      <input
        type="email"
        required
        autoComplete="username"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-5 w-full rounded border border-hairline bg-white px-3.5 py-2.5 text-[15px] text-ink outline-none transition-colors focus:border-tea"
      />

      <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.14em] text-body">
        Mot de passe
      </label>
      <input
        type="password"
        required
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-6 w-full rounded border border-hairline bg-white px-3.5 py-2.5 text-[15px] text-ink outline-none transition-colors focus:border-tea"
      />

      {error && (
        <p role="alert" className="mb-5 rounded border border-copper/40 bg-copper/10 px-3.5 py-2.5 text-[13px] text-copper">
          {error}
        </p>
      )}

      <button type="submit" disabled={busy} className="ge-cta w-full disabled:opacity-60">
        {busy ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}

export default function ConnexionPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
