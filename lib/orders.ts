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

const DATA_DIR = path.join(process.cwd(), "data");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

async function readOrders(): Promise<Order[]> {
  try {
    const raw = await fs.readFile(ORDERS_FILE, "utf-8");
    return JSON.parse(raw) as Order[];
  } catch {
    return [];
  }
}

async function writeOrders(orders: Order[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8");
}

export interface CreateOrderInput {
  paymentMethod: PaymentMethod;
  locale: string;
  customer: Order["customer"];
  items: { productId: string; size: string; quantity: number }[];
}

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
  const order: Order = {
    id: crypto.randomUUID(),
    reference: `KFT-${new Date().getFullYear()}-${crypto
      .randomBytes(3)
      .toString("hex")
      .toUpperCase()}`,
    createdAt: new Date().toISOString(),
    status: "pending",
    paymentMethod: input.paymentMethod,
    locale: input.locale,
    customer: input.customer,
    items,
    subtotal,
    shipping,
    total: subtotal + shipping,
    currency: "AED",
  };

  const orders = await readOrders();
  orders.push(order);
  await writeOrders(orders);
  return order;
}

export async function getOrder(id: string): Promise<Order | undefined> {
  const orders = await readOrders();
  return orders.find((o) => o.id === id);
}

export async function updateOrder(
  id: string,
  patch: Partial<Pick<Order, "status" | "paymentId">>
): Promise<Order | undefined> {
  const orders = await readOrders();
  const order = orders.find((o) => o.id === id);
  if (!order) return undefined;
  Object.assign(order, patch);
  await writeOrders(orders);
  return order;
}

export async function findOrderByPaymentId(
  paymentId: string
): Promise<Order | undefined> {
  const orders = await readOrders();
  return orders.find((o) => o.paymentId === paymentId);
}
