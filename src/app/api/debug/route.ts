import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import { normalizeDatabaseUrl } from "@/lib/db";

export async function GET(req: NextRequest) {
  const token = req.headers.get("x-setup-token") || new URL(req.url).searchParams.get("token");
  const expected = process.env.SETUP_TOKEN;
  if (!expected || token !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUrl = process.env.DATABASE_URL;
  const masked = dbUrl ? dbUrl.replace(/:([^:@]+)@/, ":***@") : "NOT SET";

  try {
    const pool = new Pool({ connectionString: normalizeDatabaseUrl(dbUrl || ""), connectionTimeoutMillis: 10000 });
    const res = await pool.query("SELECT 1 as ok");
    await pool.end();
    return NextResponse.json({ status: "connected", dbUrl: masked, result: res.rows });
  } catch (err: any) {
    return NextResponse.json({
      status: "error",
      dbUrl: masked,
      error: err?.message || String(err),
      code: err?.code,
    }, { status: 500 });
  }
}
