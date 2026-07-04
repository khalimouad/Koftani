import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { categoryNames, products, type Category } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

const categories: Category[] = ["caftan", "takchita", "gandoura", "jellaba"];

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ cat?: string }>;
}) {
  const { locale: raw } = await params;
  const { cat } = await searchParams;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);

  const activeCat = categories.includes(cat as Category)
    ? (cat as Category)
    : null;
  const shown = activeCat
    ? products.filter((p) => p.category === activeCat)
    : products;

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <span className="kicker">✦ {dict.brandLatin} ✦</span>
          <h1 className="display">{dict.collection.title}</h1>
          <p>{dict.collection.subtitle}</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="filter-row">
            <Link
              href={`/${locale}/collection`}
              className={`filter-chip ${!activeCat ? "active" : ""}`}
            >
              {dict.collection.all}
            </Link>
            {categories.map((c) => (
              <Link
                key={c}
                href={`/${locale}/collection?cat=${c}`}
                className={`filter-chip ${activeCat === c ? "active" : ""}`}
              >
                {categoryNames[c][locale]}
              </Link>
            ))}
          </div>

          <div className="product-grid">
            {shown.map((p) => (
              <ProductCard key={p.id} product={p} locale={locale} dict={dict} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
