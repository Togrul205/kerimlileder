"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";

type Customer = {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  notes: string;
};

export function CustomerEditor({ customer }: { customer: Customer }) {
  const t = useTranslations("admin");
  const [ok, setOk] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    const res = await fetch(`/api/admin/customers/${customer.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setOk(res.ok);
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-3">
      <input name="name" defaultValue={customer.name} className="field" />
      <input name="phone" defaultValue={customer.phone} className="field" />
      <input name="address" defaultValue={customer.address} className="field" />
      <div className="grid gap-3 sm:grid-cols-3">
        <input name="postalCode" defaultValue={customer.postalCode} className="field" />
        <input name="city" defaultValue={customer.city} className="field" />
        <input name="country" defaultValue={customer.country} className="field" />
      </div>
      <textarea name="notes" defaultValue={customer.notes} placeholder={t("notes")} className="field" rows={3} />
      <button type="submit" className="btn-dark w-auto px-8">
        {t("save")}
      </button>
      {ok && <p className="text-sm text-cognac">{t("saved")}</p>}
    </form>
  );
}
