import { NextRequest, NextResponse } from "next/server";
import { randomInt } from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { sendPasswordRecovery } from "@/lib/sms";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rl = rateLimit(`forgot:${ip}`, 5, 15 * 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "تعداد درخواست‌ها بیش از حد مجاز. لطفاً بعداً تلاش کنید." },
      { status: 429 }
    );
  }

  const { email } = await req.json().catch(() => ({}));
  if (!email) {
    return NextResponse.json({ error: "ایمیل الزامی است" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  // Always return success to avoid leaking which emails exist
  const genericOk = NextResponse.json({
    success: true,
    message: "اگر این ایمیل در سیستم ثبت شده باشد، کد بازیابی ارسال می‌شود.",
  });

  if (!user || !user.phone) return genericOk;

  const code = String(randomInt(100000, 1000000));
  const resetCodeHash = await bcrypt.hash(code, 10);
  const resetCodeExpiry = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.user.update({
    where: { id: user.id },
    data: { resetCodeHash, resetCodeExpiry },
  });

  const result = await sendPasswordRecovery(user.phone, code);
  if (!result.success) {
    console.error("Password recovery SMS failed:", result.error);
  }

  return genericOk;
}
