"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";

export function AdminLoginForm({ locale }: { locale: string }) {
  const t = useTranslations("admin");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const password = String(new FormData(e.currentTarget).get("password") || "");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      setError(t("invalid"));
      return;
    }
    window.location.href = `/${locale}/admin`;
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-24">
      <p className="text-[11px] uppercase tracking-[0.22em] text-gold">KARIMLI</p>
      <h1 className="mt-2 font-serif text-4xl">{t("login")}</h1>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <input
          name="password"
          type="password"
          required
          placeholder={t("password")}
          className="field"
        />
        {error && <p className="text-sm text-cognac">{error}</p>}
        <button type="submit" className="btn-dark">
          {t("submit")}
        </button>
      </form>
    </div>
  );
}
