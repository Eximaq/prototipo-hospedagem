import { AtSign, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { AvailabilityForm } from "@/components/booking/availability-form";
import { Logo } from "@/components/brand/logo";
import { SectionHeading } from "@/components/ui/section-heading";
import { houses } from "@/data/houses";
import { siteConfig } from "@/data/site-config";
import { getPublicAvailability } from "@/lib/availability";
import { getBookingHouseOptions } from "@/lib/data";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Contato",
  description:
    "Consulte disponibilidade da Casa Turquesa ou Casa Corais Milagres pelo WhatsApp.",
  path: "/contato/",
});

export default function ContactPage() {
  const bookingHouses = getBookingHouseOptions();
  const availability = getPublicAvailability();

  return (
    <div className="bg-[var(--color-paper)]">
      <section className="bg-[var(--color-ocean-strong)] px-5 pb-16 pt-32 text-white md:px-8 md:pb-20 md:pt-40">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.82fr_0.62fr] lg:items-end">
          <div>
            <Logo variant="light" showSignature size="lg" />
            <h1 className="mt-10 max-w-3xl font-serif text-5xl leading-tight md:text-7xl">
              Consulte disponibilidade com uma mensagem completa.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/72">
              Escolha uma das casas, confira datas disponíveis e fale com o atendimento pelo WhatsApp.
            </p>
          </div>
          <div className="border border-white/14 bg-white/[0.04] p-6 backdrop-blur">
            <ul className="space-y-5 text-sm text-white/72">
              <li className="flex gap-3">
                <MessageCircle aria-hidden="true" className="text-[var(--color-gold)]" size={19} />
                <span>WhatsApp: {siteConfig.phone}</span>
              </li>
              <li className="flex gap-3">
                <Phone aria-hidden="true" className="text-[var(--color-gold)]" size={19} />
                <span>Telefone: {siteConfig.phone}</span>
              </li>
              <li className="flex gap-3">
                <Mail aria-hidden="true" className="text-[var(--color-gold)]" size={19} />
                <span>{siteConfig.email}</span>
              </li>
              <li className="flex gap-3">
                <MapPin aria-hidden="true" className="text-[var(--color-gold)]" size={19} />
                <span>{siteConfig.address}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.46fr_0.9fr] lg:items-start">
          <div>
            <SectionHeading
              eyebrow="Atendimento"
              title="Duas casas, uma conversa objetiva."
              description="Escolha a casa, informe o período desejado e envie uma consulta clara para receber disponibilidade, valores e condições."
            />
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {houses.map((house) =>
                house.instagram ? (
                  <a
                    key={house.id}
                    href={house.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="flex min-h-14 items-center justify-between border border-[var(--color-line)] bg-[var(--color-shell)] px-4 text-sm font-semibold text-[var(--color-ink)] transition hover:border-[var(--color-copper)] hover:text-[var(--color-copper)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-gold)]"
                  >
                    {house.name}
                    <AtSign aria-hidden="true" size={17} />
                  </a>
                ) : null,
              )}
            </div>
          </div>
          <AvailabilityForm houses={bookingHouses} availability={availability} />
        </div>
      </section>
    </div>
  );
}
