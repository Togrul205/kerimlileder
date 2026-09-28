import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await req.json();
  const slug = String(body.slug || body.nameDe || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const category = await prisma.category.create({
    data: {
      slug,
      nameAz: body.nameAz,
      nameDe: body.nameDe,
    },
  });
  return NextResponse.json(category);
}
