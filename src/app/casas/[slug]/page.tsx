import Link from "next/link";
import { notFound } from "next/navigation";
import { AtSign, ArrowLeft, CalendarDays, MessageCircle } from "lucide-react";
import { AvailabilityForm } from "@/components/booking/availability-form";
import { FaqSection } from "@/components/sections/faq-section";
import { HouseVideoHero } from "@/components/hero/house-video-hero";
import { HouseFacts } from "@/components/houses/house-facts";
import { HouseGallery } from "@/components/gallery/house-gallery";
import { HouseLocation } from "@/components/maps/house-location";
import { JsonLd } from "@/components/seo/json-ld";
import { SectionHeading } from "@/components/ui/section-heading";
import { houses } from "@/data/houses";
import { getHouseSeo } from "@/data/seo-content";
import { getPublicAvailability } from "@/lib/availability";
import { createMetadata } from "@/lib/seo";
import { createHouseStructuredData } from "@/lib/structured-data";
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
  const seo = getHouseSeo(house);

  return createMetadata({
    ...seo,
    path: `/casas/${house.slug}/`,
    image: {
      src: house.images[0].src,
      alt: house.images[0].alt,
      width: house.images[0].width,
      height: house.images[0].height,
    },
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
    <>
      <JsonLd
        id={`${house.slug}-structured-data`}
        data={createHouseStructuredData(house)}
      />
      <div className="bg-[var(--color-paper)]">
        <HouseVideoHero house={house}>
          <div className="max-w-4xl">
            <nav
              className="mb-5 flex items-center gap-2 text-sm text-white/72"
              aria-label="Breadcrumb"
            >
              <Link
                href="/"
                className="hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                Início
              </Link>
              <span>/</span>
              <Link
                href="/casas/"
                className="hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
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
            <div className="mt-7 flex flex-col gap-2 sm:flex-row">
              <Link
                href="#consultar"
                className="inline-flex min-h-11 items-center justify-center gap-2 bg-[var(--color-gold)] px-4 text-sm font-semibold text-[var(--color-ink)] transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                Consultar disponibilidade
                <CalendarDays aria-hidden="true" size={16} />
              </Link>
              <Link
                href="#galeria"
                className="inline-flex min-h-11 items-center justify-center border border-white/50 bg-white/10 px-4 text-sm font-semibold text-white backdrop-blur transition hover:bg-white hover:text-[var(--color-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                Ver todas as fotos
              </Link>
            </div>
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
            <div className="grid gap-7 lg:grid-cols-[0.58fr_0.72fr] lg:items-start">
              <div>
                <SectionHeading
                  eyebrow="Informações principais"
                  title="O essencial para decidir."
                  description={house.fullDescription}
                  compact
                />
                <div className="mt-7">
                  <HouseFacts house={house} />
                </div>
                <p className="mt-5 border-l-2 border-[var(--color-copper)] pl-4 text-sm font-semibold leading-6 text-[var(--color-ink)]">
                  {house.idealFor}
                </p>
              </div>
              <div>
                <div id="galeria" className="section-anchor">
                  <HouseGallery images={house.images} label={house.name} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[var(--color-shell)] px-4 py-10 md:px-6 md:py-14 xl:px-8">
          <div className="mx-auto grid max-w-7xl gap-7 lg:grid-cols-[0.55fr_1fr] lg:items-start">
            <div>
              <SectionHeading
                eyebrow="Por que escolher"
                title={`Destaques da ${house.name}.`}
                description="Os diferenciais ajudam a entender o perfil da casa antes de consultar datas e condições."
                compact
              />
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
            <InfoList title="Diferenciais" items={house.highlights} />
          </div>
        </section>

        <section className="px-4 py-10 md:px-6 md:py-14 xl:px-8">
          <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-3">
            <InfoList title="Comodidades" items={house.amenities} />
            <InfoList
              title="Acomodações"
              items={[
                `${house.suites} suítes`,
                `${house.bedrooms} quartos`,
                `${house.bathrooms} banheiros`,
                house.capacityNote,
              ]}
            />
            <InfoList title="Informações importantes" items={house.rules} />
          </div>
        </section>

        <section
          id="consultar"
          className="section-anchor bg-[var(--color-soft)] px-4 py-10 md:px-6 md:py-14 xl:px-8"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 max-w-3xl">
              <SectionHeading
                eyebrow="Disponibilidade"
                title={`Consultar ${house.name}.`}
                description="Selecione o período desejado e envie uma consulta objetiva pelo WhatsApp."
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

        <section
          id="localizacao"
          className="section-anchor px-4 py-10 md:px-6 md:py-14 xl:px-8"
        >
          <div className="mx-auto grid max-w-7xl gap-7 lg:grid-cols-[0.72fr_1fr] lg:items-center">
            <div>
              <SectionHeading
                eyebrow="Localização"
                title="Onde você vai estar."
                description={`${house.name} fica em São Miguel dos Milagres. Confira abaixo a localização exata e as rotas de acesso.`}
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
              {house.location.distances?.length ? (
                <dl className="mt-6 grid gap-3 sm:grid-cols-2">
                  {house.location.distances.map((distance) => (
                    <div
                      key={distance.label}
                      className="border border-[var(--color-line)] bg-[var(--color-shell)] p-3"
                    >
                      <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
                        {distance.label}
                      </dt>
                      <dd className="mt-1 text-sm font-semibold text-[var(--color-ink)]">
                        {distance.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : null}
            </div>
            <HouseLocation location={house.location} title={`Mapa de ${house.name}`} />
          </div>
        </section>

        <section className="bg-[var(--color-shell)] px-4 py-10 md:px-6 md:py-14 xl:px-8">
          <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 lg:grid-cols-3">
            {house.policies.map((policy) => (
              <article
                key={policy.label}
                className="border border-[var(--color-line)] bg-[var(--color-paper)] p-4"
              >
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-copper)]">
                  {policy.label}
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                  {policy.value}
                </p>
              </article>
            ))}
          </div>
        </section>

        <FaqSection
          items={house.faqs}
          tone="paper"
          title={`Dúvidas sobre ${house.name}`}
          description="Respostas rápidas antes de consultar o período desejado."
        />

        {related.length ? (
          <section className="px-4 py-10 md:px-6 md:py-14 xl:px-8">
            <div className="mx-auto max-w-7xl">
              <SectionHeading
                eyebrow="Outra opção"
                title="Compare com a outra casa."
                description="Veja a outra propriedade antes de enviar sua consulta de disponibilidade."
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
                <Link
                  href="#consultar"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-sm bg-[var(--color-copper)] px-4 text-sm font-semibold text-[var(--color-ink)] transition hover:bg-[var(--color-ocean-strong)] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-gold)]"
                >
                  <MessageCircle aria-hidden="true" size={16} />
                  Consultar disponibilidade
                </Link>
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </>
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
