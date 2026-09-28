import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { VariantQuickEdit } from "@/components/admin/VariantQuickEdit";
import { formatEur } from "@/lib/money";
import { productImage } from "@/lib/images";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
};

export default async function AdminProductsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { q } = await searchParams;
  setRequestLocale(locale);
  await requireAdmin(locale);
  const t = await getTranslations("admin");
  const query = q?.trim();
  const products = await prisma.product.findMany({
    where: query
      ? {
          OR: [
            { nameAz: { contains: query } },
            { nameDe: { contains: query } },
            { slug: { contains: query } },
          ],
        }
      : undefined,
    include: { variants: true, images: true, category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-4xl">{t("products")}</h1>
        <Link href="/admin/products/new" className="btn-primary">
          {t("newProduct")}
        </Link>
      </div>
      <form className="mt-6" action={`/${locale}/admin/products`}>
        <input
          name="q"
          defaultValue={query}
          placeholder={t("search")}
          className="field max-w-md"
        />
      </form>
      <div className="mt-8 overflow-x-auto border border-ink/10 bg-white/50">
        <table className="w-full text-left text-sm">
          <thead className="bg-parchment text-muted">
            <tr>
              <th className="px-3 py-2"> </th>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">{t("price")}</th>
              <th className="px-3 py-2">{t("stock")}</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {products.length === 0 && (
              <tr>
                <td className="px-3 py-6 text-muted" colSpan={5}>
                  {t("noData")}
                </td>
              </tr>
            )}
            {products.map((p) => {
              const img = productImage(p.slug, p.images[0]?.url);
              const min = Math.min(...p.variants.map((v) => v.price));
              return (
                <tr key={p.id} className="border-t border-ink/10 align-top">
                  <td className="px-3 py-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="" className="h-14 w-11 object-cover" />
                  </td>
                  <td className="px-3 py-3">
                    <p className="font-medium">{locale === "az" ? p.nameAz : p.nameDe}</p>
                    <p className="text-xs text-muted">
                      {locale === "az" ? p.category.nameAz : p.category.nameDe}
                      {p.featured ? " · featured" : ""}
                    </p>
                  </td>
                  <td className="px-3 py-3">
                    {p.variants.map((v) => (
                      <VariantQuickEdit
                        key={v.id}
                        id={v.id}
                        kind="price"
                        label={locale === "az" ? v.nameAz : v.nameDe}
                        value={(v.price / 100).toFixed(2)}
                      />
                    ))}
                    {p.variants.length > 1 && (
                      <p className="mt-1 text-xs text-muted">min {formatEur(min, locale)}</p>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    {p.variants.map((v) => (
                      <VariantQuickEdit
                        key={v.id}
                        id={v.id}
                        kind="stock"
                        label={locale === "az" ? v.nameAz : v.nameDe}
                        value={String(v.stock)}
                      />
                    ))}
                  </td>
                  <td className="px-3 py-3 text-right">
                    <Link href={`/admin/products/${p.id}`} className="underline">
                      {t("edit")}
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
