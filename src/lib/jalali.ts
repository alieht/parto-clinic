import { toJalaali } from "jalaali-js";

const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
function toPersianDigits(s: string) {
  return s.replace(/\d/g, (d) => PERSIAN_DIGITS[parseInt(d)]);
}

const JALALI_MONTHS = [
  "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
  "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند",
];

/**
 * Convert a Gregorian date string (ISO: YYYY-MM-DD) or Date to a Jalali display string.
 * Example: "2026-10-25" → "۴ آبان ۱۴۰۵"
 */
export function toJalaaliDisplay(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return String(date);
  const j = toJalaali(d.getFullYear(), d.getMonth() + 1, d.getDate());
  return `${toPersianDigits(String(j.jd))} ${JALALI_MONTHS[j.jm - 1]} ${toPersianDigits(String(j.jy))}`;
}

/**
 * Convert a Gregorian date string to a short Jalali string.
 * Example: "2026-10-25" → "۱۴۰۵/۰۸/۰۴"
 */
export function toJalaaliShort(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return String(date);
  const j = toJalaali(d.getFullYear(), d.getMonth() + 1, d.getDate());
  return `${toPersianDigits(String(j.jy))}/${toPersianDigits(String(j.jm).padStart(2, "0"))}/${toPersianDigits(String(j.jd).padStart(2, "0"))}`;
}
