import type { House } from "@/types/house";
import {
  experiences,
  houses as baseHouses,
  testimonials,
} from "./houses-base";

export { experiences, testimonials };

function replaceText(items: string[], from: string, to: string) {
  return items.map((item) => (item === from ? to : item));
}

function applyTurquesaRules(house: House): House {
  return {
    ...house,
    minNights: 4,
    maxNights: null,
    shortDescription:
      "Casa beira-mar para até 14 pessoas, com 7 suítes, piscina privativa, churrasqueira e apoio de duas funcionárias das 8h às 15h.",
    fullDescription:
      "A Casa Turquesa recebe até 14 pessoas em uma experiência beira-mar em São Miguel dos Milagres. A casa combina 7 suítes, piscina privativa, churrasqueira, cozinha equipada, cafeteira, redes para relaxar e apoio de duas funcionárias, das 8h às 15h, para preparar café da manhã e almoço.",
    amenities: replaceText(
      house.amenities,
      "Duas funcionárias para café da manhã e almoço",
      "Duas funcionárias para café da manhã e almoço, das 8h às 15h",
    ),
    highlights: replaceText(
      house.highlights,
      "Duas funcionárias para café da manhã e almoço",
      "Duas funcionárias para café da manhã e almoço, das 8h às 15h",
    ),
    rules: house.rules.map((rule) => {
      if (rule === "Mínimo de 3 noites") return "Mínimo de 4 noites";
      if (rule === "Até 4 noites por consulta online") return "Sem limite máximo de noites";
      return rule;
    }),
    usefulInfo: replaceText(
      house.usefulInfo,
      "Duas funcionárias podem preparar café da manhã e almoço",
      "Duas funcionárias disponíveis das 8h às 15h para preparar café da manhã e almoço",
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

function applyCoraisRules(house: House): House {
  return {
    ...house,
    minNights: 2,
    maxNights: null,
    fullDescription:
      "A Casa Corais Milagres recebe até 8 pessoas em 3 suítes climatizadas. A casa conta com churrasqueira, cozinha equipada, cafeteira e piscina privativa, além da estrutura do condomínio com piscina grande, academia, segurança 24h, beach tennis, vôlei, empório na entrada e acesso à praia. Durante a estadia, há uma funcionária disponível das 8h às 15h para preparar café da manhã e almoço.",
    amenities: replaceText(
      house.amenities,
      "Funcionária para café da manhã e almoço",
      "Uma funcionária para café da manhã e almoço, das 8h às 15h",
    ),
    highlights: replaceText(
      house.highlights,
      "Funcionária para café da manhã e almoço",
      "Uma funcionária para café da manhã e almoço, das 8h às 15h",
    ),
    rules: house.rules.map((rule) =>
      rule === "Até 4 noites por consulta online"
        ? "Sem limite máximo de noites"
        : rule,
    ),
    usefulInfo: replaceText(
      house.usefulInfo,
      "Funcionária pode preparar café da manhã e almoço",
      "Uma funcionária disponível das 8h às 15h para preparar café da manhã e almoço",
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

export const houses: House[] = baseHouses.map((house) => {
  if (house.id === "casa-01") return applyTurquesaRules(house);
  if (house.id === "casa-02") return applyCoraisRules(house);
  return house;
});
