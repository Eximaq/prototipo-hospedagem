import { GoogleMap } from "@/components/ui/google-map";
import { siteConfig } from "@/data/site-config";
import { SectionHeading } from "@/components/ui/section-heading";

export function LocationSection() {
  return (
    <section
      id="localizacao"
      className="section-anchor bg-[var(--color-soft)] px-4 py-10 md:px-6 md:py-14 xl:px-8"
    >
      <div className="mx-auto grid max-w-7xl gap-7 lg:grid-cols-[0.72fr_1fr] lg:items-center">
        <div>
          <SectionHeading
            eyebrow="Localização"
            title="Onde você vai estar."
            description="São Miguel dos Milagres é uma base tranquila para aproveitar praias, passeios e restaurantes do litoral norte de Alagoas."
            compact
          />
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {["Praias da região", "Restaurantes locais", "Passeios em Milagres"].map((item) => (
              <div key={item} className="border-t border-[var(--color-line)] pt-4 text-sm font-semibold text-[var(--color-muted)]">
                {item}
              </div>
            ))}
          </div>
        </div>
        <GoogleMap query={siteConfig.mapQuery} title="Mapa de São Miguel dos Milagres" />
      </div>
    </section>
  );
}
