import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ProductCard } from "@/components/ProductCard";
import { getCategories, getFeaturedProducts } from "@/lib/products";
import { SITE_IMAGES, categoryImage } from "@/lib/images";

type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("hero");
  const home = await getTranslations("home");
  const [featured, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);

  return (
    <div>
      <section className="relative min-h-[88vh] overflow-hidden bg-ink text-cream">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={SITE_IMAGES.hero}
            alt=""
            className="h-full w-full object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/30" />
        </div>
        <div className="relative mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-end px-4 py-20 sm:px-6 sm:py-28">
          <p className="reveal text-[11px] uppercase tracking-[0.32em] text-gold">{t("eyebrow")}</p>
          <h1 className="reveal mt-5 max-w-2xl font-serif text-5xl leading-[1.05] sm:text-7xl">
            {t("title")}
          </h1>
          <p className="reveal mt-6 max-w-lg text-lg leading-relaxed text-cream/75">{t("subtitle")}</p>
          <div className="reveal mt-10 flex flex-wrap gap-4">
            <Link href="/shop" className="btn-primary">
              {t("cta")}
            </Link>
            <Link href="/about" className="btn-ghost border-cream/40 text-cream hover:bg-cream hover:text-ink">
              {t("secondary")}
            </Link>
          </div>
          <dl className="mt-16 grid max-w-xl grid-cols-3 gap-6 border-t border-cream/15 pt-8 text-sm">
            <div>
              <dt className="text-cream/50">{t("stat1")}</dt>
            </div>
            <div>
              <dt className="text-cream/50">{t("stat2")}</dt>
            </div>
            <div>
              <dt className="text-cream/50">{t("stat3")}</dt>
            </div>
          </dl>
        </div>
      </section>

      <section className="border-b border-ink/10 bg-parchment">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n}>
              <p className="font-serif text-xl">{home(`trust${n}Title`)}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{home(`trust${n}Text`)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-gold">{home("categories")}</p>
            <h2 className="mt-2 font-serif text-4xl">{home("categories")}</h2>
          </div>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {categories.map((c) => (
            <Link key={c.id} href={`/shop?category=${c.slug}`} className="group relative block overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={categoryImage(c.slug)}
                alt=""
                className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
              <span className="absolute bottom-6 left-6 font-serif text-3xl text-cream">
                {locale === "az" ? c.nameAz : c.nameDe}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-gold">{home("featured")}</p>
            <h2 className="mt-2 font-serif text-4xl">{home("featured")}</h2>
            <p className="mt-2 text-muted">{home("featuredLead")}</p>
          </div>
          <Link href="/shop" className="hidden text-sm tracking-wide text-cognac underline-offset-4 hover:underline sm:inline">
            {home("viewAll")}
          </Link>
        </div>
        <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
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

      <section className="bg-parchment">
        <div className="mx-auto grid max-w-6xl items-center gap-0 md:grid-cols-2">
          <div className="px-4 py-16 sm:px-10">
            <p className="text-[11px] uppercase tracking-[0.22em] text-gold">Atelier</p>
            <h2 className="mt-3 font-serif text-4xl sm:text-5xl">{home("craftTitle")}</h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted">{home("craftText")}</p>
            <a
              href="https://www.instagram.com/karimli.leder/"
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-block text-sm tracking-wide text-cognac underline-offset-4 hover:underline"
            >
              @karimli.leder
            </a>
          </div>
          <div className="min-h-[420px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={SITE_IMAGES.craft} alt="" className="h-full min-h-[420px] w-full object-cover" />
          </div>
        </div>
      </section>
    </div>
  );
}
