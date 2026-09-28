"use client";

import { FormEvent, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCart } from "./CartProvider";
import { formatEur } from "@/lib/money";
import { COUNTRIES, shippingCentsForCountry } from "@/lib/shipping";

type Props = {
  stripeEnabled: boolean;
  paypalEnabled: boolean;
};

export function CheckoutForm({ stripeEnabled, paypalEnabled }: Props) {
  const t = useTranslations("checkout");
  const locale = useLocale();
  const { items, subtotal, clear } = useCart();
  const [country, setCountry] = useState("DE");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  const shipping = useMemo(
    () => shippingCentsForCountry(country, subtotal),
    [country, subtotal],
  );
  const total = subtotal + shipping;

  async function submit(method: "stripe" | "paypal" | "demo") {
    setError("");
    setBusy(method);
    const form = document.getElementById("checkout-form") as HTMLFormElement;
    const data = new FormData(form);
    const payload = {
      locale,
      method,
      name: String(data.get("name") || ""),
      email: String(data.get("email") || ""),
      phone: String(data.get("phone") || ""),
      address: String(data.get("address") || ""),
      city: String(data.get("city") || ""),
      postalCode: String(data.get("postalCode") || ""),
      country,
      items: items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
    };

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || t("error"));
        return;
      }
      if (json.url) {
        if (method === "demo") clear();
        window.location.href = json.url;
        return;
      }
      setError(t("error"));
    } catch {
      setError(t("error"));
    } finally {
      setBusy(null);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <p className="text-muted">{t("empty")}</p>
        <Link href="/shop" className="btn-primary mt-8">
          Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-12">
      <form
        id="checkout-form"
        className="space-y-8 lg:col-span-7"
        onSubmit={(e: FormEvent) => e.preventDefault()}
      >
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-gold">KARIMLI</p>
          <h1 className="mt-2 font-serif text-4xl">{t("title")}</h1>
        </div>
        <fieldset className="space-y-3">
          <legend className="mb-3 text-xs uppercase tracking-[0.16em] text-muted">
            {t("contact")}
          </legend>
          <label className="block text-xs text-muted">{t("name")}
            <input name="name" required className="field mt-1" />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-xs text-muted">{t("email")}
              <input name="email" type="email" required className="field mt-1" />
            </label>
            <label className="block text-xs text-muted">{t("phone")}
              <input name="phone" required className="field mt-1" />
            </label>
          </div>
        </fieldset>
        <fieldset className="space-y-3">
          <legend className="mb-3 text-xs uppercase tracking-[0.16em] text-muted">
            {t("shipping")}
          </legend>
          <label className="block text-xs text-muted">{t("address")}
            <input name="address" required className="field mt-1" />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-xs text-muted">{t("city")}
              <input name="city" required className="field mt-1" />
            </label>
            <label className="block text-xs text-muted">{t("postalCode")}
              <input name="postalCode" required className="field mt-1" />
            </label>
          </div>
          <label className="block text-xs text-muted">{t("country")}
            <select
              name="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="field mt-1"
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {locale === "az" ? c.nameAz : c.nameDe}
                </option>
              ))}
            </select>
          </label>
        </fieldset>
        {error && <p className="text-sm text-cognac">{error}</p>}
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">{t("pay")}</p>
          {stripeEnabled && (
            <button type="button" disabled={!!busy} onClick={() => submit("stripe")} className="btn-dark">
              {busy === "stripe" ? "…" : t("payStripe")}
            </button>
          )}
          {paypalEnabled && (
            <button
              type="button"
              disabled={!!busy}
              onClick={() => submit("paypal")}
              className="btn-ghost w-full border-ink"
            >
              {busy === "paypal" ? "…" : t("payPaypal")}
            </button>
          )}
          {!stripeEnabled && !paypalEnabled && (
            <button type="button" disabled={!!busy} onClick={() => submit("demo")} className="btn-primary w-full">
              {busy === "demo" ? "…" : t("payDemo")}
            </button>
          )}
          <p className="text-xs text-muted">{t("secure")}</p>
        </div>
      </form>
      <aside className="lg:col-span-5">
        <div className="border border-ink/10 bg-parchment p-6 lg:sticky lg:top-28">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">{t("summary")}</p>
          <ul className="mt-4 space-y-4">
            {items.map((i) => (
              <li key={i.variantId} className="flex gap-3 text-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={i.image} alt="" className="h-16 w-12 object-cover" />
                <div className="flex-1">
                  <p>{i.name}</p>
                  <p className="text-xs text-muted">
                    {i.variantName} × {i.quantity}
                  </p>
                </div>
                <span className="tabular-nums">{formatEur(i.price * i.quantity, locale)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex justify-between text-sm text-muted">
            <span>{t("shippingCost")}</span>
            <span>{formatEur(shipping, locale)}</span>
          </div>
          <div className="mt-4 flex justify-between border-t border-ink/10 pt-4 font-serif text-2xl">
            <span>{t("total")}</span>
            <span>{formatEur(total, locale)}</span>
          </div>
          <p className="mt-3 text-xs text-muted">{t("vatNote")}</p>
        </div>
      </aside>
    </div>
  );
}
