"use client";

import Link from "next/link";
import { useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export default function Footer({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="logo" style={{ textAlign: "start" }}>
              <span className="logo-main" style={{ fontSize: 26 }}>
                {locale === "ar" ? "قفطاني" : "Koftany"}
              </span>
              <span className="logo-sub">MAISON DE CAFTAN · DUBAI</span>
            </div>
            <p className="footer-desc">{dict.footer.desc}</p>
          </div>

          <div>
            <h4>{dict.footer.shop}</h4>
            <ul className="footer-links">
              <li>
                <Link href={`/${locale}/collection`}>{dict.nav.collection}</Link>
              </li>
              <li>
                <Link href={`/${locale}/collection?cat=caftan`}>
                  {locale === "ar" ? "قفاطين" : "Caftans"}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/collection?cat=takchita`}>
                  {locale === "ar" ? "تكاشط" : "Takchitas"}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/collection?cat=gandoura`}>
                  {locale === "ar" ? "جنادر" : "Gandouras"}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4>{dict.footer.house}</h4>
            <ul className="footer-links">
              <li>
                <Link href={`/${locale}/about`}>{dict.nav.about}</Link>
              </li>
              <li>
                <Link href={`/${locale}/contact`}>{dict.nav.contact}</Link>
              </li>
              <li>
                <Link href={`/${locale}/contact`}>{dict.footer.shippingReturns}</Link>
              </li>
              <li>
                <Link href={`/${locale}/contact`}>{dict.footer.care}</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4>{dict.footer.newsletter}</h4>
            <p className="footer-desc" style={{ marginTop: 0, marginBottom: 18 }}>
              {dict.footer.newsletterText}
            </p>
            {subscribed ? (
              <p style={{ color: "var(--gold-bright)", fontSize: 14.5 }}>
                {dict.footer.subscribed}
              </p>
            ) : (
              <form
                className="newsletter-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubscribed(true);
                }}
              >
                <input
                  type="email"
                  required
                  placeholder={dict.footer.newsletterPlaceholder}
                  aria-label={dict.footer.newsletterPlaceholder}
                />
                <button type="submit">{dict.footer.subscribe}</button>
              </form>
            )}
          </div>
        </div>

        <div className="footer-bottom">
          <span>{dict.footer.rights}</span>
          <div className="pay-badges" aria-label={dict.footer.payments}>
            <span className="pay-badge">Visa</span>
            <span className="pay-badge">Mastercard</span>
            <span className="pay-badge">Stripe</span>
            <span className="pay-badge">PayPal</span>
            <span className="pay-badge">Wise</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
