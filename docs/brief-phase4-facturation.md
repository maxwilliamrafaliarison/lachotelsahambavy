# Phase 4 — Facturation, paiements et tableau de bord d'équipe

> **Brief de mission** — Lac Hôtel Sahambavy
> Version du 17/07/2026 · remplace le prompt initial
> Fondé sur l'analyse de **226 PDF et 212 fichiers Excel** réels du dossier
> `Facturation du Lac Hôtel` (clé USB), pas sur des hypothèses.

---

## 0. Décisions déjà prises (ne pas re-litiger)

| Sujet | Décision | Date |
|---|---|---|
| Compte d'encaissement | **Compte SOCIÉTÉ** BFV-SG (…0043, IBAN `MG46…4396`, BIC `BFAVMGMG`). Le compte personnel de Maggie n'est **plus** le bénéficiaire. | 17/07 |
| Paiement en ligne | **Non.** On *enregistre* un paiement reçu, on ne l'encaisse pas. Ni carte, ni DSP2/SCA, ni PCI-DSS. | 17/07 |
| Base de données | **Oui**, + reprise de l'historique 2026 (~106 factures). | 17/07 |
| Rôles | `admin` (Direction : Maggie, Max) et `reception` (Toky, Tata) — déjà en place. | 17/07 |

---

## 1. Contexte technique

- Next.js 16 (App Router), Tailwind v4, i18n fr/en/es, déployé sur Vercel (`lachotel.vercel.app`), miroir statique GitHub Pages.
- Espace équipe existant : `/admin` (Auth.js v5, comptes en variable d'environnement, alerte nouvel appareil).
- Simulateur proforma existant : `/admin/proforma` → PDF via `pdf-lib`, **aucune persistance** (localStorage seulement).
- **Aucune base de données à ce jour.** C'est le verrou du tableau de bord.

---

## 2. Ce qui est FAUX dans l'outil actuel (corriger en priorité)

L'analyse des vraies factures invalide le simulateur livré :

| Sujet | L'outil produit | La réalité documentée | Source |
|---|---|---|---|
| **TVA** | aucune | **TVA 20 %** — présente sur 160 factures / 200 | `MONTANT TOTAL TTC (Ariary)` |
| **Taxe** | « Taxe de séjour » | **« Vignette touristique »** (180 occurrences), **hors base TVA** | ligne E30 |
| **Taux €** | 4 900 Ar | grilles 2026 **et** 2027 calculées à **5 000 Ar/€** | 250 000/50 = 5 000 |
| **Tarifs** | 2026 | **2027 existe** | `TARIFS 2027/` |
| **Numérotation** | `PRO-2026-001` global | pas de compteur global ; `FACT 001` coexiste chez **8 agences** | 212 xlsx |

**Chaîne de calcul réelle à reproduire exactement :**
```
Sous Total HT        = Σ(lignes)          où ligne = Nombre × P.U. × Nuitées
TVA 20 %             = Sous Total HT × 0,20
Vignette touristique = Nombre × P.U. × Nuitées   (HORS base TVA)
MONTANT TOTAL TTC (Ariary) = Sous Total HT + TVA + Vignette
```

---

## 3. Questions bloquantes — à trancher par Maggie AVANT de coder

Ne pas deviner. Ne pas coder de valeur par défaut « raisonnable » à leur place.

1. **Taux € : 4 900 ou 5 000 ?** Max a dit 4 900 ; les grilles tarifaires disent 5 000. Écart de 2 % sur chaque facture en euros.
2. **Clause 2027 :** « les tarifs en euros sont indicatifs, convertis au taux du jour du paiement ». Incompatible avec un prix € ferme. Qui fixe le taux du jour, et où ?
3. **Série à 5 chiffres** (`FACT 12342`, `12351`, `14230`) : carnet légal papier ? Max a répondu « carnet légal » → **faire confirmer**, car cela impose que le logiciel n'invente jamais un numéro qui existerait déjà sur papier.
4. **HT ou TTC ?** Le même prix est traité tantôt HT tantôt TTC selon l'agence (5 variantes de libellé : `P.U.`, `P.U.TTC`, `P.U. HT`…). Écart réel de 20 %. **Le tarif catalogue est-il HT ou TTC ?**
5. **21 factures sur 226 n'ont aucune TVA.** Exonération (TO export ? ONG ?) ou oubli ? Règle à écrire.
6. **NIF tronqué** (`300020456`, 9 chiffres) sur les deux grilles tarifaires vs `3000204565` sur les factures. Lequel est bon ?
7. **Compte BRED** : ~25 factures mentionnent « VIRE BRED MADA » mais aucun RIB BRED n'existe au dossier. Compte de l'hôtel ou de l'agence émettrice ?

---

## 4. Périmètre

### 4.1 Module facturation (remplace le simulateur)

**Trois types sur un gabarit unique :** `PRO-FORMA` · `FACTURE` · `AVOIR`.

- Le pro-forma **n'a pas de numéro** (conforme à l'usage constaté) ; il devient facture en recevant un numéro.
- **Numérotation par agence + année**, pas globale — c'est l'usage réel. Séquence garantie sans trou ni collision, en base.
- **Avoir** : type de premier ordre, **rattaché à la facture d'origine par une vraie référence** (aujourd'hui c'est du texte libre : « PRESTAION GROUPE IN 09 AVRIL 2026 »).
- **Date de facture figée à l'émission.** ⚠️ Vos Excel utilisent `=TODAY()` : **une facture de mars affiche la date du jour quand on l'ouvre**. C'est un défaut d'intégrité comptable majeur — la base doit stocker une date immuable.
- **Montant en toutes lettres généré automatiquement** (aujourd'hui saisi à la main : « DEUX MILLION HUIT CENT QUARENTE SEPT MILLE ARIARY », faute incluse).

### 4.2 Paiements (enregistrer, pas encaisser)

- Champ **mode de règlement normalisé**, en remplacement du texte libre actuel (« VIRE BRED MADA LE 03 MARS 2026 ») :
  `espèces` · `chèque sur place` · `virement MGA (BFV société)` · `virement EUR (BNP)` · `Mvola` · `autre`.
- **Défaut : Madagascar / ariary.** L'émetteur peut choisir l'euro au cas par cas (demande de Max).
- **Mvola** : à ajouter au catalogue des modes. *Aucune trace de Mvola dans l'existant* — confirmer que c'est réellement pratiqué, et sous quel numéro.
- Suivi : `montant dû` / `acompte` / `reste à payer` / `date d'encaissement` / `référence`. La ligne `RESTE A PAYER` existe déjà sur 10 factures.
- **Le RIB doit venir d'une configuration unique**, jamais d'une valeur en dur, et ne s'imprimer que si Maggie a validé le compte société.

### 4.3 Conformité — ce qui compte vraiment ici

« Norme européenne des paiements » ne s'applique **pas** (pas d'encaissement en ligne → ni DSP2, ni SCA, ni PCI-DSS). Ce qui s'applique :

- **Mentions légales sur facture** : déjà présentes et correctes (RCS, STAT, NIF) — les conserver.
- **Virement SEPA impossible depuis l'Europe vers Madagascar** (hors zone SEPA) : ce sera du SWIFT (frais, délai). Le compte BNP euros permet le SEPA — mais il est au nom d'une personne physique : **à régulariser au nom de la société** si on veut l'afficher.
- **RGPD** : la base contiendra des clients européens (noms, e-mails, séjours). Base légale, durée de conservation, droit à l'effacement, hébergement UE (Neon/Vercel région EU), pas de données de carte.
- **Anti-fraude au faux RIB** : aujourd'hui aucune de vos 226 factures ne porte de RIB — il circule par mail. L'imprimer sur la facture supprime ce vecteur.
- **Conservation** : PDF immuable archivé, numérotation sans trou.

### 4.4 Tableau de bord d'équipe

Source : la base + **reprise des ~106 factures 2026** (62 dossiers d'agences).

**Indicateurs réellement calculables** avec les données existantes :
- **CA** par mois / par an, en ariary, avec équivalent € au taux d'émission ; HT vs TTC ; part vignette.
- **Palmarès agences** — la demande explicite. Volumétrie constatée : MY MADAGASCAR (38 fichiers), MADAWAY TOURS (36), LOOK GASY–POM (30), AEM (23), KLAUS KONNERTH (23), PARTICULIER (21), MADAGASCAR DESTINATION (20), MADA FOCUS (20)… **60 agences**.
- **Base client** : agence, groupe (code type `MNM260403`), PAX, nuitées, provenance.
- **Saisonnalité** : nuitées et CA par mois — l'indicateur roi en hôtellerie.
- **Taux d'occupation** — *seulement si* on saisit l'inventaire des chambres (50 bungalows). À arbitrer.
- **Panier moyen / séjour**, **durée moyenne de séjour**, **répartition par type de chambre**, **direct vs agence**.
- **Avoirs et annulations** : montant, motif, saisonnalité — vous en avez 9 en 2026.

**Hors périmètre — à dire clairement :**
- ❌ **« Plats phares »**. Vos factures ne facturent que `DINER` / `PETIT DEJEUNER` **en forfait**, jamais un plat. Connaître les plats phares suppose d'enregistrer **chaque plat vendu** → c'est une **caisse restaurant**, un projet distinct et bien plus lourd. Ne pas le glisser dans ce lot.
- ❌ RevPAR / ADR tant que l'inventaire des chambres n'est pas saisi.

### 4.5 Le PDF — reproduire « leur » facture

Le générateur doit être reconnu par l'équipe. Éléments identitaires, par ordre d'importance :

1. **Cartouche titre encadré**, en haut à droite (`PRO-FORMA` / `FACT` / `AVOIR`).
2. **Bloc-logo à gauche** : pictogramme + `Lac Hôtel Sahambavy` + **`The Natural choice`**.
3. **Grille d'alignement unique** `51 | 103 | 317 | 404 | 456 | 542` — partagée par le bloc client et le tableau. La casser fait « faux » immédiatement.
4. **5 colonnes exactes** : `Nombre | Désignations | P.U. | Nuitées | TOTAL`, dans l'ordre hébergement → dîner → petit-déjeuner → sous-total/TVA → vignette.
5. **Bloc client** : `Client / Date IN / Date OUT / Prestations (DP|BB) / Nombre de PAX / Nombre de Nuit`.
6. Ligne **`MONTANT TOTAL TTC (Ariary)`** détachée.
7. **`Arrêtée par la présente facture la somme de :`** + montant en toutes lettres.
8. Signature **Maggie Leong** + `Directrice générale du Lac Hôtel`.
9. **À ajouter** (absent aujourd'hui) : le **RIB société** et les **conditions de règlement**.

**Améliorations à apporter** (l'existant est perfectible) : `Nombre de PAX` est un texte libre (`12 + 1 TL`, `42 ELEVES`) → structurer ; les 5 variantes de `P.U.` → un seul libellé ; la typo `VINGETTE TOURISTIQUE` → corriger.

### 4.6 Logo « The Natural choice » — audit fait

| Fichier | Porte la mention | État |
|---|---|---|
| `logo-color.png` | ✅ oui | **le seul correct** (fond gris opaque) |
| `logo-white.png` | ⚠️ oui mais **cassée** | tagline quasi transparente (alpha défectueux) — utilisée sur le site |
| `logo-dark.png` | ⚠️ oui mais **cassée** | idem — utilisée sur le PDF |
| `logo-mark-white/dark.png` | ❌ non | pictogramme seul |

**Action : obtenir un export vectoriel propre** (SVG/PNG haute def, fond transparent, tagline pleinement opaque) en blanc et en foncé. Sans lui, la mention restera fantôme. **C'est un livrable graphique, pas du code.**

---

## 5. Modèle de données minimal

```
Agence      (id, nom, NIF, STAT, adresse, e-mail, commission %, conditions)
Client      (id, nom, agence_id?, e-mail, pays, RGPD_consentement)
Sejour      (id, client_id, agence_id, code_groupe, date_in, date_out, pax_adultes,
             pax_enfants, pax_guides, nuits, formule BB|DP|AP)
Document    (id, type PROFORMA|FACTURE|AVOIR, numero?, serie_agence, annee,
             date_emission FIGÉE, sejour_id, devise, taux_eur, statut,
             document_origine_id?  ← pour les avoirs)
Ligne       (id, document_id, ordre, nombre, designation, pu, nuitees, total,
             soumis_tva bool)
Paiement    (id, document_id, mode, montant, devise, date_encaissement, reference)
Tarif       (id, annee, code, libellé, prix_ar, type TO|PUBLIC, actif)
```

---

## 6. Ordre de marche

1. **Corriger l'outil existant** (rapide, valeur immédiate) : TVA 20 %, vignette touristique, tarifs 2027, taux configurable, date figée.
2. **Base de données** (Neon/Postgres, région UE) + persistance des documents émis.
3. **Import de l'historique 2026** — 212 xlsx, gabarit stable à 210/212 : parsable. Réconciliation des numéros en collision à prévoir.
4. **Générateur PDF fidèle** (gabarit unique, 3 types).
5. **Paiements** (modes normalisés, RIB en configuration).
6. **Tableau de bord**.

---

## 7. Rappels bloquants hors périmètre technique

- ⚠️ **`RESEND_API_KEY` toujours absente** → le formulaire de réservation renvoie un faux succès : **aucun e-mail ne part**, ni au client ni à l'hôtel. Des demandes se perdent aujourd'hui. **Priorité absolue, avant tout ce brief.**
- ⚠️ **Ne jamais committer** `COORDONNEES BANCAIRES + CIN MAGGIE.doc` (CIN, NIF, comptes en clair) dans le repo.
- ⚠️ Documents bancaires périmés (BNP 2018, RIB société 2019) : **à re-confirmer auprès des banques** avant impression sur facture.
