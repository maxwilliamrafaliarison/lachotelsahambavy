"use client";

import { useState, type FormEvent } from "react";
import { siteConfig } from "@/data/site";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function TheicoleBookingForm({ dict }: { dict: any }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [persons, setPersons] = useState("2");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent("Réservation visite de la Plantation de Thé");
    const body = encodeURIComponent(
      `Nom: ${name}\nEmail: ${email}\nDate: ${date}\nPersonnes: ${persons}`
    );
    window.location.href = `mailto:${siteConfig.email}?subject=${subject}&body=${body}`;
  }

  /* Ce formulaire vivait encore sur les jetons hérités (cream, brown-deep)
     et sur des rayons `rounded-[3px]` étrangers à la charte — alors qu'il est
     posé sur fond nuit, où le vocabulaire est lin / champagne / encre. Il
     n'était même pas listé parmi les consommateurs LEGACY connus. */
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-night-body text-sm mb-2">{dict.contact.form.name}</label>
          <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-[3px] bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-champagne/60" />
        </div>
        <div>
          <label className="block text-night-body text-sm mb-2">Email</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-[3px] bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-champagne/60" />
        </div>
        <div>
          <label className="block text-night-body text-sm mb-2">{dict.contact.form.checkin}</label>
          <input type="date" required value={date} onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-3 rounded-[3px] bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-champagne/60" />
        </div>
        <div>
          <label className="block text-night-body text-sm mb-2">{dict.contact.form.guests}</label>
          <select value={persons} onChange={(e) => setPersons(e.target.value)}
            className="w-full px-4 py-3 rounded-[3px] bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-champagne/60">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <option key={n} value={n} className="text-ink">{n}</option>
            ))}
          </select>
        </div>
      </div>
      <button type="submit" className="ge-cta w-full justify-center">
        {dict.contact.form.submit}
      </button>
    </form>
  );
}
