export function normalizeCPF(value: string) {
  return value.replace(/\D/g, "").slice(0, 11);
}

export function formatCPF(value: string) {
  const digits = normalizeCPF(value);
  return digits
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
}

function calculateDigit(digits: string, factor: number) {
  let total = 0;
  for (const digit of digits) {
    total += Number(digit) * factor;
    factor -= 1;
  }

  const remainder = (total * 10) % 11;
  return remainder === 10 ? 0 : remainder;
}

export function isValidCPF(value: string) {
  const digits = normalizeCPF(value);
  if (digits.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(digits)) return false;

  const firstDigit = calculateDigit(digits.slice(0, 9), 10);
  const secondDigit = calculateDigit(digits.slice(0, 10), 11);

  return digits === `${digits.slice(0, 9)}${firstDigit}${secondDigit}`;
}
