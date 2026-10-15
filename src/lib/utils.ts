import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(n: number | string) {
  return new Intl.NumberFormat("fa-IR").format(Number(n));
}

export function formatDate(date: string | Date) {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

export function slugify(text: string) {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u0600-\u06FF-]/g, "");
}

export const SITE = {
  name: "کلینیک فیزیوتراپی پرتو",
  tagline: "دلیل حال خوب تو",
  doctor: "دکتر مهری شاکری‌نسب",
  doctorTitle: "دکترای تخصصی فیزیوتراپی (PhD)",
  phone: "09991561688",
  phone2: "06152835992",
  whatsapp: "989991561688",
  instagram: "dr.mehri_shakerinasab",
  address:
    "بهبهان، خیابان پیروز، کوچه بهادری، بعد از سونوگرافی دکتر امینی، کلینیک تخصصی فیزیوتراپی پرتو",
  hours: "شنبه تا پنجشنبه: صبح و عصر | جمعه: تعطیل",
  mapUrl: "https://maps.app.goo.gl/xH1iaFZ8qULft9ti7",
  email: "",
};
