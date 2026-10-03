"use client";
import Link from "next/link";
import { useEffect } from "react";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "./CartContext";
import SmartImage from "@/components/ui/SmartImage";
import { faNum, toman } from "@/lib/format";

export default function CartDrawer() {
  const { open, setOpen, items, inc, dec, remove, total, count, clear } = useCart();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70]">
      <div className="absolute inset-0 bg-coffee-900/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <aside className="absolute inset-y-0 left-0 flex w-full max-w-md flex-col bg-brand-50 shadow-2xl animate-slide-in">
        <div className="flex items-center justify-between border-b border-brand-100 bg-white px-5 py-4">
          <h3 className="flex items-center gap-2 font-extrabold"><ShoppingBag size={18} /> سبد خرید ({faNum(count)})</h3>
          <button onClick={() => setOpen(false)} className="rounded-full p-1.5 hover:bg-brand-50"><X size={18} /></button>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="grid h-full place-items-center text-center text-stone-500">
              <div>
                <div className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-full bg-brand-100 text-4xl animate-float">🛒</div>
                <p className="font-bold">سبدت خالیه!</p>
                <Link href="/menu" onClick={() => setOpen(false)} className="btn-primary mt-4">بریم سراغ منو</Link>
              </div>
            </div>
          ) : (
            items.map((i) => (
              <div key={i.id} className="card flex items-center gap-3 p-3 animate-fade-up">
                <SmartImage src={i.image} alt={i.name} className="h-16 w-16 shrink-0 rounded-xl" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{i.name}</p>
                  <p className="mt-1 text-xs text-brand-700">{toman(i.price * i.quantity)}</p>
                </div>
                <div className="flex items-center gap-1 rounded-xl bg-brand-50 p-1 ring-1 ring-brand-100">
                  <button onClick={() => inc(i.id)} className="rounded-lg bg-white p-1.5 shadow-sm"><Plus size={14} /></button>
                  <span className="w-6 text-center text-sm font-black">{faNum(i.quantity)}</span>
                  {i.quantity > 1 ? (
                    <button onClick={() => dec(i.id)} className="rounded-lg bg-white p-1.5 shadow-sm"><Minus size={14} /></button>
                  ) : (
                    <button onClick={() => remove(i.id)} className="rounded-lg bg-white p-1.5 text-rose-500 shadow-sm"><Trash2 size={14} /></button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="space-y-3 border-t border-brand-100 bg-white p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-stone-500">جمع کل</span>
              <span className="text-lg font-black">{toman(total)}</span>
            </div>
            <div className="flex gap-2">
              <Link href="/checkout" onClick={() => setOpen(false)} className="btn-primary flex-1 py-3">ادامه و ثبت سفارش</Link>
              <button onClick={clear} className="btn-danger">خالی کردن</button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
