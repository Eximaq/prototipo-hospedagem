import { describe, expect, it } from "vitest";
import { buildWhatsAppMessage, buildWhatsAppUrl } from "@/lib/whatsapp";

describe("WhatsApp inquiry", () => {
  it("builds a professional message with reservation and responsible guest data", () => {
    const message = buildWhatsAppMessage({
      property: "Casa Turquesa",
      checkIn: "2026-09-20",
      checkOut: "2026-09-24",
      adults: 4,
      children: 2,
      responsibleName: "João da Silva",
      cpf: "52998224725",
      birthDate: "1990-05-15",
      notes: "Gostaria de consultar valores.",
    });

    expect(message).toContain("🏡 Casa: Casa Turquesa");
    expect(message).toContain("📅 Entrada: 20/09/2026");
    expect(message).toContain("📅 Saída: 24/09/2026");
    expect(message).toContain("🌙 Estadia: 4 noites");
    expect(message).toContain("👥 Adultos: 4");
    expect(message).toContain("👶 Crianças: 2");
    expect(message).toContain("RESPONSÁVEL");
    expect(message).toContain("CPF: 529.982.247-25");
    expect(message).toContain(
      "Gostaria de confirmar disponibilidade e receber informações sobre valores.",
    );
  });

  it("omits empty optional fields", () => {
    const message = buildWhatsAppMessage({
      property: "Casa Corais Milagres",
      checkIn: "2026-10-20",
      checkOut: "2026-10-24",
      adults: 2,
    });

    expect(message).toContain("🌙 Estadia: 4 noites");
    expect(message).not.toContain("CPF:");
    expect(message).not.toContain("Nascimento:");
    expect(message).not.toContain("Não informado");
  });

  it("encodes the message in the WhatsApp URL", () => {
    const url = buildWhatsAppUrl({
      property: "Casa Corais Milagres",
      checkIn: "2026-10-20",
      checkOut: "2026-10-24",
      responsibleName: "Maria Silva",
      cpf: "52998224725",
      birthDate: "1992-01-01",
    });

    expect(url).toMatch(/^https:\/\/wa\.me\/5582993563898\?text=/);
    expect(decodeURIComponent(url)).toContain("🏡 Casa: Casa Corais Milagres");
  });
});
