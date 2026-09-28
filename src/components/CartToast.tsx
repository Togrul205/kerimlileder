"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCart } from "./CartProvider";

export function CartToast() {
  const t = useTranslations("product");
  const { toast } = useCart();
  if (!toast) return null;
  return (
    <div className="toast pointer-events-auto fixed bottom-6 left-1/2 z-50 -translate-x-1/2 border border-ink/10 bg-ink px-5 py-3 text-sm text-cream shadow-lg">
      {t("added")}{" "}
      <Link href="/cart" className="ml-2 underline decoration-gold underline-offset-4">
        →
      </Link>
    </div>
  );
}
