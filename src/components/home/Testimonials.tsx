"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { avisVerifies, texteAffiche, type Avis, type Plateforme } from "@/data/testimonials";
import type { AvisGoogle } from "@/lib/avis-google";
import { siteConfig } from "@/data/site";
import LogoPlateforme from "@/components/ui/LogoPlateforme";
import type { Locale } from "@/lib/utils";

/**
 * Ruban de témoignages, défilant et manipulable.
 *
 * POURQUOI UN RUBAN ET NON UN CARROUSEL. Un carrousel a des vues, un
 * index, des flèches : il dit « il y a quinze avis, en voici un ». Une
 * piste qui glisse sans fin dit « il y en a trop pour les compter ».
 *
 * CE N'EST PLUS UNE ANIMATION CSS. La première version translatait la
 * piste par keyframes, avec un bouton pour l'arrêter. La direction a
 * demandé de retirer le bouton et de rendre le ruban saisissable
 * (10/08/2026) : or une translation CSS ne se saisit pas, elle ignore la
 * molette et le doigt.
 *
 * La piste est donc devenue un conteneur à défilement horizontal natif,
 * dont on pousse `scrollLeft` image par image. Trois conséquences,
 * toutes voulues :
 *   - le doigt, la molette et le pavé tactile fonctionnent tels quels,
 *     sans une ligne de code, parce que c'est du défilement natif ;
 *   - la souris peut empoigner la piste, ce que le natif ne donne pas ;
 *   - toucher le ruban l'arrête, et c'est ce qui remplace le bouton.
 *
 * LA BOUCLE. La liste est rendue DEUX FOIS, et le recalage joue dans les
 * DEUX SENS : passé la moitié de la piste on retranche cette moitié,
 * revenu au début on l'ajoute. Le second exemplaire occupant exactement
 * la place du premier, l'œil ne voit aucun saut, et la piste n'a plus ni
 * fin ni commencement, quel que soit le sens du geste. Le doublon est
 * marqué aria-hidden, sinon un lecteur d'écran énoncerait chaque avis
 * deux fois.
 *
 * ACCESSIBILITÉ. WCAG 2.2.2 demande qu'un mouvement de plus de cinq
 * secondes puisse être arrêté. Le bouton explicite ayant été retiré, ce
 * rôle revient au survol, au focus clavier et à tout geste de
 * défilement, qui figent la piste. Sous prefers-reduced-motion, seule
 * l'avance automatique est supprimée : la boucle de recalage, elle,
 * continue de tourner, sans quoi la piste buterait sur sa fin et le
 * doublon masqué aux lecteurs d'écran deviendrait pleinement visible.
 *
 * CHAQUE AVIS EST SOURCÉ, et cité mot pour mot. La carte porte donc trois
 * choses que la version précédente n'avait pas : la note DANS LE BARÈME DE
 * SA PLATEFORME (Booking note sur dix, et cinq étoiles pour un 9/10 était
 * un arrondi vers le haut), le mois du séjour, et la mention « traduit de »
 * lorsque le lecteur ne lit pas la langue dans laquelle le client a écrit.
 * Le détail de ce contrôle est en tête de src/data/testimonials.ts.
 */

/* Nom et logo de la plateforme d'origine. Les cartes ne sont pas
   cliquables : les liens vers les plateformes vivent dans la barre
   supérieure, dans la section des notes et sous le ruban, et un lien dans
   une piste qui glisse serait de toute façon une cible mouvante. */
/* Le nom sert de secours à la ligne de mentions quand le dictionnaire
   n'a pas de libellé pour la plateforme. Il n'est plus affiché à côté du
   logo : le logotype officiel de chacune des trois contient déjà son
   propre nom, et l'écrire une seconde fois le doublerait à l'œil comme
   dans un lecteur d'écran, où il est porté par le texte alternatif. */
const MARQUES: Record<Plateforme, string> = {
  booking: "Booking.com",
  google: "Google",
  tripadvisor: "Tripadvisor",
};

/* Un avis de chaque plateforme à tour de rôle : le ruban alterne les
   origines au lieu de servir sept Booking puis quatre TripAdvisor.
   L'ordre est CALCULÉ, jamais tiré au sort : serveur et client doivent
   produire le même, sous peine de casser l'hydratation.

   Les files sont construites depuis `avisVerifies` et non écrites à la
   main : le jour où des avis Google seront lus à leur source, ils
   entreront dans la rotation sans une ligne à changer ici. */
/**
 * Ce qu'une carte affiche, quelle que soit sa provenance.
 *
 * DEUX SOURCES QUI NE SE MÉLANGENT PAS EN AMONT. Les avis Tripadvisor
 * sont relevés, traduits et stockés dans testimonials.ts ; les avis
 * Google sont récupérés en direct et ne doivent JAMAIS être stockés,
 * leur politique interdisant de conserver le contenu de l'API. Les deux
 * modèles restent donc séparés jusqu'ici, et ne se rejoignent que le
 * temps du rendu, dans cette forme commune.
 *
 * Les trois derniers champs n'existent que pour Google, dont les règles
 * d'affichage imposent de créditer l'auteur avec son profil et son
 * avatar quand la place le permet, et de donner accès à l'avis sur
 * Google Maps.
 */
type Carte = {
  cle: string;
  plateforme: Plateforme;
  auteur: string;
  pays?: string;
  note: number;
  bareme: 5 | 10;
  date: string;
  texte: string;
  traduit: boolean;
  /* QUI a traduit, et non sur QUELLE plateforme l'avis a été laissé. Les
     deux ne coïncident pas : l'avis espagnol de Susana est publié sur
     Google, mais c'est nous qui l'avons traduit, et l'annoncer « traduit
     par Google » serait faux. Seuls les avis rendus en direct par l'API
     portent une traduction de Google. */
  traduitParGoogle?: boolean;
  langueOriginale?: Locale;
  /** Page publique où l'avis se lit. Porté par `cite` sur la citation. */
  source: string;
  auteurUrl?: string;
  auteurPhoto?: string;
};

function depuisAvis(a: Avis, locale: Locale): Carte {
  const { texte, traduit } = texteAffiche(a, locale);
  return {
    cle: `${a.plateforme}-${a.auteur}`,
    plateforme: a.plateforme,
    auteur: a.auteur,
    pays: a.pays,
    note: a.note,
    bareme: a.bareme,
    date: a.dateAvis[locale],
    texte,
    traduit,
    traduitParGoogle: false,
    langueOriginale: a.langueOriginale,
    source: a.source,
  };
}

function depuisGoogle(a: AvisGoogle, i: number): Carte {
  return {
    cle: `google-${i}-${a.auteur}`,
    plateforme: "google",
    auteur: a.auteur,
    note: a.note,
    bareme: 5,
    /* Google donne « il y a un mois », déjà dans la langue demandée. On
       ne le recalcule pas en date absolue : la sienne est celle que le
       lecteur retrouvera sur la fiche. */
    date: a.dateRelative,
    texte: a.texte,
    traduit: a.traduitParGoogle,
    traduitParGoogle: a.traduitParGoogle,
    source: a.urlAvis ?? siteConfig.social.google,
    auteurUrl: a.auteurUrl,
    auteurPhoto: a.auteurPhoto,
  };
}

/* Une plateforme à tour de rôle, pour que le ruban alterne les origines
   au lieu de servir sept Tripadvisor puis cinq Google. L'ordre est
   CALCULÉ, jamais tiré au sort : serveur et client doivent produire le
   même, sous peine de casser l'hydratation. */
function melanger(cartes: Carte[]): Carte[] {
  const files = new Map<Plateforme, Carte[]>();
  for (const c of cartes) {
    const f = files.get(c.plateforme);
    if (f) f.push(c);
    else files.set(c.plateforme, [c]);
  }
  const listes = [...files.values()];
  if (!listes.length) return [];
  const max = Math.max(...listes.map((l) => l.length));
  const sortie: Carte[] = [];
  for (let i = 0; i < max; i++) {
    for (const liste of listes) if (liste[i]) sortie.push(liste[i]);
  }
  return sortie;
}

/** Vitesse du défilement, en pixels par seconde. Assez lent pour lire. */
const VITESSE = 42;

/** Délai avant reprise après un geste, en millisecondes. */
const REPRISE = 2500;

/** Gel long, le temps qu'un survol à la souris ou un focus clavier dure. */
const GEL_LONG = 600_000;

/**
 * Gel d'un geste au doigt ou au stylet, en millisecondes.
 *
 * La souris annonce son départ : `pointerleave` relance la piste, le gel
 * peut donc durer tant que le curseur reste dessus. Rien n'annonce en
 * revanche qu'un doigt s'est éloigné, et un gel long figerait le ruban
 * pour le reste de la visite. Quarante secondes : de quoi lire deux ou trois
 * avis posément, sans que la page paraisse morte à qui l'a effleurée.
 */
const GEL_TACTILE = 40_000;

/** Durée du gel posé par un geste, selon ce qui l'a produit. */
function gelDuGeste(type: string) {
  return type === "mouse" ? GEL_LONG : GEL_TACTILE;
}

/**
 * Replie une position de défilement dans la première moitié de la piste,
 * celle-ci contenant deux exemplaires identiques de la liste.
 *
 * Le repli joue dans LES DEUX SENS : au-delà de la moitié on retranche
 * cette moitié, revenu au début on l'ajoute. Sans ce second cas, un
 * glissement vers la droite buterait sur le début de la piste.
 *
 * La comparaison haute est STRICTE, pour que la position « moitié » soit
 * un point de repos : sinon les deux replis se renverraient la piste
 * image après image dès qu'elle s'immobilise sur zéro.
 */
function recaler(position: number, moitie: number) {
  if (moitie <= 0) return position;
  if (position > moitie) return position - moitie;
  if (position <= 0) return position + moitie;
  return position;
}

// Drapeaux Unicode : discrets, lisibles, sans dépendance. Clé = pays tel
// qu'il est écrit dans testimonials.ts. Pays inconnu, pas de drapeau.
const DRAPEAUX: Record<string, string> = {
  Allemagne: "🇩🇪",
  Australie: "🇦🇺",
  Belgique: "🇧🇪",
  Espagne: "🇪🇸",
  France: "🇫🇷",
  Italie: "🇮🇹",
  "La Réunion": "🇷🇪",
  Madagascar: "🇲🇬",
  "Royaume-Uni": "🇬🇧",
  Suisse: "🇨🇭",
};

// Les pays sont écrits en français dans testimonials.ts, où ils servent
// aussi de clé aux drapeaux : sans cette table ils resteraient en
// français sur /en et /es. Mêmes clés que DRAPEAUX, à tenir à jour avec
// lui. Pays absent de la table, on affiche le libellé français plutôt
// que rien.
const PAYS: Record<string, Record<Locale, string>> = {
  Allemagne: { fr: "Allemagne", en: "Germany", es: "Alemania" },
  Australie: { fr: "Australie", en: "Australia", es: "Australia" },
  Belgique: { fr: "Belgique", en: "Belgium", es: "Bélgica" },
  Espagne: { fr: "Espagne", en: "Spain", es: "España" },
  France: { fr: "France", en: "France", es: "Francia" },
  Italie: { fr: "Italie", en: "Italy", es: "Italia" },
  "La Réunion": { fr: "La Réunion", en: "Réunion", es: "La Reunión" },
  Madagascar: { fr: "Madagascar", en: "Madagascar", es: "Madagascar" },
  "Royaume-Uni": { fr: "Royaume-Uni", en: "United Kingdom", es: "Reino Unido" },
  Suisse: { fr: "Suisse", en: "Switzerland", es: "Suiza" },
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function Testimonials({
  dict,
  locale,
  avisGoogle = [],
}: {
  dict: any;
  locale: Locale;
  /* Récupérés par la page, qui est un composant serveur : cette piste-ci
     est cliente, elle ne peut pas appeler l'API elle-même. Vide par
     défaut, et le ruban se contente alors de Tripadvisor. */
  avisGoogle?: AvisGoogle[];
}) {
  const t = dict.testimonials;

  /* Construit une fois par rendu, et mémorisé : le mélange est
     déterministe, mais le recalculer à chaque image de la boucle
     d'animation serait du gaspillage. */
  const cartes = useMemo(
    () =>
      melanger([
        ...avisVerifies.map((a) => depuisAvis(a, locale)),
        /* GARDE ANTI-DOUBLON. Le site porte deux chemins possibles pour
           les avis Google : ceux que la direction a relevés et qui sont
           stockés, et ceux que l'API Places rendrait en direct si une
           clé était un jour posée. Les deux ensemble afficheraient les
           mêmes clients deux fois. Les avis stockés l'emportent, étant
           traduits à la main et triés ; l'API ne parle que s'ils
           manquent. */
        ...(avisVerifies.some((a) => a.plateforme === "google")
          ? []
          : avisGoogle.map(depuisGoogle)),
      ]),
    [avisGoogle, locale],
  );
  const pisteRef = useRef<HTMLDivElement>(null);
  /* Instant avant lequel on ne pousse pas la piste. Un ref et non un
     état : il change à chaque mouvement de souris, et un rendu par
     mouvement serait ruineux. */
  const geleJusqua = useRef(0);

  /* SUSPENSION DÉLIBÉRÉE, distincte du gel passager posé par un geste.
     Le gel expire ; celle-ci dure jusqu'à ce que le visiteur la lève.
     Doublée d'un ref parce que la boucle d'animation, montée une seule
     fois, ne verrait jamais changer une valeur d'état capturée dans sa
     fermeture. */
  const [suspendu, setSuspendu] = useState(false);
  const suspenduRef = useRef(false);
  const basculerSuspension = useCallback(() => {
    /* Le ref est mis à jour HORS de l'updater, qui doit rester pur : React
       peut l'appeler deux fois en mode strict, ce qui inverserait le ref
       deux fois et laisserait la piste dans l'état contraire à ce que le
       bouton annonce. */
    suspenduRef.current = !suspenduRef.current;
    setSuspendu(suspenduRef.current);
  }, []);

  const suspendre = useCallback((duree: number = REPRISE) => {
    geleJusqua.current = performance.now() + duree;
  }, []);

  useEffect(() => {
    const piste = pisteRef.current;
    if (!piste) return;

    /* Le réglage système ne suspend que l'AVANCE automatique, jamais la
       boucle : c'est elle qui recale la piste, et une piste non recalée
       bute sur sa fin en exposant le doublon réservé aux yeux. Lu à
       chaque image plutôt qu'une fois pour toutes, il est donc pris en
       compte même s'il change en cours de visite. */
    const moinsDeMouvement = window.matchMedia("(prefers-reduced-motion: reduce)");

    let raf = 0;
    let precedent = performance.now();

    const avancer = (maintenant: number) => {
      // Onglet réveillé après une heure : on ne rattrape pas le retard.
      const dt = Math.min(maintenant - precedent, 100);
      precedent = maintenant;
      if (
        !suspenduRef.current &&
        !moinsDeMouvement.matches &&
        maintenant >= geleJusqua.current &&
        !document.hidden
      ) {
        piste.scrollLeft += (VITESSE * dt) / 1000;
      }
      /* Recalage : le second exemplaire occupant exactement la place du
         premier, le repli est invisible et la boucle n'a ni fin ni
         commencement. Il tourne à chaque image, y compris quand l'avance
         est suspendue, car la molette et le doigt déplacent eux aussi la
         piste.

         On n'écrit `scrollLeft` que si la valeur change : réécrire la
         position déjà en place ne déplace rien, mais peut couper net le
         défilement par inertie lancé au doigt sur mobile, où la boucle
         tourne justement pendant que la piste glisse toute seule. */
      const cible = recaler(piste.scrollLeft, piste.scrollWidth / 2);
      if (cible !== piste.scrollLeft) piste.scrollLeft = cible;
      raf = requestAnimationFrame(avancer);
    };

    raf = requestAnimationFrame(avancer);
    return () => cancelAnimationFrame(raf);
  }, []);

  /* Saisie à la souris. Le doigt et la molette n'ont besoin de rien : le
     conteneur défile nativement.

     On ne retient que la dernière abscisse du pointeur, et le
     déplacement appliqué est RELATIF. Une position absolue calculée
     depuis le début du geste annulerait le recalage de boucle au
     mouvement suivant : la piste resterait bloquée sur son début dès que
     l'on tire vers la droite. Le repli est refait ici, et pas seulement
     dans la boucle, sinon le navigateur bloquerait la position à zéro
     jusqu'à l'image suivante et la saisie accrocherait au passage. */
  const saisie = useRef<{ x: number } | null>(null);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    suspendre(gelDuGeste(e.pointerType));
    if (e.pointerType !== "mouse") return;
    const piste = pisteRef.current;
    if (!piste) return;
    saisie.current = { x: e.clientX };
    piste.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = saisie.current;
    const piste = pisteRef.current;
    if (!s || !piste) return;
    const vise = piste.scrollLeft - (e.clientX - s.x);
    piste.scrollLeft = recaler(vise, piste.scrollWidth / 2);
    s.x = e.clientX;
  };

  /* Gel de survol réservé à la SOURIS. Un doigt qui se pose déclenche lui
     aussi l'entrée du pointeur, et il ne repart jamais vraiment : une
     simple tape figeait le ruban dix minutes. Le tactile a son propre
     gel, posé au contact, qui expire seul (voir GEL_TACTILE). */
  const survol = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse") suspendre(GEL_LONG);
  };

  const finSurvol = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse") suspendre(0);
  };

  /* Le gel posé ici doit valoir celui du contact : un relâchement ne
     signifie pas que l'on a fini de lire. Au doigt il expirera de
     lui-même, à la souris c'est `pointerleave` qui relancera la piste. */
  const relacher = (e: React.PointerEvent<HTMLDivElement>) => {
    const piste = pisteRef.current;
    if (saisie.current && piste?.hasPointerCapture(e.pointerId)) {
      piste.releasePointerCapture(e.pointerId);
    }
    saisie.current = null;
    suspendre(gelDuGeste(e.pointerType));
  };

  return (
    <section className="lh-avis-section relative overflow-hidden py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="relative mx-auto mb-10 max-w-2xl text-center md:mb-14">
          <ScrollReveal>
            <span className="ge-label mb-4">{t.label}</span>
            <h2 style={{ textWrap: "balance" }}>{t.title}</h2>
          </ScrollReveal>

          {/* LA COMMANDE DE PAUSE EST REVENUE, mais elle ne se voit qu'au
              besoin. La direction avait fait retirer le bouton visible le
              10/08/2026, le trouvant encombrant. Le survol, le focus et le
              doigt figeaient bien la piste, mais le critère WCAG 2.2.2
              demande un MÉCANISME EXPLICITE dès qu'un mouvement dure plus
              de cinq secondes : un gel implicite ne se découvre pas, et
              rien n'annonçait au visiteur qu'il pouvait arrêter le ruban.

              Le compromis : elle est toujours dans le document et dans
              l'ordre de tabulation, donc atteignable au clavier et
              annoncée par les lecteurs d'écran, mais transparente au
              repos. Elle apparaît quand la souris entre dans la section,
              et dès qu'elle reçoit le focus. Au repos, la section est
              aussi nue qu'avant.

              Quarante-quatre pixels de côté : la cible reste conforme
              même invisible, l'opacité ne changeant rien à la surface. */}
          <button
            type="button"
            onClick={basculerSuspension}
            aria-pressed={suspendu}
            className="lh-ruban__pause"
          >
            <span className="sr-only">
              {suspendu ? String(t.reprendre ?? "Reprendre le défilement") : String(t.suspendre ?? "Suspendre le défilement")}
            </span>
            <svg width="12" height="14" viewBox="0 0 12 14" aria-hidden="true" fill="currentColor">
              {suspendu ? (
                <path d="M1 1.2v11.6a.7.7 0 0 0 1.07.6l9.2-5.8a.7.7 0 0 0 0-1.2l-9.2-5.8A.7.7 0 0 0 1 1.2Z" />
              ) : (
                <>
                  <rect x="1" y="1" width="3.4" height="12" rx="0.8" />
                  <rect x="7.6" y="1" width="3.4" height="12" rx="0.8" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Le ruban déborde volontairement de la grille : une piste qui
          s'arrête aux marges du contenu ne donne pas la sensation de
          continuité. Les fondus latéraux, posés en masque, évitent que
          les cartes n'apparaissent et ne disparaissent d'un coup net. */}
      <div
        ref={pisteRef}
        className="lh-ruban"
        role="region"
        aria-label={t.label}
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={relacher}
        onPointerCancel={relacher}
        onPointerEnter={survol}
        onPointerLeave={finSurvol}
        onFocusCapture={() => suspendre(GEL_LONG)}
        onBlurCapture={() => suspendre(0)}
        onWheel={() => suspendre()}
      >
        <div className="lh-ruban__piste">
          {[0, 1].map((exemplaire) => (
            <ul
              key={exemplaire}
              className="lh-ruban__lot"
              /* ARIA-HIDDEN NE SUFFIT PAS, et c'est le piège. Il retire
                 le doublon des lecteurs d'écran, mais laisse ses neuf
                 liens dans l'ordre de tabulation : au clavier, on
                 traversait neuf « Voir sur Google Maps » invisibles pour
                 la synthèse vocale et pointant sur des avis déjà lus.
                 `inert` retire l'un ET l'autre. Les deux attributs sont
                 nécessaires : inert n'implique pas aria-hidden dans tous
                 les moteurs. */
              aria-hidden={exemplaire === 1 ? "true" : undefined}
              inert={exemplaire === 1}
            >
              {cartes.map((c) => (
                <li key={`${exemplaire}-${c.cle}`}>
                  <CarteAvis carte={c} locale={locale} dict={dict} />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 md:px-10">
        {/* Article L.111-7-2 du Code de la consommation : dire d'où
            viennent les avis, qui en vérifie l'auteur, et comment ils
            sont traités.

            LA PHRASE A ÉTÉ REFAITE le 21/08/2026. Elle disait « avis
            publiés tels quels », ce qui était faux de deux façons : neuf
            des quinze n'avaient aucune source, et le texte des six
            autres avait été retouché. Elle avoue désormais la SÉLECTION,
            qui est le point délicat : ne sont repris que les avis sans
            réserve, et le lecteur est envoyé là où il les lit tous, les
            bons comme les mauvais. Taire ce tri serait précisément la
            présentation trompeuse que vise la directive Omnibus.

            Discrète à dessein, 11 px en gris de service, qui tient
            4,5:1 sur le papier : on ne peut pas l'éclaircir davantage,
            et une mention illisible ne remplirait plus son office. */}
        <p className="mx-auto mt-7 max-w-2xl text-center text-[11px] leading-relaxed tracking-[0.01em] text-muted md:mt-9">
          {avecLiens(String(t.transparence))}
        </p>
      </div>
    </section>
  );
}

/**
 * Bulles Tripadvisor, à leur norme.
 *
 * Leur documentation est explicite : la note d'un avis se donne en
 * bulles, dans leur vert Moss, sur fond blanc, cinquante-cinq pixels de
 * large au minimum, et jamais avec une icône maison. Le chiffre « 5/5 »
 * en orange que portaient ces cartes ne respectait aucune des trois.
 *
 * Soixante pixels ici : cinq bulles de dix, quatre intervalles de deux et
 * demi. Le fond blanc est celui de la carte, la règle voulant que le fond
 * de page ne transparaisse pas au travers.
 *
 * Les bulles vides sont prévues alors que les sept avis cités sont tous à
 * cinq bulles, et doivent le rester : Tripadvisor n'autorise la citation
 * que d'un avis à cinq bulles. Elles servent de garde-fou visible si
 * quelqu'un ajoutait un jour un 4/5 sans lire l'en-tête du fichier.
 */
function BullesTripadvisor({ note, etiquette }: { note: number; etiquette: string }) {
  const D = 10;
  const PAS = 12.5;
  return (
    <svg
      width={60}
      height={D}
      viewBox={`0 0 ${PAS * 4 + D} ${D}`}
      role="img"
      aria-label={etiquette}
      className="lh-avis__bulles"
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <circle
          key={i}
          cx={i * PAS + D / 2}
          cy={D / 2}
          r={D / 2 - 0.75}
          fill={i < note ? "#00AA6C" : "none"}
          stroke="#00AA6C"
          strokeWidth="1.5"
        />
      ))}
    </svg>
  );
}

/* La plateforme citée dans la mention de transparence devient un lien :
   « ils se lisent tous là-bas » n'a de valeur que si l'on peut y aller.
   Le texte reste dans les dictionnaires avec {tripadvisor} en repère,
   plutôt que d'y coudre du balisage.

   Le repère {booking} est CONSERVÉ bien qu'aucune phrase ne l'emploie
   aujourd'hui : le jour où Booking accordera son accord écrit (voir
   src/data/avis-booking-reserve.ts), la mention le reprendra et
   le lien fonctionnera sans qu'il faille repasser par ici. */
function avecLiens(phrase: string) {
  const cibles: Record<string, { href: string; libelle: string }> = {
    "{booking}": { href: siteConfig.social.booking, libelle: "Booking.com" },
    "{tripadvisor}": { href: siteConfig.social.tripadvisor, libelle: "Tripadvisor" },
    "{google}": { href: siteConfig.social.google, libelle: "Google" },
  };
  return phrase.split(/(\{booking\}|\{tripadvisor\}|\{google\})/).map((bout, i) => {
    const cible = cibles[bout];
    if (!cible) return <span key={i}>{bout}</span>;
    return (
      <a
        key={i}
        href={cible.href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline decoration-terracotta/40 underline-offset-2 transition-colors hover:text-terracotta"
      >
        {cible.libelle}
      </a>
    );
  });
}

/* Langue d'origine pour la mention « traduit de », dans la langue du
   LECTEUR, qui est le seul à qui elle s'adresse.

   LA PRÉPOSITION EST DANS LA TABLE, pas dans le gabarit. Un gabarit
   « Traduit du {langue} » produisait « Traduit du anglais » : le français
   élide devant une voyelle et l'espagnol contracte « de el » en « del ».
   Ces variations ne se calculent pas, elles s'écrivent. Le gabarit se
   réduit donc à « Traduit {langue} ». Première clé : la langue du client.
   Seconde : celle du lecteur. */
const LANGUES: Record<Locale, Record<Locale, string>> = {
  fr: { fr: "du français", en: "from French", es: "del francés" },
  en: { fr: "de l’anglais", en: "from English", es: "del inglés" },
  es: { fr: "de l’espagnol", en: "from Spanish", es: "del español" },
};

/* eslint-disable @typescript-eslint/no-explicit-any */
function CarteAvis({ carte, locale, dict }: { carte: Carte; locale: Locale; dict: any }) {
  const t = dict.testimonials;
  const nom = MARQUES[carte.plateforme];
  const drapeau = carte.pays ? DRAPEAUX[carte.pays] : undefined;
  const pays = carte.pays ? (PAYS[carte.pays]?.[locale] ?? carte.pays) : null;

  const chiffres = new Intl.NumberFormat(
    locale === "en" ? "en-GB" : locale === "es" ? "es-ES" : "fr-FR",
  );
  const noteLue = String(t.noteSur ?? "{note} sur {bareme}")
    .replace("{note}", chiffres.format(carte.note))
    .replace("{bareme}", String(carte.bareme));

  /* Guillemets DE LA LANGUE DU LECTEUR : Tripadvisor exige que la
     citation soit entre guillemets, la typographie française veut des
     chevrons avec espaces insécables, l'anglais et l'espagnol des
     guillemets anglais. Posés en texte plutôt qu'en `::before` CSS, pour
     qu'un copier-coller de la citation les emporte avec elle. */
  const [ouvre, ferme] = locale === "fr" ? ["«\u202F", "\u202F»"] : ["\u201C", "\u201D"];

  const origine = String(t.origineAvis?.[carte.plateforme] ?? nom);

  return (
    <article className="lh-avis">
      <div className="lh-avis__source">
        {/* LE LOGOTYPE OFFICIEL, servi tel quel depuis public/images/logos.
            Vingt pixels de haut : le minimum que Tripadvisor impose en
            hauteur, et celui qui donne au logotype Booking les 120 px de
            large qu'il exige de son côté. Le nom n'est plus écrit à
            côté : le logotype le contient déjà. */}
        <LogoPlateforme plateforme={carte.plateforme} hauteur={20} />
        {carte.plateforme === "tripadvisor" ? (
          <span className="lh-avis__note">
            <BullesTripadvisor note={carte.note} etiquette={noteLue} />
          </span>
        ) : (
          <span className="lh-avis__note">
            <span aria-hidden="true">
              {chiffres.format(carte.note)}/{carte.bareme}
            </span>
            <span className="sr-only">{noteLue}</span>
          </span>
        )}
      </div>

      {/* `cite` porte la page où l'avis se lit : la référence suit la
          citation dans le document lui-même, et pas seulement dans le
          commentaire du fichier de données. */}
      <blockquote className="lh-avis__texte" cite={carte.source}>
        {ouvre}
        {carte.texte}
        {ferme}
      </blockquote>

      <footer className="lh-avis__pied">
        {/* L'AVATAR ET LE LIEN DE PROFIL sont des obligations Google, qui
            demande de créditer l'auteur « avec toutes les ressources
            disponibles (avatar, nom et lien de profil) quand la place le
            permet ». Ils n'apparaissent donc que pour Google, les autres
            plateformes n'exposant ni l'un ni l'autre. */}
        {carte.auteurPhoto && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={carte.auteurPhoto}
            alt=""
            width={20}
            height={20}
            loading="lazy"
            decoding="async"
            className="lh-avis__avatar"
          />
        )}
        {carte.auteurUrl ? (
          <a
            href={carte.auteurUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="lh-avis__nom lh-avis__nom--lien"
          >
            {carte.auteur}
          </a>
        ) : (
          <span className="lh-avis__nom">{carte.auteur}</span>
        )}
        {pays && (
          <span className="lh-avis__lieu">
            {drapeau && <span aria-hidden="true">{drapeau} </span>}
            {pays}
          </span>
        )}
      </footer>

      {/* Origine, date, traduction, et pour Google le lien vers l'avis
          lui-même. Quatre mentions d'une même nature, réunies sur la
          ligne la plus discrète de la carte : elles disent d'où vient ce
          qu'on lit, quand ça a été écrit, dans quelle langue, et où le
          vérifier. */}
      <p className="lh-avis__mentions">
        {origine}
        {carte.date && `, ${carte.date}`}
        {carte.traduit && (
          <>
            {" · "}
            {carte.traduitParGoogle
              ? String(t.traduitParGoogle ?? "Traduit par Google")
              : String(t.traduitDe ?? "Traduit {langue}").replace(
                  "{langue}",
                  LANGUES[carte.langueOriginale ?? "fr"][locale],
                )}
          </>
        )}
        {/* UN LIEN SUR CHAQUE CARTE, ET PLUS SEULEMENT SUR CELLES DE
            GOOGLE. Deux raisons se rejoignent ici.

            La première est une obligation : Google exige que le lecteur
            puisse toujours atteindre l'avis d'origine, et un attribut
            `cite` n'y suffit pas, aucun navigateur n'en faisant un lien.

            La seconde est une question d'honnêteté, et elle vaut pour
            toutes les plateformes. La carte coupe à six lignes, et douze
            des seize avis dépassent : certains perdent plus de la moitié
            de leur texte. Une citation tronquée dont on ne peut pas lire
            la suite déforme le propos de son auteur, ce que ce site
            passe la journée à corriger. Le lien rend la troncature
            loyale : ce qui est montré est un extrait, et le texte entier
            est à un clic.

            Il tient sur la piste qui glisse parce qu'elle s'immobilise
            au survol comme au focus clavier. */}
        {carte.source && (
          <>
            {" · "}
            <a
              href={carte.source}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="lh-avis__lien"
            >
              {String(t.lireLAvis ?? "Lire l'avis")}
            </a>
          </>
        )}
      </p>
    </article>
  );
}
