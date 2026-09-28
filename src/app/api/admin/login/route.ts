import { timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { adminCookieName, signAdminToken } from "@/lib/auth";

export async function POST(req: Request) {
  const { password } = await req.json();
  const expected = process.env.ADMIN_PASSWORD || "";
  const a = Buffer.from(String(password || ""));
  const b = Buffer.from(expected);
  const ok =
    expected.length > 0 &&
    a.length === b.length &&
    timingSafeEqual(a, b);

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
