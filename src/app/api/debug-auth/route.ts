import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (token !== process.env.SETUP_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const users = await prisma.user.findMany({ select: { id: true, email: true, role: true, name: true } });
    // Test password comparison
    const admin = await prisma.user.findUnique({ where: { email: "admin@parto.online" } });
    let passwordTest = null;
    if (admin) {
      passwordTest = await bcrypt.compare("admin123", admin.password);
    }
    return NextResponse.json({ users, count: users.length, passwordTest, adminEmail: admin?.email });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}
