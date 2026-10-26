import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyRoomTag, withinJoinWindow, jitsiRoomUrl } from "@/lib/video";

export const dynamic = "force-dynamic";

/**
 * Polled by the patient's waiting room. Returns whether the doctor has admitted
 * them yet. The Jitsi URL is only disclosed once admitted.
 */
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("c");
  const tag = req.nextUrl.searchParams.get("t");
  if (!code || !tag) {
    return NextResponse.json({ error: "لینک نامعتبر است" }, { status: 400 });
  }

  const appointment = await prisma.appointment.findFirst({
    where: { method: "video", videoRoomCode: code },
    select: { id: true, status: true, date: true, time: true, admittedAt: true },
  });

  if (!appointment || !verifyRoomTag(appointment.id, code, tag)) {
    return NextResponse.json({ error: "لینک نامعتبر است" }, { status: 404 });
  }
  if (appointment.status === "cancelled") {
    return NextResponse.json({ error: "این نوبت لغو شده است" }, { status: 410 });
  }
  if (!withinJoinWindow(appointment.date, appointment.time)) {
    return NextResponse.json(
      { admitted: false, error: "زمان ورود به اتاق فرا نرسیده است" },
      { status: 403 }
    );
  }

  const admitted = Boolean(appointment.admittedAt);
  return NextResponse.json({
    admitted,
    ...(admitted ? { joinUrl: jitsiRoomUrl(code) } : {}),
  });
}
