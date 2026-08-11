import { getExternalCalendarsForHouse } from "@/data/external-calendars";
import type { Experience, House, Testimonial } from "@/types/house";

export const houses: House[] = [
  {
    id: "casa-01",
    slug: "casa-turquesa-05",
    label: "Casa 01",
    name: "Casa Turquesa",
    shortDescription:
      "Casa beira-mar para até 14 pessoas, com 7 suítes, piscina privativa, churrasqueira e apoio de duas funcionárias.",
    fullDescription:
      "A Casa Turquesa recebe até 14 pessoas em uma experiência beira-mar em São Miguel dos Milagres. A casa combina 7 suítes, piscina privativa, churrasqueira, cozinha equipada, cafeteira, redes para relaxar e apoio de duas funcionárias para preparar café da manhã e almoço.",
    idealFor:
      "Famílias e grupos de até 14 pessoas que querem uma casa beira-mar com suítes independentes e apoio na rotina.",
    capacityNote: "Capacidade para até 14 pessoas",
    location: {
      label: "São Miguel dos Milagres, AL",
      mapQuery: "São Miguel dos Milagres Alagoas Brasil",
      address: "Endereço exato informado no atendimento",
      distances: [
        { label: "Praia", value: "Beira-mar" },
        { label: "Vilinha Marceneiro / restaurantes", value: "1 km da casa" },
        { label: "Supermercado Amigão", value: "1,5 km da casa" },
        {
          label: "Aeroporto Internacional de Maceió",
          value: "1h30 a 2h de carro em condições normais de trânsito",
        },
      ],
    },
    hero: {
      type: "image",
      image: "/images/casa-01/fachada.png",
    },
    guests: 14,
    minNights: 3,
    maxNights: 4,
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
      "Cafeteira",
      "Piscina privativa",
      "Quadra de esportes de praia",
      "Redes no quintal",
      "Redes aquáticas em estacas",
      "Condomínio com segurança 24h",
      "Duas funcionárias para café da manhã e almoço",
      "Beira-mar",
    ],
    highlights: [
      "Beira-mar",
      "Até 14 pessoas",
      "7 suítes",
      "Piscina privativa",
      "Duas funcionárias para café da manhã e almoço",
    ],
    rules: [
      "Valores informados no atendimento",
      "Capacidade para até 14 pessoas",
      "Check-in a partir das 15h",
      "Check-out até 11h",
      "Não aceita pets",
      "Mínimo de 3 noites",
      "Até 4 noites por consulta online",
      "Regras completas enviadas no atendimento",
    ],
    usefulInfo: [
      "Endereço exato informado no atendimento",
      "Casa beira-mar",
      "Capacidade para até 14 pessoas",
      "7 suítes",
      "Wi-Fi, piscina privativa e churrasqueira disponíveis",
      "Duas funcionárias podem preparar café da manhã e almoço",
      "Condições comerciais enviadas pelo WhatsApp",
    ],
    policies: [
      { label: "Check-in", value: "A partir das 15h" },
      { label: "Check-out", value: "Até 11h" },
      { label: "Pets", value: "Não aceita pets" },
      { label: "Eventos", value: "Analisados caso a caso, geralmente com taxa adicional" },
      { label: "Noites mínimas", value: "Mínimo de 3 noites" },
      { label: "Noites máximas", value: "Até 4 noites por consulta online" },
      { label: "Cancelamento", value: "Condições informadas antes da confirmação" },
    ],
    faqs: [
      {
        question: "Qual a capacidade da Casa Turquesa?",
        answer: "A Casa Turquesa recebe até 14 pessoas e possui 7 suítes.",
      },
      {
        question: "A Casa Turquesa tem piscina e churrasqueira?",
        answer:
          "Sim. A casa conta com piscina privativa, churrasqueira, Wi-Fi, cozinha equipada e cafeteira.",
      },
      {
        question: "A Casa Turquesa fica perto da praia?",
        answer: "Sim. A Casa Turquesa é beira-mar.",
      },
      {
        question: "Há apoio para café da manhã e almoço?",
        answer:
          "Sim. A casa conta com duas funcionárias que podem ajudar preparando café da manhã e almoço.",
      },
      {
        question: "A Casa Turquesa aceita pets?",
        answer: "Não. A Casa Turquesa não aceita pets.",
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
      "Casa para até 8 pessoas, com 3 suítes climatizadas, piscina privativa e acesso ao condomínio com lazer completo.",
    fullDescription:
      "A Casa Corais Milagres recebe até 8 pessoas em 3 suítes climatizadas. A casa conta com churrasqueira, cozinha equipada, cafeteira e piscina privativa, além da estrutura do condomínio com piscina grande, academia, segurança 24h, beach tennis, vôlei, empório na entrada e acesso à praia.",
    idealFor:
      "Famílias e grupos de até 8 pessoas que querem privacidade na casa e estrutura de lazer no condomínio.",
    capacityNote: "Capacidade para até 8 pessoas",
    location: {
      label: "São Miguel dos Milagres, AL",
      mapQuery: "São Miguel dos Milagres Alagoas Brasil",
      address: "Endereço exato informado no atendimento",
      distances: [
        { label: "Praia", value: "Acesso pelo condomínio, 200 m da casa" },
        { label: "Vilinha Marceneiro / restaurantes", value: "500 m da casa" },
        {
          label: "Conveniência / mercadinho",
          value: "Empório na entrada do condomínio, 140 m da casa",
        },
        { label: "Supermercado Amigão", value: "250 m da casa" },
        {
          label: "Aeroporto Internacional de Maceió",
          value: "1h30 a 2h de carro em condições normais de trânsito",
        },
      ],
    },
    hero: {
      type: "image",
      image: "/images/casa-02/piscina.jpg",
    },
    guests: 8,
    minNights: 2,
    maxNights: 4,
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
      "3 suítes climatizadas",
      "Cozinha equipada",
      "Cafeteira",
      "Piscina privativa",
      "Piscina grande do condomínio",
      "Academia no condomínio",
      "Condomínio com segurança 24h",
      "Quadra de beach tennis",
      "Quadra de vôlei",
      "Empório na entrada do condomínio",
      "Funcionária para café da manhã e almoço",
      "Smart TV",
      "Área externa",
      "Espaço para famílias",
    ],
    highlights: [
      "3 suítes climatizadas",
      "Capacidade para até 8 pessoas",
      "Piscina privativa e piscina do condomínio",
      "Beach tennis, vôlei e academia",
      "Funcionária para café da manhã e almoço",
    ],
    rules: [
      "Valores informados no atendimento",
      "Capacidade para até 8 pessoas",
      "Check-in a partir das 15h",
      "Check-out até 11h",
      "Não aceita pets",
      "Mínimo de 2 noites",
      "Até 4 noites por consulta online",
      "Regras completas enviadas no atendimento",
    ],
    usefulInfo: [
      "Localização aproximada: Milagres, AL",
      "Capacidade para até 8 pessoas",
      "3 suítes climatizadas",
      "Wi-Fi, piscina privativa e churrasqueira disponíveis",
      "Condomínio com piscina grande, academia, segurança 24h, beach tennis e vôlei",
      "Funcionária pode preparar café da manhã e almoço",
      "Condições comerciais enviadas no WhatsApp",
    ],
    policies: [
      { label: "Check-in", value: "A partir das 15h" },
      { label: "Check-out", value: "Até 11h" },
      { label: "Pets", value: "Não aceita pets" },
      { label: "Eventos", value: "Analisados caso a caso, geralmente com taxa adicional" },
      { label: "Noites mínimas", value: "Mínimo de 2 noites" },
      { label: "Noites máximas", value: "Até 4 noites por consulta online" },
      { label: "Cancelamento", value: "Condições informadas antes da confirmação" },
    ],
    faqs: [
      {
        question: "Qual a capacidade da Casa Corais Milagres?",
        answer:
          "A Casa Corais Milagres recebe até 8 pessoas e possui 3 suítes climatizadas.",
      },
      {
        question: "A Casa Corais tem piscina e churrasqueira?",
        answer:
          "Sim. A casa conta com piscina privativa, churrasqueira, Wi-Fi, cozinha equipada e cafeteira. O condomínio também possui piscina grande.",
      },
      {
        question: "O condomínio oferece estrutura de lazer?",
        answer:
          "Sim. O condomínio conta com piscina grande, academia, segurança 24h, quadra de beach tennis, quadra de vôlei e empório na entrada.",
      },
      {
        question: "A Casa Corais fica perto da praia?",
        answer:
          "Sim. O condomínio tem acesso à praia, a aproximadamente 200 metros da casa.",
      },
      {
        question: "Há apoio para café da manhã e almoço?",
        answer:
          "Sim. Há uma funcionária que pode ajudar preparando café da manhã e almoço.",
      },
      {
        question: "A Casa Corais aceita pets?",
        answer: "Não. A Casa Corais Milagres não aceita pets.",
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
    description: "Áreas de lazer para desacelerar, aproveitar o sol e viver dias de pausa.",
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
