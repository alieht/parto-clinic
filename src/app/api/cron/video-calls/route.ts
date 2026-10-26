import { NextRequest, NextResponse } from "next/server";
import { runVideoCallReminders, needsSchemaSetup } from "@/lib/video-reminders";

export const dynamic = "force-dynamic";

/**
 * Cron endpoint: SMSes the Jitsi room link to the doctor and patient shortly
 * before a confirmed video appointment. Idempotent (videoLinkSentAt).
 *
 * Used by external schedulers (GitHub Actions, Liara cron, Pars Pack) and
 * handy for manual testing. Protected by CRON_SECRET.
 *
 * On hosts that run a long-lived server, INPROCESS_CRON=1 makes the app run
 * this on its own, so no external scheduler is needed.
 */
export async function GET(req: NextRequest) {
  const secret = req.headers.get("x-cron-secret") || req.nextUrl.searchParams.get("secret");
  const expected = process.env.CRON_SECRET;
  if (!expected || secret !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runVideoCallReminders();
    return NextResponse.json(result);
  } catch (err: any) {
    const message = err?.message || String(err);
    console.error("video-calls cron failed:", message);
    return NextResponse.json(
      {
        error: message,
        hint: needsSchemaSetup(message)
          ? "ستون‌های دیتابیس ساخته نشده‌اند. یک‌بار /api/setup?token=<SETUP_TOKEN> را اجرا کنید."
          : undefined,
      },
      { status: 500 }
    );
  }
}
