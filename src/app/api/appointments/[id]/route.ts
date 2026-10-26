import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { sendDoctorVideoLink, sendPatientVideoLink } from "@/lib/sms";

const ALLOWED_FIELDS = [
  "name",
  "phone",
  "email",
  "serviceType",
  "method",
  "date",
  "time",
  "notes",
  "status",
  "paymentStatus",
  "paymentId",
] as const;

const ALLOWED_STATUS = ["pending", "confirmed", "completed", "cancelled"];
const ALLOWED_PAYMENT = ["unpaid", "paid", "refunded"];

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(req, ["admin", "secretary"]);
  if (auth instanceof NextResponse) return auth;
  const { id } = await params;
  const appointment = await prisma.appointment.findUnique({ where: { id }, include: { service: true } });
  if (!appointment) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(appointment);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(req, ["admin", "secretary"]);
  if (auth instanceof NextResponse) return auth;
  const { id } = await params;
  const body = await req.json();

  const existing = await prisma.appointment.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Manual action: (re)send the Jitsi room link to doctor + patient
  if (body.action === "send_video_link") {
    if (existing.method !== "video") {
      return NextResponse.json({ error: "این نوبت ویزیت تصویری نیست" }, { status: 400 });
    }
    const roomCode = existing.videoRoomCode || randomBytes(6).toString("hex");
    const doctorPhone = process.env.DOCTOR_PHONE;
    const timeLabel = existing.time;

    const results = await Promise.allSettled([
      doctorPhone
        ? sendDoctorVideoLink(doctorPhone, existing.name, timeLabel, roomCode)
        : Promise.resolve(null),
      sendPatientVideoLink(existing.phone, existing.name, timeLabel, roomCode),
    ]);

    const delivered = results.map((r) =>
      r.status === "fulfilled" && r.value
        ? r.value
        : { success: false, error: r.status === "rejected" ? String(r.reason) : "skipped" }
    );

    await prisma.appointment.update({
      where: { id },
      data: { videoRoomCode: roomCode, videoLinkSentAt: new Date() },
    });

    return NextResponse.json({
      success: true,
      roomCode,
      joinUrl: `/v?c=${roomCode}`,
      delivered,
    });
  }

  // Whitelist updatable fields to prevent mass assignment
  const data: Record<string, unknown> = {};
  for (const field of ALLOWED_FIELDS) {
    if (field in body) data[field] = body[field];
  }
  if (data.status && !ALLOWED_STATUS.includes(String(data.status))) {
    return NextResponse.json({ error: "وضعیت نامعتبر" }, { status: 400 });
  }
  if (data.paymentStatus && !ALLOWED_PAYMENT.includes(String(data.paymentStatus))) {
    return NextResponse.json({ error: "وضعیت پرداخت نامعتبر" }, { status: 400 });
  }
  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "چیزی برای بروزرسانی نیست" }, { status: 400 });
  }

  const appointment = await prisma.appointment.update({ where: { id }, data });
  return NextResponse.json(appointment);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(req, ["admin", "secretary"]);
  if (auth instanceof NextResponse) return auth;
  const { id } = await params;
  await prisma.appointment.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
