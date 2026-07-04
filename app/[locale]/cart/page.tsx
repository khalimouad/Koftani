"use client";

import Link from "next/link";
import { use } from "react";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { formatPrice, getProductById } from "@/lib/products";
import { useCart } from "@/lib/cart";

export default function CartPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = use(params);
  const locale = (isLocale(raw) ? raw : "ar") as Locale;
  const dict = getDictionary(locale);
  const { lines, removeLine, setQuantity } = useCart();

  const detailed = lines
    .map((line) => ({ line, product: getProductById(line.productId) }))
    .filter((x) => x.product);

  const subtotal = detailed.reduce(
    (s, x) => s + x.product!.price * x.line.quantity,
    0
  );

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <span className="kicker">✦ {dict.brandLatin} ✦</span>
          <h1 className="display">{dict.cart.title}</h1>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {detailed.length === 0 ? (
            <div className="empty-state">
              <p className="display">{dict.cart.empty}</p>
              <Link href={`/${locale}/collection`} className="btn">
                <span>{dict.cart.emptyCta}</span>
              </Link>
            </div>
          ) : (
            <div className="checkout-layout">
              <div className="cart-table">
                {detailed.map(({ line, product }) => (
                  <div className="cart-row" key={`${line.productId}-${line.size}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={product!.image} alt={product!.name[locale]} />
                    <div>
                      <Link
                        href={`/${locale}/product/${product!.slug}`}
                        style={{ fontWeight: 700, fontSize: 16.5 }}
                      >
                        {product!.name[locale]}
                      </Link>
                      <div style={{ color: "var(--muted)", fontSize: 13.5, marginTop: 4 }}>
                        {dict.product.size}: {line.size}
                      </div>
                      <div style={{ color: "var(--gold-bright)", marginTop: 6, fontSize: 15 }}>
                        {formatPrice(product!.price, locale)}
                      </div>
                    </div>
                    <div className="qty-control">
                      <button
                        type="button"
                        aria-label="-"
                        onClick={() =>
                          setQuantity(line.productId, line.size, line.quantity - 1)
                        }
                      >
                        −
                      </button>
                      <span className="qty-num">{line.quantity}</span>
                      <button
                        type="button"
                        aria-label="+"
                        onClick={() =>
                          setQuantity(line.productId, line.size, line.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                    <div style={{ fontWeight: 700 }}>
                      {formatPrice(product!.price * line.quantity, locale)}
                    </div>
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => removeLine(line.productId, line.size)}
                    >
                      {dict.cart.remove}
                    </button>
                  </div>
                ))}
                <div style={{ marginTop: 30 }}>
                  <Link href={`/${locale}/collection`} className="btn btn-ghost">
                    <span>{dict.cart.continueShopping}</span>
                  </Link>
                </div>
              </div>

              <aside className="summary-card">
                <h3>{dict.checkout.orderSummary}</h3>
                <div className="summary-line">
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
                <div style={{ marginTop: 26 }}>
                  <Link href={`/${locale}/checkout`} className="btn btn-solid btn-wide">
                    <span>{dict.cart.checkout}</span>
                  </Link>
                </div>
                <div className="secure-note">🔒 {dict.checkout.secure}</div>
              </aside>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
