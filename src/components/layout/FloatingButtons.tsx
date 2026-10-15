"use client";
import { MessageCircle, Phone } from "lucide-react";
import { SITE } from "@/lib/utils";

export function FloatingButtons() {
  return (
    <div className="fixed bottom-6 start-6 z-30 flex flex-col gap-3">
      <a
        href={`https://wa.me/${SITE.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 rounded-full bg-success text-white flex items-center justify-center shadow-lg shadow-success/40 hover:scale-110 transition-transform pulse-glow"
        aria-label="واتساپ"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
      <a
        href={`tel:${SITE.phone}`}
        className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/40 hover:scale-110 transition-transform"
        aria-label="تماس"
      >
        <Phone className="h-6 w-6" />
      </a>
      <a
        href={`https://instagram.com/${SITE.instagram}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        aria-label="اینستاگرام"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      </a>
    </div>
  );
}
