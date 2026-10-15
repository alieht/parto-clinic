import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
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
