import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <span className="kicker">✦ {dict.about.kicker} ✦</span>
          <h1 className="display">{dict.about.title}</h1>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="split">
            <div className="split-media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/palace.svg" alt="" />
            </div>
            <div>
              <p style={{ fontSize: 18, color: "var(--ivory)", marginBottom: 22 }}>
                {dict.about.p1}
              </p>
              <p style={{ color: "var(--ivory-dim)", marginBottom: 22 }}>
                {dict.about.p2}
              </p>
              <p style={{ color: "var(--ivory-dim)" }}>{dict.about.p3}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head">
            <span className="kicker">✦</span>
            <h2 className="display">{dict.about.valuesTitle}</h2>
          </div>
          <div className="services-grid">
            {dict.about.values.map((value, i) => (
              <div className="service-card" key={value.title}>
                <div className="service-num">{["I", "II", "III"][i]}</div>
                <h3>{value.title}</h3>
                <p>{value.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
