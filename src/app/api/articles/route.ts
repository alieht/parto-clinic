import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const all = searchParams.get("all") === "true";
  const where = all ? {} : { published: true };
  const articles = await prisma.article.findMany({
    where,
    orderBy: { publishedAt: "desc" },
  });
  return NextResponse.json(articles);
}

export async function POST(req: NextRequest) {
  const auth = requireAuth(req, ["admin"]);
  if (auth instanceof NextResponse) return auth;
  try {
    const body = await req.json();
    const article = await prisma.article.create({
      data: {
        slug: body.slug,
        title: body.title,
        excerpt: body.excerpt,
        content: body.content,
        category: body.category || null,
        image: body.image || null,
        author: body.author || "دکتر مهری شاکری‌نسب",
        published: body.published ?? true,
        publishedAt: body.publishedAt ? new Date(body.publishedAt) : new Date(),
      },
    });
    return NextResponse.json(article, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
