"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

export function AdminShell({
  locale,
  children,
}: {
  locale: string;
  children: React.ReactNode;
}) {
  const t = useTranslations("admin");
  const pathname = usePathname();
  const isLogin = pathname.endsWith("/admin/login") || pathname === "/admin/login";

  if (isLogin) return <>{children}</>;

  const items = [
    { href: "/admin", label: t("dashboard"), match: (p: string) => p === "/admin" },
    { href: "/admin/products", label: t("products"), match: (p: string) => p.startsWith("/admin/products") },
    { href: "/admin/orders", label: t("orders"), match: (p: string) => p.startsWith("/admin/orders") },
    { href: "/admin/customers", label: t("customers"), match: (p: string) => p.startsWith("/admin/customers") },
    { href: "/admin/categories", label: t("categories"), match: (p: string) => p.startsWith("/admin/categories") },
  ];

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = `/${locale}/admin/login`;
  }

  return (
    <div className="min-h-screen bg-[#f3eee6] lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="bg-ink text-cream">
        <div className="px-5 py-6">
          <p className="font-serif text-2xl">KARIMLI</p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-gold">Admin</p>
        </div>
        <nav className="space-y-1 px-3 pb-6">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-3 py-2 text-sm ${
                item.match(pathname) ? "bg-cream/10 text-gold" : "text-cream/75 hover:text-cream"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="space-y-2 border-t border-cream/10 px-5 py-5 text-xs">
          <Link href="/" className="block text-cream/60 hover:text-gold">
            {t("viewStore")}
          </Link>
          <button type="button" onClick={logout} className="block text-cream/60 hover:text-gold">
            {t("logout")}
          </button>
        </div>
      </aside>
      <div className="px-4 py-8 sm:px-8">{children}</div>
    </div>
  );
}
