import { timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { adminCookieName, signAdminToken } from "@/lib/auth";

function safeEqual(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && a.length > 0 && timingSafeEqual(a, b);
}

export async function POST(req: Request) {
  const body = await req.json();
  const username = String(body.username || "").trim();
  const password = String(body.password || "");
  const expectedUser = process.env.ADMIN_USERNAME || "admin";
  const expectedPass = process.env.ADMIN_PASSWORD || "";
  const ok = safeEqual(username, expectedUser) && safeEqual(password, expectedPass);

  if (!ok) {
    return NextResponse.json({ error: "invalid" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(adminCookieName(), signAdminToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
