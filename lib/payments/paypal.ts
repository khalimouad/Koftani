import type { Order } from "../orders";

const PAYPAL_BASE =
  process.env.PAYPAL_ENV === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

export function isPayPalConfigured(): boolean {
  return Boolean(
    process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET
  );
}

async function getAccessToken(): Promise<string> {
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");
  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`PayPal auth failed: ${res.status}`);
  const data = await res.json();
  return data.access_token as string;
}

/**
 * Creates a PayPal order and returns the approval URL, or null when
 * PayPal is not configured (caller falls back to demo mode).
 * PayPal does not support AED settlement for all accounts, so the charge
 * is made in USD using a configurable conversion rate.
 */
export async function createPayPalOrder(
  order: Order,
  locale: string,
  origin: string
): Promise<{ approvalUrl: string; paypalOrderId: string } | null> {
  if (!isPayPalConfigured()) return null;

  const rate = Number(process.env.AED_TO_USD_RATE || "0.2723");
  const usdTotal = (order.total * rate).toFixed(2);

  const token = await getAccessToken();
  const res = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: order.id,
          custom_id: order.reference,
          description: `Koftany order ${order.reference}`,
          amount: { currency_code: "USD", value: usdTotal },
        },
      ],
      application_context: {
        brand_name: "KOFTANY",
        user_action: "PAY_NOW",
        return_url: `${origin}/api/checkout/paypal/capture?order=${order.id}&locale=${locale}`,
        cancel_url: `${origin}/${locale}/checkout`,
      },
    }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`PayPal order creation failed: ${res.status}`);
  const data = await res.json();
  const approvalUrl = (data.links as { rel: string; href: string }[]).find(
    (l) => l.rel === "approve"
  )?.href;
  if (!approvalUrl) throw new Error("PayPal approval link missing");
  return { approvalUrl, paypalOrderId: data.id as string };
}

/** Captures an approved PayPal order. Returns true when completed. */
export async function capturePayPalOrder(
  paypalOrderId: string
): Promise<boolean> {
  if (!isPayPalConfigured()) return false;
  const token = await getAccessToken();
  const res = await fetch(
    `${PAYPAL_BASE}/v2/checkout/orders/${paypalOrderId}/capture`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );
  if (!res.ok) return false;
  const data = await res.json();
  return data.status === "COMPLETED";
}
