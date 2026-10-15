import Link from "next/link";
import { Calendar, Phone, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SITE } from "@/lib/utils";

export function CTA() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl gradient-bg p-10 sm:p-16 text-white text-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.15),transparent_50%)]" />
          <div className="absolute top-0 end-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4">
              پرتو؛ دلیل حال خوب تو
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              همین حالا نوبت خود را آنلاین رزرو کنید و اولین قدم برای یک زندگی
              بدون درد را بردارید.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/booking">
                <button className="inline-flex items-center gap-2 h-14 px-8 rounded-xl bg-white text-primary font-bold shadow-xl hover:-translate-y-0.5 transition-all">
                  <Calendar className="h-5 w-5" />
                  رزرو نوبت آنلاین
                </button>
              </Link>
              <a href={`tel:${SITE.phone}`}>
                <button className="inline-flex items-center gap-2 h-14 px-8 rounded-xl bg-white/20 backdrop-blur text-white font-bold border border-white/30 hover:bg-white/30 transition-all">
                  <Phone className="h-5 w-5" />
                  تماس تلفنی
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
