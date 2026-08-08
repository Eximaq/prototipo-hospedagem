export function AvailabilityLegend({
  showUnavailable = true,
}: {
  showUnavailable?: boolean;
}) {
  const items = [
    { label: "Disponível", className: "bg-white border-[var(--color-line)]" },
    showUnavailable
      ? {
          label: "Indisponível",
          className: "bg-[var(--color-soft)] border-[var(--color-line)] opacity-60",
        }
      : null,
    {
      label: "Selecionado",
      className: "bg-[var(--color-ocean-strong)] border-[var(--color-ocean-strong)]",
    },
  ].filter((item) => item !== null);

  return (
    <div className="flex flex-wrap gap-3 text-xs font-medium text-[var(--color-muted)]">
      {items.map((item) => (
        <span key={item.label} className="inline-flex items-center gap-2">
          <span className={`size-3 border ${item.className}`} aria-hidden="true" />
          {item.label}
        </span>
      ))}
    </div>
  );
}
