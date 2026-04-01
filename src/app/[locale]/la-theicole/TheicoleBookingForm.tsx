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
    const subject = encodeURIComponent("Excursion Théicole — Réservation");
    const body = encodeURIComponent(
      `Nom: ${name}\nEmail: ${email}\nDate: ${date}\nPersonnes: ${persons}`
    );
    window.location.href = `mailto:${siteConfig.email}?subject=${subject}&body=${body}`;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-cream/80 text-sm mb-2">{dict.contact.form.name}</label>
          <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cream/50" />
        </div>
        <div>
          <label className="block text-cream/80 text-sm mb-2">Email</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cream/50" />
        </div>
        <div>
          <label className="block text-cream/80 text-sm mb-2">{dict.contact.form.checkin}</label>
          <input type="date" required value={date} onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-cream/50" />
        </div>
        <div>
          <label className="block text-cream/80 text-sm mb-2">{dict.contact.form.guests}</label>
          <select value={persons} onChange={(e) => setPersons(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-cream/50">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <option key={n} value={n} className="text-brown-deep">{n}</option>
            ))}
          </select>
        </div>
      </div>
      <button type="submit" className="w-full py-4 bg-cream text-brown-deep font-semibold rounded-lg hover:bg-white transition-colors duration-300">
        {dict.contact.form.submit}
      </button>
    </form>
  );
}
