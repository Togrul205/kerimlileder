import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ order?: string }>;
};

export default async function SuccessPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { order } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("success");

  let status: string | null = null;
  if (order) {
    const found = await prisma.order.findUnique({ where: { id: order } });
    status = found?.status ?? null;
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="text-[11px] uppercase tracking-[0.28em] text-gold">KARIMLI</p>
      <h1 className="mt-4 font-serif text-5xl">{t("title")}</h1>
      <p className="mt-5 leading-relaxed text-muted">{t("text")}</p>
      {order && (
        <p className="mt-8 border border-ink/10 bg-parchment px-4 py-3 font-mono text-sm">
          {t("order")}: {order}
          {status ? ` · ${status}` : ""}
        </p>
      )}
      <Link href="/shop" className="btn-primary mt-10">
        {t("back")}
      </Link>
    </div>
  );
}
