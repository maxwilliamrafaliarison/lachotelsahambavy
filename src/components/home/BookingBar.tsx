"use client";

import { useState, useRef, useEffect } from "react";
import { siteConfig } from "@/data/site";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface RoomConfig {
  adults: number;
  children: number;
}

export default function BookingBar({ dict }: { dict: any }) {
  const b = dict.bookingBar;
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [rooms, setRooms] = useState<RoomConfig[]>([{ adults: 2, children: 0 }]);
  const [rate, setRate] = useState("standard");
  const [guestsOpen, setGuestsOpen] = useState(false);
  const [rateOpen, setRateOpen] = useState(false);
  const guestsRef = useRef<HTMLDivElement>(null);
  const rateRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (guestsRef.current && !guestsRef.current.contains(e.target as Node)) {
        setGuestsOpen(false);
      }
      if (rateRef.current && !rateRef.current.contains(e.target as Node)) {
        setRateOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const totalAdults = rooms.reduce((sum, r) => sum + r.adults, 0);
  const totalChildren = rooms.reduce((sum, r) => sum + r.children, 0);

  const guestsSummary = [
    `${rooms.length} ${rooms.length > 1 ? b.roomPlural : b.room}`,
    `${totalAdults} ${totalAdults > 1 ? b.adultPlural : b.adult}`,
    ...(totalChildren > 0
      ? [`${totalChildren} ${totalChildren > 1 ? b.childPlural : b.child}`]
      : []),
  ].join(", ");

  const rateLabels: Record<string, string> = {
    standard: b.rateStandard,
    to: b.rateTo,
    promo: b.ratePromo,
  };

  function updateRoom(index: number, field: "adults" | "children", delta: number) {
    setRooms((prev) =>
      prev.map((r, i) => {
        if (i !== index) return r;
        const val = r[field] + delta;
        if (field === "adults") return { ...r, adults: Math.max(1, Math.min(6, val)) };
        return { ...r, children: Math.max(0, Math.min(4, val)) };
      })
    );
  }

  function addRoom() {
    if (rooms.length < 4) {
      setRooms((prev) => [...prev, { adults: 2, children: 0 }]);
    }
  }

  function removeRoom(index: number) {
    if (rooms.length > 1) {
      setRooms((prev) => prev.filter((_, i) => i !== index));
    }
  }

  // Format date for display
  function formatDate(dateStr: string) {
    if (!dateStr) return b.selectDate;
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString(undefined, { day: "numeric", month: "short" });
  }

  // Today's date for min attribute
  const today = new Date().toISOString().split("T")[0];

  function handleSubmit() {
    const rateText = rateLabels[rate];
    const roomDetails = rooms
      .map(
        (r, i) =>
          `  Chambre ${i + 1}: ${r.adults} adulte(s), ${r.children} enfant(s)`
      )
      .join("\n");

    const subject = encodeURIComponent(
      `Demande de réservation — Lac Hôtel Sahambavy`
    );
    const body = encodeURIComponent(
      `Bonjour,\n\nJe souhaite réserver :\n\n` +
        `Arrivée : ${checkin || "Non précisé"}\n` +
        `Départ : ${checkout || "Non précisé"}\n\n` +
        `Hébergement :\n${roomDetails}\n\n` +
        `Tarif souhaité : ${rateText}\n\n` +
        `Merci de me confirmer la disponibilité.\n\nCordialement`
    );

    window.location.href = `mailto:${siteConfig.email}?subject=${subject}&body=${body}`;
  }

  return (
    <div className="booking-bar">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="booking-bar__inner">
          {/* Check-in */}
          <div className="booking-bar__field">
            <label className="booking-bar__label">{b.checkin}</label>
            <div className="booking-bar__input-wrap">
              <svg className="booking-bar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
              <input
                type="date"
                value={checkin}
                min={today}
                onChange={(e) => {
                  setCheckin(e.target.value);
                  if (checkout && e.target.value > checkout) setCheckout("");
                }}
                className="booking-bar__date"
              />
              <span className="booking-bar__date-display">{formatDate(checkin)}</span>
            </div>
          </div>

          <div className="booking-bar__divider" />

          {/* Check-out */}
          <div className="booking-bar__field">
            <label className="booking-bar__label">{b.checkout}</label>
            <div className="booking-bar__input-wrap">
              <svg className="booking-bar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
              <input
                type="date"
                value={checkout}
                min={checkin || today}
                onChange={(e) => setCheckout(e.target.value)}
                className="booking-bar__date"
              />
              <span className="booking-bar__date-display">{formatDate(checkout)}</span>
            </div>
          </div>

          <div className="booking-bar__divider" />

          {/* Rooms & Guests */}
          <div className="booking-bar__field" ref={guestsRef}>
            <label className="booking-bar__label">{b.rooms} & {b.guests}</label>
            <button
              type="button"
              onClick={() => { setGuestsOpen(!guestsOpen); setRateOpen(false); }}
              className="booking-bar__input-wrap booking-bar__trigger"
            >
              <svg className="booking-bar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
              </svg>
              <span className="text-sm truncate">{guestsSummary}</span>
              <svg className={`w-4 h-4 ml-auto transition-transform flex-shrink-0 ${guestsOpen ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {guestsOpen && (
              <div className="booking-bar__dropdown booking-bar__dropdown--guests">
                {rooms.map((room, i) => (
                  <div key={i} className="booking-bar__room-config">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-brown-deep">
                        {b.room} {i + 1}
                      </span>
                      {rooms.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRoom(i)}
                          className="text-xs text-red-500 hover:text-red-700"
                        >
                          {b.removeRoom}
                        </button>
                      )}
                    </div>
                    {/* Adults */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-text-muted">{b.adults}</span>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => updateRoom(i, "adults", -1)}
                          className="booking-bar__stepper"
                          disabled={room.adults <= 1}
                        >
                          -
                        </button>
                        <span className="text-sm font-medium w-4 text-center">{room.adults}</span>
                        <button
                          type="button"
                          onClick={() => updateRoom(i, "adults", 1)}
                          className="booking-bar__stepper"
                          disabled={room.adults >= 6}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    {/* Children */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-muted">{b.children}</span>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => updateRoom(i, "children", -1)}
                          className="booking-bar__stepper"
                          disabled={room.children <= 0}
                        >
                          -
                        </button>
                        <span className="text-sm font-medium w-4 text-center">{room.children}</span>
                        <button
                          type="button"
                          onClick={() => updateRoom(i, "children", 1)}
                          className="booking-bar__stepper"
                          disabled={room.children >= 4}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {rooms.length < 4 && (
                  <button
                    type="button"
                    onClick={addRoom}
                    className="w-full text-sm text-gold hover:text-gold-light font-medium py-2 border-t border-brown-deep/10 mt-2"
                  >
                    + {b.addRoom}
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="booking-bar__divider" />

          {/* Rate selector */}
          <div className="booking-bar__field" ref={rateRef}>
            <label className="booking-bar__label">{b.rate}</label>
            <button
              type="button"
              onClick={() => { setRateOpen(!rateOpen); setGuestsOpen(false); }}
              className="booking-bar__input-wrap booking-bar__trigger"
            >
              <svg className="booking-bar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
              </svg>
              <span className="text-sm truncate">{rateLabels[rate]}</span>
              <svg className={`w-4 h-4 ml-auto transition-transform flex-shrink-0 ${rateOpen ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {rateOpen && (
              <div className="booking-bar__dropdown">
                {(["standard", "to", "promo"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => { setRate(r); setRateOpen(false); }}
                    className={`block w-full text-left px-4 py-3 text-sm transition-colors ${
                      rate === r
                        ? "bg-gold/10 text-gold font-semibold"
                        : "text-text-body hover:bg-cream"
                    }`}
                  >
                    {rateLabels[r]}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="button"
            onClick={handleSubmit}
            className="booking-bar__submit"
          >
            {b.submit}
          </button>
        </div>
      </div>
    </div>
  );
}
