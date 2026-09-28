import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: Ctx) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  const body = await req.json();
  const data: { price?: number; stock?: number } = {};
  if (body.priceEur !== undefined) data.price = Math.round(Number(body.priceEur) * 100);
  if (body.stock !== undefined) data.stock = Number(body.stock);
  await prisma.productVariant.update({ where: { id }, data });
  return NextResponse.json({ ok: true });
}
