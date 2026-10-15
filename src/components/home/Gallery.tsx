"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { X } from "lucide-react";

const images = [
  { src: "/assets/clinic-electro.jpg", alt: "اتاق الکتروتراپی" },
  { src: "/assets/shockwave.jpg", alt: "دستگاه CPM" },
  { src: "/assets/dynamometer-laser.jpg", alt: "لیزر پرتوان" },
  { src: "/assets/rehab-room.jpg", alt: "اتاق ویزیت" },
  { src: "/assets/magnet.jpg", alt: "مگنت تراپی" },
  { src: "/assets/shock-room.jpg", alt: "اتاق توانبخشی" },
  { src: "/assets/treatment-rooms.jpg", alt: "اتاق‌های درمان" },
];

export function Gallery() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            گالری کلینیک
          </span>
          <h2 className="text-3xl sm:text-4xl font-black mb-4">
            فضایی <span className="gradient-text">آرام و مجهز</span>
          </h2>
          <p className="text-muted-foreground">
            نگاهی به فضای آرام، بهداشتی و مجهز کلینیک تخصصی فیزیوتراپی پرتو
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group"
              onClick={() => setSelected(img.src)}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium text-center px-2">
                  {img.alt}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <button className="absolute top-4 end-4 p-2 rounded-full bg-white/10 text-white" aria-label="بستن">
            <X className="h-6 w-6" />
          </button>
          <img src={selected} alt="" className="max-w-full max-h-[90vh] rounded-2xl" />
        </div>
      )}
    </section>
  );
}
