import { NextRequest, NextResponse } from "next/server";
import { appUrl, markOrderPaid } from "@/lib/checkout";
import { prisma } from "@/lib/prisma";

function paypalBase() {
  return process.env.PAYPAL_MODE === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
}

async function paypalToken() {
  const id = process.env.PAYPAL_CLIENT_ID!;
  const secret = process.env.PAYPAL_CLIENT_SECRET!;
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

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const orderId = req.nextUrl.searchParams.get("orderId");
  const locale = req.nextUrl.searchParams.get("locale") || "de";
  const success = `${appUrl()}/${locale}/checkout/success?order=${orderId ?? ""}`;
  const cancel = `${appUrl()}/${locale}/checkout`;

  if (!token || !orderId) {
    return NextResponse.redirect(cancel);
  }

  try {
    const access = await paypalToken();
    const capture = await fetch(`${paypalBase()}/v2/checkout/orders/${token}/capture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access}`,
        "Content-Type": "application/json",
      },
    });
    if (!capture.ok) {
      return NextResponse.redirect(cancel);
    }
    await prisma.order.update({
      where: { id: orderId },
      data: { paymentId: token },
    });
    await markOrderPaid(orderId, token);
    return NextResponse.redirect(success);
  } catch {
    return NextResponse.redirect(cancel);
  }
}
