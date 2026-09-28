import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { OrderEditor } from "@/components/admin/OrderEditor";
import { formatEur } from "@/lib/money";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

type Props = { params: Promise<{ locale: string; id: string }> };

export default async function AdminOrderDetail({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  await requireAdmin(locale);
  const t = await getTranslations("admin");
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, customer: true },
  });
  if (!order) notFound();

  return (
    <div className="max-w-3xl">
      <p className="text-xs text-muted">
        <Link href="/admin/orders" className="hover:text-ink">
          {t("orders")}
        </Link>{" "}
        / {t("orderDetail")}
      </p>
      <h1 className="mt-2 font-serif text-4xl">{order.name}</h1>
      <p className="mt-1 font-mono text-xs text-muted">{order.id}</p>
      <p className="mt-4 font-serif text-3xl">{formatEur(order.totalCents, locale)}</p>
      <p className="text-sm text-muted">
        {order.paymentMethod} · shipping {formatEur(order.shippingCents, locale)}
      </p>
      <ul className="mt-6 border border-ink/10 bg-white/50 p-4 text-sm">
        {order.items.map((i) => (
          <li key={i.id} className="flex justify-between py-1">
            <span>
              {i.productName} ({i.variantName}) × {i.quantity}
            </span>
            <span>{formatEur(i.unitPrice * i.quantity, locale)}</span>
          </li>
        ))}
      </ul>
      {order.customer && (
        <p className="mt-4 text-sm">
          <Link href={`/admin/customers/${order.customer.id}`} className="text-cognac underline">
            {t("customerDetail")}: {order.customer.email}
          </Link>
        </p>
      )}
      <OrderEditor order={order} />
    </div>
  );
}
