import { getTranslations, setRequestLocale } from "next-intl/server";
import { SITE_IMAGES } from "@/lib/images";

type Props = { params: Promise<{ locale: string }> };

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  return (
    <div>
      <div className="relative min-h-[46vh] overflow-hidden bg-ink text-cream">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={SITE_IMAGES.about} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/20" />
        <div className="relative mx-auto flex min-h-[46vh] max-w-6xl flex-col justify-end px-4 py-16 sm:px-6">
          <p className="text-[11px] uppercase tracking-[0.28em] text-gold">{t("eyebrow")}</p>
          <h1 className="mt-3 font-serif text-5xl sm:text-6xl">{t("title")}</h1>
          <p className="mt-4 max-w-xl text-lg text-cream/75">{t("lead")}</p>
        </div>
      </div>
      <article className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <p className="text-lg leading-relaxed text-ink/85">{t("p1")}</p>
        <p className="mt-6 leading-relaxed text-ink/80">{t("p2")}</p>
        <p className="mt-6 leading-relaxed text-ink/80">{t("p3")}</p>
        <div className="mt-12 grid gap-6 border-t border-ink/10 pt-10 sm:grid-cols-3">
          {[t("v1"), t("v2"), t("v3")].map((v) => (
            <p key={v} className="font-serif text-xl">
              {v}
            </p>
          ))}
        </div>
      </article>
    </div>
  );
}
