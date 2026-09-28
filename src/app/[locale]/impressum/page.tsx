import { LegalPage } from "@/components/LegalPage";

type Props = { params: Promise<{ locale: string }> };

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return <LegalPage locale={locale} ns="impressum" />;
}
