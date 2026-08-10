import { getExternalCalendarsForHouse } from "@/data/external-calendars";
import type { Experience, House, Testimonial } from "@/types/house";

export const houses: House[] = [
  {
    id: "casa-01",
    slug: "casa-turquesa-05",
    label: "Casa 01",
    name: "Casa Turquesa",
    shortDescription:
      "Casa de temporada com 7 suítes, piscina, Wi-Fi e churrasqueira para dias de descanso em Milagres.",
    fullDescription:
      "A Casa Turquesa combina 7 suítes, áreas de convivência, piscina, Wi-Fi e churrasqueira para famílias e grupos que querem dias tranquilos em São Miguel dos Milagres.",
    idealFor: "Famílias e grupos maiores que precisam de suítes independentes e áreas de convivência.",
    capacityNote: "Capacidade final confirmada no atendimento",
    location: {
      label: "São Miguel dos Milagres, AL",
      mapQuery: "São Miguel dos Milagres Alagoas Brasil",
      address: "Endereço exato informado no atendimento",
    },
    hero: {
      type: "image",
      image: "/images/casa-01/fachada.png",
    },
    guests: null,
    suites: 7,
    bedrooms: 7,
    beds: 7,
    bathrooms: 7,
    pool: true,
    barbecue: true,
    amenities: [
      "Wi-Fi",
      "Piscina",
      "Churrasqueira",
      "Ar-condicionado",
      "Cozinha equipada",
      "Estacionamento",
      "Área externa",
      "Roupa de cama",
      "Perto do mar",
    ],
    highlights: [
      "Piscina privativa",
      "7 suítes para receber grupos",
      "Churrasqueira e área externa",
    ],
    rules: [
      "Valores informados no atendimento",
      "Capacidade confirmada no atendimento",
      "Regras completas enviadas no atendimento",
    ],
    usefulInfo: [
      "Endereço exato informado no atendimento",
      "Check-in e check-out a combinar",
      "Wi-Fi, piscina e churrasqueira disponíveis",
      "Condições comerciais enviadas pelo WhatsApp",
    ],
    policies: [
      { label: "Check-in", value: "Horário confirmado durante o atendimento" },
      { label: "Check-out", value: "Horário confirmado durante o atendimento" },
      { label: "Pets", value: "Política confirmada antes da pré-reserva" },
      { label: "Eventos", value: "Regras e limites enviados pelo atendimento" },
      { label: "Noites mínimas", value: "Definidas conforme período solicitado" },
      { label: "Cancelamento", value: "Condições informadas antes da confirmação" },
    ],
    faqs: [
      {
        question: "Qual a capacidade da Casa Turquesa?",
        answer:
          "A casa possui 7 suítes. A capacidade máxima oficial é confirmada pelo atendimento antes da pré-reserva.",
      },
      {
        question: "A Casa Turquesa tem piscina e churrasqueira?",
        answer: "Sim. A casa conta com piscina, churrasqueira, Wi-Fi e área externa.",
      },
      {
        question: "A casa possui estacionamento?",
        answer: "O estacionamento está listado entre as comodidades da Casa Turquesa.",
      },
      {
        question: "Como consultar disponibilidade?",
        answer:
          "Escolha a casa, selecione entrada e saída no calendário e envie a solicitação pelo WhatsApp.",
      },
    ],
    images: [
      {
        src: "/images/casa-01/fachada.png",
        alt: "Fachada e piscina iluminada da Casa Turquesa",
        width: 1448,
        height: 1086,
      },
      {
        src: "/images/casa-01/piscina.png",
        alt: "Piscina da Casa Turquesa com vista para coqueiros",
        width: 1448,
        height: 1086,
      },
      {
        src: "/images/casa-01/deck-piscina.png",
        alt: "Deck da piscina da Casa Turquesa com vista para o mar",
        width: 1448,
        height: 1086,
      },
      {
        src: "/images/casa-01/vista-piscina.png",
        alt: "Vista superior da piscina da Casa Turquesa",
        width: 1448,
        height: 1086,
      },
      {
        src: "/images/casa-01/jardim-noite.png",
        alt: "Área externa noturna da Casa Turquesa",
        width: 1448,
        height: 1086,
      },
      {
        src: "/images/casa-01/suite-01.png",
        alt: "Suíte da Casa Turquesa com cama e enxoval claro",
        width: 1448,
        height: 1086,
      },
      {
        src: "/images/casa-01/suite-varanda.png",
        alt: "Suíte da Casa Turquesa integrada à varanda",
        width: 1448,
        height: 1086,
      },
      {
        src: "/images/casa-01/suite-02.png",
        alt: "Suíte da Casa Turquesa com painel de madeira",
        width: 1448,
        height: 1086,
      },
      {
        src: "/images/casa-01/suite-vista.png",
        alt: "Suíte da Casa Turquesa com iluminação aconchegante",
        width: 1448,
        height: 1086,
      },
      {
        src: "/images/casa-01/suite-03.png",
        alt: "Suíte da Casa Turquesa com cortina e acabamento em madeira",
        width: 1448,
        height: 1086,
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
      "Casa para temporada com 3 suítes, piscina, Wi-Fi e churrasqueira em São Miguel dos Milagres.",
    fullDescription:
      "A Casa Corais Milagres é uma opção para quem busca natureza, privacidade e espaço para reunir família ou amigos. A casa conta com 3 suítes, piscina, Wi-Fi e churrasqueira; o visitante pode navegar pelas fotos e enviar uma consulta para confirmar disponibilidade, valores e condições.",
    idealFor: "Grupos menores que procuram privacidade, piscina e uma casa prática para dias em Milagres.",
    capacityNote: "Capacidade final confirmada no atendimento",
    location: {
      label: "São Miguel dos Milagres, AL",
      mapQuery: "São Miguel dos Milagres Alagoas Brasil",
      address: "Endereço exato informado no atendimento",
    },
    hero: {
      type: "image",
      image: "/images/casa-02/piscina.jpg",
    },
    guests: null,
    suites: 3,
    bedrooms: 3,
    beds: 3,
    bathrooms: 3,
    pool: true,
    barbecue: true,
    amenities: [
      "Wi-Fi",
      "Piscina",
      "Churrasqueira",
      "Ar-condicionado",
      "Cozinha equipada",
      "Estacionamento",
      "Smart TV",
      "Área externa",
      "Espaço para famílias",
    ],
    highlights: [
      "3 suítes bem distribuídas",
      "Piscina e área gourmet",
      "Próxima ao clima de praia de Milagres",
    ],
    rules: [
      "Valores informados no atendimento",
      "Capacidade confirmada no atendimento",
      "Regras completas enviadas no atendimento",
    ],
    usefulInfo: [
      "Localização aproximada: Milagres, AL",
      "Wi-Fi, piscina e churrasqueira disponíveis",
      "Condições comerciais enviadas no WhatsApp",
    ],
    policies: [
      { label: "Check-in", value: "Horário confirmado durante o atendimento" },
      { label: "Check-out", value: "Horário confirmado durante o atendimento" },
      { label: "Pets", value: "Política confirmada antes da pré-reserva" },
      { label: "Eventos", value: "Regras e limites enviados pelo atendimento" },
      { label: "Noites mínimas", value: "Definidas conforme período solicitado" },
      { label: "Cancelamento", value: "Condições informadas antes da confirmação" },
    ],
    faqs: [
      {
        question: "Qual a capacidade da Casa Corais Milagres?",
        answer:
          "A casa possui 3 suítes. A capacidade máxima oficial é confirmada pelo atendimento antes da pré-reserva.",
      },
      {
        question: "A Casa Corais tem piscina e churrasqueira?",
        answer: "Sim. A casa conta com piscina, churrasqueira, Wi-Fi e área externa.",
      },
      {
        question: "A casa possui estacionamento?",
        answer: "O estacionamento está listado entre as comodidades da Casa Corais Milagres.",
      },
      {
        question: "Como consultar disponibilidade?",
        answer:
          "Escolha a casa, selecione entrada e saída no calendário e envie a solicitação pelo WhatsApp.",
      },
    ],
    images: [
      {
        src: "/images/casa-02/piscina.jpg",
        alt: "Piscina da Casa Corais Milagres",
        width: 3840,
        height: 2558,
      },
      {
        src: "/images/casa-02/fachada.jpg",
        alt: "Fachada da Casa Corais Milagres",
        width: 2510,
        height: 3840,
      },
      {
        src: "/images/casa-02/area-externa.jpg",
        alt: "Varanda e área externa da Casa Corais Milagres",
        width: 3840,
        height: 2510,
      },
      {
        src: "/images/casa-02/sala-jantar.jpg",
        alt: "Sala de jantar da Casa Corais Milagres",
        width: 2477,
        height: 3840,
      },
      {
        src: "/images/casa-02/sala.jpg",
        alt: "Sala de estar da Casa Corais Milagres",
        width: 2880,
        height: 3840,
      },
      {
        src: "/images/casa-02/cozinha.jpg",
        alt: "Apoio de cozinha da Casa Corais Milagres",
        width: 2602,
        height: 3840,
      },
      {
        src: "/images/casa-02/suite-01.jpg",
        alt: "Suíte da Casa Corais Milagres com cama e painel de madeira",
        width: 2750,
        height: 3840,
      },
      {
        src: "/images/casa-02/suite-02.jpg",
        alt: "Suíte da Casa Corais Milagres com enxoval listrado",
        width: 2558,
        height: 3840,
      },
      {
        src: "/images/casa-02/vista-aerea.jpg",
        alt: "Vista aérea da região da Casa Corais Milagres",
        width: 2160,
        height: 3840,
      },
      {
        src: "/images/casa-02/praia.jpg",
        alt: "Praia próxima à Casa Corais Milagres",
        width: 3840,
        height: 2160,
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
      "São Miguel dos Milagres reúne mar claro, coqueiros e uma rotina tranquila para dias de pausa.",
    image: "/images/casa-02/praia.jpg",
  },
  {
    title: "Piscina e descanso",
    description:
      "Áreas de lazer para desacelerar, aproveitar o sol e viver dias de pausa.",
    image: "/images/casa-01/piscina.png",
  },
  {
    title: "Momentos em família",
    description:
      "Casas com suítes, áreas de convivência, piscina e churrasqueira para reunir família e amigos.",
    image: "/images/casa-02/familia.jpg",
  },
  {
    title: "Gastronomia e passeios",
    description:
      "Uma base confortável para explorar praias, restaurantes e passeios da região.",
    image: "/images/casa-01/deck-piscina.png",
  },
];

export const testimonials: Testimonial[] = [
  {
    name: "Mariana Albuquerque",
    context: "Viagem em família",
    stay: "Casa Turquesa",
    placeholder: true,
    quote:
      "Escolhemos a Casa Turquesa por causa das 7 suítes e foi a decisão certa. Todo mundo ficou confortável, a piscina foi usada todos os dias e a área da churrasqueira funcionou muito bem para reunir a família.",
  },
  {
    name: "Rafael Menezes",
    context: "Fim de semana com amigos",
    stay: "Casa Corais Milagres",
    placeholder: true,
    quote:
      "A Casa Corais atendeu muito bem nosso grupo. As 3 suítes deram privacidade, o Wi-Fi funcionou bem e a área externa com piscina deixou o fim de semana bem mais tranquilo.",
  },
  {
    name: "Camila e Bruno",
    context: "Férias com crianças",
    stay: "Casa Turquesa",
    placeholder: true,
    quote:
      "A Casa Turquesa tem espaço de sobra para uma viagem com crianças. As suítes ajudam na organização da família e a piscina virou o lugar preferido depois dos passeios em Milagres.",
  },
  {
    name: "Família Carvalho",
    context: "Temporada em Milagres",
    stay: "Casa Corais Milagres",
    placeholder: true,
    quote:
      "Ficamos na Casa Corais para aproveitar São Miguel dos Milagres com mais privacidade. A casa é prática, tem piscina, churrasqueira e uma área de convivência boa para descansar no fim do dia.",
  },
];
