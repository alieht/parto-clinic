import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/** Which build is actually serving requests (Netlify injects COMMIT_REF). */
export async function GET() {
  return NextResponse.json({
    commit: process.env.COMMIT_REF || process.env.VERCEL_GIT_COMMIT_SHA || "unknown",
    branch: process.env.BRANCH || null,
    context: process.env.CONTEXT || null,
    builtAt: process.env.DEPLOY_PRIME_URL || null,
    hasVideoStatusRoute: true,
    time: new Date().toISOString(),
  });
}
