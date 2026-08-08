import { siteConfig } from "@/data/site-config";
import { formatDateForDisplay } from "@/lib/availability/date-utils";
import { formatCPF } from "@/lib/cpf";

export type WhatsAppInquiry = {
  property?: string;
  room?: string;
  checkIn?: string;
  checkOut?: string;
  adults?: number;
  children?: number;
  responsibleName?: string;
  cpf?: string;
  birthDate?: string;
  notes?: string;
};

export function buildWhatsAppMessage({
  property,
  room,
  checkIn,
  checkOut,
  adults,
  children,
  responsibleName,
  cpf,
  birthDate,
  notes,
}: WhatsAppInquiry) {
  const lines = [
    "Olá! Gostaria de consultar disponibilidade nas Casas Milagres.",
    "",
    "HOSPEDAGEM",
    "",
    `Casa: ${property || room || "Não informada"}`,
    `Entrada: ${formatDateForDisplay(checkIn)}`,
    `Saída: ${formatDateForDisplay(checkOut)}`,
    "",
    "HÓSPEDES",
    "",
    `Adultos: ${adults ?? "Não informado"}`,
    `Crianças: ${children ?? 0}`,
    "",
    "RESPONSÁVEL",
    "",
    `Nome: ${responsibleName?.trim() || "Não informado"}`,
    `CPF: ${cpf ? formatCPF(cpf) : "Não informado"}`,
    `Nascimento: ${formatDateForDisplay(birthDate)}`,
  ];

  if (notes?.trim()) {
    lines.push("", "OBSERVAÇÕES", "", notes.trim());
  }

  lines.push(
    "",
    "Gostaria de receber informações sobre disponibilidade, valores e condições.",
  );

  return lines.join("\n");
}

export function buildWhatsAppUrl(inquiry: WhatsAppInquiry) {
  const message = buildWhatsAppMessage(inquiry);
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
    message,
  )}`;
}
