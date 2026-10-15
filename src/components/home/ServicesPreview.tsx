"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Stethoscope } from "lucide-react";
import * as React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

// Map icon names to lucide components
import * as LucideIcons from "lucide-react";

function IconByName(name: string) {
  const Icon = (LucideIcons as any)[name] || LucideIcons.Stethoscope;
  return <Icon className="h-6 w-6" />;
}

export function ServicesPreview({ services }: { services: any[] }) {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            خدمات ما
          </span>
          <h2 className="text-3xl sm:text-4xl font-black mb-4">
            مراقبت <span className="gradient-text">تخصصی</span>
          </h2>
          <p className="text-muted-foreground">
            روی هر خدمت بزنید تا توضیح آن را ببینید
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((s, i) => (
            <motion.div
              key={s.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href="/services">
                <Card hover className="h-full overflow-hidden group">
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={s.image}
                      alt={s.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 start-3 w-10 h-10 rounded-xl bg-white/90 backdrop-blur flex items-center justify-center text-primary">
                      {IconByName(s.icon)}
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-bold mb-2 group-hover:text-primary transition-colors">
                      {s.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {s.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/services">
            <Button variant="outline" icon={<ArrowLeft className="h-4 w-4" />} iconPosition="end">
              مشاهده همه خدمات و تجهیزات
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
