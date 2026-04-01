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
      {label && <span className="section-label">{label}</span>}
      <h2 className={light ? "text-white" : ""}>{title}</h2>
      {subtitle && (
        <p className={`mt-3 text-lg font-[family-name:var(--font-sub)] ${light ? "text-cream/70" : "text-text-muted"}`}>
          {subtitle}
        </p>
      )}
      <div className="section-divider" />
    </div>
  );
}
