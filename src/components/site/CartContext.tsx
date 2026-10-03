"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ProductDTO } from "@/lib/types";
import { finalPrice } from "@/lib/format";

export type CartItem = { id: string; name: string; price: number; image: string; quantity: number };

type Ctx = {
  items: CartItem[];
  count: number;
  total: number;
  table: string | null;
  open: boolean;
  setOpen: (v: boolean) => void;
  setTable: (t: string | null) => void;
  add: (p: ProductDTO, qty?: number) => void;
  inc: (id: string) => void;
  dec: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  qtyOf: (id: string) => number;
};

const CartCtx = createContext<Ctx | null>(null);
const KEY = "kenari_cart_v2";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [table, setTableState] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const d = JSON.parse(raw) as { items?: CartItem[]; table?: string | null };
        setItems(d.items ?? []);
        setTableState(d.table ?? null);
      }
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(KEY, JSON.stringify({ items, table }));
  }, [items, table, ready]);

  const add = useCallback((p: ProductDTO, qty = 1) => {
    setItems((prev) => {
      const ex = prev.find((i) => i.id === p._id);
      if (ex) return prev.map((i) => (i.id === p._id ? { ...i, quantity: i.quantity + qty } : i));
      return [...prev, { id: p._id, name: p.name, price: finalPrice(p), image: p.image, quantity: qty }];
    });
  }, []);
  const inc = useCallback((id: string) => setItems((p) => p.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i))), []);
  const dec = useCallback(
    (id: string) => setItems((p) => p.flatMap((i) => (i.id !== id ? [i] : i.quantity > 1 ? [{ ...i, quantity: i.quantity - 1 }] : []))),
    []
  );
  const remove = useCallback((id: string) => setItems((p) => p.filter((i) => i.id !== id)), []);
  const clear = useCallback(() => setItems([]), []);
  const setTable = useCallback((t: string | null) => setTableState(t), []);

  const value = useMemo<Ctx>(() => {
    const count = items.reduce((a, b) => a + b.quantity, 0);
    const total = items.reduce((a, b) => a + b.quantity * b.price, 0);
    return {
      items, count, total, table, open, setOpen, setTable, add, inc, dec, remove, clear,
      qtyOf: (id: string) => items.find((i) => i.id === id)?.quantity ?? 0,
    };
  }, [items, table, open, add, inc, dec, remove, clear, setTable]);

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const c = useContext(CartCtx);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
}
