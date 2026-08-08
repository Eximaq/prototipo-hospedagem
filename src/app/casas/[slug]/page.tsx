import Link from "next/link";
import { notFound } from "next/navigation";
import { AtSign, ArrowLeft } from "lucide-react";
import { AvailabilityForm } from "@/components/booking/availability-form";
import { HouseVideoHero } from "@/components/hero/house-video-hero";
import { HouseFacts } from "@/components/houses/house-facts";
import { HouseGallery } from "@/components/gallery/house-gallery";
import { HouseLocation } from "@/components/maps/house-location";
import { SectionHeading } from "@/components/ui/section-heading";
import { houses } from "@/data/houses";
import { getPublicAvailability } from "@/lib/availability";
import { createMetadata } from "@/lib/seo";
import { getBookingHouseOptions, getHouseBySlug, getRelatedHouses } from "@/lib/data";

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return houses.map((house) => ({ slug: house.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const house = getHouseBySlug(slug);
  if (!house) return {};

  return createMetadata({
    title: house.name,
    description: house.shortDescription,
    path: `/casas/${house.slug}/`,
    image: house.images[0].src,
  });
}

export default async function HouseDetailPage({ params }: Props) {
  const { slug } = await params;
  const house = getHouseBySlug(slug);
  if (!house) notFound();

  const related = getRelatedHouses(house.slug);
  const bookingHouses = getBookingHouseOptions();
  const publicAvailability = getPublicAvailability();

  return (
    <div className="bg-[var(--color-paper)]">
      <HouseVideoHero house={house}>
        <div className="max-w-4xl">
          <nav className="mb-5 flex items-center gap-2 text-sm text-white/72" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
              Início
            </Link>
            <span>/</span>
            <Link href="/casas/" className="hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
              Casas
            </Link>
            <span>/</span>
            <span aria-current="page">{house.name}</span>
          </nav>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-gold)]">
            {house.label}
          </p>
          <h1 className="mt-3 font-serif text-4xl leading-tight md:text-6xl">
            {house.name}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/82 md:text-lg">
            {house.shortDescription}
          </p>
        </div>
      </HouseVideoHero>

      <section className="px-4 py-10 md:px-6 md:py-14 xl:px-8">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/casas/"
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-ocean)] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-gold)]"
          >
            <ArrowLeft aria-hidden="true" size={16} />
            Voltar para as casas
          </Link>
          <div className="grid gap-7 lg:grid-cols-[0.72fr_0.58fr]">
            <div>
              <HouseGallery images={house.images} label={house.name} priority />
            </div>
            <div>
              <SectionHeading
                eyebrow="Detalhes"
                title="Informações para decidir com segurança."
                description={house.fullDescription}
                compact
              />
              <div className="mt-8">
                <HouseFacts house={house} />
              </div>
              {house.instagram ? (
                <a
                  href={house.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-copper)] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-gold)]"
                >
                  <AtSign aria-hidden="true" size={16} />
                  Ver Instagram da casa
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-shell)] px-4 py-10 md:px-6 md:py-14 xl:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-3">
          <InfoList title="Comodidades" items={house.amenities} />
          <InfoList title="Diferenciais" items={house.highlights} />
          <InfoList title="Regras" items={house.rules} />
        </div>
      </section>

      <section id="localizacao" className="section-anchor px-4 py-10 md:px-6 md:py-14 xl:px-8">
        <div className="mx-auto grid max-w-7xl gap-7 lg:grid-cols-[0.72fr_1fr] lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Localização"
              title={house.location.label}
              description="Localização em São Miguel dos Milagres, com endereço exato informado durante o atendimento."
              compact
            />
            <ul className="mt-5 space-y-2 text-sm leading-6 text-[var(--color-muted)]">
              {house.usefulInfo.map((info) => (
                <li key={info} className="flex gap-3">
                  <span className="mt-3 h-px w-6 shrink-0 bg-[var(--color-copper)]" />
                  {info}
                </li>
              ))}
            </ul>
          </div>
          <HouseLocation location={house.location} title={`Mapa de ${house.name}`} />
        </div>
      </section>

      <section id="consultar" className="section-anchor bg-[var(--color-soft)] px-4 py-10 md:px-6 md:py-14 xl:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 max-w-3xl">
            <SectionHeading
              eyebrow="Consulta"
              title="Consultar esta casa pelo WhatsApp."
              description="O formulário já fica com esta casa selecionada e envia uma mensagem completa para atendimento."
              compact
            />
          </div>
          <AvailabilityForm
            selectedHouseSlug={house.slug}
            houses={bookingHouses}
            availability={publicAvailability}
            layout="horizontal"
          />
        </div>
      </section>

      {related.length ? (
        <section className="px-4 py-10 md:px-6 md:py-14 xl:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Outra opção"
              title="Compare com a outra casa."
              description="Volte para as duas opções ou veja a casa relacionada antes de consultar."
              compact
            />
            <div className="mt-8 flex flex-wrap gap-3">
              {related.map((item) => (
                <Link
                  href={`/casas/${item.slug}/`}
                  key={item.id}
                  className="inline-flex min-h-11 items-center justify-center rounded-sm border border-[var(--color-ocean)] px-4 text-sm font-semibold text-[var(--color-ocean)] transition hover:bg-[var(--color-ocean-strong)] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-gold)]"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}

function InfoList({ title, items }: { title: string; items: string[] }) {
  return (
    <article className="border-l border-[var(--color-line)] pl-6">
      <h2 className="font-serif text-3xl text-[var(--color-ink)]">{title}</h2>
      <ul className="mt-5 space-y-3 text-sm leading-6 text-[var(--color-muted)]">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-2 h-px w-5 shrink-0 bg-[var(--color-copper)]" />
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}
