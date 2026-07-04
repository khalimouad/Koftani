import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import {
  categoryNames,
  formatPrice,
  getProduct,
  products,
} from "@/lib/products";
import AddToCart from "@/components/AddToCart";
import ProductCard from "@/components/ProductCard";

export function generateStaticParams() {
  return products.flatMap((p) =>
    (["ar", "en"] as const).map((locale) => ({ locale, slug: p.slug }))
  );
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);
  const product = getProduct(slug);
  if (!product) notFound();

  const related = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .concat(products.filter((p) => p.id !== product.id))
    .filter((p, i, arr) => arr.indexOf(p) === i)
    .slice(0, 4);

  return (
    <>
      <section className="section" style={{ paddingTop: 70 }}>
        <div className="container">
          <div className="product-layout">
            <div className="product-hero-media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={product.image} alt={product.name[locale]} />
            </div>

            <div>
              <span className="kicker">
                {categoryNames[product.category][locale]} · {product.sku}
              </span>
              <h1 className="display product-title">{product.name[locale]}</h1>
              <div style={{ color: "var(--muted)", fontSize: 15 }}>
                {product.color[locale]}
              </div>
              <div className="price-lg">{formatPrice(product.price, locale)}</div>
              <div className="stock-note">
                {product.madeToOrder
                  ? dict.product.madeToOrder
                  : dict.product.inStock}
              </div>
              <p className="product-desc">{product.description[locale]}</p>

              <AddToCart
                productId={product.id}
                sizes={product.sizes}
                dict={dict}
              />

              <div className="accordion">
                <details open>
                  <summary>{dict.product.craft}</summary>
                  <div className="acc-body">{product.craft[locale]}</div>
                </details>
                <details>
                  <summary>{dict.product.delivery}</summary>
                  <div className="acc-body">{dict.product.deliveryText}</div>
                </details>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head">
            <h2 className="display" style={{ fontSize: 32 }}>
              {dict.product.related}
            </h2>
          </div>
          <div className="product-grid">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} locale={locale} dict={dict} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
