const configuredPublicUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") || "";

export const siteConfig = {
  name: "CASAS MILAGRES",
  shortName: "Casas Milagres",
  url: configuredPublicUrl,
  description:
    "Casas para temporada em São Miguel dos Milagres, com piscina, suítes, privacidade e consulta de disponibilidade pelo WhatsApp.",
  whatsappNumber: "5582993563898",
  phone: "+55 (82) 99356-3898",
  email: "reservas@casasmilagres.com.br",
  instagram: "https://www.instagram.com/casa_turquesa05",
  address: "São Miguel dos Milagres, AL",
  city: "São Miguel dos Milagres, AL",
  mapQuery: "São Miguel dos Milagres, Alagoas, Brasil",
  serviceHours: "Atendimento todos os dias pelo WhatsApp",
  ogImage: "/images/og-image.jpg",
};

export const navItems = [
  { label: "Início", href: "/#inicio", id: "inicio" },
  { label: "Casas", href: "/#casas", id: "casas" },
  { label: "Experiência", href: "/#experiencia", id: "experiencia" },
  { label: "Localização", href: "/#localizacao", id: "localizacao" },
  { label: "FAQ", href: "/#faq", id: "faq" },
  { label: "Contato", href: "/contato/", id: "contato" },
];
