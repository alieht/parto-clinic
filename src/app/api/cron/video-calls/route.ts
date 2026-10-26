import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendDoctorVideoLink, sendPatientVideoLink } from "@/lib/sms";
import { randomBytes } from "crypto";

export const dynamic = "force-dynamic";

const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

function toEnglishDigits(s: string) {
  return s.replace(/[۰-۹]/g, (d) => String(PERSIAN_DIGITS.indexOf(d)));
}

/** Minimum minutes before the appointment at which the Jitsi link is sent. */
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

  const appointments = await prisma.appointment.findMany({
    where: {
      method: "video",
      status: { in: ["pending", "confirmed"] },
      videoLinkSentAt: null,
    },
  });

  const notified: string[] = [];
  const skipped: string[] = [];

  for (const appt of appointments) {
    const parts = appt.date.split("-").map(Number);
    const timeParts = toEnglishDigits(appt.time).split(":").map(Number);
    if (parts.length !== 3 || timeParts.length < 2 || parts.some(isNaN) || timeParts.some(isNaN)) {
      skipped.push(appt.id);
      continue;
    }

    // date is stored as a Gregorian ISO yyyy-mm-dd with the wall-clock time
    const apptAt = new Date(
      parts[0], parts[1] - 1, parts[2],
      timeParts[0], timeParts[1], 0, 0
    );
    const minutesUntil = (apptAt.getTime() - now.getTime()) / 60000;

    // Send when we're inside the lead window and the appointment hasn't passed
    if (minutesUntil > LEAD_MINUTES || minutesUntil < 0) continue;

    const roomCode = appt.videoRoomCode || randomBytes(6).toString("hex");
    const doctorPhone = process.env.DOCTOR_PHONE;
    const timeLabel = toEnglishDigits(appt.time);

    const results = await Promise.allSettled([
      doctorPhone
        ? sendDoctorVideoLink(doctorPhone, appt.name, timeLabel, roomCode)
        : Promise.resolve(null),
      sendPatientVideoLink(appt.phone, appt.name, timeLabel, roomCode),
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
}
