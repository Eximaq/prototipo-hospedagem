import { Bath, BedDouble, DoorOpen, Users, Waves } from "lucide-react";
import type { House } from "@/types/house";

const factIcons = [Users, DoorOpen, BedDouble, Bath, Waves];

export function HouseFacts({ house, compact = false }: { house: House; compact?: boolean }) {
  const facts = [
    { label: "Hóspedes", value: `até ${house.guests}` },
    { label: "Quartos", value: String(house.bedrooms) },
    { label: "Camas", value: String(house.beds) },
    { label: "Banheiros", value: String(house.bathrooms) },
    { label: "Piscina", value: house.pool ? "sim" : "sob consulta" },
  ];

  return (
    <dl className={compact ? "grid grid-cols-3 gap-2 sm:grid-cols-5" : "grid grid-cols-2 gap-3 md:grid-cols-5"}>
      {facts.map((fact, index) => {
        const Icon = factIcons[index];
        return (
          <div
            key={fact.label}
            className={compact ? "border border-[var(--color-line)] bg-white/55 p-2.5" : "border border-[var(--color-line)] bg-[var(--color-shell)] p-4"}
          >
            <dt className={compact ? "flex items-center gap-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]" : "flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]"}>
              <Icon aria-hidden="true" size={compact ? 13 : 15} />
              {fact.label}
            </dt>
            <dd className={compact ? "mt-1.5 font-serif text-xl text-[var(--color-ink)]" : "mt-3 font-serif text-2xl text-[var(--color-ink)]"}>
              {fact.value}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
