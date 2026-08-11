import { CalendarCheck, MapPin, MessageCircle, ShieldCheck } from "lucide-react";
import { siteConfig } from "@/data/site-config";
import { SectionHeading } from "@/components/ui/section-heading";

const trustItems = [
  {
    title: "Atendimento direto",
    description: `Consulta pelo WhatsApp ${siteConfig.phone}, sem etapas confusas.`,
    icon: MessageCircle,
  },
  {
    title: "Reserva personalizada",
    description: "Datas, número de hóspedes e condições são alinhados conforme a casa escolhida.",
    icon: CalendarCheck,
  },
  {
    title: "Informações antes da decisão",
    description: "Regras, valores e endereço exato são confirmados antes da pré-reserva.",
    icon: ShieldCheck,
  },
  {
    title: "São Miguel dos Milagres",
    description: "As casas ficam em um dos destinos mais procurados do litoral de Alagoas.",
    icon: MapPin,
  },
];

export function TrustSection() {
  return (
    <section className="bg-[var(--color-shell)] px-4 py-10 md:px-6 md:py-14 xl:px-8">
      <div className="mx-auto grid max-w-7xl gap-7 lg:grid-cols-[0.6fr_1fr] lg:items-start">
        <SectionHeading
          eyebrow="Confiança"
          title="Consulta simples, atendimento claro."
          description="O pedido chega com as informações principais da estadia, facilitando uma resposta objetiva sobre disponibilidade e condições."
          compact
        />
        <div className="grid gap-3 sm:grid-cols-2">
          {trustItems.map(({ title, description, icon: Icon }) => (
            <article
              key={title}
              className="border border-[var(--color-line)] bg-[var(--color-paper)] p-4"
            >
              <Icon aria-hidden="true" className="text-[var(--color-ocean)]" size={22} />
              <h3 className="mt-4 font-serif text-2xl text-[var(--color-ink)]">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                {description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
