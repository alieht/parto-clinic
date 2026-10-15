"use client";
import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Calendar, ChevronDown } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { EQUIPMENT, FAQS } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

function IconByName(name: string) {
  const Icon = (LucideIcons as any)[name] || LucideIcons.Stethoscope;
  return <Icon className="h-6 w-6" />;
}

export function ServicesClient({ services }: { services: any[] }) {
  const [openFaq, setOpenFaq] = React.useState<number | null>(0);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
        {services.map((s, i) => (
          <motion.div
            key={s.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
          >
            <Card hover className="h-full overflow-hidden">
              <div className="relative h-44 overflow-hidden">
                <img
                  src={s.image || "/assets/svc-back.jpg"}
                  alt={s.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-3 start-3 w-11 h-11 rounded-xl bg-white/90 backdrop-blur flex items-center justify-center text-primary">
                  {IconByName(s.icon || "Stethoscope")}
                </div>
              </div>
              <CardContent className="p-5">
                <h3 className="font-bold text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{s.description}</p>
                <Link href="/booking">
                  <Button size="sm" variant="outline" className="w-full">
                    رزرو نوبت ←
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <section className="mb-20">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl font-black mb-4">
            فناوری روز در <span className="gradient-text">خدمت درمان شما</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-4">دستگاه‌ها و روش‌های درمانی</h3>
              <ul className="space-y-2">
                {EQUIPMENT.map((e, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                    {e}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-4">خدمات درمانی و تمرینی</h3>
              <ul className="space-y-2 text-sm">
                {[
                  "تمرین‌درمانی تخصصی",
                  "تیپینگ درمانی",
                  "درمان بی‌اختیاری ادرار و مشکلات عملکردی کف لگن",
                  "برنامه‌های تخصصی بازگشت به فعالیت و ورزش",
                  "اصلاح الگوی حرکتی و پیشگیری از آسیب",
                ].map((e, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                    {e}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mb-20">
        <h2 className="text-3xl font-black mb-8 text-center">
          محیط و <span className="gradient-text">تجهیزات کلینیک</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            "/assets/clinic-electro.jpg",
            "/assets/shockwave.jpg",
            "/assets/dynamometer-laser.jpg",
            "/assets/rehab-room.jpg",
            "/assets/magnet.jpg",
            "/assets/shock-room.jpg",
            "/assets/treatment-rooms.jpg",
          ].map((src, i) => (
            <div key={i} className="aspect-square rounded-2xl overflow-hidden">
              <img src={src} alt="" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
            </div>
          ))}
        </div>
      </section>

      <section className="mb-20 max-w-3xl mx-auto">
        <h2 className="text-3xl font-black mb-8 text-center">
          پاسخ به <span className="gradient-text">پرسش‌های شما</span>
        </h2>
        <div className="space-y-3">
          {FAQS.map((f, i) => {
            const isOpen = openFaq === i;
            return (
              <div key={i} className="rounded-2xl bg-card border border-border overflow-hidden">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-start font-semibold hover:bg-muted/50 transition-colors"
                >
                  <span>{f.q}</span>
                  <ChevronDown className={`h-5 w-5 shrink-0 transition-transform ${isOpen ? "rotate-180 text-primary" : ""}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-muted-foreground leading-relaxed">
                    {f.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="text-center">
        <div className="rounded-3xl gradient-bg p-10 text-white">
          <h2 className="text-3xl font-black mb-4">آماده‌اید مسیر بهبودی را آغاز کنید؟</h2>
          <p className="opacity-90 mb-6">برای دریافت مشاوره و انتخاب مناسب‌ترین روش درمانی، همین امروز نوبت خود را ثبت کنید.</p>
          <Link href="/booking">
            <button className="inline-flex items-center gap-2 h-12 px-8 rounded-xl bg-white text-primary font-bold">
              <Calendar className="h-5 w-5" />
              رزرو نوبت آنلاین
            </button>
          </Link>
        </div>
      </section>
    </>
  );
}
