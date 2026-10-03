"use client";
import { Minus, Plus } from "lucide-react";
import clsx from "clsx";
import { useCart } from "./CartContext";
import type { ProductDTO } from "@/lib/types";
import { faNum } from "@/lib/format";
import toast from "react-hot-toast";

export default function QtyControl({ product, large }: { product: ProductDTO; large?: boolean }) {
  const { qtyOf, add, inc, dec } = useCart();
  const q = qtyOf(product._id);
  if (!product.isAvailable) {
    return <span className="rounded-xl bg-stone-100 px-3 py-2 text-xs font-bold text-stone-500">ناموجود</span>;
  }
  if (q === 0) {
    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          add(product);
          toast.success(`${product.name} به سبد اضافه شد`, { duration: 1500 });
        }}
        className={clsx("btn-primary", large ? "px-6 py-3 text-base" : "px-3 py-2 text-xs")}
      >
        <Plus size={large ? 18 : 14} /> افزودن
      </button>
    );
  }
  return (
    <div onClick={(e) => e.stopPropagation()} className={clsx("flex items-center gap-1 rounded-xl bg-brand-500 p-1 text-white shadow-soft", large && "p-1.5")}>
      <button onClick={() => inc(product._id)} className="rounded-lg bg-white/20 p-1.5 hover:bg-white/30"><Plus size={large ? 18 : 14} /></button>
      <span key={q} className={clsx("text-center font-black animate-pop", large ? "w-10 text-lg" : "w-6 text-sm")}>{faNum(q)}</span>
      <button onClick={() => dec(product._id)} className="rounded-lg bg-white/20 p-1.5 hover:bg-white/30"><Minus size={large ? 18 : 14} /></button>
    </div>
  );
}
