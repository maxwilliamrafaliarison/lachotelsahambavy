"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface RoomConfig {
  adults: number;
  children: number;
}

/* ─── Mini Calendar Component ─── */
function MiniCalendar({
  value,
  onChange,
  minDate,
  locale,
}: {
  value: string;
  onChange: (d: string) => void;
  minDate?: string;
  locale: string;
}) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const min = minDate ? new Date(minDate + "T00:00:00") : now;

  const initDate = value ? new Date(value + "T00:00:00") : now;
  const [viewYear, setViewYear] = useState(initDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initDate.getMonth());

  const monthNames: Record<string, string[]> = {
    fr: ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"],
    en: ["January","February","March","April","May","June","July","August","September","October","November","December"],
    es: ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],
  };
  const dayNames: Record<string, string[]> = {
    fr: ["Lu","Ma","Me","Je","Ve","Sa","Di"],
    en: ["Mo","Tu","We","Th","Fr","Sa","Su"],
    es: ["Lu","Ma","Mi","Ju","Vi","Sá","Do"],
  };

  const months = monthNames[locale] || monthNames.fr;
  const days = dayNames[locale] || dayNames.fr;

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }

  const firstDay = new Date(viewYear, viewMonth, 1);
  let startDow = firstDay.getDay() - 1;
  if (startDow < 0) startDow = 6;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  function toISO(day: number) {
    return `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }
  function isDisabled(day: number) {
    return new Date(viewYear, viewMonth, day) < min;
  }
  function isSelected(day: number) {
    return value === toISO(day);
  }
  function isToday(day: number) {
    return now.getDate() === day && now.getMonth() === viewMonth && now.getFullYear() === viewYear;
  }

  const canPrev = viewYear > now.getFullYear() || (viewYear === now.getFullYear() && viewMonth > now.getMonth());

  return (
    <div className="w-[290px] select-none" onClick={e => e.stopPropagation()}>
      <div className="flex items-center justify-between mb-3 px-1">
        <button type="button" onClick={prevMonth} disabled={!canPrev}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gold/15 transition-colors disabled:opacity-20 text-paper">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <span className="text-sm font-semibold text-gold">{months[viewMonth]} {viewYear}</span>
        <button type="button" onClick={nextMonth}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gold/15 transition-colors text-paper">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>
      <div className="grid grid-cols-7 mb-1">
        {days.map(d => (
          <div key={d} className="text-center text-[0.625rem] font-semibold text-paper/40 uppercase py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((day, i) => (
          <div key={i} className="flex items-center justify-center">
            {day ? (
              <button type="button" disabled={isDisabled(day)}
                onClick={(e) => { e.stopPropagation(); onChange(toISO(day)); }}
                className={`w-9 h-9 rounded-full text-sm transition-all
                  ${isSelected(day) ? "bg-gold text-white font-bold shadow-md"
                    : isToday(day) ? "bg-gold/20 text-gold font-semibold"
                    : isDisabled(day) ? "text-paper/15 cursor-not-allowed"
                    : "text-paper/80 hover:bg-gold/15 hover:text-gold"}`}
              >{day}</button>
            ) : <span className="w-9 h-9" />}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Booking Bar: Fixed Bottom ─── */
export default function BookingBar({ dict }: { dict: any }) {
  const b = dict.bookingBar;
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname?.split("/")[1] || "fr";

  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [rooms, setRooms] = useState<RoomConfig[]>([{ adults: 2, children: 0 }]);
  const [rate, setRate] = useState("standard");
  const [visible, setVisible] = useState(false);
  // Below `lg` (1024 px) default to minimized: the expanded 4-field bar
  // eats ~50 % of a phone viewport otherwise. Desktop keeps it expanded.
  // Safe to read `window` in the lazy initializer: the component returns
  // `null` while `visible=false`, so server and first client render both
  // emit nothing and hydration never sees the `minimized` state.
  const [minimized, setMinimized] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 1024
  );
  const userToggledRef = useRef(false);

  const [openPanel, setOpenPanel] = useState<"checkin" | "checkout" | "guests" | "rate" | null>(null);

  const checkinRef = useRef<HTMLDivElement>(null);
  const checkoutRef = useRef<HTMLDivElement>(null);
  const guestsRef = useRef<HTMLDivElement>(null);
  const rateRef = useRef<HTMLDivElement>(null);

  // Show after scrolling past hero
  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const t = e.target as Node;
      if (openPanel === "checkin" && checkinRef.current && !checkinRef.current.contains(t)) {
        setOpenPanel(null);
      } else if (openPanel === "checkout" && checkoutRef.current && !checkoutRef.current.contains(t)) {
        setOpenPanel(null);
      } else if (openPanel === "guests" && guestsRef.current && !guestsRef.current.contains(t)) {
        setOpenPanel(null);
      } else if (openPanel === "rate" && rateRef.current && !rateRef.current.contains(t)) {
        setOpenPanel(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [openPanel]);

  const totalAdults = rooms.reduce((s, r) => s + r.adults, 0);
  const totalChildren = rooms.reduce((s, r) => s + r.children, 0);

  const guestsSummary = [
    `${rooms.length} ${rooms.length > 1 ? b.roomPlural : b.room}`,
    `${totalAdults} ${totalAdults > 1 ? b.adultPlural : b.adult}`,
    ...(totalChildren > 0 ? [`${totalChildren} ${totalChildren > 1 ? b.childPlural : b.child}`] : []),
  ].join(", ");

  const rateLabels: Record<string, string> = {
    standard: b.rateStandard,
    to: b.rateTo,
  };

  function formatDateDisplay(dateStr: string) {
    if (!dateStr) return b.selectDate;
    const d = new Date(dateStr + "T00:00:00");
    const day = d.getDate();
    const mn: Record<string, string[]> = {
      fr: ["jan","fév","mar","avr","mai","jun","jul","aoû","sep","oct","nov","déc"],
      en: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
      es: ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"],
    };
    const m = mn[locale] || mn.fr;
    return `${day} ${m[d.getMonth()]} ${d.getFullYear()}`;
  }

  function updateRoom(i: number, field: "adults" | "children", delta: number) {
    setRooms(prev => prev.map((r, idx) => {
      if (idx !== i) return r;
      const val = r[field] + delta;
      if (field === "adults") return { ...r, adults: Math.max(1, Math.min(6, val)) };
      return { ...r, children: Math.max(0, Math.min(4, val)) };
    }));
  }

  function togglePanel(panel: "checkin" | "checkout" | "guests" | "rate") {
    if (minimized) {
      userToggledRef.current = true;
      setMinimized(false);
    }
    setOpenPanel(prev => prev === panel ? null : panel);
  }

  function handleSubmit() {
    const params = new URLSearchParams();
    if (checkin) params.set("checkin", checkin);
    if (checkout) params.set("checkout", checkout);
    params.set("guests", String(totalAdults + totalChildren));
    params.set("adults", String(totalAdults));
    params.set("children", String(totalChildren));
    params.set("rooms", String(rooms.length));
    params.set("rate", rate);
    setOpenPanel(null);
    router.push(`/${locale}/contact/?${params.toString()}`);
  }

  const today = new Date().toISOString().split("T")[0];

  if (!visible) return null;

  return (
    <div className={`booking-bar-fixed ${minimized ? "booking-bar-fixed--minimized" : ""}`}>
      {/* Minimize/expand toggle */}
      <button
        type="button"
        onClick={() => {
          userToggledRef.current = true;
          setMinimized(!minimized);
          setOpenPanel(null);
        }}
        className="booking-bar-fixed__toggle"
        aria-label={minimized ? "Ouvrir" : "Réduire"}
      >
        {minimized ? (
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
            </svg>
            <span className="text-[0.65rem] font-semibold uppercase tracking-[0.15em]">{b.submit}</span>
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 15l-6-6-6 6"/></svg>
          </span>
        ) : (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>
        )}
      </button>

      {/* Full bar: hidden when minimized */}
      {!minimized && (
        <div className="max-w-[1100px] mx-auto px-4">
          <div className="booking-bar__inner">
            {/* ── Check-in ── */}
            <div className="booking-bar__field" ref={checkinRef}>
              <label className="booking-bar__label">
                <svg className="booking-bar__label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
                </svg>
                {b.checkin}
              </label>
              <button type="button" onClick={() => togglePanel("checkin")} className="booking-bar__value">
                <span className={checkin ? "text-ink font-semibold" : "text-muted"}>
                  {formatDateDisplay(checkin)}
                </span>
              </button>
              {openPanel === "checkin" && (
                <div className="booking-bar__dropdown booking-bar__dropdown--calendar booking-bar__dropdown--up">
                  <MiniCalendar
                    value={checkin}
                    minDate={today}
                    locale={locale}
                    onChange={(d) => {
                      setCheckin(d);
                      if (checkout && d >= checkout) setCheckout("");
                      setTimeout(() => setOpenPanel("checkout"), 150);
                    }}
                  />
                </div>
              )}
            </div>

            <div className="booking-bar__divider" />

            {/* ── Check-out ── */}
            <div className="booking-bar__field" ref={checkoutRef}>
              <label className="booking-bar__label">
                <svg className="booking-bar__label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
                </svg>
                {b.checkout}
              </label>
              <button type="button" onClick={() => togglePanel("checkout")} className="booking-bar__value">
                <span className={checkout ? "text-ink font-semibold" : "text-muted"}>
                  {formatDateDisplay(checkout)}
                </span>
              </button>
              {openPanel === "checkout" && (
                <div className="booking-bar__dropdown booking-bar__dropdown--calendar booking-bar__dropdown--up">
                  <MiniCalendar
                    value={checkout}
                    minDate={checkin || today}
                    locale={locale}
                    onChange={(d) => {
                      setCheckout(d);
                      setOpenPanel(null);
                    }}
                  />
                </div>
              )}
            </div>

            <div className="booking-bar__divider" />

            {/* ── Rooms & Guests ── */}
            <div className="booking-bar__field" ref={guestsRef}>
              <label className="booking-bar__label">
                <svg className="booking-bar__label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
                </svg>
                {b.rooms} & {b.guests}
              </label>
              <button type="button" onClick={() => togglePanel("guests")} className="booking-bar__value">
                <span className="text-ink font-medium text-sm truncate">{guestsSummary}</span>
                <svg className={`w-3.5 h-3.5 ml-auto transition-transform flex-shrink-0 text-muted ${openPanel === "guests" ? "rotate-180" : ""}`}
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>
              </button>
              {openPanel === "guests" && (
                <div className="booking-bar__dropdown booking-bar__dropdown--guests booking-bar__dropdown--up" onClick={e => e.stopPropagation()}>
                  {rooms.map((room, i) => (
                    <div key={i} className="booking-bar__room-config">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-gold capitalize">{b.room} {i + 1}</span>
                        {rooms.length > 1 && (
                          <button type="button" onClick={() => setRooms(p => p.filter((_, idx) => idx !== i))}
                            className="text-xs text-red-400 hover:text-red-300 transition-colors">{b.removeRoom}</button>
                        )}
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-paper/60">{b.adults}</span>
                        <div className="flex items-center gap-3">
                          <button type="button" onClick={() => updateRoom(i, "adults", -1)} className="booking-bar__stepper" disabled={room.adults <= 1}>-</button>
                          <span className="text-sm font-semibold w-5 text-center text-paper">{room.adults}</span>
                          <button type="button" onClick={() => updateRoom(i, "adults", 1)} className="booking-bar__stepper" disabled={room.adults >= 6}>+</button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-paper/60">{b.children}</span>
                        <div className="flex items-center gap-3">
                          <button type="button" onClick={() => updateRoom(i, "children", -1)} className="booking-bar__stepper" disabled={room.children <= 0}>-</button>
                          <span className="text-sm font-semibold w-5 text-center text-paper">{room.children}</span>
                          <button type="button" onClick={() => updateRoom(i, "children", 1)} className="booking-bar__stepper" disabled={room.children >= 4}>+</button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {rooms.length < 4 && (
                    <button type="button" onClick={() => setRooms(p => [...p, { adults: 2, children: 0 }])}
                      className="w-full text-sm text-gold hover:text-champagne font-medium py-2.5 border-t border-gold/15 mt-1 transition-colors">
                      + {b.addRoom}
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="booking-bar__divider" />

            {/* ── Rate ── */}
            <div className="booking-bar__field" ref={rateRef}>
              <label className="booking-bar__label">
                <svg className="booking-bar__label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
                </svg>
                {b.rate}
              </label>
              <button type="button" onClick={() => togglePanel("rate")} className="booking-bar__value">
                <span className="text-ink font-medium text-sm truncate">{rateLabels[rate]}</span>
                <svg className={`w-3.5 h-3.5 ml-auto transition-transform flex-shrink-0 text-muted ${openPanel === "rate" ? "rotate-180" : ""}`}
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>
              </button>
              {openPanel === "rate" && (
                <div className="booking-bar__dropdown booking-bar__dropdown--up" onClick={e => e.stopPropagation()}>
                  {(["standard", "to"] as const).map(r => (
                    <button key={r} type="button"
                      onClick={() => { setRate(r); setOpenPanel(null); }}
                      className={`block w-full text-left px-4 py-3 text-sm transition-colors rounded-[3px] ${
                        rate === r ? "bg-gold/20 text-gold font-semibold" : "text-paper/80 hover:bg-gold/10 hover:text-gold"}`}>
                      {rateLabels[r]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── Submit ── */}
            <button type="button" onClick={handleSubmit} className="booking-bar__submit">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/>
              </svg>
              {b.submit}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
