import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { appointmentSchema } from "@/lib/validation";
import path from "path";
import fs from "fs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const where = status ? { status } : {};
  const appointments = await prisma.appointment.findMany({
    where,
    include: { service: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(appointments);
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rl = rateLimit(`booking:${ip}`, 20, 60 * 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json({ error: "تعداد درخواست‌ها بیش از حد مجاز" }, { status: 429 });
  }
  try {
    const formData = await req.formData();
    const name = String(formData.get("name") || "");
    const phone = String(formData.get("phone") || "");
    const email = String(formData.get("email") || "") || null;
    const serviceType = String(formData.get("serviceType") || "") || null;
    const method = String(formData.get("method") || "inperson");
    const date = String(formData.get("date") || "");
    const time = String(formData.get("time") || "");
    const notes = String(formData.get("notes") || "") || null;

    const parsed = appointmentSchema.safeParse({ name, phone, email: email || "", serviceType: serviceType || "", method, date, time, notes: notes || "" });
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "داده‌های نامعتبر" }, { status: 400 });
    }

    // Handle file uploads
    const uploadedFiles: string[] = [];
    const files = formData.getAll("files") as File[];
    if (files.length > 0) {
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
      for (const file of files) {
        if (file.size === 0) continue;
        const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
        const filepath = path.join(uploadDir, filename);
        const buffer = Buffer.from(await file.arrayBuffer());
        fs.writeFileSync(filepath, buffer);
        uploadedFiles.push(`/uploads/${filename}`);
      }
    }

    const d = parsed.data;
    const appointment = await prisma.appointment.create({
      data: {
        name: d.name,
        phone: d.phone,
        email: d.email || null,
        serviceType: d.serviceType || null,
        method: d.method,
        date: d.date,
        time: d.time,
        notes: d.notes || null,
        files: uploadedFiles.length ? JSON.stringify(uploadedFiles) : null,
        status: "pending",
      },
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
