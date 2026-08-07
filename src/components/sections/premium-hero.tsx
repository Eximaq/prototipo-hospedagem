import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { Logo } from "@/components/brand/logo";

export function PremiumHero() {
  return (
    <section
      id="inicio"
      className="section-anchor relative min-h-[78svh] overflow-hidden bg-[var(--color-ocean)] text-white"
    >
      <Image
        src="/images/experiences/milagres-hero.jpg"
        alt="Casa de temporada com piscina, arquitetura natural e jardim tropical"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,31,35,0.84),rgba(10,31,35,0.48)_48%,rgba(10,31,35,0.16))]" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[var(--color-paper)] to-transparent" />

      <div className="relative z-10 mx-auto grid min-h-[78svh] max-w-7xl place-items-center px-4 py-24 text-center md:px-6 xl:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-4 flex justify-center">
            <Logo
              variant="light"
              orientation="stacked"
              showSignature
              size="lg"
              className="drop-shadow-[0_8px_22px_rgba(0,0,0,0.28)]"
            />
          </div>
          <p className="mb-4 inline-flex items-center gap-2 border border-white/24 bg-white/10 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-white/82 backdrop-blur">
            <MapPin aria-hidden="true" size={14} />
            São Miguel dos Milagres, AL
          </p>
          <h1 className="font-serif text-3xl leading-[1.08] text-white sm:text-4xl md:text-5xl lg:text-[3.65rem]">
            Duas casas. Um só destino. Experiências inesquecíveis à beira-mar em São Miguel dos Milagres.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-white/78 md:text-lg">
            Galerias rápidas, dados essenciais e consulta direta pelo WhatsApp.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-2 sm:flex-row">
            <Link
              href="#casas"
              className="inline-flex min-h-11 items-center justify-center gap-2 bg-[var(--color-gold)] px-4 text-sm font-semibold text-[var(--color-ink)] transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Ver casas
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
            <Link
              href="#consultar"
              className="inline-flex min-h-11 items-center justify-center border border-white/50 bg-white/10 px-4 text-sm font-semibold text-white backdrop-blur transition hover:bg-white hover:text-[var(--color-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Consultar datas
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
