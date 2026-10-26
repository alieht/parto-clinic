"use client";
import { useEffect, useState } from "react";

const POLL_MS = 4000;

export function WaitingRoom({
  code,
  tag,
  name,
  time,
  initiallyAdmitted,
  jitsiUrl,
}: {
  code: string;
  tag: string;
  name: string;
  time: string;
  initiallyAdmitted: boolean;
  jitsiUrl: string;
}) {
  const [admitted, setAdmitted] = useState(initiallyAdmitted);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (admitted) {
      const t = setTimeout(() => {
        window.location.href = jitsiUrl;
      }, 1200);
      return () => clearTimeout(t);
    }

    let stopped = false;
    const poll = async () => {
      try {
        const res = await fetch(
          `/api/video/status?c=${encodeURIComponent(code)}&t=${encodeURIComponent(tag)}`,
          { cache: "no-store" }
        );
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setError(data.error || "خطا در ارتباط با سرور");
          return;
        }
        const data = await res.json();
        if (data.admitted) setAdmitted(true);
      } catch {
        // transient network error — keep polling
      }
    };

    poll();
    const id = setInterval(() => {
      if (!stopped) poll();
    }, POLL_MS);
    return () => {
      stopped = true;
      clearInterval(id);
    };
  }, [admitted, code, tag, jitsiUrl]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-cyan-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white/80 p-8 text-center shadow-xl backdrop-blur">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full gradient-bg">
          {admitted ? (
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <span className="relative flex h-4 w-4">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
              <span className="relative inline-flex h-4 w-4 rounded-full bg-white" />
            </span>
          )}
        </div>

        <h1 className="mb-2 text-xl font-bold text-foreground">
          {admitted ? "در حال ورود به اتاق ویزیت..." : "اتاق انتظار ویزیت تصویری"}
        </h1>
        <p className="mb-1 text-sm text-foreground">{name} عزیز، خوش آمدید.</p>
        <p className="mb-6 text-sm text-muted-foreground">زمان نوبت شما: {time}</p>

        {admitted ? (
          <a href={jitsiUrl} className="inline-block rounded-xl gradient-bg px-6 py-3 text-sm font-bold text-white">
            ورود به ویزیت
          </a>
        ) : (
          <div className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
            لطفاً منتظر بمانید. به‌محض پذیرش شما توسط پزشک، به‌طور خودکار وارد اتاق ویزیت می‌شوید.
          </div>
        )}

        {error && <p className="mt-4 text-xs text-rose-600">{error}</p>}

      </div>
    </div>
  );
}
