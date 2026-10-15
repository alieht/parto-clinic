import Link from "next/link";
import { prisma } from "@/lib/db";
import { ServicesClient } from "@/components/services/ServicesClient";

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-primary">خانه</Link>
        <span className="mx-2">←</span>
        <span>خدمات</span>
      </nav>

      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          خدمات ما
        </span>
        <h1 className="text-4xl sm:text-5xl font-black mb-4">
          حوزه‌های <span className="gradient-text">تخصصی درمان</span>
        </h1>
        <p className="text-muted-foreground">
          در کلینیک پرتو، هر بیمار به‌صورت اختصاصی ارزیابی شده و برنامه درمانی
          متناسب با شرایط او طراحی می‌شود.
        </p>
      </div>

      <ServicesClient services={services} />
    </div>
  );
}
