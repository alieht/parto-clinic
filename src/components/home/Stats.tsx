"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Award, GraduationCap, Stethoscope, FileText, TrendingUp, Users } from "lucide-react";

const stats = [
  { icon: Award, value: "PhD", label: "دکترای تخصصی فیزیوتراپی", color: "from-primary to-accent", glow: "shadow-primary/30" },
  { icon: GraduationCap, value: "۳", label: "دانشگاه معتبر", sub: "شیراز، اصفهان، اهواز", color: "from-accent to-cyan-500", glow: "shadow-accent/30" },
  { icon: Stethoscope, value: "+۱۰", label: "خدمت تخصصی", sub: "با تجهیزات پیشرفته", color: "from-success to-emerald-500", glow: "shadow-success/30" },
  { icon: FileText, value: "۴", label: "مقاله علمی", sub: "در کنگره‌های بین‌المللی", color: "from-warning to-orange-500", glow: "shadow-warning/30" },
];

export function Stats() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-16 relative" ref={ref}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ delay: i * 0.12, duration: 0.6, ease: "easeOut" }}
              className="group relative"
            >
              <div className="relative overflow-hidden rounded-3xl bg-card border border-border p-6 sm:p-8 text-center hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10">
                {/* Top gradient bar */}
                <div className={`absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r ${s.color}`} />
                {/* Hover glow */}
                <div className={`absolute -inset-1 bg-gradient-to-r ${s.color} opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500 -z-10`} />

                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className={`w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white mb-4 shadow-xl ${s.glow}`}
                >
                  <s.icon className="h-7 w-7 sm:h-8 sm:w-8" />
                </motion.div>

                <div className="text-4xl sm:text-5xl font-black gradient-text mb-2 tracking-tight">
                  {s.value}
                </div>
                <div className="text-sm sm:text-base font-bold text-foreground mb-1">
                  {s.label}
                </div>
                {s.sub && (
                  <div className="text-xs text-muted-foreground">{s.sub}</div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
