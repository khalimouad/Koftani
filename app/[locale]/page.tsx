import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { products } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import HeroBackdrop from "@/components/HeroBackdrop";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);

  const featured = products.filter((p) => p.badge).slice(0, 4);

  return (
    <>
      {/* ————— Hero ————— */}
      <section className="hero">
        <HeroBackdrop />
        <div className="hero-veil" />
        <div className="container" style={{ width: "100%" }}>
          <div className="hero-content">
            <span className="kicker fade-up">{dict.hero.kicker}</span>
            <h1 className="display fade-up fade-up-1">{dict.hero.title}</h1>
            <p className="fade-up fade-up-2">{dict.hero.subtitle}</p>
            <div className="hero-actions fade-up fade-up-3">
              <Link href={`/${locale}/collection`} className="btn btn-solid">
                <span>{dict.hero.cta}</span>
              </Link>
              <Link href={`/${locale}/about`} className="btn btn-ghost">
                <span>{dict.hero.cta2}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ————— Values band ————— */}
      <div className="band">
        <div className="band-track">
          <span>{locale === "ar" ? "صناعة يدوية" : "Handcrafted"}</span>
          <span>✦</span>
          <span>{locale === "ar" ? "خيوط ذهبية" : "Gold Thread"}</span>
          <span>✦</span>
          <span>{locale === "ar" ? "إصدارات محدودة" : "Limited Editions"}</span>
          <span>✦</span>
          <span>{locale === "ar" ? "من فاس إلى دبي" : "Fès to Dubai"}</span>
        </div>
      </div>

      {/* ————— Featured products ————— */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="kicker">{dict.home.featuredKicker}</span>
            <h2 className="display">{dict.home.featuredTitle}</h2>
          </div>
          <div className="product-grid">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} locale={locale} dict={dict} />
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 60 }}>
            <Link href={`/${locale}/collection`} className="btn">
              <span>{dict.home.viewAll}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ————— Craft editorial ————— */}
      <section className="section" style={{ background: "var(--noir-2)", borderBlock: "1px solid var(--line)" }}>
        <div className="container">
          <div className="split">
            <div className="split-media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/atelier.svg" alt="" />
            </div>
            <div>
              <span className="kicker">{dict.home.craftKicker}</span>
              <h2 className="display">{dict.home.craftTitle}</h2>
              <p>{dict.home.craftText}</p>
              <ul className="craft-list">
                {dict.home.craftPoints.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ————— Heritage editorial ————— */}
      <section className="section">
        <div className="container">
          <div className="split">
            <div>
              <span className="kicker">{dict.home.editorialKicker}</span>
              <h2 className="display">{dict.home.editorialTitle}</h2>
              <p>{dict.home.editorialText}</p>
              <div style={{ marginTop: 36 }}>
                <Link href={`/${locale}/about`} className="btn btn-ghost">
                  <span>{dict.hero.cta2}</span>
                </Link>
              </div>
            </div>
            <div className="split-media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/palace.svg" alt="" />
            </div>
          </div>
        </div>
      </section>

      {/* ————— Services ————— */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head">
            <span className="kicker">✦</span>
            <h2 className="display">{dict.home.servicesTitle}</h2>
          </div>
          <div className="services-grid">
            {dict.home.services.map((service, i) => (
              <div className="service-card" key={service.title}>
                <div className="service-num">
                  {["I", "II", "III"][i]}
                </div>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
