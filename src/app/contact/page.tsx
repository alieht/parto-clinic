"use client";
import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Phone, MessageCircle, MapPin, Clock, Send, CheckCircle2 } from "lucide-react";
import { SITE } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";

export default function ContactPage() {
  const [form, setForm] = React.useState({ name: "", phone: "", email: "", subject: "", message: "" });
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", phone: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-primary">خانه</Link>
        <span className="mx-2">←</span>
        <span>ارتباط با ما</span>
      </nav>

      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          ارتباط با ما
        </span>
        <h1 className="text-4xl sm:text-5xl font-black mb-4">
          برای هرگونه سؤال، <span className="gradient-text">با ما در ارتباط باشید</span>
        </h1>
      </div>

      <div className="grid lg:grid-cols-2 gap-10 mb-12">
        {/* Info cards */}
        <div className="space-y-4">
          {[
            { icon: MapPin, title: "آدرس کلینیک", value: SITE.address, href: SITE.mapUrl },
            { icon: Phone, title: "شماره تماس", value: `${SITE.phone2} | ${SITE.phone}`, href: `tel:${SITE.phone}` },
            { icon: MessageCircle, title: "واتساپ", value: SITE.phone, href: `https://wa.me/${SITE.whatsapp}` },
            { icon: null, title: "اینستاگرام", value: `@${SITE.instagram}`, href: `https://instagram.com/${SITE.instagram}` },
            { icon: Clock, title: "ساعات کاری", value: SITE.hours, href: null },
          ].map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              {c.href ? (
                <a href={c.href} target="_blank" rel="noopener noreferrer" className="block">
                  <div className="flex items-start gap-4 p-5 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all">
                    <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center text-white shrink-0">
                      {c.icon ? <c.icon className="h-5 w-5" /> : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <div className="font-bold mb-1">{c.title}</div>
                      <div className="text-sm text-muted-foreground">{c.value}</div>
                    </div>
                  </div>
                </a>
              ) : (
                <div className="flex items-start gap-4 p-5 rounded-2xl bg-card border border-border">
                  <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center text-white shrink-0">
                    {c.icon ? <c.icon className="h-5 w-5" /> : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <div className="font-bold mb-1">{c.title}</div>
                    <div className="text-sm text-muted-foreground">{c.value}</div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Contact form */}
        <div className="rounded-2xl bg-card border border-border p-6 sm:p-8">
          <h2 className="text-2xl font-bold mb-6">ارسال پیام</h2>
          {status === "success" ? (
            <div className="text-center py-10">
              <CheckCircle2 className="h-16 w-16 text-success mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">پیام شما ارسال شد</h3>
              <p className="text-muted-foreground">به زودی با شما تماس خواهیم گرفت.</p>
              <button
                onClick={() => setStatus("idle")}
                className="mt-6 text-primary font-medium"
              >
                ارسال پیام جدید
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="نام و نام خانوادگی *"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
                <Input
                  label="شماره تماس"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  dir="ltr"
                />
              </div>
              <Input
                label="ایمیل"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                dir="ltr"
              />
              <Input
                label="موضوع"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
              />
              <Textarea
                label="پیام شما *"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
              />
              <Button type="submit" className="w-full" loading={status === "loading"}>
                <Send className="h-4 w-4" />
                ارسال پیام
              </Button>
              {status === "error" && (
                <p className="text-danger text-sm text-center">خطا در ارسال. لطفاً دوباره تلاش کنید.</p>
              )}
            </form>
          )}
        </div>
      </div>

      {/* Map */}
      <div className="rounded-2xl overflow-hidden border border-border">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3420!2d50.24!3d30.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDM0JzQ4LjAiTiA1MMKwMTQnMjQuMCJF!5e0!3m2!1sfa!2sir!4v1"
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="موقعیت کلینیک پرتو"
        />
      </div>
    </div>
  );
}
