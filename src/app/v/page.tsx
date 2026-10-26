"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

function VideoCallInner() {
  const searchParams = useSearchParams();
  const code = searchParams.get("c");
  const [status, setStatus] = useState("در حال اتصال به تماس تصویری...");

  useEffect(() => {
    if (!code) {
      setStatus("کد ورود یافت نشد.");
      return;
    }
    const jitsiUrl = `https://meet.jit.si/parto-clinic-${code}`;
    setStatus("در حال انتقال به اتاق تماس تصویری...");
    window.location.href = jitsiUrl;
  }, [code]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-cyan-50">
      <div className="text-center p-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-bg flex items-center justify-center">
          <svg className="h-8 w-8 text-white animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-lg font-medium text-foreground">{status}</p>
        {code && (
          <p className="text-sm text-muted-foreground mt-2">
            در صورت عدم انتقال،{" "}
            <a href={`https://meet.jit.si/parto-clinic-${code}`} className="text-primary underline">
              اینجا کلیک کنید
            </a>
          </p>
        )}
      </div>
    </div>
  );
}

export default function VideoCallPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">در حال بارگذاری...</div>}>
      <VideoCallInner />
    </Suspense>
  );
}
