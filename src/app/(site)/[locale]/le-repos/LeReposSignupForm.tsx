"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, type FormEvent } from "react";
import { siteConfig } from "@/data/site";

export default function LeReposSignupForm({ dict }: { dict: any }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent("Le Repos, inscription avant-première");
    const body = encodeURIComponent(
      `${dict.repos.formNameLabel ?? "Nom"}: ${name}\nEmail: ${email}`
    );
    window.location.href = `mailto:${siteConfig.email}?subject=${subject}&body=${body}`;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
          {dict.repos.formNameLabel}
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-[3px] border border-hairline bg-paper px-4 py-3 text-ink placeholder:text-muted/60 focus:border-lake focus:outline-none focus:ring-1 focus:ring-lake"
          placeholder={dict.repos.formNamePlaceholder}
        />
      </div>
      <div>
        <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
          Email
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-[3px] border border-hairline bg-paper px-4 py-3 text-ink placeholder:text-muted/60 focus:border-lake focus:outline-none focus:ring-1 focus:ring-lake"
          placeholder={dict.repos.formEmailPlaceholder}
        />
      </div>

      <button type="submit" className="ge-cta w-full">
        {dict.repos.formSubmit}
      </button>
    </form>
  );
}
