import { getTranslations, setRequestLocale } from "next-intl/server";

type Key = "impressum" | "privacy" | "terms" | "withdrawal";

export async function LegalPage({ locale, ns }: { locale: string; ns: Key }) {
  setRequestLocale(locale);
  const t = await getTranslations(ns);
  const legal = await getTranslations("legal");
  return (
    <article className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <p className="text-[11px] uppercase tracking-[0.22em] text-gold">{legal("updated")} · 2026</p>
      <h1 className="mt-3 font-serif text-4xl">{t("title")}</h1>
      <p className="mt-8 whitespace-pre-line leading-relaxed text-ink/85">{t("body")}</p>
    </article>
  );
}
