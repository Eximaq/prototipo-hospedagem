import Link from "next/link";
import { ArrowRight, Check, Minus } from "lucide-react";
import { houses } from "@/data/houses";
import { SectionHeading } from "@/components/ui/section-heading";

export function HouseComparisonSection() {
  const rows = [
    {
      label: "Capacidade",
      getValue: (house: (typeof houses)[number]) =>
        house.guests ? `Até ${house.guests} hóspedes` : "A confirmar no atendimento",
    },
    { label: "Suítes", getValue: (house: (typeof houses)[number]) => `${house.suites}` },
    { label: "Quartos", getValue: (house: (typeof houses)[number]) => `${house.bedrooms}` },
    { label: "Banheiros", getValue: (house: (typeof houses)[number]) => `${house.bathrooms}` },
    { label: "Piscina", getValue: (house: (typeof houses)[number]) => (house.pool ? "Sim" : "Não informado") },
    {
      label: "Churrasqueira",
      getValue: (house: (typeof houses)[number]) => (house.barbecue ? "Sim" : "Não informado"),
    },
    {
      label: "Estacionamento",
      getValue: (house: (typeof houses)[number]) =>
        house.amenities.includes("Estacionamento") ? "Sim" : "Não informado",
    },
  ];

  return (
    <section className="bg-[var(--color-shell)] px-4 py-10 md:px-6 md:py-14 xl:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-5 md:grid-cols-[0.78fr_1fr] md:items-end">
          <SectionHeading
            eyebrow="Comparação"
            title="Qual casa combina com sua viagem?"
            description="Veja rapidamente as diferenças principais antes de abrir os detalhes de cada propriedade."
            compact
          />
          <p className="text-sm leading-6 text-[var(--color-muted)]">
            A capacidade final é confirmada no atendimento antes da pré-reserva. As demais informações ajudam a comparar estrutura e perfil de estadia.
          </p>
        </div>

        <div className="mt-7 grid gap-4 lg:grid-cols-2">
          {houses.map((house) => (
            <article
              key={house.id}
              className="border border-[var(--color-line)] bg-[var(--color-paper)] p-4 shadow-[0_18px_45px_rgba(23,35,34,0.07)] md:p-5"
            >
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-copper)]">
                {house.label}
              </p>
              <h3 className="mt-1 font-serif text-3xl leading-tight text-[var(--color-ink)]">
                {house.name}
              </h3>
              <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
                {house.idealFor}
              </p>

              <dl className="mt-5 divide-y divide-[var(--color-line)] border-y border-[var(--color-line)]">
                {rows.map((row) => {
                  const value = row.getValue(house);
                  const positive = value === "Sim";
                  const neutral = value.includes("confirmar") || value.includes("Não informado");

                  return (
                    <div key={row.label} className="grid grid-cols-[0.58fr_1fr] gap-3 py-3">
                      <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]">
                        {row.label}
                      </dt>
                      <dd className="flex items-center gap-2 text-sm font-semibold text-[var(--color-ink)]">
                        {positive ? (
                          <Check aria-hidden="true" className="text-[var(--color-ocean)]" size={16} />
                        ) : neutral ? (
                          <Minus aria-hidden="true" className="text-[var(--color-muted)]" size={16} />
                        ) : null}
                        {value}
                      </dd>
                    </div>
                  );
                })}
              </dl>

              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                <Link
                  href={`/casas/${house.slug}/`}
                  className="inline-flex min-h-11 items-center justify-center gap-2 border border-[var(--color-ocean)] px-4 text-sm font-semibold text-[var(--color-ocean)] transition hover:bg-[var(--color-ocean-strong)] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-gold)]"
                >
                  Conhecer a casa
                  <ArrowRight aria-hidden="true" size={16} />
                </Link>
                <Link
                  href={`/casas/${house.slug}/#consultar`}
                  className="inline-flex min-h-11 items-center justify-center bg-[var(--color-copper)] px-4 text-sm font-semibold text-[var(--color-ink)] transition hover:bg-[var(--color-ocean-strong)] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-gold)]"
                >
                  Consultar disponibilidade
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
