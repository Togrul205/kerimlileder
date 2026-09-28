"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";

type Category = {
  id: string;
  slug: string;
  nameAz: string;
  nameDe: string;
  _count: { products: number };
};

export function CategoryManager({ categories }: { categories: Category[] }) {
  const t = useTranslations("admin");
  const [savedId, setSavedId] = useState<string | null>(null);

  async function create(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    window.location.reload();
  }

  async function save(id: string, form: HTMLFormElement) {
    const data = Object.fromEntries(new FormData(form).entries());
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) setSavedId(id);
  }

  async function remove(id: string) {
    if (!confirm(t("delete") + "?")) return;
    const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    if (res.ok) window.location.reload();
  }

  return (
    <div className="mt-8 space-y-8">
      <form onSubmit={create} className="grid gap-2 sm:grid-cols-3">
        <input name="nameAz" placeholder="AZ" className="field" required />
        <input name="nameDe" placeholder="DE" className="field" required />
        <button type="submit" className="btn-primary">
          {t("newCategory")}
        </button>
      </form>
      <ul className="space-y-4">
        {categories.map((c) => (
          <li key={c.id} className="border border-ink/10 bg-white/50 p-3">
            <form
              className="grid gap-2 sm:grid-cols-4"
              onSubmit={(e) => {
                e.preventDefault();
                void save(c.id, e.currentTarget);
              }}
            >
              <input name="slug" defaultValue={c.slug} className="field" />
              <input name="nameAz" defaultValue={c.nameAz} className="field" />
              <input name="nameDe" defaultValue={c.nameDe} className="field" />
              <div className="flex items-center gap-2">
                <button type="submit" className="text-sm underline">
                  {t("save")}
                </button>
                {c._count.products === 0 && (
                  <button type="button" onClick={() => remove(c.id)} className="text-sm text-cognac">
                    {t("delete")}
                  </button>
                )}
                <span className="text-xs text-muted">{c._count.products}</span>
                {savedId === c.id && <span className="text-xs text-cognac">{t("saved")}</span>}
              </div>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
