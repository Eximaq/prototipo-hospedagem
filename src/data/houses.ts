import { getExternalCalendarsForHouse } from "@/data/external-calendars";
import type { Experience, House, Testimonial } from "@/types/house";

export const houses: House[] = [
  {
    id: "casa-01",
    slug: "casa-turquesa-05",
    label: "Casa 01",
    name: "Casa Turquesa",
    shortDescription:
      "Uma casa de temporada com atmosfera clara, piscina e clima de descanso perto do mar.",
    fullDescription:
      "A Casa Turquesa foi pensada para famílias e grupos que querem planejar dias tranquilos em São Miguel dos Milagres. A casa combina áreas de convivência, piscina e ambientes claros para uma estadia confortável perto do mar.",
    location: {
      label: "São Miguel dos Milagres, AL",
      mapQuery: "São Miguel dos Milagres Alagoas Brasil",
      address: "Endereço exato informado no atendimento",
    },
    hero: {
      type: "image",
      image: "/images/casa-01/fachada.jpg",
    },
    guests: 8,
    bedrooms: 4,
    beds: 5,
    bathrooms: 4,
    pool: true,
    amenities: [
      "Wi-Fi",
      "Ar-condicionado",
      "Cozinha equipada",
      "Piscina",
      "Estacionamento",
      "Área externa",
      "Roupa de cama",
      "Perto do mar",
    ],
    highlights: [
      "Piscina privativa",
      "Ambientes claros e ventilados",
      "Boa opção para famílias",
    ],
    rules: [
      "Valores sob consulta",
      "Capacidade de até 8 hóspedes",
      "Regras completas enviadas no atendimento",
    ],
    usefulInfo: [
      "Endereço exato informado no atendimento",
      "Check-in e check-out a combinar",
      "Condições comerciais enviadas pelo WhatsApp",
    ],
    images: [
      {
        src: "/images/casa-01/fachada.jpg",
        alt: "Área externa da Casa Turquesa",
        width: 1400,
        height: 1000,
      },
      {
        src: "/images/casa-01/piscina.jpg",
        alt: "Piscina da Casa Turquesa",
        width: 1400,
        height: 1000,
      },
      {
        src: "/images/casa-01/varanda.jpg",
        alt: "Varanda da Casa Turquesa com clima de praia",
        width: 1400,
        height: 1000,
      },
      {
        src: "/images/casa-01/suite.jpg",
        alt: "Ambiente interno da Casa Turquesa",
        width: 1400,
        height: 1000,
      },
    ],
    featured: true,
    instagram: "https://www.instagram.com/casa_turquesa05",
    externalCalendars: getExternalCalendarsForHouse("casa-01"),
  },
  {
    id: "casa-02",
    slug: "casa-corais-milagres",
    label: "Casa 02",
    name: "Casa Corais Milagres",
    shortDescription:
      "Casa para temporada com presença de natureza, áreas de convivência e uma rotina leve em Milagres.",
    fullDescription:
      "A Casa Corais Milagres é uma opção para quem busca natureza, privacidade e espaço para reunir família ou amigos. O visitante pode comparar os principais dados, navegar pelas fotos e enviar uma consulta para confirmar disponibilidade, valores e condições.",
    location: {
      label: "São Miguel dos Milagres, AL",
      mapQuery: "São Miguel dos Milagres Alagoas Brasil",
      address: "Endereço exato informado no atendimento",
    },
    hero: {
      type: "image",
      image: "/images/casa-02/fachada.jpg",
    },
    guests: 10,
    bedrooms: 4,
    beds: 6,
    bathrooms: 5,
    pool: true,
    amenities: [
      "Wi-Fi",
      "Ar-condicionado",
      "Cozinha equipada",
      "Piscina",
      "Estacionamento",
      "Smart TV",
      "Área externa",
      "Espaço para famílias",
    ],
    highlights: [
      "Área externa generosa",
      "Convivência para grupos",
      "Atendimento direto pelo WhatsApp",
    ],
    rules: [
      "Valores sob consulta",
      "Capacidade de até 10 hóspedes",
      "Regras completas enviadas no atendimento",
    ],
    usefulInfo: [
      "Localização aproximada: Milagres, AL",
      "Condições comerciais enviadas no WhatsApp",
      "Substitua os textos por informações oficiais da operação",
    ],
    images: [
      {
        src: "/images/casa-02/fachada.jpg",
        alt: "Área externa da Casa Corais Milagres",
        width: 1400,
        height: 1000,
      },
      {
        src: "/images/casa-02/jardim.jpg",
        alt: "Jardim da Casa Corais Milagres",
        width: 1400,
        height: 1000,
      },
      {
        src: "/images/casa-02/familia.jpg",
        alt: "Ambiente familiar da Casa Corais Milagres",
        width: 1400,
        height: 1000,
      },
      {
        src: "/images/casa-02/piscina.jpg",
        alt: "Piscina da Casa Corais Milagres",
        width: 1400,
        height: 1000,
      },
    ],
    featured: true,
    instagram: "https://www.instagram.com/casacorais.milagres",
    externalCalendars: getExternalCalendarsForHouse("casa-02"),
  },
];

export const experiences: Experience[] = [
  {
    title: "Praia e natureza",
    description:
      "Uma base visual para comunicar proximidade com mar, paisagens naturais e dias de pausa.",
  },
  {
    title: "Piscina e descanso",
    description:
      "Áreas de lazer para desacelerar, aproveitar o sol e viver dias de pausa.",
  },
  {
    title: "Momentos em família",
    description:
      "Conteúdo editável para valorizar convivência, conforto e privacidade.",
  },
  {
    title: "Gastronomia e passeios",
    description:
      "Uma base confortável para explorar praias, restaurantes e passeios da região.",
  },
];

export const testimonials: Testimonial[] = [
  {
    name: "Família em viagem",
    context: "Estadia em temporada",
    quote:
      "A casa reuniu conforto, privacidade e uma localização excelente para aproveitar Milagres com tranquilidade.",
  },
  {
    name: "Grupo de amigos",
    context: "Fim de semana em Milagres",
    quote:
      "O atendimento foi direto e a experiência teve tudo que procurávamos para descansar perto do mar.",
  },
  {
    name: "Casal com filhos",
    context: "Férias em família",
    quote:
      "As áreas de convivência fizeram diferença para aproveitar os dias com conforto e segurança.",
  },
];
