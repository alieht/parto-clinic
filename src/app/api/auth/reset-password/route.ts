import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rl = rateLimit(`reset:${ip}`, 10, 15 * 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json({ error: "تعداد تلاش‌ها بیش از حد مجاز." }, { status: 429 });
  }

  const { email, code, password } = await req.json().catch(() => ({}));
  if (!email || !code || !password) {
    return NextResponse.json({ error: "همه فیلدها الزامی هستند" }, { status: 400 });
  }
  if (String(password).length < 8) {
    return NextResponse.json({ error: "رمز عبور باید حداقل ۸ کاراکتر باشد" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.resetCodeHash || !user.resetCodeExpiry) {
    return NextResponse.json({ error: "کد بازیابی نامعتبر است" }, { status: 400 });
  }
  if (user.resetCodeExpiry.getTime() < Date.now()) {
    return NextResponse.json({ error: "کد بازیابی منقضی شده است" }, { status: 400 });
  }
  const valid = await bcrypt.compare(String(code), user.resetCodeHash);
  if (!valid) {
    return NextResponse.json({ error: "کد بازیابی نامعتبر است" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: await bcrypt.hash(String(password), 10),
      resetCodeHash: null,
      resetCodeExpiry: null,
    },
  });

  return NextResponse.json({ success: true, message: "رمز عبور با موفقیت تغییر کرد." });
}
