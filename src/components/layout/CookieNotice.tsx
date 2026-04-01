"use client";

import { useState, useEffect } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function CookieNotice({ dict }: { dict: any }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("cookies_accepted")) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookies_accepted", "true");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("cookies_accepted", "false");
    setVisible(false);
  };

  return (
    <div className={`cookie-notice ${visible ? "visible" : ""}`}>
      <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm">{dict.cookie.text}</p>
        <div className="flex gap-3">
          <button onClick={accept} className="btn--cta btn text-xs py-2 px-4">
            {dict.cookie.accept}
          </button>
          <button onClick={decline} className="text-xs text-cream/60 hover:text-cream transition-colors">
            {dict.cookie.decline}
          </button>
        </div>
      </div>
    </div>
  );
}
