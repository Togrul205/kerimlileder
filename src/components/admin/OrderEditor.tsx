"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";

const STATUSES = ["pending", "paid", "processing", "shipped", "cancelled"];

type Order = {
  id: string;
  status: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  notes: string;
};

export function OrderEditor({ order }: { order: Order }) {
  const t = useTranslations("admin");
  const [ok, setOk] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    const res = await fetch(`/api/admin/orders/${order.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setOk(res.ok);
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-3">
      <select name="status" defaultValue={order.status} className="field">
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <input name="name" defaultValue={order.name} className="field" />
      <input name="phone" defaultValue={order.phone} className="field" />
      <input name="address" defaultValue={order.address} className="field" />
      <div className="grid gap-3 sm:grid-cols-3">
        <input name="postalCode" defaultValue={order.postalCode} className="field" />
        <input name="city" defaultValue={order.city} className="field" />
        <input name="country" defaultValue={order.country} className="field" />
      </div>
      <textarea name="notes" defaultValue={order.notes} placeholder={t("notes")} className="field" rows={3} />
      <button type="submit" className="btn-dark w-auto px-8">
        {t("save")}
      </button>
      {ok && <p className="text-sm text-cognac">{t("saved")}</p>}
    </form>
  );
}
