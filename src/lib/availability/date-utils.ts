const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const ICAL_DATE_PATTERN = /^(\d{4})(\d{2})(\d{2})/;
const MS_PER_DAY = 86_400_000;
export const PROPERTY_TIME_ZONE = "America/Sao_Paulo";

export type LocalDateParts = {
  year: number;
  month: number;
  day: number;
};

export function parseISODate(value: string): LocalDateParts | null {
  const match = ISO_DATE_PATTERN.exec(value);
  if (!match) return null;

  const [, year, month, day] = match;
  const parts = {
    year: Number(year),
    month: Number(month),
    day: Number(day),
  };

  const date = new Date(Date.UTC(parts.year, parts.month - 1, parts.day));
  if (
    date.getUTCFullYear() !== parts.year ||
    date.getUTCMonth() !== parts.month - 1 ||
    date.getUTCDate() !== parts.day
  ) {
    return null;
  }

  return parts;
}

export function isISODate(value: string) {
  return parseISODate(value) !== null;
}

export function toDayNumber(value: string) {
  const parts = parseISODate(value);
  if (!parts) throw new Error(`Invalid ISO date: ${value}`);
  return Date.UTC(parts.year, parts.month - 1, parts.day) / MS_PER_DAY;
}

export function tryToDayNumber(value: string) {
  return isISODate(value) ? toDayNumber(value) : null;
}

export function fromDayNumber(dayNumber: number) {
  const date = new Date(dayNumber * MS_PER_DAY);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function compareISODate(a: string, b: string) {
  return toDayNumber(a) - toDayNumber(b);
}

export function addDays(value: string, days: number) {
  return fromDayNumber(toDayNumber(value) + days);
}

export function isBefore(a: string, b: string) {
  return compareISODate(a, b) < 0;
}

export function isSameOrBefore(a: string, b: string) {
  return compareISODate(a, b) <= 0;
}

export function isDateInRange(
  date: string,
  range: { startDate: string; endDate: string },
) {
  const day = toDayNumber(date);
  return day >= toDayNumber(range.startDate) && day < toDayNumber(range.endDate);
}

export function rangesOverlap(
  a: { startDate: string; endDate: string },
  b: { startDate: string; endDate: string },
) {
  return toDayNumber(a.startDate) < toDayNumber(b.endDate) &&
    toDayNumber(b.startDate) < toDayNumber(a.endDate);
}

export function isValidDateRange(startDate: string, endDate: string) {
  return isISODate(startDate) && isISODate(endDate) && isBefore(startDate, endDate);
}

export function getTodayISO(timeZone = PROPERTY_TIME_ZONE) {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

export function formatDateForDisplay(value?: string) {
  if (!value || !isISODate(value)) return "Não informado";
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}

export function getMonthMatrix(year: number, monthIndex: number) {
  const firstDay = new Date(Date.UTC(year, monthIndex, 1));
  const firstWeekday = firstDay.getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
  const cells: Array<string | null> = [];

  for (let index = 0; index < firstWeekday; index += 1) cells.push(null);
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(fromDayNumber(Date.UTC(year, monthIndex, day) / MS_PER_DAY));
  }
  while (cells.length % 7 !== 0) cells.push(null);

  return cells;
}

export function getMonthLabel(year: number, monthIndex: number) {
  return new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, monthIndex, 1)));
}

export function getMonthFromISO(value: string) {
  const parts = parseISODate(value);
  if (!parts) throw new Error(`Invalid ISO date: ${value}`);
  return { year: parts.year, monthIndex: parts.month - 1 };
}

export function parseICalDateValue(value: string) {
  const match = ICAL_DATE_PATTERN.exec(value);
  if (!match) return null;

  const [, year, month, day] = match;
  const iso = `${year}-${month}-${day}`;
  return isISODate(iso) ? iso : null;
}
