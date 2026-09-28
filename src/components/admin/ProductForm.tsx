"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";

type Category = { id: string; nameAz: string; nameDe: string };
type VariantRow = {
  id?: string;
  nameAz: string;
  nameDe: string;
  color: string;
  priceEur: string;
  stock: string;
  sku: string;
};

type Initial = {
  id?: string;
  slug: string;
  nameAz: string;
  nameDe: string;
  descriptionAz: string;
  descriptionDe: string;
  featured: boolean;
  categoryId: string;
  imageUrl: string;
  variants: VariantRow[];
};

export function ProductForm({
  locale,
  categories,
  initial,
}: {
  locale: string;
  categories: Category[];
  initial: Initial;
}) {
  const t = useTranslations("admin");
  const [imageUrl, setImageUrl] = useState(initial.imageUrl);
  const [variants, setVariants] = useState<VariantRow[]>(
    initial.variants.length
      ? initial.variants
      : [{ nameAz: "Standart", nameDe: "Standard", color: "", priceEur: "49.00", stock: "5", sku: "" }],
  );
  const [busy, setBusy] = useState(false);

  async function upload(file: File) {
    const data = new FormData();
    data.set("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: data });
    const json = await res.json();
    if (json.url) setImageUrl(json.url);
  }

  function updateVariant(index: number, patch: Partial<VariantRow>) {
    setVariants((rows) => rows.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const form = new FormData(e.currentTarget);
    const payload = {
      slug: String(form.get("slug")),
      nameAz: String(form.get("nameAz")),
      nameDe: String(form.get("nameDe")),
      descriptionAz: String(form.get("descriptionAz")),
      descriptionDe: String(form.get("descriptionDe")),
      featured: form.get("featured") === "on",
      categoryId: String(form.get("categoryId")),
      imageUrl,
      variants: variants.map((v) => ({
        id: v.id,
        nameAz: v.nameAz,
        nameDe: v.nameDe,
        color: v.color,
        priceEur: v.priceEur,
        stock: v.stock,
        sku: v.sku,
      })),
    };
    const url = initial.id ? `/api/admin/products/${initial.id}` : "/api/admin/products";
    const res = await fetch(url, {
      method: initial.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setBusy(false);
    if (res.ok) window.location.href = `/${locale}/admin/products`;
  }

  async function onDelete() {
    if (!initial.id || !confirm(t("delete") + "?")) return;
    const res = await fetch(`/api/admin/products/${initial.id}`, { method: "DELETE" });
    if (res.ok) {
      window.location.href = `/${locale}/admin/products`;
      return;
    }
    alert(t("cannotDelete"));
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 max-w-3xl space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <input name="slug" defaultValue={initial.slug} placeholder="slug" className="field" required />
        <select name="categoryId" defaultValue={initial.categoryId} className="field">
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {locale === "az" ? c.nameAz : c.nameDe}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <input name="nameAz" defaultValue={initial.nameAz} placeholder="Ad (AZ)" className="field" required />
        <input name="nameDe" defaultValue={initial.nameDe} placeholder="Name (DE)" className="field" required />
      </div>
      <textarea name="descriptionAz" defaultValue={initial.descriptionAz} placeholder="Təsvir AZ" className="field" rows={3} />
      <textarea name="descriptionDe" defaultValue={initial.descriptionDe} placeholder="Beschreibung DE" className="field" rows={3} />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="featured" defaultChecked={initial.featured} />
        {t("featured")}
      </label>
      <div>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void upload(file);
          }}
        />
        {imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt="" className="mt-3 h-36 w-28 bg-parchment object-cover" />
        )}
      </div>

      <div className="border border-ink/10 bg-white/40 p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.14em] text-muted">{t("variants")}</p>
          <button
            type="button"
            className="text-sm text-cognac underline"
            onClick={() =>
              setVariants((rows) => [
                ...rows,
                { nameAz: "", nameDe: "", color: "", priceEur: "49.00", stock: "0", sku: "" },
              ])
            }
          >
            {t("addVariant")}
          </button>
        </div>
        <div className="space-y-4">
          {variants.map((v, i) => (
            <div key={v.id ?? `new-${i}`} className="grid gap-2 border-t border-ink/10 pt-3 sm:grid-cols-6">
              <input
                value={v.nameAz}
                onChange={(e) => updateVariant(i, { nameAz: e.target.value })}
                placeholder="AZ"
                className="field sm:col-span-1"
              />
              <input
                value={v.nameDe}
                onChange={(e) => updateVariant(i, { nameDe: e.target.value })}
                placeholder="DE"
                className="field sm:col-span-1"
              />
              <input
                value={v.priceEur}
                onChange={(e) => updateVariant(i, { priceEur: e.target.value })}
                placeholder={t("price")}
                type="number"
                step="0.01"
                min="0"
                className="field"
              />
              <input
                value={v.stock}
                onChange={(e) => updateVariant(i, { stock: e.target.value })}
                placeholder={t("stock")}
                type="number"
                className="field"
              />
              <input
                value={v.sku}
                onChange={(e) => updateVariant(i, { sku: e.target.value })}
                placeholder="SKU"
                className="field"
              />
              <div className="flex gap-2">
                <input
                  value={v.color}
                  onChange={(e) => updateVariant(i, { color: e.target.value })}
                  placeholder="#8B4E2A"
                  className="field"
                />
                {variants.length > 1 && (
                  <button
                    type="button"
                    className="text-xs text-muted"
                    onClick={() => setVariants((rows) => rows.filter((_, idx) => idx !== i))}
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={busy} className="btn-dark w-auto px-8 disabled:opacity-50">
          {t("save")}
        </button>
        {initial.id && (
          <button type="button" onClick={onDelete} className="text-sm text-cognac underline">
            {t("delete")}
          </button>
        )}
      </div>
    </form>
  );
}
