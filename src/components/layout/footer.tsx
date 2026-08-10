import Link from "next/link";
import { AtSign, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { navItems, siteConfig } from "@/data/site-config";

export function Footer() {
  return (
    <footer className="bg-[var(--color-ink)] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:grid-cols-[1.4fr_0.8fr_1fr] md:px-8">
        <div>
          <Logo variant="light" showSignature size="md" />
          <p className="mt-5 max-w-md text-sm leading-7 text-white/68">
            Casas para temporada em São Miguel dos Milagres, com piscina, suítes,
            privacidade e atendimento direto para consultar disponibilidade.
          </p>
        </div>
        <nav aria-label="Rodapé" className="flex flex-col gap-3">
          {navItems.map((item) => (
            <Link
              className="text-sm text-white/72 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <address className="not-italic">
          <ul className="space-y-4 text-sm text-white/72">
            <li className="flex gap-3">
              <MapPin aria-hidden="true" size={18} />
              <span>{siteConfig.address}</span>
            </li>
            <li className="flex gap-3">
              <Phone aria-hidden="true" size={18} />
              <span>{siteConfig.phone}</span>
            </li>
            <li className="flex gap-3">
              <MessageCircle aria-hidden="true" size={18} />
              <Link
                href="/#consultar"
                className="hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                Consultar disponibilidade
              </Link>
            </li>
            <li className="flex gap-3">
              <Mail aria-hidden="true" size={18} />
              <span>{siteConfig.email}</span>
            </li>
            <li className="flex gap-3">
              <AtSign aria-hidden="true" size={18} />
              <a
                href={siteConfig.instagram}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                Instagram
              </a>
            </li>
          </ul>
        </address>
      </div>
      <div className="mx-auto flex max-w-7xl flex-col gap-3 border-t border-white/10 px-5 py-5 text-xs text-white/50 md:flex-row md:items-center md:justify-between md:px-8">
        <div className="flex flex-wrap gap-4">
          <Link href="/contato/" className="hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
            Termos
          </Link>
          <Link href="/contato/" className="hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
            Política de privacidade
          </Link>
        </div>
        <span>São Miguel dos Milagres, AL</span>
      </div>
      <div className="border-t border-white/10 px-5 py-5 text-center text-xs text-white/52">
        © 2026 {siteConfig.name}. Hospedagem de temporada em São Miguel dos Milagres.
      </div>
    </footer>
  );
}
