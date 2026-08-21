/**
 * Composant inert qui injecte un (ou plusieurs) bloc(s) JSON-LD
 * dans le <head> via une balise <script type="application/ld+json">.
 *
 * Usage :
 *
 *   import { JsonLd } from "@/components/seo/JsonLd";
 *   import { lodgingBusinessSchema, websiteSchema } from "@/lib/schema-org";
 *
 *   <JsonLd schemas={[lodgingBusinessSchema(locale), websiteSchema(locale)]} />
 *
 * Les objets sont sérialisés avec JSON.stringify (escape automatique).
 * Aucune logique runtime : pur composant Server Component.
 */

interface JsonLdProps {
  schemas: Record<string, unknown> | Record<string, unknown>[];
}

function stripUndefined(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(stripUndefined);
  }
  if (value !== null && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      if (v === undefined) continue;
      out[k] = stripUndefined(v);
    }
    return out;
  }
  return value;
}

/* Le vocabulaire, ajouté ICI et non dans chaque générateur.

   Un bloc JSON-LD sans `@context` n'est pas du JSON-LD : les moteurs
   l'ignorent en silence. `organizationSchema()` l'avait oublié, et son
   bloc partait donc invalide sur les 51 pages depuis l'origine, sans que
   rien ne le signale. Le poser au point de passage commun règle le cas
   présent et tous ceux à venir : un générateur qui l'oublie ne peut plus
   émettre un bloc mort.

   Celui qui le déclare déjà garde le sien : on ne l'écrase pas, au cas
   où un schéma aurait besoin d'un contexte particulier. */
const VOCABULAIRE = "https://schema.org";

export function JsonLd({ schemas }: JsonLdProps) {
  const list = (Array.isArray(schemas) ? schemas : [schemas]).map((s) =>
    s && typeof s === "object" && !("@context" in s) ? { "@context": VOCABULAIRE, ...s } : s,
  );

  return (
    <>
      {list.map((schema, idx) => (
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(stripUndefined(schema)).replace(/</g, "\\u003c"),
          }}
          // Pas de nonce → CSP en `script-src 'self' 'unsafe-inline'`
          // (acceptable pour JSON-LD inerte, pas de JS exécutable)
          key={`json-ld-${idx}`}
          type="application/ld+json"
        />
      ))}
    </>
  );
}
