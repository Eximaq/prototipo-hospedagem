import { testimonials } from "@/data/houses";
import { SectionHeading } from "@/components/ui/section-heading";
import { Star } from "lucide-react";

export function TestimonialsSection() {
  const verifiedTestimonials = testimonials.filter((testimonial) => !testimonial.placeholder);

  if (!verifiedTestimonials.length) return null;

  return (
    <section className="bg-[var(--color-paper)] px-4 py-10 md:px-6 md:py-14 xl:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Depoimentos"
          title="O que os hóspedes destacam nas casas."
          description="Conforto nas suítes, piscina, churrasqueira e atendimento direto para planejar dias tranquilos em São Miguel dos Milagres."
          compact
        />
        <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {verifiedTestimonials.map((testimonial) => (
            <figure
              key={testimonial.name}
              className="flex h-full flex-col border border-[var(--color-line)] bg-[var(--color-shell)] p-4 shadow-[0_16px_38px_rgba(23,35,34,0.06)] md:p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-rust)]">
                  {testimonial.stay}
                </p>
                <div
                  className="flex shrink-0 items-center gap-0.5 text-[var(--color-copper)]"
                  aria-label={`Avaliação: ${testimonial.rating || 5} de 5`}
                >
                  {Array.from({ length: testimonial.rating || 5 }, (_, index) => (
                    <Star key={index} aria-hidden="true" size={13} fill="currentColor" />
                  ))}
                </div>
              </div>
              <blockquote className="mt-4 text-sm leading-6 text-[var(--color-ink)]">
                “{testimonial.quote}”
              </blockquote>
              <figcaption className="mt-auto border-t border-[var(--color-line)] pt-4">
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
