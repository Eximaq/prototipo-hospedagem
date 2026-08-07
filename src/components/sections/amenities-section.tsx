import { amenityGroups } from "@/data/amenities";
import { SectionHeading } from "@/components/ui/section-heading";

export function AmenitiesSection() {
  return (
    <section className="bg-[var(--color-shell)] px-4 py-10 md:px-6 md:py-14 xl:px-8">
      <div className="mx-auto grid max-w-7xl gap-7 md:grid-cols-[0.7fr_1fr]">
        <SectionHeading
          eyebrow="Comodidades"
          title="Estrutura apresentada com calma e clareza."
          description="Itens essenciais para quem busca conforto, praticidade e bons momentos em família."
          compact
        />
        <div className="grid gap-4 md:grid-cols-3">
          {amenityGroups.map((group) => (
            <article key={group.title} className="border-l border-[var(--color-line)] pl-6">
              <h3 className="font-serif text-2xl text-[var(--color-ink)]">{group.title}</h3>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-[var(--color-muted)]">
                {group.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-px w-5 shrink-0 bg-[var(--color-copper)]" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
