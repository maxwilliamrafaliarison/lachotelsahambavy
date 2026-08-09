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
        {/* Le bouton d'acceptation était en `.btn--cta`, un vestige : fond or
            hérité et coins à 2 px, quand tout le reste du site appelle à
            l'action en bleu du lac et en pilule. Il apparaît sur les vingt
            pages — c'était le bouton le plus visible du site à ne pas
            suivre la charte. Passé en `.ge-cta`.

            « Refuser » reste en lin discret : la charte veut que le choix
            par défaut soit le plus protecteur, mais elle n'impose pas que
            les deux options aient le même poids visuel — refuser doit
            rester atteignable sans être un appel à l'action. */}
        <div className="flex items-center gap-4">
          <button onClick={accept} className="ge-cta !px-5 !py-2 !text-[11.5px]">
            {dict.cookie.accept}
          </button>
          <button
            onClick={decline}
            className="text-xs text-linen/70 underline decoration-linen/30 underline-offset-4 transition-colors hover:text-linen hover:decoration-linen"
          >
            {dict.cookie.decline}
          </button>
        </div>
      </div>
    </div>
  );
}
