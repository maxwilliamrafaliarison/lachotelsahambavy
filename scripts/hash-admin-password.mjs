#!/usr/bin/env node
/**
 * Génère le hash bcrypt d'un mot de passe admin.
 * Usage : node scripts/hash-admin-password.mjs "mon-mot-de-passe"
 * Le hash obtenu se place dans ADMIN_USERS_JSON (Vercel → Settings → Env vars).
 */
import { hash } from "bcryptjs";

const pwd = process.argv[2];
if (!pwd || pwd.length < 8) {
  console.error("Usage : node scripts/hash-admin-password.mjs \"mot-de-passe (8 caractères min)\"");
  process.exit(1);
}
console.log(await hash(pwd, 12));
