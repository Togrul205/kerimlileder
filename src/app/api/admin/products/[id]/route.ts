import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

function toCents(value: unknown) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.round(n * 100);
}

export async function PUT(req: Request, ctx: Ctx) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  const body = await req.json();

  await prisma.product.update({
    where: { id },
    data: {
      slug: body.slug,
      nameAz: body.nameAz,
      nameDe: body.nameDe,
      descriptionAz: body.descriptionAz ?? "",
      descriptionDe: body.descriptionDe ?? "",
      featured: Boolean(body.featured),
      categoryId: body.categoryId,
    },
  });

  if (body.imageUrl) {
    const existing = await prisma.productImage.findFirst({
      where: { productId: id },
      orderBy: { sortOrder: "asc" },
    });
    if (existing) {
      await prisma.productImage.update({ where: { id: existing.id }, data: { url: body.imageUrl } });
    } else {
      await prisma.productImage.create({
        data: { productId: id, url: body.imageUrl, altAz: body.nameAz, altDe: body.nameDe },
      });
    }
  }

  if (Array.isArray(body.variants)) {
    const incomingIds = body.variants.map((v: { id?: string }) => v.id).filter(Boolean) as string[];
    await prisma.productVariant.deleteMany({
      where: {
        productId: id,
        id: { notIn: incomingIds.length ? incomingIds : ["_"] },
        orderItems: { none: {} },
      },
    });
    for (const v of body.variants) {
      const data = {
        nameAz: String(v.nameAz || "Standart"),
        nameDe: String(v.nameDe || "Standard"),
        color: v.color ? String(v.color) : null,
        price: toCents(v.priceEur),
        stock: Number(v.stock) || 0,
        sku: v.sku ? String(v.sku) : null,
      };
      if (v.id) {
        await prisma.productVariant.update({ where: { id: v.id }, data });
      } else {
        await prisma.productVariant.create({ data: { ...data, productId: id } });
      }
    }
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, ctx: Ctx) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  const used = await prisma.orderItem.count({ where: { variant: { productId: id } } });
  if (used > 0) {
    return NextResponse.json({ error: "product_has_orders" }, { status: 400 });
  }
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
