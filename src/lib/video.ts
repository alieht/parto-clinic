import { createHmac, randomBytes, timingSafeEqual } from "crypto";

/**
 * Video visit security helpers.
 *
 * The Jitsi room name is derived from a random per-appointment code. The code
 * is never handed out on its own: every link carries a short HMAC tag that
 * binds the code to that specific appointment, so codes cannot be guessed or
 * reused across appointments. Access is additionally gated by the doctor
 * admitting the patient (see `admittedAt`).
 */

const SECRET = process.env.VIDEO_LINK_SECRET || process.env.JWT_SECRET || "insecure-dev-secret";

/** Minutes before the appointment time at which the link becomes usable. */
export const JOIN_WINDOW_BEFORE_MIN = 15;
/** Minutes after the appointment time at which the link stops working. */
export const JOIN_WINDOW_AFTER_MIN = 60;

export function newRoomCode(): string {
  return randomBytes(6).toString("hex"); // 12 chars
}

/**
 * Short tamper-proof tag binding a room code to an appointment.
 * 16 hex chars (64 bits) — long enough to resist guessing, short enough to fit
 * inside the SMS template's 40-character parameter limit.
 */
export function signRoomCode(appointmentId: string, roomCode: string): string {
  return createHmac("sha256", SECRET)
    .update(`${appointmentId}:${roomCode}`)
    .digest("hex")
    .slice(0, 16);
}

export function verifyRoomTag(appointmentId: string, roomCode: string, tag: string): boolean {
  const expected = signRoomCode(appointmentId, roomCode);
  const a = Buffer.from(expected);
  const b = Buffer.from(String(tag || ""));
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function jitsiRoomUrl(roomCode: string): string {
  const base = process.env.JITSI_BASE_URL || "https://meet.jit.si";
  return `${base}/parto-clinic-${roomCode}`;
}

/** Public entry point that patients and the doctor open (served by our domain). */
export function joinPath(roomCode: string, tag: string): string {
  return `/v?c=${roomCode}&t=${tag}`;
}

/** Clinic wall-clock (Tehran) appointment -> UTC instant. Iran has no DST. */
export function appointmentToUtc(date: string, time: string): Date | null {
  const d = String(date).split("-").map(Number);
  const t = String(time)
    .replace(/[۰-۹]/g, (ch) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(ch)))
    .split(":")
    .map(Number);
  if (d.length !== 3 || t.length < 2 || [...d, ...t].some((n) => Number.isNaN(n))) return null;
  const offset = Number(process.env.CLINIC_TZ_OFFSET_MINUTES || 210);
  return new Date(Date.UTC(d[0], d[1] - 1, d[2], t[0], t[1], 0, 0) - offset * 60 * 1000);
}

/** True when `now` is inside the allowed join window for this appointment. */
export function withinJoinWindow(date: string, time: string, now = new Date()): boolean {
  const at = appointmentToUtc(date, time);
  if (!at) return false;
  const start = at.getTime() - JOIN_WINDOW_BEFORE_MIN * 60 * 1000;
  const end = at.getTime() + JOIN_WINDOW_AFTER_MIN * 60 * 1000;
  return now.getTime() >= start && now.getTime() <= end;
}
