"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useCart } from "./CartProvider";
import { formatEur } from "@/lib/money";
import { QtyStepper } from "./QtyStepper";

type Variant = {
  id: string;
  nameAz: string;
  nameDe: string;
  color: string | null;
  price: number;
  stock: number;
  sku?: string | null;
};

type Props = {
  productId: string;
  slug: string;
  nameAz: string;
  nameDe: string;
  image: string;
  variants: Variant[];
};

export function AddToCart({
  productId,
  slug,
  nameAz,
  nameDe,
  image,
  variants,
}: Props) {
  const t = useTranslations("product");
  const locale = useLocale();
  const { addItem } = useCart();
  const [variantId, setVariantId] = useState(variants[0]?.id ?? "");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const variant = useMemo(
    () => variants.find((v) => v.id === variantId) ?? variants[0],
    [variants, variantId],
  );

  if (!variant) return null;

  const name = locale === "az" ? nameAz : nameDe;
  const variantName = locale === "az" ? variant.nameAz : variant.nameDe;
  const out = variant.stock <= 0;

  function onAdd() {
    addItem(
      {
        productId,
        slug,
        name,
        variantId: variant.id,
        variantName,
        image,
        price: variant.price,
        stock: variant.stock,
      },
      qty,
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="font-serif text-3xl">{formatEur(variant.price, locale)}</p>
        <p className="mt-1 text-xs text-muted">{t("vat")}</p>
      </div>
      <div>
        <p className="mb-3 text-xs uppercase tracking-[0.16em] text-muted">{t("variant")}</p>
        <div className="flex flex-wrap gap-2">
          {variants.map((v) => {
            const selected = v.id === variant.id;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => {
                  setVariantId(v.id);
                  setQty(1);
                }}
                className={`inline-flex items-center gap-2 border px-3 py-2 text-sm ${
                  selected ? "border-ink bg-ink text-cream" : "border-ink/20 hover:border-ink"
                }`}
              >
                {v.color && (
                  <span
                    className="h-3 w-3 rounded-full border border-black/10"
                    style={{ background: v.color }}
                  />
                )}
                {locale === "az" ? v.nameAz : v.nameDe}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-muted">
          {variant.stock <= 3
            ? t("lowStock", { count: variant.stock })
            : `${variant.stock} ${t("stock")}`}
          {variant.sku ? ` · ${t("sku")} ${variant.sku}` : ""}
        </p>
      </div>
      <div>
        <p className="mb-2 text-xs uppercase tracking-[0.16em] text-muted">{t("quantity")}</p>
        <QtyStepper value={qty} max={Math.max(1, variant.stock)} onChange={setQty} />
      </div>
      <button type="button" disabled={out} onClick={onAdd} className="btn-primary w-full">
        {out ? t("outOfStock") : added ? t("added") : t("addToCart")}
      </button>
      <p className="text-sm text-muted">{t("shippingNote")}</p>
    </div>
  );
}
