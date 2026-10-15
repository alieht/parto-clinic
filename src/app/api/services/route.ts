import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const all = searchParams.get("all") === "true";
  const where = all ? {} : { active: true };
  const services = await prisma.service.findMany({
    where,
    orderBy: { order: "asc" },
  });
  return NextResponse.json(services);
}

export async function POST(req: NextRequest) {
  const auth = requireAuth(req, ["admin"]);
  if (auth instanceof NextResponse) return auth;
  try {
    const body = await req.json();
    const service = await prisma.service.create({
      data: {
        slug: body.slug,
        title: body.title,
        titleEn: body.titleEn || null,
        description: body.description,
        icon: body.icon || null,
        image: body.image || null,
        category: body.category || null,
        order: body.order ?? 0,
        active: body.active ?? true,
      },
    });
    return NextResponse.json(service, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
