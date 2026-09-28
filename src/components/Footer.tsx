"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { NewsletterForm } from "./NewsletterForm";

export function Footer() {
  const t = useTranslations("footer");
  const legal = useTranslations("legal");
  const nav = useTranslations("nav");
  const home = useTranslations("home");
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-ink text-cream">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-serif text-3xl">KARIMLI</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-gold/90">{t("tagline")}</p>
          <p className="mt-6 text-xs uppercase tracking-[0.16em] text-cream/50">
            {t("newsletter")}
          </p>
          <p className="mt-1 text-sm text-cream/60">{home("newsletterHint")}</p>
          <NewsletterForm />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-gold">{t("explore")}</p>
          <div className="mt-4 space-y-2.5 text-sm">
            <Link href="/shop" className="block text-cream/80 hover:text-gold">
              {nav("shop")}
            </Link>
            <Link href="/about" className="block text-cream/80 hover:text-gold">
              {nav("about")}
            </Link>
            <Link href="/contact" className="block text-cream/80 hover:text-gold">
              {nav("contact")}
            </Link>
            <a
              href="https://www.instagram.com/karimli.leder/"
              className="block text-cream/80 hover:text-gold"
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>
            <a
              href="https://www.etsy.com/de/shop/KarimliLeder"
              className="block text-cream/80 hover:text-gold"
              target="_blank"
              rel="noreferrer"
            >
              Etsy
            </a>
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-gold">{t("legalCol")}</p>
          <div className="mt-4 space-y-2.5 text-sm">
            <Link href="/impressum" className="block text-cream/80 hover:text-gold">
              {legal("impressum")}
            </Link>
            <Link href="/privacy" className="block text-cream/80 hover:text-gold">
              {legal("privacy")}
            </Link>
            <Link href="/terms" className="block text-cream/80 hover:text-gold">
              {legal("terms")}
            </Link>
            <Link href="/withdrawal" className="block text-cream/80 hover:text-gold">
              {legal("withdrawal")}
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-cream/10 py-4 text-center text-xs text-cream/50">
        © {year} KARIMLI Leather. {t("rights")}
      </div>
    </footer>
  );
}
