/**
 * Connexion à la base.
 *  - Production (Vercel) : Neon serverless (driver HTTP, sans pool).
 *  - Dev local optionnel : PGlite (Postgres WASM en mémoire), activé par
 *    DEV_PGLITE=1, amorcé une fois depuis un JSONL (DEV_PGLITE_SEED). Permet
 *    d'utiliser le tableau de bord sans base hébergée. Jamais chargé en prod
 *    (import dynamique sous le flag).
 */
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { sql } from "drizzle-orm";
import { readFileSync } from "node:fs";
import * as schema from "./schema";

/* eslint-disable @typescript-eslint/no-explicit-any */

export function hasDb(): boolean {
  return !!process.env.DATABASE_URL || process.env.DEV_PGLITE === "1";
}

let _neon: ReturnType<typeof drizzle<typeof schema>> | null = null;
let _pglite: Promise<any> | null = null;

async function getPgliteDb() {
  if (_pglite) return _pglite;
  _pglite = (async () => {
    const { PGlite } = await import("@electric-sql/pglite");
    const { drizzle: pgliteDrizzle } = await import("drizzle-orm/pglite");
    const client = new PGlite(process.env.DEV_PGLITE_DIR || undefined);
    const db = pgliteDrizzle(client);
    // Applique la migration si le schéma n'existe pas encore.
    const exists = await client
      .query("select to_regclass('public.documents') as t")
      .then((r: any) => r.rows[0]?.t)
      .catch(() => null);
    if (!exists) {
      const ddl = readFileSync(process.cwd() + "/drizzle/0000_init.sql", "utf-8");
      for (const stmt of ddl.split("--> statement-breakpoint")) {
        const s = stmt.trim();
        if (s) await client.exec(s);
      }
      const seedPath = process.env.DEV_PGLITE_SEED;
      if (seedPath) {
        const { importFactures } = await import("./import-2026");
        const records = readFileSync(seedPath, "utf-8")
          .trim()
          .split("\n")
          .map((l) => JSON.parse(l));
        await importFactures(db, records);
      }
    }
    return db;
  })();
  return _pglite;
}

/**
 * Instance Drizzle. Sur Neon (prod) : synchrone. Sous PGlite (dev) : les
 * appels sont await-és, or `db.execute(sql\`…\`)` renvoie déjà une Promise
 * dans les deux cas → l'appelant `await` sans distinction.
 */
export function getDb() {
  if (process.env.DEV_PGLITE === "1") {
    // Proxy qui délègue chaque méthode à l'instance PGlite (async).
    return new Proxy({} as any, {
      get(_t, prop) {
        return (...args: any[]) => getPgliteDb().then((db) => (db as any)[prop](...args));
      },
    });
  }
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL absente : créez une base Neon et ajoutez la variable dans Vercel.",
    );
  }
  if (!_neon) {
    _neon = drizzle(neon(process.env.DATABASE_URL), { schema });
  }
  return _neon;
}

export { schema, sql };
