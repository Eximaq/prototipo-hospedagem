export type NumericInputValue = number | "";

export function parseNumericInputValue(value: string): NumericInputValue {
  if (value.trim() === "") return "";

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : "";
}

export function normalizeGuestCount(value: NumericInputValue, minimum: number) {
  if (value === "" || !Number.isFinite(value)) return minimum;
  return Math.max(minimum, Math.trunc(value));
}

export function getGuestTotal(adults: NumericInputValue, children: NumericInputValue) {
  if (adults === "" || children === "") return null;
  return adults + children;
}
