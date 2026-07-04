import { NextRequest, NextResponse } from "next/server";
import { createOrder, type PaymentMethod } from "@/lib/orders";

const PAYMENT_METHODS: PaymentMethod[] = ["stripe", "paypal", "wise"];

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const b = body as {
    paymentMethod?: string;
    locale?: string;
    customer?: Record<string, string>;
    items?: { productId?: string; size?: string; quantity?: number }[];
  };

  if (!PAYMENT_METHODS.includes(b.paymentMethod as PaymentMethod)) {
    return NextResponse.json({ error: "Invalid payment method" }, { status: 400 });
  }
  const c = b.customer;
  if (!c?.fullName || !c?.email || !c?.phone || !c?.address || !c?.city) {
    return NextResponse.json({ error: "Missing customer fields" }, { status: 400 });
  }
  if (!Array.isArray(b.items) || b.items.length === 0) {
    return NextResponse.json({ error: "Empty cart" }, { status: 400 });
  }

  try {
    const order = await createOrder({
      paymentMethod: b.paymentMethod as PaymentMethod,
      locale: b.locale === "en" ? "en" : "ar",
      customer: {
        fullName: String(c.fullName).slice(0, 120),
        email: String(c.email).slice(0, 160),
        phone: String(c.phone).slice(0, 40),
        address: String(c.address).slice(0, 300),
        city: String(c.city).slice(0, 80),
        emirate: String(c.emirate ?? "").slice(0, 80),
        notes: c.notes ? String(c.notes).slice(0, 600) : undefined,
      },
      items: b.items.map((i) => ({
        productId: String(i.productId ?? ""),
        size: String(i.size ?? "M").slice(0, 6),
        quantity: Number(i.quantity ?? 1),
      })),
    });
    return NextResponse.json({ order: { id: order.id, reference: order.reference, total: order.total } });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Order failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
