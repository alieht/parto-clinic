import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/db";
import { verifyRoomTag, withinJoinWindow, jitsiRoomUrl, JOIN_WINDOW_BEFORE_MIN } from "@/lib/video";
import { WaitingRoom } from "./waiting-room";

export const dynamic = "force-dynamic";

type Search = { c?: string; t?: string };

export default async function VideoVisitPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const { c: code, t: tag } = await searchParams;

  // Clinic staff may open the room directly (no SMS tag, no waiting room).
  const isStaff = await getStaffSession();

  if (isStaff && code) {
    const appt = await prisma.appointment.findFirst({
      where: { method: "video", videoRoomCode: code },
      select: { id: true, status: true },
    });
    if (!appt) {
      return <Status tone="error" title="اتاق یافت نشد" body="اتاق ویدیویی با این کد وجود ندارد." />;
    }
    return <StaffRoom jitsiUrl={jitsiRoomUrl(code)} />;
  }

  if (!code || !tag) {
    return <Status tone="error" title="لینک نامعتبر" body="این لینک ناقص است. لطفاً از لینکی که پیامک شده استفاده کنید." />;
  }

  // Look the room up across all video appointments and check the HMAC tag.
  const appointment = await prisma.appointment.findFirst({
    where: { method: "video", videoRoomCode: code },
  });

  if (!appointment || !verifyRoomTag(appointment.id, code, tag)) {
    return <Status tone="error" title="لینک نامعتبر" body="این لینک معتبر نیست یا منقضی شده است." />;
  }

  if (appointment.status === "cancelled") {
    return <Status tone="error" title="نوبت لغو شده" body="این نوبت لغو شده است. برای هماهنگی با کلینیک تماس بگیرید." />;
  }

  if (!withinJoinWindow(appointment.date, appointment.time)) {
    return (
      <Status
        tone="wait"
        title="هنوز زمان ورود نرسیده"
        body={`این اتاق ${JOIN_WINDOW_BEFORE_MIN} دقیقه قبل از زمان نوبت باز می‌شود. زمان نوبت شما: ${appointment.time}`}
      />
    );
  }

  return (
    <WaitingRoom
      code={code}
      tag={tag}
      name={appointment.name}
      time={appointment.time}
      initiallyAdmitted={Boolean(appointment.admittedAt)}
      jitsiUrl={jitsiRoomUrl(code)}
    />
  );
}

function Status({
  tone,
  title,
  body,
}: {
  tone: "error" | "wait";
  title: string;
  body: string;
}) {
  const color = tone === "error" ? "text-rose-600" : "text-amber-600";
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-cyan-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white/80 p-8 text-center shadow-xl backdrop-blur">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
          <svg className={`h-7 w-7 ${color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>
        <h1 className="mb-2 text-lg font-bold text-foreground">{title}</h1>
        <p className="text-sm leading-6 text-muted-foreground">{body}</p>
      </div>
    </div>
  );
}

async function getStaffSession(): Promise<boolean> {
  const store = await cookies();
  const token = store.get("token")?.value;
  const secret = process.env.JWT_SECRET;
  if (!token || !secret) return false;
  try {
    const payload = jwt.verify(token, secret) as { role?: string };
    return payload.role === "admin" || payload.role === "secretary";
  } catch {
    return false;
  }
}

function StaffRoom({ jitsiUrl }: { jitsiUrl: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-cyan-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white/80 p-8 text-center shadow-xl backdrop-blur">
        <h1 className="mb-2 text-lg font-bold text-foreground">ورود پزشک به اتاق ویزیت</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          شما به‌عنوان کادر کلینیک وارد می‌شوید. بیمار پس از «پذیرش» در پنل، به اتاق هدایت می‌شود.
        </p>
        <a href={jitsiUrl} className="inline-block rounded-xl gradient-bg px-6 py-3 text-sm font-bold text-white">
          ورود به اتاق
        </a>
      </div>
    </div>
  );
}
