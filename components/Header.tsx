"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { useCart } from "@/lib/cart";

export default function Header({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const { count } = useCart();
  const pathname = usePathname();
  const otherLocale = locale === "ar" ? "en" : "ar";
  const switchedPath = pathname.replace(`/${locale}`, `/${otherLocale}`);

  const nav = [
    { href: `/${locale}`, label: dict.nav.home },
    { href: `/${locale}/collection`, label: dict.nav.collection },
    { href: `/${locale}/about`, label: dict.nav.about },
    { href: `/${locale}/contact`, label: dict.nav.contact },
  ];

  return (
    <header className="header">
      <div className="header-topbar">
        {locale === "ar"
          ? "توصيل مجاني خلال ٤٨ ساعة في جميع أنحاء الإمارات ✦ تفصيل حسب الطلب"
          : "Free 48h delivery across the UAE ✦ Made-to-measure available"}
      </div>
      <div className="container">
        <div className="header-inner">
          <nav className="header-nav" aria-label="Main">
            {nav.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>

          <Link href={`/${locale}`} className="logo" aria-label="Koftany">
            <span className="logo-main">
              {locale === "ar" ? "قفطاني" : "Koftany"}
            </span>
            <span className="logo-sub">
              {locale === "ar" ? "KOFTANY · DUBAI" : "MAISON DE CAFTAN · DUBAI"}
            </span>
          </Link>

          <div className="header-actions">
            <Link
              href={switchedPath || `/${otherLocale}`}
              className="lang-switch"
              aria-label="Switch language"
            >
              {otherLocale === "ar" ? "العربية" : "EN"}
            </Link>
            <Link href={`/${locale}/cart`} className="cart-link">
              {dict.nav.cart}
              <span className="cart-count">{count}</span>
            </Link>
          </div>
        </div>
      </div>
      <nav className="mobile-nav container" aria-label="Mobile">
        {nav.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
