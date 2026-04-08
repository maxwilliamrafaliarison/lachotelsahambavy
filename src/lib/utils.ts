export const locales = ["fr", "en", "es"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fr";

export function getBasePath() {
  return process.env.NEXT_PUBLIC_BASE_PATH || "";
}

export function getImagePath(src: string) {
  return `${getBasePath()}${src}`;
}
