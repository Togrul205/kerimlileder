import { getTranslations, setRequestLocale } from "next-intl/server";
import { CategoryManager } from "@/components/admin/CategoryManager";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

type Props = { params: Promise<{ locale: string }> };

export default async function AdminCategoriesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  await requireAdmin(locale);
  const t = await getTranslations("admin");
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { nameDe: "asc" },
  });

  return (
    <div className="max-w-2xl">
      <h1 className="font-serif text-4xl">{t("categories")}</h1>
      <CategoryManager categories={categories} />
    </div>
  );
}
