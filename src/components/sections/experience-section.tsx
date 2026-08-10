import Image from "next/image";
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
            description="A rotina em Milagres combina praia, piscina, refeições sem pressa e casas preparadas para reunir quem viaja junto."
            tone="dark"
            compact
          />
          <p className="text-base leading-8 text-white/66">
            A casa certa muda o ritmo da viagem: mais privacidade, mais tempo de descanso e uma base confortável para aproveitar a região.
          </p>
        </div>
        <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {experiences.map((experience, index) => {
            const Icon = icons[index];
            return (
              <article
                key={experience.title}
                className="group overflow-hidden border border-white/14 bg-white/[0.04]"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={experience.image}
                    alt={experience.title}
                    fill
                    sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition duration-700 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071b1f]/68 to-transparent" />
                  <Icon
                    aria-hidden="true"
                    className="absolute bottom-4 left-4 text-[var(--color-gold)]"
                    size={24}
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-serif text-2xl text-white">
                    {experience.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-white/66">
                    {experience.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
