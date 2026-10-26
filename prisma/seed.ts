import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import { ARTICLES } from "../src/lib/articles-data";
import { SERVICES, TESTIMONIALS } from "../src/lib/constants";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Admin user
  const adminEmail = process.env.ADMIN_EMAIL || "admin@parto.online";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const adminHashed = await bcrypt.hash(adminPassword, 10);

  const secretaryEmail = process.env.SECRETARY_EMAIL || "secretary@parto.online";
  const secretaryPassword = process.env.SECRETARY_PASSWORD || "secretary123";
  const secretaryHashed = await bcrypt.hash(secretaryPassword, 10);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: adminHashed,
      role: "admin",
      ...(process.env.ADMIN_PHONE ? { phone: process.env.ADMIN_PHONE } : {}),
    },
    create: {
      email: adminEmail,
      name: "مدیر کلینیک",
      password: adminHashed,
      role: "admin",
      phone: process.env.ADMIN_PHONE,
    },
  });

  await prisma.user.upsert({
    where: { email: secretaryEmail },
    update: {
      password: secretaryHashed,
      role: "secretary",
      ...(process.env.SECRETARY_PHONE ? { phone: process.env.SECRETARY_PHONE } : {}),
    },
    create: {
      email: secretaryEmail,
      name: "منشی کلینیک",
      password: secretaryHashed,
      role: "secretary",
      phone: process.env.SECRETARY_PHONE,
    },
  });

  // Services
  for (let i = 0; i < SERVICES.length; i++) {
    const s = SERVICES[i];
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: {},
      create: {
        slug: s.slug,
        title: s.title,
        description: s.description,
        icon: s.icon,
        image: s.image,
        category: s.category,
        order: i,
        active: true,
      },
    });
  }

  // Articles
  for (const a of ARTICLES) {
    await prisma.article.upsert({
      where: { slug: a.slug },
      update: {},
      create: {
        slug: a.slug,
        title: a.title,
        excerpt: a.excerpt,
        content: a.content,
        category: a.category,
        image: a.image,
        author: a.author,
        published: true,
        publishedAt: new Date(a.publishedAt),
      },
    });
  }

  // Reviews
  for (const r of TESTIMONIALS) {
    const exists = await prisma.review.findFirst({ where: { name: r.name, text: r.text } });
    if (!exists) {
      await prisma.review.create({
        data: { name: r.name, rating: r.rating, text: r.text, approved: true },
      });
    }
  }

  // Settings
  const settings = [
    { key: "clinic_name", value: "کلینیک تخصصی فیزیوتراپی پرتو" },
    { key: "doctor_name", value: "دکتر مهری شاکری‌نسب" },
    { key: "phone", value: "09991561688" },
    { key: "whatsapp", value: "989991561688" },
  ];
  for (const s of settings) {
    await prisma.setting.upsert({ where: { key: s.key }, update: {}, create: s });
  }

  console.log("Seed completed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
