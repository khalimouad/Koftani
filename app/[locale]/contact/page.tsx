"use client";

import { use, useState } from "react";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = use(params);
  const locale = (isLocale(raw) ? raw : "ar") as Locale;
  const dict = getDictionary(locale);
  const [sent, setSent] = useState(false);

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <span className="kicker">✦ {dict.brandLatin} ✦</span>
          <h1 className="display">{dict.contact.title}</h1>
          <p>{dict.contact.subtitle}</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="checkout-layout">
            <div>
              {sent ? (
                <div className="alert">{dict.contact.sent}</div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSent(true);
                  }}
                >
                  <div className="form-row">
                    <div className="field">
                      <label htmlFor="c-name">{dict.contact.name}</label>
                      <input id="c-name" required />
                    </div>
                    <div className="field">
                      <label htmlFor="c-email">{dict.contact.email}</label>
                      <input id="c-email" type="email" dir="ltr" required />
                    </div>
                  </div>
                  <div className="field">
                    <label htmlFor="c-msg">{dict.contact.message}</label>
                    <textarea id="c-msg" rows={6} required />
                  </div>
                  <button type="submit" className="btn btn-solid">
                    <span>{dict.contact.send}</span>
                  </button>
                </form>
              )}
            </div>

            <aside className="summary-card">
              <h3>{dict.contact.boutique}</h3>
              <div className="summary-line">
                <span style={{ color: "var(--ivory-dim)" }}>
                  {dict.contact.boutiqueAddr}
                </span>
              </div>
              <div className="summary-line" style={{ marginTop: 10 }}>
                <span>{dict.contact.phone}</span>
                <span dir="ltr" style={{ color: "var(--gold-bright)" }}>
                  +971 4 000 0000
                </span>
              </div>
              <div className="summary-line">
                <span>{dict.contact.email}</span>
                <span dir="ltr" style={{ color: "var(--gold-bright)" }}>
                  care@koftany.com
                </span>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
