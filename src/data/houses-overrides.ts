import { houses as baseHouses } from "./houses";

export * from "./houses";

export const houses = baseHouses.map((house) => {
  if (house.id === "casa-01") {
    return {
      ...house,
      minNights: 4,
      maxNights: null,
      shortDescription:
        "Casa beira-mar para até 14 pessoas, com 7 suítes, piscina privativa, churrasqueira e apoio de duas funcionárias das 8h às 15h.",
      fullDescription:
        "A Casa Turquesa recebe até 14 pessoas em uma experiência beira-mar em São Miguel dos Milagres. A casa combina 7 suítes, piscina privativa, churrasqueira, cozinha equipada, cafeteira, redes para relaxar e apoio de duas funcionárias, das 8h às 15h, para preparar café da manhã e almoço.",
      amenities: house.amenities.map((item) =>
        item === "Duas funcionárias para café da manhã e almoço"
          ? "Duas funcionárias para café da manhã e almoço, das 8h às 15h"
          : item,
      ),
      highlights: house.highlights.map((item) =>
        item === "Duas funcionárias para café da manhã e almoço"
          ? "Duas funcionárias para café da manhã e almoço, das 8h às 15h"
          : item,
      ),
      rules: house.rules
        .filter((item) => item !== "Mínimo de 3 noites" && item !== "Até 4 noites por consulta online")
        .flatMap((item) =>
          item === "Não aceita pets"
            ? [item, "Mínimo de 4 noites", "Sem limite máximo de noites"]
            : [item],
        ),
      usefulInfo: house.usefulInfo.map((item) =>
        item === "Duas funcionárias podem preparar café da manhã e almoço"
          ? "Duas funcionárias disponíveis das 8h às 15h para preparar café da manhã e almoço"
          : item,
      ),
      policies: house.policies.map((policy) => {
        if (policy.label === "Noites mínimas") {
          return { ...policy, value: "Mínimo de 4 noites" };
        }
        if (policy.label === "Noites máximas") {
          return { ...policy, value: "Sem limite máximo de noites" };
        }
        return policy;
      }),
      faqs: house.faqs.map((faq) =>
        faq.question === "Há apoio para café da manhã e almoço?"
          ? {
              ...faq,
              answer:
                "Sim. A Casa Turquesa conta com duas funcionárias, disponíveis das 8h às 15h, para preparar café da manhã e almoço.",
            }
          : faq,
      ),
    };
  }

  if (house.id === "casa-02") {
    return {
      ...house,
      minNights: 2,
      maxNights: null,
      fullDescription:
        "A Casa Corais Milagres recebe até 8 pessoas em 3 suítes climatizadas. A casa conta com churrasqueira, cozinha equipada, cafeteira e piscina privativa, além da estrutura do condomínio com piscina grande, academia, segurança 24h, beach tennis, vôlei, empório na entrada e acesso à praia. Durante a estadia, há uma funcionária disponível das 8h às 15h para preparar café da manhã e almoço.",
      amenities: house.amenities.map((item) =>
        item === "Funcionária para café da manhã e almoço"
          ? "Uma funcionária para café da manhã e almoço, das 8h às 15h"
          : item,
      ),
      highlights: house.highlights.map((item) =>
        item === "Funcionária para café da manhã e almoço"
          ? "Uma funcionária para café da manhã e almoço, das 8h às 15h"
          : item,
      ),
      rules: house.rules
        .filter((item) => item !== "Até 4 noites por consulta online")
        .flatMap((item) =>
          item === "Mínimo de 2 noites" ? [item, "Sem limite máximo de noites"] : [item],
        ),
      usefulInfo: house.usefulInfo.map((item) =>
        item === "Funcionária pode preparar café da manhã e almoço"
          ? "Uma funcionária disponível das 8h às 15h para preparar café da manhã e almoço"
          : item,
      ),
      policies: house.policies.map((policy) =>
        policy.label === "Noites máximas"
          ? { ...policy, value: "Sem limite máximo de noites" }
          : policy,
      ),
      faqs: house.faqs.map((faq) =>
        faq.question === "Há apoio para café da manhã e almoço?"
          ? {
              ...faq,
              answer:
                "Sim. A Casa Corais Milagres conta com uma funcionária, disponível das 8h às 15h, para preparar café da manhã e almoço.",
            }
          : faq,
      ),
    };
  }

  return house;
});
