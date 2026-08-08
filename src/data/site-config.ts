const configuredPublicUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") || "";

export const siteConfig = {
  name: "CASAS MILAGRES",
  shortName: "Casas Milagres",
  url: configuredPublicUrl,
  description:
    "Duas casas para temporada em São Miguel dos Milagres, com conforto, privacidade e consulta rápida pelo WhatsApp.",
  whatsappNumber: "5582993563898",
  phone: "+55 (82) 99356-3898",
  email: "reservas@casasmilagres.com.br",
  instagram: "https://www.instagram.com/casa_turquesa05",
  address: "São Miguel dos Milagres, AL - endereço exato sob consulta",
  city: "São Miguel dos Milagres, AL",
  mapQuery: "São Miguel dos Milagres, Alagoas, Brasil",
  serviceHours: "Atendimento todos os dias pelo WhatsApp",
  ogImage: "/images/og-image.jpg",
};

export const navItems = [
  { label: "Início", href: "/#inicio", id: "inicio" },
  { label: "Experiência", href: "/#experiencia", id: "experiencia" },
  { label: "Localização", href: "/#localizacao", id: "localizacao" },
  { label: "Contato", href: "/contato/", id: "contato" },
];
