import type { House } from "@/types/house";

type SeoContent = {
  title: string;
  description: string;
};

export const pageSeo = {
  home: {
    title: "Hospedagem em São Miguel dos Milagres",
    description:
      "Conheça a Casa Turquesa e a Casa Corais Milagres, duas opções de hospedagem com piscina para grupos e famílias no litoral de Alagoas.",
  },
  houses: {
    title: "Casas para temporada em São Miguel dos Milagres",
    description:
      "Compare a Casa Turquesa beira-mar e a Casa Corais Milagres, com fotos, suítes, piscinas, estrutura e consulta direta de disponibilidade.",
  },
  contact: {
    title: "Contato e disponibilidade",
    description:
      "Consulte datas da Casa Turquesa e da Casa Corais Milagres e envie sua solicitação de hospedagem em São Miguel dos Milagres pelo WhatsApp.",
  },
} satisfies Record<string, SeoContent>;

const houseSeo: Record<string, SeoContent> = {
  "casa-turquesa-05": {
    title: "Casa Turquesa: casa de temporada beira-mar",
    description:
      "Casa de temporada beira-mar em São Miguel dos Milagres para até 14 hóspedes, com 7 suítes, piscina privativa, churrasqueira e apoio na rotina.",
  },
  "casa-corais-milagres": {
    title: "Casa Corais Milagres: casa com piscina",
    description:
      "Casa de temporada em São Miguel dos Milagres para até 8 hóspedes, com 3 suítes climatizadas, piscina privativa e acesso à praia pelo condomínio.",
  },
};

export function getHouseSeo(house: House): SeoContent {
  return (
    houseSeo[house.slug] || {
      title: `${house.name} em São Miguel dos Milagres`,
      description: house.shortDescription,
    }
  );
}
