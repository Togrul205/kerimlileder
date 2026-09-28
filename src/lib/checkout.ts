import { z } from "zod";
import { prisma } from "./prisma";
import { shippingCentsForCountry } from "./shipping";
import { upsertCustomer } from "./customers";

export const checkoutSchema = z.object({
  locale: z.enum(["az", "de"]).default("de"),
  method: z.enum(["stripe", "paypal", "demo"]),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(5),
  address: z.string().min(3),
  city: z.string().min(2),
  postalCode: z.string().min(3),
  country: z.string().min(2),
  items: z
    .array(z.object({ variantId: z.string(), quantity: z.number().int().min(1) }))
    .min(1),
});

export async function createPendingOrder(input: z.infer<typeof checkoutSchema>) {
  const variants = await prisma.productVariant.findMany({
    where: { id: { in: input.items.map((i) => i.variantId) } },
    include: { product: true },
  });

  if (variants.length !== input.items.length) {
    throw new Error("INVALID_ITEMS");
  }

  const lines = input.items.map((item) => {
    const variant = variants.find((v) => v.id === item.variantId);
    if (!variant || variant.stock < item.quantity) {
      throw new Error("OUT_OF_STOCK");
    }
    const productName =
      input.locale === "az" ? variant.product.nameAz : variant.product.nameDe;
    const variantName = input.locale === "az" ? variant.nameAz : variant.nameDe;
    return {
      variantId: variant.id,
      productName,
      variantName,
      quantity: item.quantity,
      unitPrice: variant.price,
    };
  });

  const subtotal = lines.reduce((n, l) => n + l.unitPrice * l.quantity, 0);
  const shippingCents = shippingCentsForCountry(input.country, subtotal);
  const totalCents = subtotal + shippingCents;

  const customer = await upsertCustomer({
    email: input.email,
    name: input.name,
    phone: input.phone,
    address: input.address,
    city: input.city,
    postalCode: input.postalCode,
    country: input.country,
  });

  const order = await prisma.order.create({
    data: {
      email: input.email,
      name: input.name,
      phone: input.phone,
      address: input.address,
      city: input.city,
      postalCode: input.postalCode,
      country: input.country,
      shippingCents,
      totalCents,
      status: "pending",
      paymentMethod: input.method,
      locale: input.locale,
      customerId: customer.id,
      items: { create: lines },
    },
  });

  return { order, lines };
}

export async function markOrderPaid(orderId: string, paymentId?: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
  if (!order || order.status === "paid") return order;

  await prisma.$transaction(async (tx) => {
    for (const item of order.items) {
      await tx.productVariant.update({
        where: { id: item.variantId },
        data: { stock: { decrement: item.quantity } },
      });
    }
    await tx.order.update({
      where: { id: orderId },
      data: { status: "paid", paymentId: paymentId ?? order.paymentId },
    });
  });

  return prisma.order.findUnique({ where: { id: orderId } });
}

export function appUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}
