import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactForm } from "@/components/ContactForm";

type Props = { params: Promise<{ locale: string }> };

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <p className="text-[11px] uppercase tracking-[0.22em] text-gold">Studio</p>
        <h1 className="mt-2 font-serif text-5xl">{t("title")}</h1>
        <p className="mt-4 text-muted">{t("intro")}</p>
        <dl className="mt-10 space-y-5 text-sm">
          <div>
            <dt className="text-xs uppercase tracking-[0.14em] text-muted">{t("studio")}</dt>
            <dd className="mt-1">{t("hours")}</dd>
            <dd className="text-muted">{t("reply")}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.14em] text-muted">{t("email")}</dt>
            <dd className="mt-1">hello@karimlileder.com</dd>
          </div>
          <div className="space-y-2">
            <a className="block text-cognac underline-offset-4 hover:underline" href="https://www.instagram.com/karimli.leder/" target="_blank" rel="noreferrer">
              {t("instagram")} — @karimli.leder
            </a>
            <a className="block text-cognac underline-offset-4 hover:underline" href="https://www.etsy.com/de/shop/KarimliLeder" target="_blank" rel="noreferrer">
              {t("etsy")}
            </a>
          </div>
        </dl>
      </div>
      <div className="border border-ink/10 bg-parchment p-6 sm:p-8 lg:col-span-7">
        <ContactForm />
      </div>
    </div>
  );
}
