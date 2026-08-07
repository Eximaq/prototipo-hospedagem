import { siteConfig } from "@/data/site-config";
import { formatDateForMessage } from "@/lib/format";

export type WhatsAppInquiry = {
  property?: string;
  room?: string;
  checkIn?: string;
  checkOut?: string;
  adults?: number;
  children?: number;
  notes?: string;
};

export function buildWhatsAppMessage({
  property,
  room,
  checkIn,
  checkOut,
  adults,
  children,
  notes,
}: WhatsAppInquiry) {
  const lines = [
    "Olá! Gostaria de consultar disponibilidade nas Casas Milagres.",
    "",
    `Casa escolhida: ${property || room || "Não informada"}`,
    `Entrada: ${formatDateForMessage(checkIn)}`,
    `Saída: ${formatDateForMessage(checkOut)}`,
    `Adultos: ${adults ?? "Não informado"}`,
    `Crianças: ${children ?? 0}`,
  ];

  if (notes?.trim()) {
    lines.push("", "Observação:", notes.trim());
  }

  lines.push("", "Aguardo retorno com disponibilidade, valores e condições.");

  return lines.join("\n");
}

export function buildWhatsAppUrl(inquiry: WhatsAppInquiry) {
  const message = buildWhatsAppMessage(inquiry);
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
    message,
  )}`;
}
