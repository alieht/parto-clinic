"use client";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { SITE } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Animated mesh gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-indigo-50/50 to-cyan-50/50" />
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 start-1/4 w-[500px] h-[500px] bg-primary/30 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, -80, 0], y: [0, 80, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 end-1/4 w-[600px] h-[600px] bg-accent/25 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, 60, 0], y: [0, 60, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 start-1/2 w-[400px] h-[400px] bg-success/20 rounded-full blur-[100px]"
        />
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#6366f108_1px,transparent_1px),linear-gradient(to_bottom,#6366f108_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <motion.div style={{ y, opacity }} className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center lg:text-start order-2 lg:order-1"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-xl border border-primary/20 shadow-lg shadow-primary/10 text-primary text-sm font-semibold mb-8"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4"><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"/></svg>
              اولین کلینیک دارای PhD فیزیوتراپی در بهبهان
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            </motion.div>

            {/* Main heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black leading-[1.05] mb-6 tracking-tight">
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.7 }}
                className="block"
              >
                دلیل حال خوب
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.7 }}
                className="gradient-text block"
              >
                تو
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0"
            >
              کلینیک تخصصی فیزیوتراپی پرتو زیر نظر{" "}
              <strong className="text-foreground font-bold">دکتر مهری شاکری‌نسب</strong>{" "}
              — درمان تخصصی کمردرد، گردن‌درد، زانو، آسیب‌های ورزشی و توانبخشی با
              تجهیزات روز دنیا و رویکرد مبتنی بر شواهد علمی.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-12"
            >
              <Link href="/booking">
                <Button size="xl" icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5"><path d="M8 2v3"/><path d="M16 2v3"/><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/></svg>} className="shadow-2xl shadow-primary/40">
                  رزرو نوبت آنلاین
                </Button>
              </Link>
              <a href={`tel:${SITE.phone}`}>
                <Button variant="secondary" size="xl" icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5"><path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"/></svg>} className="shadow-xl">
                  تماس با کلینیک
                </Button>
              </a>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-6"
            >
              {[
                { svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" class="h-5 w-5 text-primary"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>', label: "PhD فیزیوتراپی" },
                { svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" class="h-5 w-5 text-success"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>', label: "درمان مبتنی بر شواهد" },
                { svg: '<svg viewBox="0 0 24 24" fill="currentColor" class="h-5 w-5 text-warning"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>', label: "۴.۹ از ۵ (نظرات)" },
              ].map((b, i) => (
                <div key={i} className="flex items-center gap-2 text-sm font-medium text-foreground/80">
                  <span dangerouslySetInnerHTML={{ __html: b.svg }} />
                  <span>{b.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Visual side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="relative order-1 lg:order-2"
          >
            <div className="relative mx-auto max-w-lg">
              {/* Glow */}
              <div className="absolute -inset-8 gradient-bg rounded-[4rem] opacity-20 blur-3xl" />

              {/* Main image card */}
              <div className="relative">
                <div className="absolute inset-0 gradient-bg rounded-[3rem] rotate-3 opacity-15" />
                <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white bg-white aspect-[3/4]">
                  <Image
                    src="/assets/doctor.jpg"
                    alt="دکتر مهری شاکری‌نسب"
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent" />
                </div>
              </div>

              {/* Floating cards */}
              <motion.div
                animate={{ y: [0, -15, 0], rotate: [-2, 2, -2] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-8 -start-8 glass rounded-2xl p-4 shadow-2xl max-w-[220px] border border-white/40"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-success to-emerald-600 flex items-center justify-center text-white shadow-lg">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground font-medium">تجهیزات</div>
                    <div className="font-bold text-sm">روز دنیا</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 15, 0], rotate: [2, -2, 2] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -top-8 -end-8 glass rounded-2xl p-5 shadow-2xl border border-white/40 text-center"
              >
                <div className="text-4xl font-black gradient-text mb-1">+۱۰</div>
                <div className="text-xs text-muted-foreground font-medium">خدمت تخصصی</div>
              </motion.div>

              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute top-1/2 -end-12 glass rounded-2xl p-4 shadow-2xl border border-white/40"
              >
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2 rtl:space-x-reverse">
                    {["م", "ع", "ح"].map((c, i) => (
                      <div key={i} className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                        {c}
                      </div>
                    ))}
                  </div>
                  <div className="text-xs">
                    <div className="font-bold">+۱۰۰۰</div>
                    <div className="text-muted-foreground">مراجعه‌کننده</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground"
      >
        <span className="text-xs font-medium">اسکرول کنید</span>
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-1.5">
          <motion.div
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-primary"
          />
        </div>
      </motion.div>
    </section>
  );
}
