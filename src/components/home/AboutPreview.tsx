"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

const points = [
  "دکترای تخصصی فیزیوتراپی (PhD)",
  "فارغ‌التحصیل ممتاز دانشگاه‌های شیراز، اصفهان و اهواز",
  "درمان مبتنی بر شواهد علمی (Evidence-Based)",
  "برنامه درمان اختصاصی برای هر بیمار",
  "تجهیزات پیشرفته و مدرن روز دنیا",
  "اولین و تنها کلینیک دارای PhD در بهبهان",
];

export function AboutPreview() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="order-2 lg:order-1"
          >
            <div className="relative">
              <div className="absolute -inset-4 gradient-bg rounded-[3rem] opacity-20 blur-2xl" />
              <img
                src="/assets/doctor.jpg"
                alt="دکتر مهری شاکری‌نسب"
                className="relative rounded-[2.5rem] shadow-2xl w-full"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="order-1 lg:order-2"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              درباره ما
            </span>
            <h2 className="text-3xl sm:text-4xl font-black mb-4">
              سلامت شما، <span className="gradient-text">اولویت ماست</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              دکتر مهری شاکری‌نسب، دکترای تخصصی فیزیوتراپی و فارغ‌التحصیل ممتاز
              دانشگاه‌های علوم پزشکی شیراز، اصفهان و جندی‌شاپور اهواز، با سال‌ها
              تجربه در حوزه ارزیابی، درمان و توانبخشی اختلالات اسکلتی-عضلانی،
              آسیب‌های ورزشی و مشکلات حرکتی، خدمات درمانی تخصصی و مبتنی بر
              شواهد علمی را به مراجعین ارائه می‌دهند.
            </p>
            <ul className="space-y-3 mb-8">
              {points.map((p, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
                  <span className="text-sm">{p}</span>
                </li>
              ))}
            </ul>
            <div className="flex gap-3">
              <Link href="/about">
                <Button icon={<ArrowLeft className="h-4 w-4" />} iconPosition="end">
                  بیشتر درباره ما
                </Button>
              </Link>
              <Link href="/booking">
                <Button variant="outline">رزرو نوبت</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
