import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import fs from "fs";
import path from "path";
import { prisma, normalizeDatabaseUrl } from "@/lib/db";
import bcrypt from "bcryptjs";
import { ARTICLES } from "@/lib/articles-data";
import { SERVICES, TESTIMONIALS } from "@/lib/constants";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(req: NextRequest) {
  // Authorized if EITHER:
  //   1. a valid SETUP_TOKEN is supplied (?token=... or x-setup-token header), OR
  //   2. the caller is logged into the admin panel as a manager (JWT cookie)
  const token = req.headers.get("x-setup-token") || new URL(req.url).searchParams.get("token");
  const expected = process.env.SETUP_TOKEN;
  const tokenOk = Boolean(expected) && token === expected;

  const user = getUserFromRequest(req);
  const adminOk = user?.role === "admin";

  if (!tokenOk && !adminOk) {
    const setupTokenConfigured = Boolean(expected);
    return NextResponse.json(
      {
        error: "Unauthorized",
        hint: setupTokenConfigured
          ? "توکن ارسال‌شده با SETUP_TOKEN در Netlify مطابقت ندارد. یا مقدار را دقیقاً کپی کنید، یا با حساب مدیر در /admin/login وارد شوید و دوباره همین آدرس را در همان مرورگر باز کنید."
          : "متغیر SETUP_TOKEN در Netlify تعریف نشده است. یا آن را بسازید، یا با حساب مدیر در /admin/login وارد شوید و دوباره همین آدرس را در همان مرورگر باز کنید.",
        setupTokenConfigured,
        adminSession: Boolean(user),
      },
      { status: 401 }
    );
  }

  const log: string[] = [];
  try {
    const migrationsDir = path.join(process.cwd(), "prisma", "migrations");
    const files = fs.existsSync(migrationsDir)
      ? fs
          .readdirSync(migrationsDir)
          .filter((d) => fs.existsSync(path.join(migrationsDir, d, "migration.sql")))
          .sort()
      : [];

    if (files.length === 0) {
      log.push("migration: SQL files not found, skipped");
    }

    const pool = new Pool({
      connectionString: normalizeDatabaseUrl(process.env.DATABASE_URL || "", false),
      connectionTimeoutMillis: 15000,
      ssl: { rejectUnauthorized: false },
      max: 1,
    });
    try {
      for (const dir of files) {
        const sql = fs.readFileSync(path.join(migrationsDir, dir, "migration.sql"), "utf8");
        try {
          await pool.query(sql);
          log.push(`migration ${dir}: applied`);
        } catch (e: any) {
          // The baseline init migration is not idempotent; re-runs are expected to fail here
          log.push(`migration ${dir}: ${e?.message || e}`);
        }
      }
    } finally {
      await pool.end();
    }

    const adminEmail = process.env.ADMIN_EMAIL || "admin@parto.online";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    const adminHashed = await bcrypt.hash(adminPassword, 10);
    const adminPhone = process.env.ADMIN_PHONE || undefined;
    await prisma.user.upsert({
      where: { email: adminEmail },
      update: { password: adminHashed, role: "admin", ...(adminPhone ? { phone: adminPhone } : {}) },
      create: { email: adminEmail, name: "مدیر کلینیک", password: adminHashed, role: "admin", phone: adminPhone },
    });
    log.push("seed: admin user ok");

    const secretaryEmail = process.env.SECRETARY_EMAIL || "secretary@parto.online";
    const secretaryPassword = process.env.SECRETARY_PASSWORD || "secretary123";
    const secretaryHashed = await bcrypt.hash(secretaryPassword, 10);
    const secretaryPhone = process.env.SECRETARY_PHONE || undefined;
    await prisma.user.upsert({
      where: { email: secretaryEmail },
      update: { password: secretaryHashed, role: "secretary", ...(secretaryPhone ? { phone: secretaryPhone } : {}) },
      create: { email: secretaryEmail, name: "منشی کلینیک", password: secretaryHashed, role: "secretary", phone: secretaryPhone },
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

/**
 * Browser-friendly alias so the setup can be triggered by simply opening the
 * URL in a browser (which issues GET). Same token protection + idempotency.
 */
export async function GET(req: NextRequest) {
  return POST(req);
}
