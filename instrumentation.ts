/**
 * Runs once when the Next.js server boots.
 *
 * On hosts that keep a long-lived Node process (Pars Pack, Liara, Docker, VPS)
 * there is no need for an external cron service: setting INPROCESS_CRON=1 runs
 * the video-reminder job in-process every minute.
 *
 * Serverless platforms (Netlify) must leave this unset — the process is
 * short-lived there, so use the scheduled function / GitHub Actions instead.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  if (process.env.INPROCESS_CRON !== "1") return;

  // Guard against double registration (dev HMR, multiple imports)
  const g = globalThis as unknown as { __partoCronStarted?: boolean };
  if (g.__partoCronStarted) return;
  g.__partoCronStarted = true;

  const intervalMs = Number(process.env.INPROCESS_CRON_INTERVAL_MS || 60_000);

  console.log(`[cron] in-process video reminders enabled (every ${intervalMs / 1000}s)`);

  const tick = async () => {
    try {
      const { runVideoCallReminders } = await import("@/lib/video-reminders");
      const result = await runVideoCallReminders();
      if (result.notified > 0) {
        console.log(`[cron] sent ${result.notified} video link(s): ${result.ids.join(", ")}`);
      }
    } catch (err: any) {
      // Never let a failed tick crash the server
      console.error("[cron] video reminders failed:", err?.message || err);
    }
  };

  // First run shortly after boot, then on a fixed interval
  setTimeout(tick, 10_000);
  setInterval(tick, intervalMs);
}
