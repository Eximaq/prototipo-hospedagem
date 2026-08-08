import Link from "next/link";
import { MapPin } from "lucide-react";
import { HouseGallery } from "@/components/gallery/house-gallery";
import { HouseFacts } from "@/components/houses/house-facts";
import { SectionHeading } from "@/components/ui/section-heading";
import { houses } from "@/data/houses";

export function HouseShowcase() {
  return (
    <section
      id="casas"
      className="section-anchor bg-[var(--color-paper)] px-4 py-10 md:px-6 md:py-14 xl:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Escolha sua experiência"
            title="Escolha entre Casa Turquesa e Casa Corais Milagres."
            description="Fotos em destaque, informações essenciais e consulta direta pelo WhatsApp."
            compact
          />
          <p className="max-w-md text-sm leading-6 text-[var(--color-muted)]">
            Compare capacidade, estrutura, comodidades e escolha a casa ideal para sua estadia.
          </p>
        </div>

        <div className="mt-7 grid gap-5 md:grid-cols-2 xl:gap-6">
          {houses.map((house) => (
            <article
              key={house.id}
              className="overflow-hidden border border-[var(--color-line)] bg-[var(--color-shell)] shadow-[0_18px_45px_rgba(23,35,34,0.08)]"
            >
              <div className="flex items-center justify-between border-b border-[var(--color-line)] px-4 py-3">
                <div>
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-copper)]">
                    {house.label}
                  </p>
                  <h3 className="font-serif text-2xl leading-none text-[var(--color-ink)]">
                    {house.name}
                  </h3>
                </div>
                <p className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-muted)]">
                  <MapPin aria-hidden="true" size={14} />
                  Milagres
                </p>
              </div>

              <HouseGallery images={house.images} label={house.name} compact />

              <div className="space-y-4 p-4 md:p-5">
                <p className="text-sm leading-6 text-[var(--color-muted)]">
                  {house.shortDescription}
                </p>
                <HouseFacts house={house} compact />
                <div className="flex flex-wrap gap-1.5">
                  {house.amenities.slice(0, 6).map((amenity) => (
                    <span
                      key={amenity}
                      className="bg-[var(--color-soft)] px-2.5 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-[var(--color-muted)]"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link
                    href={`/casas/${house.slug}/`}
                    className="inline-flex min-h-11 items-center justify-center border border-[var(--color-ocean)] px-3 text-sm font-semibold text-[var(--color-ocean)] transition hover:bg-[var(--color-ocean-strong)] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--color-gold)]"
                  >
                    Ver detalhes
                  </Link>
                  <Link
                    href={`/casas/${house.slug}/#consultar`}
                    className="inline-flex min-h-11 items-center justify-center bg-[var(--color-copper)] px-3 text-sm font-semibold text-[var(--color-ink)] transition hover:bg-[var(--color-ocean-strong)] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--color-gold)]"
                  >
                    Escolher
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
