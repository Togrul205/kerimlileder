import { getTranslations, setRequestLocale } from "next-intl/server";
import { ProductForm } from "@/components/admin/ProductForm";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

type Props = { params: Promise<{ locale: string }> };

export default async function NewProductPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  await requireAdmin(locale);
  const t = await getTranslations("admin");
  const categories = await prisma.category.findMany();

  return (
    <div>
      <h1 className="font-serif text-4xl">{t("newProduct")}</h1>
      <ProductForm
        locale={locale}
        categories={categories}
        initial={{
          slug: "",
          nameAz: "",
          nameDe: "",
          descriptionAz: "",
          descriptionDe: "",
          featured: false,
          categoryId: categories[0]?.id ?? "",
          imageUrl: "",
          variants: [{ nameAz: "Standart", nameDe: "Standard", color: "", priceEur: "49.00", stock: "5", sku: "" }],
        }}
      />
    </div>
  );
}
