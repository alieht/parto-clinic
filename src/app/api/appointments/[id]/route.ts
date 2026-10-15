import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(req, ["admin", "secretary"]);
  if (auth instanceof NextResponse) return auth;
  const { id } = await params;
  const appointment = await prisma.appointment.findUnique({ where: { id }, include: { service: true } });
  if (!appointment) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(appointment);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(req, ["admin", "secretary"]);
  if (auth instanceof NextResponse) return auth;
  const { id } = await params;
  const body = await req.json();
  const appointment = await prisma.appointment.update({
    where: { id },
    data: body,
  });
  return NextResponse.json(appointment);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(req, ["admin", "secretary"]);
  if (auth instanceof NextResponse) return auth;
  const { id } = await params;
  await prisma.appointment.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
