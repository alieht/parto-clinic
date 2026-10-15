import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: string;
};

export function getUserFromRequest(req: NextRequest): AuthUser | null {
  const token = req.cookies.get("token")?.value;
  if (!token || !JWT_SECRET) return null;
  try {
    return jwt.verify(token, JWT_SECRET) as AuthUser;
  } catch {
    return null;
  }
}

/**
 * Verifies the request has a valid session and (optionally) one of the allowed roles.
 * Returns the user on success, or a NextResponse (401/403) to return directly.
 */
export function requireAuth(
  req: NextRequest,
  allowedRoles?: string[]
): AuthUser | NextResponse {
  const user = getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return user;
}

export function isAdmin(user: AuthUser | null): boolean {
  return !!user && user.role === "admin";
}
