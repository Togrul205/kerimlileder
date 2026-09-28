import { NextResponse } from "next/server";
import Stripe from "stripe";
import {
  appUrl,
  checkoutSchema,
  createPendingOrder,
  markOrderPaid,
} from "@/lib/checkout";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = checkoutSchema.parse(await req.json());
    const { order, lines } = await createPendingOrder(body);
    const base = appUrl();
    const success = `${base}/${body.locale}/checkout/success?order=${order.id}`;
    const cancel = `${base}/${body.locale}/checkout`;

    if (body.method === "demo") {
      await markOrderPaid(order.id, "demo");
      return NextResponse.json({ url: success });
    }

    if (body.method === "stripe") {
      const key = process.env.STRIPE_SECRET_KEY;
      if (!key) {
        return NextResponse.json({ error: "Stripe is not configured" }, { status: 503 });
      }
      const stripe = new Stripe(key);
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        customer_email: body.email,
        success_url: success,
        cancel_url: cancel,
        metadata: { orderId: order.id },
        line_items: [
          ...lines.map((l) => ({
            quantity: l.quantity,
            price_data: {
              currency: "eur",
              unit_amount: l.unitPrice,
              product_data: { name: `${l.productName} — ${l.variantName}` },
            },
          })),
          {
            quantity: 1,
            price_data: {
              currency: "eur",
              unit_amount: order.shippingCents,
              product_data: { name: "Shipping / Versand" },
            },
          },
        ],
      });
      await prisma.order.update({
        where: { id: order.id },
        data: { paymentId: session.id },
      });
      return NextResponse.json({ url: session.url });
    }

    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      return NextResponse.json({ error: "PayPal is not configured" }, { status: 503 });
    }

    const token = await paypalToken(clientId, clientSecret);
    const paypalRes = await fetch(`${paypalBase()}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            custom_id: order.id,
            amount: {
              currency_code: "EUR",
              value: (order.totalCents / 100).toFixed(2),
            },
          },
        ],
        application_context: {
          return_url: `${base}/api/checkout/paypal/capture?orderId=${order.id}&locale=${body.locale}`,
          cancel_url: cancel,
          brand_name: "KARIMLI Leather",
        },
      }),
    });
    const paypalJson = await paypalRes.json();
    const approve = paypalJson.links?.find((l: { rel: string }) => l.rel === "approve")?.href;
    if (!approve) {
      return NextResponse.json({ error: "PayPal order failed" }, { status: 502 });
    }
    await prisma.order.update({
      where: { id: order.id },
      data: { paymentId: paypalJson.id },
    });
    return NextResponse.json({ url: approve });
  } catch (err) {
    const message = err instanceof Error ? err.message : "error";
    const status = message === "OUT_OF_STOCK" || message === "INVALID_ITEMS" ? 400 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

function paypalBase() {
  return process.env.PAYPAL_MODE === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
}

async function paypalToken(id: string, secret: string) {
  const res = await fetch(`${paypalBase()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  const json = await res.json();
  return json.access_token as string;
}
