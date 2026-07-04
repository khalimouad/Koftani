import { NextRequest, NextResponse } from "next/server";
import { updateOrder } from "@/lib/orders";
import { constructStripeEvent } from "@/lib/payments/stripe";

/**
 * Stripe webhook: marks orders as paid on checkout.session.completed.
 * Configure the endpoint in the Stripe dashboard and set STRIPE_WEBHOOK_SECRET.
 */
export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const payload = await request.text();
  const event = constructStripeEvent(payload, signature);
  if (!event) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata?.orderId ?? session.client_reference_id;
    if (orderId && session.payment_status === "paid") {
      await updateOrder(orderId, { status: "paid", paymentId: session.id });
    }
  }

  return NextResponse.json({ received: true });
}
