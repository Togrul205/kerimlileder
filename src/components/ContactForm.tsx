"use client";

import { useTranslations } from "next-intl";
import { FormEvent } from "react";

export function ContactForm() {
  const t = useTranslations("contact");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") || "");
    const message = String(data.get("message") || "");
    const text = encodeURIComponent(`${name}: ${message}`);
    window.open(`https://wa.me/4915120000000?text=${text}`, "_blank");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block text-xs text-muted">
        {t("formName")}
        <input name="name" required className="field mt-1" />
      </label>
      <label className="block text-xs text-muted">
        {t("formMessage")}
        <textarea name="message" required rows={6} className="field mt-1" />
      </label>
      <button type="submit" className="btn-primary">
        {t("send")}
      </button>
      <p className="text-xs text-muted">{t("whatsappNote")}</p>
    </form>
  );
}
