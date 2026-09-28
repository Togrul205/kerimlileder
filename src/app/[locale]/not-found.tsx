import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("notFound");
  return (
    <div className="mx-auto max-w-lg px-4 py-28 text-center">
      <p className="text-[11px] uppercase tracking-[0.28em] text-gold">404</p>
      <h1 className="mt-4 font-serif text-5xl">{t("title")}</h1>
      <p className="mt-4 text-muted">{t("text")}</p>
      <Link href="/shop" className="btn-primary mt-10">
        {t("cta")}
      </Link>
    </div>
  );
}
