# Base de données & tableau de bord

Le tableau de bord (`/admin/tableau-de-bord`) lit une base **PostgreSQL**.
En production elle est hébergée sur **Neon** ; en développement local, un
mode **PGlite** (Postgres en mémoire) permet de l'essayer sans base hébergée.

## Mise en place (production, une seule fois)

### 1. Créer la base Neon
1. Compte gratuit sur **neon.tech**, projet en **région Europe** (RGPD :
   la base contiendra des clients européens).
2. Copier la **chaîne de connexion** (« pooled connection », format
   `postgres://user:pass@…-pooler.…/neondb?sslmode=require`).

### 2. La déclarer dans Vercel
Settings → Environment Variables → `DATABASE_URL` = la chaîne copiée →
cocher **Production** et **Preview** → Save → **Redeploy**.

*(L'intégration Vercel ↔ Neon, dans l'onglet Storage, crée cette variable
automatiquement — c'est le plus simple.)*

### 3. Créer les tables
```bash
DATABASE_URL='postgres://…' npm run db:migrate
```

### 4. Importer l'historique 2026
```bash
# a) Générer le dataset depuis les Excel (clé USB montée)
python3 scripts/parse-factures-2026.py          # → factures.jsonl + anomalies.json

# b) L'importer (idempotent : rejouable sans doublon)
DATABASE_URL='postgres://…' npm run db:import chemin/vers/factures.jsonl
```

Le tableau de bord affiche alors le CA, les agences et la saisonnalité.
Tant que `DATABASE_URL` n'est pas définie, il affiche un écran d'aide et le
reste de l'espace équipe (facture proforma) fonctionne normalement.

## Essayer en local sans Neon (PGlite)

```bash
# .env.local
DEV_PGLITE=1
DEV_PGLITE_SEED=/chemin/absolu/vers/factures.jsonl
```
`npm run dev` amorce alors une base Postgres en mémoire au premier accès au
tableau de bord. Données non persistées (rechargées à chaque redémarrage) —
uniquement pour le développement.

## Ce que contient la base

`agences`, `sejours`, `documents` (PROFORMA / FACTURE / AVOIR), `lignes`,
`paiements`, `documents_meta`. Schéma : `src/lib/db/schema.ts`. Montants en
ariary entiers. `date_in` (arrivée) est fiable ; `date_emission` provient du
`=TODAY()` des Excel, donc peu fiable — conservée pour mémoire seulement.

## Qualité de l'import

Le parser extrait ~208 documents sur 212 fichiers. Les 4 restants sont des
plannings / fiches d'information (pas des factures). Voir `anomalies.json`
après chaque exécution. Le gabarit Excel étant stable (210/212 identiques),
l'extraction est fiable ; les cas particuliers (avoirs 2025, remises dans le
bloc totaux) sont gérés.

⚠️ **Données personnelles** : `factures.jsonl` contient des noms de clients.
Ne pas le committer dans le dépôt ni le diffuser (il est ignoré par `.gitignore`).
