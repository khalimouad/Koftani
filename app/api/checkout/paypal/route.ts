import { NextRequest, NextResponse } from "next/server";
import { getOrder, updateOrder } from "@/lib/orders";
import { createPayPalOrder } from "@/lib/payments/paypal";

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
    const result = await createPayPalOrder(order, locale, origin);
    if (!result) {
      // PayPal not configured — record a demo/test order instead of failing.
      await updateOrder(order.id, { status: "test" });
      return NextResponse.json({ demo: true });
    }
    await updateOrder(order.id, { paymentId: result.paypalOrderId });
    return NextResponse.json({ url: result.approvalUrl });
  } catch (err) {
    console.error("PayPal checkout error:", err);
    return NextResponse.json({ error: "PayPal error" }, { status: 502 });
  }
}
