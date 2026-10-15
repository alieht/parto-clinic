import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const payment = await prisma.payment.create({
    data: {
      appointmentId: body.appointmentId || null,
      amount: body.amount || 0,
      method: body.method || "online",
      status: "pending",
      gateway: body.gateway || "demo",
    },
  });
  // Demo: mark as success after creation
  await prisma.payment.update({
    where: { id: payment.id },
    data: { status: "success", transactionId: `DEMO-${Date.now()}` },
  });
  if (body.appointmentId) {
    await prisma.appointment.update({
      where: { id: body.appointmentId },
      data: { paymentStatus: "paid" },
    });
  }
  return NextResponse.json({ ...payment, status: "success" });
}
