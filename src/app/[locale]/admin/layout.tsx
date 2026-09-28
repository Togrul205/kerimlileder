import { setRequestLocale } from "next-intl/server";
import { AdminShell } from "@/components/admin/AdminShell";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function AdminLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AdminShell locale={locale}>{children}</AdminShell>;
}
