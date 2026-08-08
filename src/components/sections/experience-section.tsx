import { Palmtree, Sparkles, Utensils, Waves } from "lucide-react";
import { experiences } from "@/data/houses";
import { SectionHeading } from "@/components/ui/section-heading";

const icons = [Waves, Sparkles, Palmtree, Utensils];

export function ExperienceSection() {
  return (
    <section
      id="experiencia"
      className="section-anchor bg-[var(--color-ocean-strong)] px-4 py-10 text-white md:px-6 md:py-14 xl:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-5 md:grid-cols-[0.75fr_1fr] md:items-end">
          <SectionHeading
            eyebrow="Experiência"
            title="Dias de mar, pausa e convivência."
            description="Uma experiência pensada para quem quer aproveitar Milagres com conforto, privacidade e leveza."
            tone="dark"
            compact
          />
          <p className="text-base leading-8 text-white/66">
            A seção foi pensada para valorizar Milagres como destino e apoiar a decisão
            de quem busca conforto com privacidade.
          </p>
        </div>
        <div className="mt-7 grid gap-4 md:grid-cols-4">
          {experiences.map((experience, index) => {
            const Icon = icons[index];
            return (
              <article
                key={experience.title}
                className="border-t border-white/18 pt-4"
              >
                <Icon aria-hidden="true" className="text-[var(--color-gold)]" size={24} />
                <h3 className="mt-4 font-serif text-2xl text-white">
                  {experience.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-white/66">
                  {experience.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
