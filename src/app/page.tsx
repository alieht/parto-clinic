import { Hero } from "@/components/home/HeroNew";
import { Stats } from "@/components/home/Stats";
import { ServicesPreview } from "@/components/home/ServicesPreview";
import { prisma } from "@/lib/db";
import { AboutPreview } from "@/components/home/AboutPreview";
import { Gallery } from "@/components/home/Gallery";
import { Testimonials } from "@/components/home/Testimonials";
import { FAQ } from "@/components/home/FAQ";
import { CTA } from "@/components/home/CTA";

export const dynamic = "force-dynamic";

export default async function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    name: "کلینیک تخصصی فیزیوتراپی پرتو",
    description: "اولین کلینیک دارای دکترای تخصصی فیزیوتراپی در بهبهان",
    url: "https://parto.online",
    telephone: "+989991561688",
    address: {
      "@type": "PostalAddress",
      streetAddress: "خیابان پیروز، کوچه بهادری، بعد از سونوگرافی دکتر امینی",
      addressLocality: "بهبهان",
      addressCountry: "IR",
    },
    medicalSpecialty: "Physiotherapy",
    founder: {
      "@type": "Person",
      name: "دکتر مهری شاکری‌نسب",
      jobTitle: "دکترای تخصصی فیزیوتراپی",
    },
    openingHours: "Sa-Th 08:00-18:00",
  };

  const services = await prisma.service.findMany({ where: { active: true }, orderBy: { order: "asc" } });
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero />
      <Stats />
      <ServicesPreview services={services} />
      <AboutPreview />
      <Gallery />
      <Testimonials />
      <FAQ />
      <CTA />
    </>
  );
}
