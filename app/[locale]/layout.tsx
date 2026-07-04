import type { Metadata } from "next";
import { Playfair_Display, Amiri, Cairo } from "next/font/google";
import { notFound } from "next/navigation";
import { isLocale, dirOf, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { CartProvider } from "@/lib/cart";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "../globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

export function generateStaticParams() {
  return [{ locale: "ar" }, { locale: "en" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";
  return {
    title: isAr
      ? "قفطاني — قفاطين مغربية فاخرة | دبي والإمارات"
      : "Koftany — Luxury Moroccan Caftans | Dubai & UAE",
    description: isAr
      ? "دار قفطاني: قفاطين وتكاشط مغربية مطرّزة يدوياً بخيوط الذهب. توصيل فاخر في جميع الإمارات."
      : "Maison Koftany: Moroccan caftans and takchitas hand-embroidered in gold thread. Luxury delivery across the UAE.",
    icons: { icon: "/logo.svg" },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale as Locale);

  return (
    <html
      lang={locale}
      dir={dirOf(locale as Locale)}
      className={`${playfair.variable} ${amiri.variable} ${cairo.variable}`}
    >
      <body>
        <CartProvider>
          <Header locale={locale as Locale} dict={dict} />
          <main>{children}</main>
          <Footer locale={locale as Locale} dict={dict} />
        </CartProvider>
      </body>
    </html>
  );
}
