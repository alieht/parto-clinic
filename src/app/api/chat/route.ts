import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("sessionId");
  if (!sessionId) return NextResponse.json([]);
  const messages = await prisma.chatMessage.findMany({
    where: { sessionId },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(messages);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const msg = await prisma.chatMessage.create({
    data: {
      sessionId: body.sessionId,
      sender: body.sender || "user",
      text: body.text,
    },
  });
  // Auto-reply bot
  if (body.sender === "user") {
    const reply = generateBotReply(body.text);
    await prisma.chatMessage.create({
      data: { sessionId: body.sessionId, sender: "bot", text: reply },
    });
  }
  return NextResponse.json(msg, { status: 201 });
}

function generateBotReply(text: string): string {
  const t = text.toLowerCase();
  if (t.includes("نوبت") || t.includes("رزرو")) {
    return "برای رزرو نوبت می‌توانید از صفحه «رزرو نوبت» اقدام کنید یا با شماره ۰۹۹۹۱۵۶۱۶۸۸ تماس بگیرید. 😊";
  }
  if (t.includes("آدرس") || t.includes("کجا")) {
    return "آدرس کلینیک: بهبهان، خیابان پیروز، کوچه بهادری، بعد از سونوگرافی دکتر امینی. 📍";
  }
  if (t.includes("ساعت") || t.includes("کاری")) {
    return "ساعات کاری: شنبه تا پنجشنبه صبح و عصر. جمعه تعطیل است. 🕐";
  }
  if (t.includes("قیمت") || t.includes("هزینه") || t.includes("تعرفه")) {
    return "هزینه ویزیت بسته به نوع خدمت متفاوت است. برای اطلاع دقیق با کلینیک تماس بگیرید. 💳";
  }
  if (t.includes("خدمات") || t.includes("درمان")) {
    return "خدمات ما شامل: درمان کمردرد و گردن‌درد، آسیب‌های ورزشی، زانو، کف لگن، توانبخشی نورولوژیک و پس از جراحی، و درمان دردهای مزمن. 🏥";
  }
  return "سلام! چطور می‌توانم کمکتان کنم؟ می‌توانید درباره نوبت، آدرس، ساعات کاری یا خدمات سؤال کنید. 😊";
}
