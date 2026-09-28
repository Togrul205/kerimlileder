import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";
import { formatEur } from "@/lib/money";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ status?: string }>;
};

export default async function AdminOrdersPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { status } = await searchParams;
  setRequestLocale(locale);
  await requireAdmin(locale);
  const t = await getTranslations("admin");
  const orders = await prisma.order.findMany({
    where: status ? { status } : undefined,
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
  const statuses = ["pending", "paid", "processing", "shipped", "cancelled"];

  return (
    <div>
      <h1 className="font-serif text-4xl">{t("orders")}</h1>
      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/admin/orders"
          className={`border px-3 py-1 text-sm ${!status ? "border-ink bg-ink text-cream" : "border-ink/15"}`}
        >
          {t("allStatuses")}
        </Link>
        {statuses.map((s) => (
          <Link
            key={s}
            href={`/admin/orders?status=${s}`}
            className={`border px-3 py-1 text-sm ${
              status === s ? "border-ink bg-ink text-cream" : "border-ink/15"
            }`}
          >
            {s}
          </Link>
        ))}
      </div>
      <div className="mt-8 space-y-4">
        {orders.length === 0 && <p className="text-muted">{t("noData")}</p>}
        {orders.map((o) => (
          <article key={o.id} className="border border-ink/10 bg-white/50 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <Link href={`/admin/orders/${o.id}`} className="font-serif text-lg hover:text-cognac">
                  {o.name}
                </Link>
                <p className="text-sm text-muted">
                  {o.email} · {o.phone}
                </p>
                <p className="text-sm text-muted">
                  {o.address}, {o.postalCode} {o.city}, {o.country}
                </p>
                <p className="mt-1 font-mono text-[11px] text-muted">{o.id}</p>
              </div>
              <div className="text-right">
                <p className="font-serif text-xl">{formatEur(o.totalCents, locale)}</p>
                <p className="text-xs text-muted">{o.paymentMethod}</p>
                <OrderStatusSelect id={o.id} status={o.status} />
              </div>
            </div>
            <ul className="mt-3 text-sm text-muted">
              {o.items.map((i) => (
                <li key={i.id}>
                  {i.productName} ({i.variantName}) × {i.quantity}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}
