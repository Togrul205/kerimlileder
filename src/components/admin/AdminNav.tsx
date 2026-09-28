"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function AdminNav({ locale }: { locale: string }) {
  const t = useTranslations("admin");

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = `/${locale}/admin/login`;
  }

  return (
    <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-ink/10 pb-5">
      <div className="flex gap-6 text-sm tracking-wide">
        <Link href="/admin/products" className="hover:text-cognac">
          {t("products")}
        </Link>
        <Link href="/admin/orders" className="hover:text-cognac">
          {t("orders")}
        </Link>
      </div>
      <button type="button" onClick={logout} className="text-xs uppercase tracking-wide text-muted">
        {t("logout")}
      </button>
    </div>
  );
}
