import { NextRequest, NextResponse } from "next/server";
import { getOrder, updateOrder } from "@/lib/orders";
import { capturePayPalOrder } from "@/lib/payments/paypal";

/** PayPal return URL: captures the approved payment then shows the receipt. */
export async function GET(request: NextRequest) {
  const orderId = request.nextUrl.searchParams.get("order");
  const paypalToken = request.nextUrl.searchParams.get("token"); // PayPal order id
  const locale = request.nextUrl.searchParams.get("locale") === "en" ? "en" : "ar";
  const origin = request.nextUrl.origin;

  if (!orderId || !paypalToken) {
    return NextResponse.redirect(`${origin}/${locale}/checkout`);
  }
  const order = await getOrder(orderId);
  if (!order) {
    return NextResponse.redirect(`${origin}/${locale}/checkout`);
  }

  const captured = await capturePayPalOrder(paypalToken);
  if (captured) {
    await updateOrder(order.id, { status: "paid", paymentId: paypalToken });
  }
  return NextResponse.redirect(
    `${origin}/${locale}/checkout/success?order=${order.id}`
  );
}
