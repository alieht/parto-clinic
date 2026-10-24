import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

/**
 * Netlify/AWS Lambda cannot resolve IPv6-only hostnames.
 * Supabase's direct host (db.<ref>.supabase.co) is IPv6-only in some regions,
 * so we transparently rewrite it to the IPv4-capable pooler.
 *
 * For app queries we use transaction mode (port 6543) with pgbouncer=true
 * to avoid exhausting the session-mode pool in serverless.
 */
export function normalizeDatabaseUrl(url: string, transactionMode = true): string {
  // Direct: postgresql://postgres:PASS@db.REF.supabase.co:5432/postgres?...
  const directMatch = url.match(/^postgresql:\/\/postgres:([^@]+)@db\.([a-z0-9]+)\.supabase\.co(:\d+)?\/(.+)$/);
  if (directMatch) {
    const [, password, ref] = directMatch;
    const port = transactionMode ? "6543" : "5432";
    const params = transactionMode ? "schema=public&pgbouncer=true" : "schema=public";
    return `postgresql://postgres.${ref}:${password}@aws-1-eu-central-1.pooler.supabase.com:${port}/postgres?${params}`;
  }
  // Already a pooler URL — adjust port/mode if needed
  if (url.includes("pooler.supabase.com")) {
    if (transactionMode && url.includes(":5432/")) {
      url = url.replace(":5432/", ":6543/");
    }
    if (transactionMode && !url.includes("pgbouncer=true")) {
      url += (url.includes("?") ? "&" : "?") + "pgbouncer=true";
    }
    return url;
  }
  return url;
}

function createPrismaClient() {
  const raw = process.env.DATABASE_URL;
  if (!raw) {
    throw new Error("DATABASE_URL is not set");
  }
  const connectionString = normalizeDatabaseUrl(raw, true);
  const pool = new Pool({ connectionString, connectionTimeoutMillis: 15000, ssl: { rejectUnauthorized: false }, max: 1 });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

// Lazy proxy: importing this module never throws; the client is created on first use.
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = createPrismaClient();
    }
    const client = globalForPrisma.prisma as any;
    const value = client[prop];
    return typeof value === "function" ? value.bind(client) : value;
  },
});
