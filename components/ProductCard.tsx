import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { categoryNames, formatPrice, type Product } from "@/lib/products";

export default function ProductCard({
  product,
  locale,
  dict,
}: {
  product: Product;
  locale: Locale;
  dict: Dictionary;
}) {
  const badgeLabel =
    product.badge === "new"
      ? dict.misc.newBadge
      : product.badge === "bestseller"
        ? dict.misc.bestseller
        : product.badge === "limited"
          ? dict.misc.limitedEdition
          : null;

  return (
    <Link
      href={`/${locale}/product/${product.slug}`}
      className="product-card"
    >
      <div className="product-media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.image} alt={product.name[locale]} loading="lazy" />
        {badgeLabel && <span className="product-badge">{badgeLabel}</span>}
      </div>
      <div className="product-info">
        <span className="p-cat">{categoryNames[product.category][locale]}</span>
        <h3>{product.name[locale]}</h3>
        <div className="p-price">{formatPrice(product.price, locale)}</div>
      </div>
    </Link>
  );
}
