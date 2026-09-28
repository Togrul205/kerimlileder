import { prisma } from "./prisma";

export async function upsertCustomer(input: {
  email: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}) {
  const email = input.email.trim().toLowerCase();
  return prisma.customer.upsert({
    where: { email },
    create: { ...input, email },
    update: {
      name: input.name,
      phone: input.phone,
      address: input.address,
      city: input.city,
      postalCode: input.postalCode,
      country: input.country,
    },
  });
}

export async function backfillCustomers() {
  const orders = await prisma.order.findMany({
    where: { customerId: null },
    orderBy: { createdAt: "desc" },
  });
  for (const o of orders) {
    const customer = await upsertCustomer({
      email: o.email,
      name: o.name,
      phone: o.phone,
      address: o.address,
      city: o.city,
      postalCode: o.postalCode,
      country: o.country,
    });
    await prisma.order.update({
      where: { id: o.id },
      data: { customerId: customer.id },
    });
  }
}
