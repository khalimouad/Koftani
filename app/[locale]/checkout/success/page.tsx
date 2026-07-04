import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { formatPrice } from "@/lib/products";
import { getOrder, updateOrder } from "@/lib/orders";
import { verifyStripeSession } from "@/lib/payments/stripe";

export const dynamic = "force-dynamic";

export default async function SuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ order?: string; session_id?: string; demo?: string }>;
}) {
  const { locale: raw } = await params;
  const { order: orderId, session_id: sessionId, demo } = await searchParams;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);

  let order = orderId ? await getOrder(orderId) : undefined;
  if (!order) notFound();

  // Returning from Stripe Checkout: verify the session server-side.
  if (sessionId && order.status === "pending") {
    const paid = await verifyStripeSession(sessionId);
    if (paid) {
      order = (await updateOrder(order.id, { status: "paid", paymentId: sessionId })) ?? order;
    }
  }
  if (demo === "1" && order.status === "pending") {
    order = (await updateOrder(order.id, { status: "test" })) ?? order;
  }
  if (order.paymentMethod === "wise" && order.status === "pending") {
    order = (await updateOrder(order.id, { status: "pending_transfer" })) ?? order;
  }

  const statusLabel =
    dict.success.status[order.status as keyof typeof dict.success.status] ??
    dict.success.status.pending;

  const wise = {
    account: process.env.WISE_ACCOUNT_NAME || "Koftany FZ-LLC",
    iban: process.env.WISE_IBAN || "BE00 0000 0000 0000",
    bic: process.env.WISE_BIC || "TRWIBEB1XXX",
  };

  return (
    <section className="section">
      <div className="container">
        <div className="success-wrap">
          <div className="success-seal">✦</div>
          <span className="kicker" style={{ justifyContent: "center" }}>
            {dict.brandLatin}
          </span>
          <h1 className="display" style={{ fontSize: 44, marginTop: 14 }}>
            {dict.success.title}
          </h1>
          <p style={{ color: "var(--ivory-dim)", marginTop: 12 }}>
            {dict.success.subtitle}
          </p>

          <div className="order-ref-box">
            <div style={{ fontSize: 12, letterSpacing: "0.2em", color: "var(--muted)", textTransform: "uppercase" }}>
              {dict.success.orderRef}
            </div>
            <div className="ref">{order.reference}</div>
          </div>

          <div>
            <span className="status-pill">{statusLabel}</span>
            <span className="status-pill" style={{ marginInlineStart: 10 }}>
              {formatPrice(order.total, locale)}
            </span>
          </div>

          {demo === "1" && (
            <div className="alert" style={{ marginTop: 30, textAlign: "start" }}>
              {dict.success.demoNote}
            </div>
          )}

          {order.paymentMethod === "wise" ? (
            <div className="wise-box">
              <h3>{dict.success.wiseTitle}</h3>
              <p style={{ color: "var(--ivory-dim)", fontSize: 15, marginBottom: 20 }}>
                {dict.success.wiseIntro}
              </p>
              <div className="wise-detail">
                <span className="k">{dict.success.wiseAccount}</span>
                <span className="v">{wise.account}</span>
              </div>
              <div className="wise-detail">
                <span className="k">{dict.success.wiseIban}</span>
                <span className="v">{wise.iban}</span>
              </div>
              <div className="wise-detail">
                <span className="k">{dict.success.wiseBic}</span>
                <span className="v">{wise.bic}</span>
              </div>
              <div className="wise-detail" style={{ borderBottom: "none" }}>
                <span className="k">{dict.success.wiseRef}</span>
                <span className="v" style={{ color: "var(--gold-bright)" }}>
                  {order.reference}
                </span>
              </div>
              <p style={{ color: "var(--muted)", fontSize: 13.5, marginTop: 18 }}>
                {dict.success.wiseNote}
              </p>
            </div>
          ) : (
            <p style={{ color: "var(--muted)", marginTop: 26, fontSize: 14.5 }}>
              {dict.success.emailNote}
            </p>
          )}

          <div style={{ marginTop: 46 }}>
            <Link href={`/${locale}`} className="btn">
              <span>{dict.success.backHome}</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
