import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { ProductForm } from "@/components/admin/ProductForm";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

type Props = { params: Promise<{ locale: string; id: string }> };

export default async function EditProductPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  await requireAdmin(locale);
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { images: true, variants: true },
    }),
    prisma.category.findMany(),
  ]);
  if (!product) notFound();

  return (
    <div>
      <h1 className="font-serif text-4xl">{product.nameDe}</h1>
      <ProductForm
        locale={locale}
        categories={categories}
        initial={{
          id: product.id,
          slug: product.slug,
          nameAz: product.nameAz,
          nameDe: product.nameDe,
          descriptionAz: product.descriptionAz,
          descriptionDe: product.descriptionDe,
          featured: product.featured,
          categoryId: product.categoryId,
          imageUrl: product.images[0]?.url ?? "",
          variants: product.variants.map((v) => ({
            id: v.id,
            nameAz: v.nameAz,
            nameDe: v.nameDe,
            color: v.color ?? "",
            priceEur: (v.price / 100).toFixed(2),
            stock: String(v.stock),
            sku: v.sku ?? "",
          })),
        }}
      />
    </div>
  );
}
