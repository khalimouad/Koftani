"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export interface CartLine {
  productId: string;
  size: string;
  quantity: number;
}

interface CartContextValue {
  lines: CartLine[];
  count: number;
  addLine: (productId: string, size: string, quantity?: number) => void;
  removeLine: (productId: string, size: string) => void;
  setQuantity: (productId: string, size: string, quantity: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "koftany-cart-v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {
      /* corrupted storage — start fresh */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      count: lines.reduce((s, l) => s + l.quantity, 0),
      addLine: (productId, size, quantity = 1) =>
        setLines((prev) => {
          const existing = prev.find(
            (l) => l.productId === productId && l.size === size
          );
          if (existing) {
            return prev.map((l) =>
              l === existing
                ? { ...l, quantity: Math.min(10, l.quantity + quantity) }
                : l
            );
          }
          return [...prev, { productId, size, quantity }];
        }),
      removeLine: (productId, size) =>
        setLines((prev) =>
          prev.filter((l) => !(l.productId === productId && l.size === size))
        ),
      setQuantity: (productId, size, quantity) =>
        setLines((prev) =>
          quantity <= 0
            ? prev.filter(
                (l) => !(l.productId === productId && l.size === size)
              )
            : prev.map((l) =>
                l.productId === productId && l.size === size
                  ? { ...l, quantity: Math.min(10, quantity) }
                  : l
              )
        ),
      clear: () => setLines([]),
    }),
    [lines]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
