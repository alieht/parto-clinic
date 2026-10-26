import { prisma } from "@/lib/db";
import { sendDoctorVideoLink, sendPatientVideoLink } from "@/lib/sms";
import { newRoomCode, signRoomCode, appointmentToUtc } from "@/lib/video";

const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

function toEnglishDigits(s: string) {
  return s.replace(/[۰-۹]/g, (d) => String(PERSIAN_DIGITS.indexOf(d)));
}

/**
 * Send the room link this many minutes before the appointment.
 * Look this far ahead so a coarse scheduler still catches every appointment.
 * Sending a few minutes early is harmless — the join page stays locked until
 * JOIN_WINDOW_BEFORE_MIN on its own.
 */
export const LEAD_MINUTES = Number(process.env.VIDEO_LEAD_MINUTES || 15);

export type ReminderResult = {
  checked: number;
  notified: number;
  skipped: number;
  ids: string[];
  at: string;
};

/**
 * Finds confirmed video appointments starting within the lead window and SMSes
 * the signed room link to both the doctor and the patient.
 *
 * Idempotent: an appointment is only notified once (tracked by videoLinkSentAt),
 * so it is safe to call this every minute or from several places at once.
 */
export async function runVideoCallReminders(now = new Date()): Promise<ReminderResult> {
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

    // Inside the lead window, and the appointment hasn't passed
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

  return {
    checked: appointments.length,
    notified: notified.length,
    skipped: skipped.length,
    ids: notified,
    at: now.toISOString(),
  };
}

export function needsSchemaSetup(message: string): boolean {
  return /videoLinkSentAt|videoRoomCode|does not exist|Unknown (argument|field)/i.test(message);
}
