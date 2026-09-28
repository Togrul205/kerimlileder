import { notFound } from "next/navigation";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { AddToCart } from "@/components/AddToCart";
import { ProductCard } from "@/components/ProductCard";
import { ProductImage } from "@/components/ProductImage";
import { getProductBySlug, getRelatedProducts } from "@/lib/products";
import { productImage } from "@/lib/images";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function ProductPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const t = await getTranslations("product");
  const loc = await getLocale();
  const name = loc === "az" ? product.nameAz : product.nameDe;
  const description = loc === "az" ? product.descriptionAz : product.descriptionDe;
  const image = productImage(product.slug, product.images[0]?.url);
  const related = await getRelatedProducts(product.id, product.categoryId);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <nav className="text-xs text-muted">
        <Link href="/shop" className="hover:text-ink">
          Shop
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/shop?category=${product.category.slug}`} className="hover:text-ink">
          {loc === "az" ? product.category.nameAz : product.category.nameDe}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{name}</span>
      </nav>

      <div className="mt-8 grid gap-12 lg:grid-cols-2">
        <div className="bg-parchment">
          <ProductImage
            slug={product.slug}
            src={product.images[0]?.url}
            alt={name}
            className="aspect-[4/5] w-full object-cover"
          />
        </div>
        <div className="lg:py-4">
          <p className="text-[11px] uppercase tracking-[0.2em] text-gold">
            {t("handmade")} · {loc === "az" ? product.category.nameAz : product.category.nameDe}
          </p>
          <h1 className="mt-3 font-serif text-4xl sm:text-5xl">{name}</h1>
          <div className="mt-8">
            <AddToCart
              productId={product.id}
              slug={product.slug}
              nameAz={product.nameAz}
              nameDe={product.nameDe}
              image={image}
              variants={product.variants}
            />
          </div>
          <div className="mt-10 space-y-4 border-t border-ink/10 pt-8">
            <details open className="group border-b border-ink/10 pb-4">
              <summary className="cursor-pointer text-xs uppercase tracking-[0.16em] text-muted">
                {t("description")}
              </summary>
              <p className="mt-3 leading-relaxed text-ink/80">{description}</p>
            </details>
            <details className="group border-b border-ink/10 pb-4">
              <summary className="cursor-pointer text-xs uppercase tracking-[0.16em] text-muted">
                {t("materials")}
              </summary>
              <p className="mt-3 leading-relaxed text-ink/80">{t("materialsBody")}</p>
            </details>
            <details className="group border-b border-ink/10 pb-4">
              <summary className="cursor-pointer text-xs uppercase tracking-[0.16em] text-muted">
                {t("care")}
              </summary>
              <p className="mt-3 leading-relaxed text-ink/80">{t("careBody")}</p>
            </details>
            <details className="group pb-2">
              <summary className="cursor-pointer text-xs uppercase tracking-[0.16em] text-muted">
                {t("shipping")}
              </summary>
              <p className="mt-3 leading-relaxed text-ink/80">{t("shippingBody")}</p>
            </details>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="font-serif text-3xl">{t("related")}</h2>
          <div className="mt-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
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
        </section>
      )}
    </div>
  );
}
