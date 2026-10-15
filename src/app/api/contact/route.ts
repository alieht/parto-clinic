import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { contactSchema } from "@/lib/validation";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function GET(req: NextRequest) {
  const auth = requireAuth(req, ["admin", "secretary"]);
  if (auth instanceof NextResponse) return auth;
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(messages);
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rl = rateLimit(`contact:${ip}`, 10, 60 * 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json({ error: "تعداد درخواست‌ها بیش از حد مجاز" }, { status: 429 });
  }
  const body = await req.json();
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "داده‌های نامعتبر" }, { status: 400 });
  }
  const d = parsed.data;
  const msg = await prisma.contactMessage.create({
    data: {
      name: d.name,
      phone: d.phone || null,
      email: d.email || null,
      subject: d.subject || null,
      message: d.message,
    },
  });
  return NextResponse.json(msg, { status: 201 });
}
