import { getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { formatEur } from "@/lib/money";
import { ProductImage } from "./ProductImage";

type Props = {
  slug: string;
  nameAz: string;
  nameDe: string;
  image: string;
  price: number;
  colors?: (string | null)[];
  handmade?: boolean;
};

export async function ProductCard({
  slug,
  nameAz,
  nameDe,
  image,
  price,
  colors = [],
}: Props) {
  const locale = await getLocale();
  const name = locale === "az" ? nameAz : nameDe;

  return (
    <Link href={`/shop/${slug}`} className="group block">
      <div className="relative overflow-hidden bg-parchment">
        <ProductImage
          slug={slug}
          src={image}
          alt={name}
          className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <span className="absolute left-3 top-3 bg-cream/90 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-ink">
          {locale === "az" ? "Əl işi" : "Handmade"}
        </span>
      </div>
      <div className="mt-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-serif text-[1.2rem] leading-snug text-ink">{name}</h3>
          <p className="shrink-0 pt-1 text-sm tabular-nums text-muted">{formatEur(price, locale)}</p>
        </div>
        {colors.length > 1 && (
          <div className="mt-2 flex gap-1.5">
            {colors.filter(Boolean).map((c) => (
              <span
                key={c}
                className="h-3 w-3 rounded-full border border-ink/15"
                style={{ background: c ?? undefined }}
              />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
