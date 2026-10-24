import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import fs from "fs";
import path from "path";
import { prisma, normalizeDatabaseUrl } from "@/lib/db";
import bcrypt from "bcryptjs";
import { ARTICLES } from "@/lib/articles-data";
import { SERVICES, TESTIMONIALS } from "@/lib/constants";

export async function POST(req: NextRequest) {
  const token = req.headers.get("x-setup-token") || new URL(req.url).searchParams.get("token");
  const expected = process.env.SETUP_TOKEN;
  if (!expected || token !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const log: string[] = [];
  try {
    const candidates = [
      path.join(process.cwd(), "prisma", "migrations", "20261015172210_init", "migration.sql"),
    ];
    let sql = "";
    for (const c of candidates) {
      if (fs.existsSync(c)) { sql = fs.readFileSync(c, "utf8"); break; }
    }
    if (sql) {
      const pool = new Pool({ connectionString: normalizeDatabaseUrl(process.env.DATABASE_URL || ""), connectionTimeoutMillis: 15000, ssl: { rejectUnauthorized: false } });
      try {
        await pool.query(sql);
        log.push("migration: applied");
      } catch (e: any) {
        log.push(`migration: ${e?.message || e}`);
      } finally {
        await pool.end();
      }
    } else {
      log.push("migration: SQL file not found, skipped");
    }

    const adminEmail = process.env.ADMIN_EMAIL || "admin@parto.online";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    const adminHashed = await bcrypt.hash(adminPassword, 10);
    await prisma.user.upsert({
      where: { email: adminEmail },
      update: { password: adminHashed, role: "admin" },
      create: { email: adminEmail, name: "مدیر کلینیک", password: adminHashed, role: "admin" },
    });
    log.push("seed: admin user ok");

    const secretaryEmail = process.env.SECRETARY_EMAIL || "secretary@parto.online";
    const secretaryPassword = process.env.SECRETARY_PASSWORD || "secretary123";
    const secretaryHashed = await bcrypt.hash(secretaryPassword, 10);
    await prisma.user.upsert({
      where: { email: secretaryEmail },
      update: { password: secretaryHashed, role: "secretary" },
      create: { email: secretaryEmail, name: "منشی کلینیک", password: secretaryHashed, role: "secretary" },
    });
    log.push("seed: secretary user ok");

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
    log.push("seed: services ok");

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
    log.push("seed: articles ok");

    for (const r of TESTIMONIALS) {
      const exists = await prisma.review.findFirst({ where: { name: r.name, text: r.text } });
      if (!exists) {
        await prisma.review.create({ data: { name: r.name, rating: r.rating, text: r.text, approved: true } });
      }
    }
    log.push("seed: reviews ok");

    const settings = [
      { key: "clinic_name", value: "کلینیک تخصصی فیزیوتراپی پرتو" },
      { key: "doctor_name", value: "دکتر مهری شاکری‌نسب" },
      { key: "phone", value: "09991561688" },
      { key: "whatsapp", value: "989991561688" },
    ];
    for (const s of settings) {
      await prisma.setting.upsert({ where: { key: s.key }, update: {}, create: s });
    }
    log.push("seed: settings ok");

    return NextResponse.json({ success: true, log });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err?.message || "Setup failed", log }, { status: 500 });
  }
}
