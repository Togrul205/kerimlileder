import { setRequestLocale } from "next-intl/server";
import { CheckoutForm } from "@/components/CheckoutForm";

type Props = { params: Promise<{ locale: string }> };

export default async function CheckoutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const stripeOn = Boolean(process.env.STRIPE_SECRET_KEY);
  const paypalOn = Boolean(
    process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET,
  );
  return <CheckoutForm stripeEnabled={stripeOn} paypalEnabled={paypalOn} />;
}
