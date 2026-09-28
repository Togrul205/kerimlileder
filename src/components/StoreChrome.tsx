"use client";

import { usePathname } from "@/i18n/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CartToast } from "./CartToast";

export function StoreChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      {!isAdmin && <Header />}
      <main className="flex-1">{children}</main>
      {!isAdmin && <Footer />}
      {!isAdmin && <CartToast />}
    </>
  );
}
