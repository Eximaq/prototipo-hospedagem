import { siteConfig } from "@/data/site-config";
import { calculateNights, formatDateForDisplay } from "@/lib/availability/date-utils";
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
  const nights = calculateNights(checkIn, checkOut);
  const lines = ["Olá! Gostaria de consultar uma hospedagem nas Casas Milagres."];

  const stayLines = [
    property || room ? `🏡 Casa: ${property || room}` : "",
    checkIn ? `📅 Entrada: ${formatDateForDisplay(checkIn)}` : "",
    checkOut ? `📅 Saída: ${formatDateForDisplay(checkOut)}` : "",
    nights ? `🌙 Estadia: ${nights} noite${nights === 1 ? "" : "s"}` : "",
  ].filter(Boolean);

  if (stayLines.length) {
    lines.push("", ...stayLines);
  }

  const guestLines = [
    typeof adults === "number" ? `👥 Adultos: ${adults}` : "",
    typeof children === "number" ? `👶 Crianças: ${children}` : "",
  ].filter(Boolean);

  if (guestLines.length) {
    lines.push("", ...guestLines);
  }

  const responsibleLines = [
    responsibleName?.trim() ? `Nome: ${responsibleName.trim()}` : "",
    cpf ? `CPF: ${formatCPF(cpf)}` : "",
    birthDate ? `Nascimento: ${formatDateForDisplay(birthDate)}` : "",
  ].filter(Boolean);

  if (responsibleLines.length) {
    lines.push("", "RESPONSÁVEL", "", ...responsibleLines);
  }

  if (notes?.trim()) {
    lines.push("", "OBSERVAÇÕES", "", notes.trim());
  }

  lines.push(
    "",
    "Gostaria de confirmar disponibilidade e receber informações sobre valores.",
  );

  return lines.join("\n");
}

export function buildWhatsAppUrl(inquiry: WhatsAppInquiry) {
  const message = buildWhatsAppMessage(inquiry);
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
    message,
  )}`;
}
