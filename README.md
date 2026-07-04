# KOFTANY — قفطاني

Luxury Moroccan caftan e-commerce boutique for the UAE market. Arabic-first (RTL) with full English support, designed in a haute-couture aesthetic: deep noir, espresso brown, antique gold.

## Stack

- **Next.js 15** (App Router, TypeScript) — frontend + backend API routes in one codebase
- **Custom design system** — no CSS framework; hand-crafted luxury styling with logical properties for RTL/LTR
- **Payments** — Stripe Checkout (cards / Apple Pay), PayPal, and Wise (bank transfer instructions)
- **Orders** — persisted to `data/orders.json` (swap for a real database in production)

## Getting started

```bash
npm install
cp .env.example .env   # add your payment keys (optional — demo mode works without them)
npm run dev
```

Open http://localhost:3000 — you are redirected to `/ar` (Arabic, default). English lives at `/en`.

## Internationalization

- `ar` (default, RTL) and `en` are defined in `lib/i18n/config.ts`.
- All copy lives in `lib/i18n/dictionaries.ts`; product content is bilingual in `lib/products.ts`.
- Adding a market later (e.g. `fr`) = add the locale to `config.ts` and a dictionary entry.

## Payments

| Method | Flow | Configuration |
|---|---|---|
| **Stripe** | Hosted Stripe Checkout in AED, verified server-side on return + webhook | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` |
| **PayPal** | PayPal Orders API (approve → capture), charged in USD | `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_ENV` |
| **Wise** | Order recorded as `pending_transfer`; customer receives IBAN/BIC transfer instructions with the order reference | `WISE_ACCOUNT_NAME`, `WISE_IBAN`, `WISE_BIC` |

Without keys the site runs in **demo mode**: checkout completes and records the order with status `test`.

All amounts are recomputed **server-side** from the catalog — client-sent prices are never trusted.

## API

- `GET /api/products` — catalog
- `POST /api/orders` — create an order (validates items, recomputes totals)
- `GET /api/orders/:id` — order details
- `POST /api/checkout/stripe` — create a Stripe Checkout session
- `POST /api/checkout/paypal` — create a PayPal order (returns approval URL)
- `GET /api/checkout/paypal/capture` — PayPal return URL (captures payment)
- `POST /api/webhooks/stripe` — Stripe webhook (`checkout.session.completed`)

## Production notes

- Replace the JSON order store (`lib/orders.ts`) with a database (Postgres/Supabase) before going live.
- Product photography: the SVG illustrations in `public/products/` are placeholders — swap in real photos with the same file paths or update `lib/products.ts`.
- Configure the Stripe webhook endpoint (`/api/webhooks/stripe`) in the Stripe dashboard.
