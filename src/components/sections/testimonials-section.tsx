import { testimonials } from "@/data/houses";
import { SectionHeading } from "@/components/ui/section-heading";

export function TestimonialsSection() {
  return (
    <section className="bg-[var(--color-paper)] px-4 py-10 md:px-6 md:py-14 xl:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Depoimentos"
          title="Relatos de quem procura conforto e privacidade."
          description="Experiências curtas que reforçam a proposta das casas para famílias e grupos."
          compact
        />
        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <figure
              key={testimonial.name}
              className="border border-[var(--color-line)] bg-[var(--color-shell)] p-4"
            >
              <blockquote className="text-sm leading-6 text-[var(--color-ink)]">
                “{testimonial.quote}”
              </blockquote>
              <figcaption className="mt-4 border-t border-[var(--color-line)] pt-4">
                <p className="font-semibold text-[var(--color-ink)]">{testimonial.name}</p>
                <p className="mt-1 text-sm text-[var(--color-muted)]">
                  {testimonial.context}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
