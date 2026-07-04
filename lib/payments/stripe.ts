import Stripe from "stripe";
import type { Order } from "../orders";

function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

/**
 * Creates a Stripe Checkout Session for the order.
 * Returns the hosted checkout URL, or null when Stripe is not configured
 * (the caller then falls back to demo mode).
 */
export async function createStripeCheckout(
  order: Order,
  locale: string,
  origin: string
): Promise<string | null> {
  const stripe = getStripe();
  if (!stripe) return null;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    locale: locale === "ar" ? "auto" : "en",
    customer_email: order.customer.email,
    client_reference_id: order.id,
    line_items: order.items.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: "aed",
        unit_amount: Math.round(item.unitPrice * 100),
        product_data: {
          name: `${item.name} — Size ${item.size}`,
          metadata: { productId: item.productId },
        },
      },
    })),
    metadata: { orderId: order.id, reference: order.reference },
    success_url: `${origin}/${locale}/checkout/success?order=${order.id}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/${locale}/checkout`,
  });

  return session.url;
}

/** Returns true when the checkout session has been paid. */
export async function verifyStripeSession(sessionId: string): Promise<boolean> {
  const stripe = getStripe();
  if (!stripe) return false;
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return session.payment_status === "paid";
  } catch {
    return false;
  }
}

export function constructStripeEvent(
  payload: string,
  signature: string
): Stripe.Event | null {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) return null;
  try {
    return stripe.webhooks.constructEvent(payload, signature, secret);
  } catch {
    return null;
  }
}
