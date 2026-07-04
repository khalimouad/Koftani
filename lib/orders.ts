import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import { getProductById } from "./products";

export type PaymentMethod = "stripe" | "paypal" | "wise";
export type OrderStatus =
  | "pending"
  | "pending_transfer"
  | "paid"
  | "shipped"
  | "cancelled"
  | "test";

export interface OrderItem {
  productId: string;
  slug: string;
  name: string;
  size: string;
  quantity: number;
  unitPrice: number; // AED, validated server-side
}

export interface Order {
  id: string;
  reference: string; // human-friendly, e.g. KFT-2026-XXXXXX
  createdAt: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentId?: string; // Stripe session id / PayPal order id
  locale: string;
  customer: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    emirate: string;
    notes?: string;
  };
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  currency: "AED";
}

export interface CreateOrderInput {
  paymentMethod: PaymentMethod;
  locale: string;
  customer: Order["customer"];
  items: { productId: string; size: string; quantity: number }[];
}

/* ————————————————————————————————————————————
   Supabase-backed store (production).
   Tables are locked down with RLS and no policies; all access goes through
   SECURITY DEFINER RPCs guarded by KOFTANY_DB_TOKEN, so the publishable
   anon key alone grants no data access.
   ———————————————————————————————————————————— */

function supabaseEnv() {
  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  const token = process.env.KOFTANY_DB_TOKEN;
  if (!url || !anonKey || !token) return null;
  return { url, anonKey, token };
}

async function rpc<T>(fn: string, args: Record<string, unknown>): Promise<T> {
  const env = supabaseEnv();
  if (!env) throw new Error("Supabase not configured");
  const res = await fetch(`${env.url}/rest/v1/rpc/${fn}`, {
    method: "POST",
    headers: {
      apikey: env.anonKey,
      Authorization: `Bearer ${env.anonKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args),
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Supabase RPC ${fn} failed: ${res.status} ${body.slice(0, 200)}`);
  }
  return (await res.json()) as T;
}

interface DbOrderRow {
  id: string;
  reference: string;
  created_at: string;
  status: OrderStatus;
  payment_method: PaymentMethod;
  payment_id: string | null;
  locale: string;
  customer: Order["customer"];
  items: OrderItem[];
  subtotal: number | string;
  shipping: number | string;
  total: number | string;
}

function fromDbRow(row: DbOrderRow): Order {
  return {
    id: row.id,
    reference: row.reference,
    createdAt: row.created_at,
    status: row.status,
    paymentMethod: row.payment_method,
    paymentId: row.payment_id ?? undefined,
    locale: row.locale,
    customer: row.customer,
    items: row.items,
    subtotal: Number(row.subtotal),
    shipping: Number(row.shipping),
    total: Number(row.total),
    currency: "AED",
  };
}

/* ————————————————————————————————————————————
   JSON file store (local development fallback)
   ———————————————————————————————————————————— */

const DATA_DIR = path.join(process.cwd(), "data");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

async function readOrdersFile(): Promise<Order[]> {
  try {
    const raw = await fs.readFile(ORDERS_FILE, "utf-8");
    return JSON.parse(raw) as Order[];
  } catch {
    return [];
  }
}

async function writeOrdersFile(orders: Order[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8");
}

/* ————————————————————————————————————————————
   Public API
   ———————————————————————————————————————————— */

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  // Recompute all prices server-side — never trust client amounts.
  const items: OrderItem[] = input.items.map((item) => {
    const product = getProductById(item.productId);
    if (!product) throw new Error(`Unknown product: ${item.productId}`);
    const quantity = Math.max(1, Math.min(10, Math.floor(item.quantity)));
    return {
      productId: product.id,
      slug: product.slug,
      name: product.name.en,
      size: item.size,
      quantity,
      unitPrice: product.price,
    };
  });
  if (items.length === 0) throw new Error("Empty order");

  const subtotal = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const shipping = 0; // free luxury delivery across the UAE
  const base = {
    reference: `KFT-${new Date().getFullYear()}-${crypto
      .randomBytes(3)
      .toString("hex")
      .toUpperCase()}`,
    status: "pending" as OrderStatus,
    paymentMethod: input.paymentMethod,
    locale: input.locale,
    customer: input.customer,
    items,
    subtotal,
    shipping,
    total: subtotal + shipping,
    currency: "AED" as const,
  };

  const env = supabaseEnv();
  if (env) {
    const row = await rpc<DbOrderRow>("koftany_create_order", {
      p_token: env.token,
      p_order: base,
    });
    return fromDbRow(row);
  }

  const order: Order = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...base,
  };
  const orders = await readOrdersFile();
  orders.push(order);
  await writeOrdersFile(orders);
  return order;
}

export async function getOrder(id: string): Promise<Order | undefined> {
  const env = supabaseEnv();
  if (env) {
    if (!/^[0-9a-f-]{36}$/i.test(id)) return undefined;
    const row = await rpc<DbOrderRow | null>("koftany_get_order", {
      p_token: env.token,
      p_id: id,
    });
    return row ? fromDbRow(row) : undefined;
  }
  const orders = await readOrdersFile();
  return orders.find((o) => o.id === id);
}

export async function updateOrder(
  id: string,
  patch: Partial<Pick<Order, "status" | "paymentId">>
): Promise<Order | undefined> {
  const env = supabaseEnv();
  if (env) {
    if (!/^[0-9a-f-]{36}$/i.test(id)) return undefined;
    const row = await rpc<DbOrderRow | null>("koftany_update_order", {
      p_token: env.token,
      p_id: id,
      p_status: patch.status ?? null,
      p_payment_id: patch.paymentId ?? null,
    });
    return row ? fromDbRow(row) : undefined;
  }
  const orders = await readOrdersFile();
  const order = orders.find((o) => o.id === id);
  if (!order) return undefined;
  Object.assign(order, patch);
  await writeOrdersFile(orders);
  return order;
}
