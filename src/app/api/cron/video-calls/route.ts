import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendDoctorVideoLink, sendPatientVideoLink } from "@/lib/sms";
import { newRoomCode, signRoomCode, appointmentToUtc } from "@/lib/video";

export const dynamic = "force-dynamic";

const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

function toEnglishDigits(s: string) {
  return s.replace(/[۰-۹]/g, (d) => String(PERSIAN_DIGITS.indexOf(d)));
}

/** Send the room link this many minutes before the appointment. */
const LEAD_MINUTES = 5;

/**
 * Cron endpoint: finds video appointments starting in ~5 minutes and SMSes the
 * Jitsi room link to both the doctor and the patient. Idempotent — an
 * appointment is only notified once (tracked by videoLinkSentAt).
 *
 * Protected by CRON_SECRET.
 */
export async function GET(req: NextRequest) {
  const secret = req.headers.get("x-cron-secret") || req.nextUrl.searchParams.get("secret");
  const expected = process.env.CRON_SECRET;
  if (!expected || secret !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();

  try {
  const appointments = await prisma.appointment.findMany({
    where: {
      method: "video",
      status: "confirmed",
      videoLinkSentAt: null,
    },
  });

  const notified: string[] = [];
  const skipped: string[] = [];

  for (const appt of appointments) {
    const apptAt = appointmentToUtc(appt.date, appt.time);
    if (!apptAt) {
      skipped.push(appt.id);
      continue;
    }
    const minutesUntil = (apptAt.getTime() - now.getTime()) / 60000;

    // Send when we're inside the lead window and the appointment hasn't passed
    if (minutesUntil > LEAD_MINUTES || minutesUntil < 0) continue;

    const roomCode = appt.videoRoomCode || newRoomCode();
    const doctorPhone = process.env.DOCTOR_PHONE;
    const timeLabel = toEnglishDigits(appt.time);
    // SMS carries the code plus its HMAC tag: "<code>&t=<tag>"
    const smsCode = `${roomCode}&t=${signRoomCode(appt.id, roomCode)}`;

    const results = await Promise.allSettled([
      doctorPhone
        ? sendDoctorVideoLink(doctorPhone, appt.name, timeLabel, smsCode)
        : Promise.resolve(null),
      sendPatientVideoLink(appt.phone, appt.name, timeLabel, smsCode),
    ]);

    const anySent = results.some(
      (r) => r.status === "fulfilled" && r.value && (r.value as { success?: boolean }).success
    );

    await prisma.appointment.update({
      where: { id: appt.id },
      data: {
        videoRoomCode: roomCode,
        ...(anySent ? { videoLinkSentAt: now } : {}),
      },
    });

    if (anySent) notified.push(appt.id);
    else skipped.push(appt.id);
  }

  return NextResponse.json({
    checked: appointments.length,
    notified: notified.length,
    skipped: skipped.length,
    ids: notified,
    at: now.toISOString(),
  });
  } catch (err: any) {
    const message = err?.message || String(err);
    console.error("video-calls cron failed:", message);
    const needsSetup = /videoLinkSentAt|videoRoomCode|does not exist|Unknown (argument|field)/i.test(message);
    return NextResponse.json(
      {
        error: message,
        hint: needsSetup
          ? "ستون‌های دیتابیس ساخته نشده‌اند. یک‌بار /api/setup?token=<SETUP_TOKEN> را اجرا کنید."
          : undefined,
      },
      { status: 500 }
    );
  }
}
