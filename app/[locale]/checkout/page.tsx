"use client";

import Link from "next/link";
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { formatPrice, getProductById } from "@/lib/products";
import { useCart } from "@/lib/cart";
import type { PaymentMethod } from "@/lib/orders";

export default function CheckoutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = use(params);
  const locale = (isLocale(raw) ? raw : "ar") as Locale;
  const dict = getDictionary(locale);
  const router = useRouter();
  const { lines, clear } = useCart();

  const [method, setMethod] = useState<PaymentMethod>("stripe");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    emirate: dict.checkout.emirates[0],
    notes: "",
  });

  const detailed = lines
    .map((line) => ({ line, product: getProductById(line.productId) }))
    .filter((x) => x.product);
  const subtotal = detailed.reduce(
    (s, x) => s + x.product!.price * x.line.quantity,
    0
  );

  const set = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.fullName || !form.email || !form.phone || !form.address || !form.city) {
      setError(dict.checkout.required);
      return;
    }
    if (lines.length === 0) return;

    setBusy(true);
    try {
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentMethod: method,
          locale,
          customer: form,
          items: lines,
        }),
      });
      if (!orderRes.ok) throw new Error("order");
      const { order } = await orderRes.json();

      if (method === "wise") {
        clear();
        router.push(`/${locale}/checkout/success?order=${order.id}`);
        return;
      }

      const payRes = await fetch(`/api/checkout/${method}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id, locale }),
      });
      if (!payRes.ok) throw new Error("payment");
      const data = await payRes.json();

      if (data.demo) {
        clear();
        router.push(`/${locale}/checkout/success?order=${order.id}&demo=1`);
        return;
      }
      if (data.url) {
        clear();
        window.location.href = data.url;
        return;
      }
      throw new Error("payment");
    } catch {
      setError(dict.checkout.errorGeneric);
      setBusy(false);
    }
  }

  if (detailed.length === 0) {
    return (
      <section className="section">
        <div className="container empty-state">
          <p className="display">{dict.cart.empty}</p>
          <Link href={`/${locale}/collection`} className="btn">
            <span>{dict.cart.emptyCta}</span>
          </Link>
        </div>
      </section>
    );
  }

  const payOptions: {
    id: PaymentMethod;
    title: string;
    desc: string;
    mark: string;
  }[] = [
    { id: "stripe", title: dict.checkout.payCard, desc: dict.checkout.payCardDesc, mark: "STRIPE" },
    { id: "paypal", title: dict.checkout.payPaypal, desc: dict.checkout.payPaypalDesc, mark: "PAYPAL" },
    { id: "wise", title: dict.checkout.payWise, desc: dict.checkout.payWiseDesc, mark: "WISE" },
  ];

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <span className="kicker">✦ {dict.brandLatin} ✦</span>
          <h1 className="display">{dict.checkout.title}</h1>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <form className="checkout-layout" onSubmit={submit} noValidate>
            <div>
              {error && <div className="alert alert-error">{error}</div>}

              <h2 className="checkout-section-title">
                <span className="num">01</span> {dict.checkout.contact}
              </h2>
              <div className="field">
                <label htmlFor="fullName">{dict.checkout.fullName} *</label>
                <input id="fullName" value={form.fullName} onChange={set("fullName")} required />
              </div>
              <div className="form-row">
                <div className="field">
                  <label htmlFor="email">{dict.checkout.email} *</label>
                  <input id="email" type="email" dir="ltr" value={form.email} onChange={set("email")} required />
                </div>
                <div className="field">
                  <label htmlFor="phone">{dict.checkout.phone} *</label>
                  <input id="phone" type="tel" dir="ltr" placeholder="+971…" value={form.phone} onChange={set("phone")} required />
                </div>
              </div>

              <h2 className="checkout-section-title" style={{ marginTop: 40 }}>
                <span className="num">02</span> {dict.checkout.shippingAddr}
              </h2>
              <div className="field">
                <label htmlFor="address">{dict.checkout.address} *</label>
                <input id="address" value={form.address} onChange={set("address")} required />
              </div>
              <div className="form-row">
                <div className="field">
                  <label htmlFor="city">{dict.checkout.city} *</label>
                  <input id="city" value={form.city} onChange={set("city")} required />
                </div>
                <div className="field">
                  <label htmlFor="emirate">{dict.checkout.emirate} *</label>
                  <select id="emirate" value={form.emirate} onChange={set("emirate")}>
                    {dict.checkout.emirates.map((em) => (
                      <option key={em} value={em}>{em}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="field">
                <label htmlFor="notes">{dict.checkout.notes}</label>
                <textarea id="notes" rows={3} value={form.notes} onChange={set("notes")} />
              </div>

              <h2 className="checkout-section-title" style={{ marginTop: 40 }}>
                <span className="num">03</span> {dict.checkout.payment}
              </h2>
              {payOptions.map((opt) => (
                <div
                  key={opt.id}
                  className={`pay-option ${method === opt.id ? "active" : ""}`}
                  onClick={() => setMethod(opt.id)}
                  role="radio"
                  aria-checked={method === opt.id}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") setMethod(opt.id);
                  }}
                >
                  <span className="pay-radio" />
                  <div>
                    <h4>
                      {opt.title} <span className="pay-mark">{opt.mark}</span>
                    </h4>
                    <p>{opt.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <aside className="summary-card">
              <h3>{dict.checkout.orderSummary}</h3>
              {detailed.map(({ line, product }) => (
                <div className="summary-item" key={`${line.productId}-${line.size}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={product!.image} alt="" />
                  <div style={{ flex: 1 }}>
                    <div className="si-name">{product!.name[locale]}</div>
                    <div className="si-meta">
                      {dict.product.size}: {line.size} · ×{line.quantity}
                    </div>
                  </div>
                  <div style={{ fontSize: 14.5, fontWeight: 700 }}>
                    {formatPrice(product!.price * line.quantity, locale)}
                  </div>
                </div>
              ))}
              <div className="summary-line" style={{ marginTop: 16 }}>
                <span>{dict.cart.subtotal}</span>
                <span>{formatPrice(subtotal, locale)}</span>
              </div>
              <div className="summary-line">
                <span>{dict.cart.shipping}</span>
                <span>{dict.cart.shippingFree}</span>
              </div>
              <div className="summary-line total">
                <span>{dict.cart.total}</span>
                <span className="amount">{formatPrice(subtotal, locale)}</span>
              </div>
              <div style={{ marginTop: 28 }}>
                <button type="submit" className="btn btn-solid btn-wide" disabled={busy}>
                  <span>{busy ? dict.checkout.processing : dict.checkout.placeOrder}</span>
                </button>
              </div>
              <div className="secure-note">🔒 {dict.checkout.secure}</div>
            </aside>
          </form>
        </div>
      </section>
    </>
  );
}
