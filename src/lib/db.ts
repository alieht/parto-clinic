import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

/**
 * Netlify/AWS Lambda cannot resolve IPv6-only hostnames.
 * Supabase's direct host (db.<ref>.supabase.co) is IPv6-only in some regions,
 * so we transparently rewrite it to the IPv4-capable session-mode pooler.
 */
export function normalizeDatabaseUrl(url: string): string {
  // Direct: postgresql://postgres:PASS@db.REF.supabase.co:5432/postgres?...
  const directMatch = url.match(/^postgresql:\/\/postgres:([^@]+)@db\.([a-z0-9]+)\.supabase\.co(:\d+)?\/(.+)$/);
  if (directMatch) {
    const [, password, ref, , rest] = directMatch;
    const port = directMatch[3] || ":5432";
    return `postgresql://postgres.${ref}:${password}@aws-0-eu-central-1.pooler.supabase.com${port}/postgres?${rest.includes("?") ? rest.split("?")[1] : "schema=public"}`;
  }
  return url;
}

function createPrismaClient() {
  const raw = process.env.DATABASE_URL;
  if (!raw) {
    throw new Error("DATABASE_URL is not set");
  }
  const connectionString = normalizeDatabaseUrl(raw);
  const pool = new Pool({ connectionString, connectionTimeoutMillis: 15000, ssl: { rejectUnauthorized: false } });
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
