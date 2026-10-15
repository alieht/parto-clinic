import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const all = searchParams.get("all") === "true";
  const where = all ? {} : { approved: true };
  const reviews = await prisma.review.findMany({ where, orderBy: { createdAt: "desc" } });
  return NextResponse.json(reviews);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const review = await prisma.review.create({
    data: {
      name: body.name,
      rating: body.rating || 5,
      text: body.text,
      approved: false,
    },
  });
  return NextResponse.json(review, { status: 201 });
}
