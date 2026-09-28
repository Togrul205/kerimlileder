"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCart } from "./CartProvider";
import { formatEur } from "@/lib/money";
import { QtyStepper } from "./QtyStepper";

const FREE_SHIP = 15000;

export function CartView() {
  const t = useTranslations("cart");
  const locale = useLocale();
  const { items, updateQty, removeItem, subtotal } = useCart();
  const remain = Math.max(0, FREE_SHIP - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIP) * 100);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <p className="text-[11px] uppercase tracking-[0.22em] text-gold">KARIMLI</p>
        <h1 className="mt-3 font-serif text-5xl">{t("title")}</h1>
        <p className="mt-4 text-muted">{t("empty")}</p>
        <p className="mt-2 text-sm text-muted">{t("emptyLead")}</p>
        <Link href="/shop" className="btn-primary mt-10">
          {t("continue")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-12">
      <div className="lg:col-span-8">
        <h1 className="font-serif text-4xl">{t("title")}</h1>
        <ul className="mt-8 divide-y divide-ink/10 border-t border-ink/10">
          {items.map((item) => (
            <li key={item.variantId} className="flex gap-5 py-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image} alt="" className="h-32 w-24 bg-parchment object-cover" />
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <Link href={`/shop/${item.slug}`} className="font-serif text-xl hover:text-cognac">
                    {item.name}
                  </Link>
                  <p className="text-sm text-muted">{item.variantName}</p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <QtyStepper
                    value={item.quantity}
                    max={item.stock}
                    onChange={(n) => updateQty(item.variantId, n)}
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(item.variantId)}
                    className="text-xs text-muted underline"
                  >
                    {t("remove")}
                  </button>
                </div>
              </div>
              <p className="text-sm tabular-nums">{formatEur(item.price * item.quantity, locale)}</p>
            </li>
          ))}
        </ul>
      </div>
      <aside className="lg:col-span-4">
        <div className="border border-ink/10 bg-parchment p-6 lg:sticky lg:top-28">
          <p className="text-xs text-muted">
            {remain === 0 ? t("freeShipDone") : t("freeShip", { amount: formatEur(remain, locale) })}
          </p>
          <div className="mt-2 h-1 bg-ink/10">
            <div className="h-full bg-cognac" style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-6 flex justify-between text-sm">
            <span>{t("subtotal")}</span>
            <span className="tabular-nums">{formatEur(subtotal, locale)}</span>
          </div>
          <p className="mt-2 text-xs text-muted">{t("shippingHint")}</p>
          <Link href="/checkout" className="btn-primary mt-6 w-full">
            {t("checkout")}
          </Link>
          <Link href="/shop" className="mt-4 block text-center text-sm text-muted underline">
            {t("continue")}
          </Link>
        </div>
      </aside>
    </div>
  );
}
