import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function toCents(value: unknown) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.round(n * 100);
}

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const products = await prisma.product.findMany({
    include: { variants: true, images: true, category: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await req.json();
  const variants = Array.isArray(body.variants) && body.variants.length > 0
    ? body.variants
    : [{ nameAz: "Standart", nameDe: "Standard", priceEur: body.priceEur ?? 0, stock: body.stock ?? 0 }];

  const product = await prisma.product.create({
    data: {
      slug: body.slug,
      nameAz: body.nameAz,
      nameDe: body.nameDe,
      descriptionAz: body.descriptionAz ?? "",
      descriptionDe: body.descriptionDe ?? "",
      featured: Boolean(body.featured),
      categoryId: body.categoryId,
      images: body.imageUrl
        ? { create: { url: body.imageUrl, altAz: body.nameAz, altDe: body.nameDe } }
        : undefined,
      variants: {
        create: variants.map((v: Record<string, unknown>) => ({
          nameAz: String(v.nameAz || "Standart"),
          nameDe: String(v.nameDe || "Standard"),
          color: v.color ? String(v.color) : null,
          price: toCents(v.priceEur),
          stock: Number(v.stock) || 0,
          sku: v.sku ? String(v.sku) : null,
        })),
      },
    },
  });
  return NextResponse.json(product);
}
