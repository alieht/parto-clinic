import Link from "next/link";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { SITE } from "@/lib/utils";

export function Footer() {
  return (
    <footer className="bg-foreground text-background mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center text-white font-black text-xl">
                پ
              </div>
              <div>
                <div className="font-bold text-lg">کلینیک پرتو</div>
                <div className="text-sm opacity-70">دلیل حال خوب تو</div>
              </div>
            </div>
            <p className="text-sm opacity-80 leading-relaxed">
              اولین کلینیک دارای دکترای تخصصی فیزیوتراپی در بهبهان. درمان تخصصی
              مبتنی بر شواهد علمی زیر نظر دکتر مهری شاکری‌نسب.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-bold text-lg mb-4">دسترسی سریع</h3>
            <ul className="space-y-2 text-sm opacity-80">
              {[
                ["/", "خانه"],
                ["/services", "خدمات و تجهیزات"],
                ["/about", "درباره دکتر"],
                ["/articles", "مقالات علمی"],
                ["/booking", "رزرو نوبت"],
                ["/contact", "ارتباط با ما"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="hover:opacity-100 hover:text-accent transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4">ارتباط با ما</h3>
            <ul className="space-y-3 text-sm opacity-80">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-1 shrink-0" />
                <span>{SITE.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" />
                <a href={`tel:${SITE.phone2}`} dir="ltr">
                  {SITE.phone2}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" />
                <a href={`tel:${SITE.phone}`} dir="ltr">
                  {SITE.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 shrink-0" />
                <span>{SITE.hours}</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-bold text-lg mb-4">شبکه‌های اجتماعی</h3>
            <div className="flex gap-3">
              <a
                href={`https://wa.me/${SITE.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl bg-white/10 hover:bg-success flex items-center justify-center transition-colors"
                aria-label="واتساپ"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
              <a
                href={`https://instagram.com/${SITE.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl bg-white/10 hover:bg-pink-500 flex items-center justify-center transition-colors"
                aria-label="اینستاگرام"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href={SITE.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl bg-white/10 hover:bg-primary flex items-center justify-center transition-colors"
                aria-label="گوگل مپ"
              >
                <MapPin className="h-5 w-5" />
              </a>
            </div>
            <div className="mt-6">
              <Link href="/booking">
                <button className="w-full h-12 rounded-xl gradient-bg text-white font-semibold">
                  رزرو نوبت آنلاین
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm opacity-70">
          <p>© ۱۴۰۵ کلینیک فیزیوتراپی پرتو. تمامی حقوق محفوظ است.</p>
          <p>طراحی شده با ❤ برای سلامت شما</p>
        </div>
      </div>
    </footer>
  );
}
