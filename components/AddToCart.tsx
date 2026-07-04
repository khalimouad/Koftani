"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { useCart } from "@/lib/cart";

export default function AddToCart({
  productId,
  sizes,
  dict,
}: {
  productId: string;
  sizes: string[];
  dict: Dictionary;
}) {
  const { addLine } = useCart();
  const [size, setSize] = useState(sizes[2] ?? sizes[0]);
  const [added, setAdded] = useState(false);

  return (
    <div>
      <span className="option-label">{dict.product.size}</span>
      <div className="size-row">
        {sizes.map((s) => (
          <button
            key={s}
            type="button"
            className={`size-chip ${size === s ? "active" : ""}`}
            onClick={() => setSize(s)}
          >
            {s}
          </button>
        ))}
      </div>
      <button
        type="button"
        className="btn btn-solid btn-wide"
        onClick={() => {
          addLine(productId, size);
          setAdded(true);
          setTimeout(() => setAdded(false), 2200);
        }}
      >
        <span>{added ? dict.product.added : dict.product.addToCart}</span>
      </button>
    </div>
  );
}
