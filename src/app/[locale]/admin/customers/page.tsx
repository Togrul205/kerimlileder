import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { formatEur } from "@/lib/money";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { backfillCustomers } from "@/lib/customers";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
};

export default async function AdminCustomersPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { q } = await searchParams;
  setRequestLocale(locale);
  await requireAdmin(locale);
  await backfillCustomers();
  const t = await getTranslations("admin");
  const query = q?.trim();
  const customers = await prisma.customer.findMany({
    where: query
      ? {
          OR: [
            { name: { contains: query } },
            { email: { contains: query } },
            { city: { contains: query } },
          ],
        }
      : undefined,
    include: { orders: true },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-serif text-4xl">{t("customers")}</h1>
      <form className="mt-6" action={`/${locale}/admin/customers`}>
        <input name="q" defaultValue={query} placeholder={t("search")} className="field max-w-md" />
      </form>
      <div className="mt-8 overflow-x-auto border border-ink/10 bg-white/50">
        <table className="w-full text-left text-sm">
          <thead className="bg-parchment text-muted">
            <tr>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">{t("orders")}</th>
              <th className="px-3 py-2">{t("revenue")}</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 && (
              <tr>
                <td className="px-3 py-6 text-muted" colSpan={4}>
                  {t("noData")}
                </td>
              </tr>
            )}
            {customers.map((c) => {
              const spent = c.orders
                .filter((o) => ["paid", "processing", "shipped"].includes(o.status))
                .reduce((n, o) => n + o.totalCents, 0);
              return (
                <tr key={c.id} className="border-t border-ink/10">
                  <td className="px-3 py-3">
                    <Link href={`/admin/customers/${c.id}`} className="hover:text-cognac">
                      {c.name}
                    </Link>
                    <p className="text-xs text-muted">{c.city}, {c.country}</p>
                  </td>
                  <td className="px-3 py-3">{c.email}</td>
                  <td className="px-3 py-3">{c.orders.length}</td>
                  <td className="px-3 py-3">{formatEur(spent, locale)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
