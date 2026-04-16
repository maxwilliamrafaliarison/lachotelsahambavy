/**
 * Titre de section réutilisable.
 *
 * `light={true}` : variante sur fond sombre (ex. `bg-brown-deep`).
 *   - Le titre force `color: #FFFFFF` via `style` (ceinture ET bretelles :
 *     même si la règle `h2 { color: var(--color-text-dark) }` sortait un
 *     jour de `@layer base`, l'inline style gagne la spécificité).
 *   - Sous-titre en crème translucide.
 *
 * `light={false}` : variante sur fond clair (défaut).
 */
export default function SectionHeader({
  label,
  title,
  subtitle,
  light = false,
  className = "",
}: {
  label?: string;
  title: string;
  subtitle?: string;
  light?: boolean;
  className?: string;
}) {
  return (
    <div className={`text-center mb-16 ${className}`}>
      {label && (
        <span
          className="section-label"
          style={light ? { color: "var(--color-gold-light)" } : undefined}
        >
          {label}
        </span>
      )}
      <h2 style={light ? { color: "#FFFFFF" } : undefined}>{title}</h2>
      {subtitle && (
        <p
          className={`mt-3 text-lg font-[family-name:var(--font-sub)] ${
            light ? "" : "text-text-muted"
          }`}
          style={light ? { color: "rgba(248, 245, 240, 0.75)" } : undefined}
        >
          {subtitle}
        </p>
      )}
      <div className="section-divider" />
    </div>
  );
}
