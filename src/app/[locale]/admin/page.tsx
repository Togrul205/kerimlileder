import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { formatEur } from "@/lib/money";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { backfillCustomers } from "@/lib/customers";

type Props = { params: Promise<{ locale: string }> };

export default async function AdminDashboard({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  await requireAdmin(locale);
  await backfillCustomers();
  const t = await getTranslations("admin");

  const [products, orders, customers, lowStock] = await Promise.all([
    prisma.product.count(),
    prisma.order.findMany({ include: { items: true }, orderBy: { createdAt: "desc" } }),
    prisma.customer.count(),
    prisma.productVariant.findMany({
      where: { stock: { lte: 3 } },
      include: { product: true },
      take: 8,
    }),
  ]);

  const paid = orders.filter((o) => ["paid", "processing", "shipped"].includes(o.status));
  const revenue = paid.reduce((n, o) => n + o.totalCents, 0);

  return (
    <div>
      <h1 className="font-serif text-4xl">{t("dashboard")}</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label={t("revenue")} value={formatEur(revenue, locale)} />
        <Stat label={t("orders")} value={String(orders.length)} />
        <Stat label={t("products")} value={String(products)} />
        <Stat label={t("customers")} value={String(customers)} />
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <section>
          <h2 className="font-serif text-2xl">{t("recentOrders")}</h2>
          <ul className="mt-4 divide-y divide-ink/10 border border-ink/10 bg-white/50">
            {orders.slice(0, 6).map((o) => (
              <li key={o.id} className="flex items-center justify-between px-4 py-3 text-sm">
                <div>
                  <Link href={`/admin/orders/${o.id}`} className="hover:text-cognac">
                    {o.name}
                  </Link>
                  <p className="text-xs text-muted">{o.status}</p>
                </div>
                <span>{formatEur(o.totalCents, locale)}</span>
              </li>
            ))}
            {orders.length === 0 && <li className="px-4 py-6 text-muted">{t("noData")}</li>}
          </ul>
        </section>
        <section>
          <h2 className="font-serif text-2xl">{t("lowStock")}</h2>
          <ul className="mt-4 divide-y divide-ink/10 border border-ink/10 bg-white/50">
            {lowStock.map((v) => (
              <li key={v.id} className="flex items-center justify-between px-4 py-3 text-sm">
                <Link href={`/admin/products/${v.productId}`} className="hover:text-cognac">
                  {locale === "az" ? v.product.nameAz : v.product.nameDe} ·{" "}
                  {locale === "az" ? v.nameAz : v.nameDe}
                </Link>
                <span className={v.stock === 0 ? "text-cognac" : ""}>{v.stock}</span>
              </li>
            ))}
            {lowStock.length === 0 && <li className="px-4 py-6 text-muted">{t("noData")}</li>}
          </ul>
        </section>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-ink/10 bg-white/60 px-4 py-5">
      <p className="text-xs uppercase tracking-[0.14em] text-muted">{label}</p>
      <p className="mt-2 font-serif text-3xl">{value}</p>
    </div>
  );
}
