"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, type FormEvent } from "react";
import { siteConfig } from "@/data/site";

export default function LeReposSignupForm({ dict }: { dict: any }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent("Le Repos — Inscription avant-première");
    const body = encodeURIComponent(
      `${dict.repos.formNameLabel ?? "Nom"}: ${name}\nEmail: ${email}`
    );
    window.location.href = `mailto:${siteConfig.email}?subject=${subject}&body=${body}`;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-text-muted text-sm mb-2">
          {dict.repos.formNameLabel}
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-brown-deep/20 bg-white text-brown-deep placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-brown-deep/30"
          placeholder={dict.repos.formNamePlaceholder}
        />
      </div>
      <div>
        <label className="block text-text-muted text-sm mb-2">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-brown-deep/20 bg-white text-brown-deep placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-brown-deep/30"
          placeholder={dict.repos.formEmailPlaceholder}
        />
      </div>

      <button
        type="submit"
        className="w-full py-4 bg-brown-deep text-cream font-semibold rounded-lg hover:bg-brown-deep/90 transition-colors duration-300"
      >
        {dict.repos.formSubmit}
      </button>
    </form>
  );
}
