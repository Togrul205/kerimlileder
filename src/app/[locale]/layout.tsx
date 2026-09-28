import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { CartProvider } from "@/components/CartProvider";
import { StoreChrome } from "@/components/StoreChrome";

export const dynamic = "force-dynamic";

const serif = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-serif-display",
});

const sans = Outfit({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans-body",
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: { default: t("title"), template: "%s · KARIMLI Leather" },
    description: t("description"),
    icons: { icon: "/favicon.svg" },
    openGraph: {
      title: t("title"),
      description: t("description"),
      locale: locale === "az" ? "az_AZ" : "de_DE",
      type: "website",
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!(routing.locales as readonly string[]).includes(locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${serif.variable} ${sans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-cream text-ink">
        <NextIntlClientProvider messages={messages}>
          <CartProvider>
            <StoreChrome>{children}</StoreChrome>
          </CartProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
