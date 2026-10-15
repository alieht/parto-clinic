import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const auth = requireAuth(req, ["admin"]);
  if (auth instanceof NextResponse) return auth;
  const [appointments, articles, reviews, messages, pendingAppts] = await Promise.all([
    prisma.appointment.count(),
    prisma.article.count(),
    prisma.review.count(),
    prisma.contactMessage.count(),
    prisma.appointment.count({ where: { status: "pending" } }),
  ]);
  const recentAppointments = await prisma.appointment.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });
  return NextResponse.json({
    appointments,
    articles,
    reviews,
    messages,
    pendingAppts,
    recentAppointments,
  });
}
