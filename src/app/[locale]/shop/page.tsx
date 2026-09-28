import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ProductCard } from "@/components/ProductCard";
import { ShopSearch } from "@/components/ShopSearch";
import { getCategories, getProducts } from "@/lib/products";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; q?: string }>;
};

export default async function ShopPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { category, q } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("shop");
  const [categories, all] = await Promise.all([getCategories(), getProducts(category)]);
  const query = (q ?? "").trim().toLowerCase();
  const products = query
    ? all.filter((p) =>
        `${p.nameAz} ${p.nameDe} ${p.descriptionAz} ${p.descriptionDe}`.toLowerCase().includes(query),
      )
    : all;

  return (
    <div>
      <div className="border-b border-ink/10 bg-parchment">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <p className="text-[11px] uppercase tracking-[0.22em] text-gold">KARIMLI</p>
          <h1 className="mt-2 font-serif text-5xl">{t("title")}</h1>
          <p className="mt-3 max-w-xl text-muted">{t("lead")}</p>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            <Link
              href="/shop"
              className={`border px-3 py-1.5 text-sm ${
                !category ? "border-ink bg-ink text-cream" : "border-ink/15 hover:border-ink"
              }`}
            >
              {t("all")}
            </Link>
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/shop?category=${c.slug}`}
                className={`border px-3 py-1.5 text-sm ${
                  category === c.slug
                    ? "border-ink bg-ink text-cream"
                    : "border-ink/15 hover:border-ink"
                }`}
              >
                {locale === "az" ? c.nameAz : c.nameDe}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted">{t("count", { count: products.length })}</p>
            <Suspense>
              <ShopSearch placeholder={t("search")} />
            </Suspense>
          </div>
        </div>
        {products.length === 0 ? (
          <p className="mt-20 text-center text-muted">{t("empty")}</p>
        ) : (
          <div className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                slug={p.slug}
                nameAz={p.nameAz}
                nameDe={p.nameDe}
                image={p.images[0]?.url ?? ""}
                price={p.variants[0]?.price ?? 0}
                colors={p.variants.map((v) => v.color)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
