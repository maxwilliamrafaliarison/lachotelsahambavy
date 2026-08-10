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
  const [visible, setVisible] = useState(false);

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
        Outil interne du Lac Hôtel Sahambavy. Accès réservé à l&apos;équipe.
      </p>

      <label
        htmlFor="email"
        className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.14em] text-body"
      >
        E-mail
      </label>
      <input
        id="email"
        type="email"
        required
        autoComplete="username"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-5 w-full rounded-[3px] border border-hairline bg-white px-3.5 py-2.5 text-[15px] text-ink outline-none transition-colors focus:border-lake"
      />

      <label
        htmlFor="mot-de-passe"
        className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.14em] text-body"
      >
        Mot de passe
      </label>
      <div className="relative mb-6">
        <input
          id="mot-de-passe"
          type={visible ? "text" : "password"}
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-[3px] border border-hairline bg-white py-2.5 pl-3.5 pr-12 text-[15px] text-ink outline-none transition-colors focus:border-lake"
        />
        {/* Affichage en clair, standard des formulaires de connexion : le
            mot de passe saisi à l'aveugle est la première cause d'échec.
            type="button" pour ne pas soumettre le formulaire. */}
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          aria-pressed={visible}
          title={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-muted transition-colors hover:text-lake focus-visible:text-lake"
        >
          {visible ? (
            /* Œil barré */
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
              <path d="M3 3l18 18" />
              <path d="M10.6 10.6a2 2 0 002.8 2.8" />
              <path d="M9.4 5.2A9.5 9.5 0 0112 5c5 0 9 4.5 9 7 0 1-.7 2.3-1.9 3.5M6.5 6.6C4.2 8.1 3 10.2 3 12c0 2.5 4 7 9 7 1.4 0 2.7-.35 3.8-.9" />
            </svg>
          ) : (
            /* Œil */
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
              <path d="M3 12s3.5-7 9-7 9 7 9 7-3.5 7-9 7-9-7-9-7Z" />
              <circle cx="12" cy="12" r="2.6" />
            </svg>
          )}
        </button>
      </div>

      {error && (
        <p role="alert" className="mb-5 rounded-[3px] border border-copper/40 bg-copper/10 px-3.5 py-2.5 text-[13px] text-copper">
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
