import type { Locale } from "./i18n/config";

export type Category = "caftan" | "takchita" | "gandoura" | "jellaba";

export interface Product {
  id: string;
  slug: string;
  sku: string;
  category: Category;
  price: number; // AED
  compareAtPrice?: number;
  image: string;
  badge?: "new" | "bestseller" | "limited";
  madeToOrder?: boolean;
  sizes: string[];
  name: Record<Locale, string>;
  color: Record<Locale, string>;
  description: Record<Locale, string>;
  craft: Record<Locale, string>;
}

export const categoryNames: Record<Category, Record<Locale, string>> = {
  caftan: { ar: "قفطان", en: "Caftan" },
  takchita: { ar: "تكشيطة", en: "Takchita" },
  gandoura: { ar: "جندورة", en: "Gandoura" },
  jellaba: { ar: "جلابة", en: "Jellaba" },
};

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export const products: Product[] = [
  {
    id: "p1",
    slug: "caftan-sultana-noir",
    sku: "KFT-001",
    category: "caftan",
    price: 4900,
    image: "/products/sultana-noir.svg",
    badge: "bestseller",
    sizes: SIZES,
    name: { ar: "قفطان السلطانة — أسود ملكي", en: "Sultana Caftan — Royal Black" },
    color: { ar: "أسود بتطريز ذهبي", en: "Black with gold embroidery" },
    description: {
      ar: "قفطان من المخمل الأسود الفاخر، مطرّز بالكامل بخيوط الذهب الصقلي على الصدر والأكمام. قطعة ملكية لسهرات لا تُنسى.",
      en: "A caftan in sumptuous black velvet, fully hand-embroidered with golden Sqalli thread across the bodice and sleeves. A regal piece for unforgettable evenings.",
    },
    craft: {
      ar: "مخمل حرير ٩٥٪ — تطريز يدوي ٢٨٠ ساعة — أزرار عقاد مصنوعة يدوياً — حزام «مضمة» ذهبي",
      en: "95% silk velvet — 280 hours of hand embroidery — hand-braided Aakad buttons — golden Mdamma belt",
    },
  },
  {
    id: "p2",
    slug: "takchita-amira-doree",
    sku: "KFT-002",
    category: "takchita",
    price: 7200,
    image: "/products/amira-doree.svg",
    badge: "limited",
    madeToOrder: true,
    sizes: SIZES,
    name: { ar: "تكشيطة الأميرة — ذهب خالص", en: "Amira Takchita — Pure Gold" },
    color: { ar: "ذهبي شامبانيا", en: "Champagne gold" },
    description: {
      ar: "تكشيطة من طبقتين: تحتية من الساتان الذهبي وفوقية من الشيفون المطرّز بالكريستال. إصدار محدود من عشر قطع مرقّمة.",
      en: "A two-layer takchita: a golden satin under-dress beneath crystal-embroidered chiffon. A limited edition of ten numbered pieces.",
    },
    craft: {
      ar: "ساتان دوقيس — شيفون حرير — كريستال مثبت يدوياً — ٣٢٠ ساعة عمل",
      en: "Duchess satin — silk chiffon — hand-set crystals — 320 hours of work",
    },
  },
  {
    id: "p3",
    slug: "caftan-fassia-chocolat",
    sku: "KFT-003",
    category: "caftan",
    price: 5400,
    image: "/products/fassia-chocolat.svg",
    badge: "new",
    sizes: SIZES,
    name: { ar: "قفطان الفاسية — بني شوكولاتة", en: "Fassia Caftan — Chocolate Brown" },
    color: { ar: "بني داكن بخيوط نحاسية", en: "Deep brown with copper thread" },
    description: {
      ar: "قفطان من الموبرة البنية الداكنة بتطريز «الرندة» النحاسي المستوحى من أبواب فاس القديمة. أناقة دافئة وهادئة.",
      en: "A caftan in deep brown mubra with copper Randa embroidery inspired by the ancient doors of Fès. A warm, quiet elegance.",
    },
    craft: {
      ar: "موبرة فاخرة — تطريز رندة يدوي — بطانة حرير طبيعي",
      en: "Fine mubra — hand Randa embroidery — natural silk lining",
    },
  },
  {
    id: "p4",
    slug: "gandoura-yasmina-ivoire",
    sku: "KFT-004",
    category: "gandoura",
    price: 2800,
    image: "/products/yasmina-ivoire.svg",
    sizes: SIZES,
    name: { ar: "جندورة ياسمينة — عاجي", en: "Yasmina Gandoura — Ivory" },
    color: { ar: "عاجي بتطريز ذهبي خفيف", en: "Ivory with light gold embroidery" },
    description: {
      ar: "جندورة انسيابية من الكريب العاجي، مثالية للمجالس النهارية والعزائم العائلية. خفّة وفخامة في آن واحد.",
      en: "A flowing gandoura in ivory crêpe, perfect for daytime majlis gatherings and family occasions. Lightness and luxury at once.",
    },
    craft: {
      ar: "كريب حرير — تطريز ذهبي على الياقة والأكمام — قصّة انسيابية",
      en: "Silk crêpe — gold embroidery at collar and cuffs — fluid cut",
    },
  },
  {
    id: "p5",
    slug: "caftan-zellige-emeraude",
    sku: "KFT-005",
    category: "caftan",
    price: 6100,
    image: "/products/zellige-emeraude.svg",
    badge: "new",
    sizes: SIZES,
    name: { ar: "قفطان الزليج — زمردي", en: "Zellige Caftan — Emerald" },
    color: { ar: "أخضر زمردي بذهبي", en: "Emerald green with gold" },
    description: {
      ar: "قفطان من الحرير الزمردي بتطريز هندسي مستوحى من فن الزليج المغربي. لمسة ملوكية للمناسبات الكبرى.",
      en: "An emerald silk caftan with geometric embroidery inspired by Moroccan zellige art. A sovereign statement for grand occasions.",
    },
    craft: {
      ar: "حرير طبيعي — تطريز هندسي يدوي — حزام مضمة مرصّع",
      en: "Natural silk — geometric hand embroidery — jewelled Mdamma belt",
    },
  },
  {
    id: "p6",
    slug: "takchita-layali-bordeaux",
    sku: "KFT-006",
    category: "takchita",
    price: 6800,
    image: "/products/layali-bordeaux.svg",
    badge: "bestseller",
    sizes: SIZES,
    name: { ar: "تكشيطة ليالي — عنابي", en: "Layali Takchita — Bordeaux" },
    color: { ar: "عنابي داكن بذهبي عتيق", en: "Deep bordeaux with antique gold" },
    description: {
      ar: "تكشيطة العروس والمناسبات، من المخمل العنابي المطرّز بالذهب العتيق. حضور آسر من أول نظرة.",
      en: "The takchita of brides and grand celebrations, in bordeaux velvet embroidered with antique gold. Captivating from the very first glance.",
    },
    craft: {
      ar: "مخمل حرير — تطريز ذهب عتيق — طبقتان بحزام مرصّع",
      en: "Silk velvet — antique gold embroidery — two layers with a jewelled belt",
    },
  },
  {
    id: "p7",
    slug: "jellaba-medina-camel",
    sku: "KFT-007",
    category: "jellaba",
    price: 2400,
    image: "/products/medina-camel.svg",
    sizes: SIZES,
    name: { ar: "جلابة المدينة — كاميل", en: "Medina Jellaba — Camel" },
    color: { ar: "بيج كاميل بحواف بنية", en: "Camel beige with brown trim" },
    description: {
      ar: "جلابة عصرية من الصوف الخفيف بلون الكاميل، بقبّعة مبطّنة بالحرير وحواف مطرّزة يدوياً. أناقة يومية راقية.",
      en: "A modern jellaba in lightweight camel wool, with a silk-lined hood and hand-embroidered trim. Refined everyday elegance.",
    },
    craft: {
      ar: "صوف خفيف فاخر — بطانة حرير — تطريز حواف يدوي",
      en: "Fine lightweight wool — silk lining — hand-embroidered trim",
    },
  },
  {
    id: "p8",
    slug: "caftan-perle-du-desert",
    sku: "KFT-008",
    category: "caftan",
    price: 8900,
    image: "/products/perle-du-desert.svg",
    badge: "limited",
    madeToOrder: true,
    sizes: SIZES,
    name: { ar: "قفطان لؤلؤة الصحراء", en: "Pearl of the Desert Caftan" },
    color: { ar: "رملي بلؤلؤ طبيعي", en: "Sand with natural pearls" },
    description: {
      ar: "تحفة الدار: قفطان بلون رمال الصحراء مرصّع بلآلئ طبيعية وخيوط ذهب عيار ٢٤. يُصنع حسب الطلب فقط.",
      en: "The masterpiece of the House: a desert-sand caftan set with natural pearls and 24-karat gold thread. Made to order only.",
    },
    craft: {
      ar: "حرير حلبي — لؤلؤ طبيعي — خيط ذهب ٢٤ قيراط — ٤٠٠ ساعة عمل",
      en: "Aleppo silk — natural pearls — 24k gold thread — 400 hours of work",
    },
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function formatPrice(amount: number, locale: Locale): string {
  const formatted = new Intl.NumberFormat(locale === "ar" ? "ar-AE" : "en-AE", {
    maximumFractionDigits: 0,
  }).format(amount);
  return locale === "ar" ? `${formatted} د.إ` : `AED ${formatted}`;
}
