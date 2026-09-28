import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CustomerEditor } from "@/components/admin/CustomerEditor";
import { formatEur } from "@/lib/money";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

type Props = { params: Promise<{ locale: string; id: string }> };

export default async function AdminCustomerDetail({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  await requireAdmin(locale);
  const t = await getTranslations("admin");
  const customer = await prisma.customer.findUnique({
    where: { id },
    include: { orders: { orderBy: { createdAt: "desc" } } },
  });
  if (!customer) notFound();

  return (
    <div className="max-w-3xl">
      <p className="text-xs text-muted">
        <Link href="/admin/customers" className="hover:text-ink">
          {t("customers")}
        </Link>{" "}
        / {t("customerDetail")}
      </p>
      <h1 className="mt-2 font-serif text-4xl">{customer.name}</h1>
      <p className="text-muted">{customer.email}</p>
      <CustomerEditor customer={customer} />
      <h2 className="mt-10 font-serif text-2xl">{t("orders")}</h2>
      <ul className="mt-4 divide-y divide-ink/10 border border-ink/10 bg-white/50">
        {customer.orders.map((o) => (
          <li key={o.id} className="flex justify-between px-4 py-3 text-sm">
            <Link href={`/admin/orders/${o.id}`} className="hover:text-cognac">
              {o.status} · {new Date(o.createdAt).toLocaleDateString()}
            </Link>
            <span>{formatEur(o.totalCents, locale)}</span>
          </li>
        ))}
        {customer.orders.length === 0 && <li className="px-4 py-6 text-muted">{t("noData")}</li>}
      </ul>
    </div>
  );
}
