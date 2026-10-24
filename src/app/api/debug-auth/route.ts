import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (token !== process.env.SETUP_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const users = await prisma.user.findMany({ select: { id: true, email: true, role: true, name: true, password: true } });
    const admin = users.find(u => u.role === "admin");
    let passwordTest123 = null;
    let passwordTestYahoo = null;
    if (admin) {
      passwordTest123 = await bcrypt.compare("admin123", admin.password);
    }
    // Check env vars
    const envInfo = {
      ADMIN_EMAIL: process.env.ADMIN_EMAIL || "(not set, default admin@parto.online)",
      ADMIN_PASSWORD_SET: !!process.env.ADMIN_PASSWORD,
      SECRETARY_EMAIL: process.env.SECRETARY_EMAIL || "(not set, default secretary@parto.online)",
      SECRETARY_PASSWORD_SET: !!process.env.SECRETARY_PASSWORD,
      JWT_SECRET_SET: !!process.env.JWT_SECRET,
    };
    return NextResponse.json({ users: users.map(u => ({ id: u.id, email: u.email, role: u.role, name: u.name })), count: users.length, passwordTest123, envInfo });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}
