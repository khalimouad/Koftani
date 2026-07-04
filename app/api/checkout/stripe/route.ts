import { NextRequest, NextResponse } from "next/server";
import { getOrder, updateOrder } from "@/lib/orders";
import { createStripeCheckout } from "@/lib/payments/stripe";

export async function POST(request: NextRequest) {
  const { orderId, locale = "ar" } = await request.json().catch(() => ({}));
  if (!orderId) {
    return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
  }
  const order = await getOrder(orderId);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const origin = request.nextUrl.origin;

  try {
    const url = await createStripeCheckout(order, locale, origin);
    if (!url) {
      // Stripe not configured — record a demo/test order instead of failing.
      await updateOrder(order.id, { status: "test" });
      return NextResponse.json({ demo: true });
    }
    return NextResponse.json({ url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json({ error: "Stripe error" }, { status: 502 });
  }
}
