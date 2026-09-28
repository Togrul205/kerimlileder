"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useCart } from "./CartProvider";
import { useEffect, useState } from "react";

export function Header() {
  const t = useTranslations("nav");
  const announce = useTranslations();
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const links = [
    { href: "/shop", label: t("shop") },
    { href: "/about", label: t("about") },
    { href: "/contact", label: t("contact") },
  ] as const;

  return (
    <div className="sticky top-0 z-40">
      <div className="bg-ink text-center text-[11px] tracking-[0.14em] text-gold/90">
        <p className="px-4 py-2">{announce("announce")}</p>
      </div>
      <header className="border-b border-ink/10 bg-cream/90 backdrop-blur-md">
        <div className="mx-auto flex h-[4.25rem] max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="leading-none">
            <span className="font-serif text-[1.35rem] text-ink">KARIMLI</span>
            <span className="mt-0.5 block text-[9px] uppercase tracking-[0.32em] text-muted">
              Leather
            </span>
          </Link>

          <nav className="hidden items-center gap-9 text-[13px] tracking-[0.06em] md:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`pb-0.5 transition-colors ${
                  pathname === l.href || pathname.startsWith(`${l.href}/`)
                    ? "border-b border-ink text-ink"
                    : "text-muted hover:text-ink"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <a
              href="https://www.instagram.com/karimli.leder/"
              target="_blank"
              rel="noreferrer"
              className="hidden text-muted hover:text-ink sm:block"
              aria-label="Instagram"
            >
              <InstagramIcon />
            </a>
            <Link href="/cart" className="relative text-ink" aria-label={t("cart")}>
              <BagIcon />
              {count > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-cognac px-1 text-[10px] text-cream">
                  {count}
                </span>
              )}
            </Link>
            <button
              type="button"
              className="md:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? t("close") : t("menu")}
            >
              <span className="block h-px w-5 bg-ink" />
              <span className="mt-1.5 block h-px w-5 bg-ink" />
            </button>
          </div>
        </div>
        {open && (
          <div className="border-t border-ink/10 bg-cream px-6 py-6 md:hidden">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="block py-3 font-serif text-2xl">
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </header>
    </div>
  );
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 8h12l-1 13H7L6 8z" />
      <path d="M9 8V7a3 3 0 0 1 6 0v1" />
    </svg>
  );
}
