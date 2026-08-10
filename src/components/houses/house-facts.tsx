import { Flame, DoorOpen, Users, Waves, Wifi } from "lucide-react";
import type { House } from "@/types/house";

const factIcons = [Users, DoorOpen, Wifi, Waves, Flame];

export function HouseFacts({ house, compact = false }: { house: House; compact?: boolean }) {
  const facts = [
    {
      label: "Hóspedes",
      value: house.guests ? `até ${house.guests}` : "a confirmar",
    },
    { label: "Suítes", value: String(house.suites) },
    { label: "Wi-Fi", value: "Sim" },
    { label: "Piscina", value: house.pool ? "Sim" : "a confirmar" },
    { label: "Churrasqueira", value: house.barbecue ? "Sim" : "a confirmar" },
  ];

  return (
    <dl
      className={
        compact
          ? "grid gap-2 [grid-template-columns:repeat(auto-fit,minmax(145px,1fr))] sm:[grid-template-columns:repeat(auto-fit,minmax(150px,1fr))]"
          : "grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(150px,1fr))]"
      }
    >
      {facts.map((fact, index) => {
        const Icon = factIcons[index];
        return (
          <div
            key={fact.label}
            className={
              compact
                ? "min-h-16 border border-[var(--color-line)] bg-white/60 px-3 py-3 sm:flex sm:min-h-14 sm:items-center sm:gap-3 sm:py-2.5"
                : "border border-[var(--color-line)] bg-[var(--color-shell)] p-4"
            }
          >
            {compact ? (
              <span className="mb-2 grid size-7 shrink-0 place-items-center bg-[var(--color-soft)] text-[var(--color-ocean-strong)] sm:mb-0">
                <Icon aria-hidden="true" size={15} />
              </span>
            ) : null}
            <div className={compact ? "min-w-0 flex-1" : undefined}>
              <dt
                className={
                  compact
                    ? "text-[0.58rem] font-semibold uppercase tracking-[0.08em] text-[var(--color-muted)] sm:text-[0.62rem] sm:tracking-[0.12em]"
                    : "flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]"
                }
              >
                {!compact ? <Icon aria-hidden="true" size={15} /> : null}
                {fact.label}
              </dt>
              <dd
                className={
                  compact
                    ? "mt-0.5 text-[0.95rem] font-semibold leading-5 text-[var(--color-ink)]"
                    : "mt-3 font-serif text-2xl text-[var(--color-ink)]"
                }
              >
                {fact.value}
              </dd>
            </div>
          </div>
        );
      })}
    </dl>
  );
}
