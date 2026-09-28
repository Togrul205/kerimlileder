import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, ctx: Ctx) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  const body = await req.json();
  const allowed = ["pending", "paid", "processing", "shipped", "cancelled"];
  const data: Record<string, string> = {};
  if (body.status && allowed.includes(body.status)) data.status = body.status;
  if (body.notes !== undefined) data.notes = String(body.notes);
  if (body.name) data.name = body.name;
  if (body.phone) data.phone = body.phone;
  if (body.address) data.address = body.address;
  if (body.city) data.city = body.city;
  if (body.postalCode) data.postalCode = body.postalCode;
  if (body.country) data.country = body.country;
  await prisma.order.update({ where: { id }, data });
  return NextResponse.json({ ok: true });
}
