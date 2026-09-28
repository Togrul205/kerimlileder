"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";

export function NewsletterForm() {
  const t = useTranslations("home");
  const [ok, setOk] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setOk(true);
  }

  if (ok) {
    return <p className="mt-4 text-sm text-gold">{t("newsletterOk")}</p>;
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 flex max-w-sm gap-2">
      <input
        type="email"
        required
        placeholder="email@…"
        className="min-w-0 flex-1 border border-cream/20 bg-transparent px-3 py-2 text-sm text-cream placeholder:text-cream/35"
      />
      <button type="submit" className="bg-cognac px-4 py-2 text-[11px] uppercase tracking-[0.14em] text-cream">
        {t("newsletterCta")}
      </button>
    </form>
  );
}
