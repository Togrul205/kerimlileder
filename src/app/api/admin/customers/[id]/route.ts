import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, ctx: Ctx) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  const body = await req.json();
  await prisma.customer.update({
    where: { id },
    data: {
      name: body.name,
      phone: body.phone,
      address: body.address,
      city: body.city,
      postalCode: body.postalCode,
      country: body.country,
      notes: body.notes ?? "",
    },
  });
  return NextResponse.json({ ok: true });
}
