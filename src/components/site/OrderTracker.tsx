"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Check, ChefHat, CircleCheckBig, Clock, HandPlatter, XCircle } from "lucide-react";
import clsx from "clsx";
import type { OrderDTO, OrderStatus } from "@/lib/types";
import { STATUS_FLOW, STATUS_LABELS } from "@/lib/types";
import { faDate, faNum, toman } from "@/lib/format";

const ICONS: Record<OrderStatus, typeof Check> = {
  pending: Clock, confirmed: Check, preparing: ChefHat, ready: HandPlatter, delivered: CircleCheckBig, cancelled: XCircle,
};

export default function OrderTracker({ code }: { code: string }) {
  const [order, setOrder] = useState<OrderDTO | null>(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const r = await fetch(`/api/orders/${encodeURIComponent(code)}`, { cache: "no-store" });
        const d = await r.json();
        if (!r.ok) throw new Error(d.error);
        if (alive) setOrder(d as OrderDTO);
      } catch (e) {
        if (alive) setErr(e instanceof Error ? e.message : "خطا");
      }
    };
    load();
    const t = setInterval(load, 5000);
    return () => { alive = false; clearInterval(t); };
  }, [code]);

  if (err && !order) return <div className="container-x py-24 text-center font-bold text-rose-600">{err}</div>;
  if (!order) return <div className="container-x py-24 text-center"><div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-500" /></div>;

  const idx = STATUS_FLOW.indexOf(order.status);
  const cancelled = order.status === "cancelled";

  return (
    <div className="container-x max-w-3xl py-10">
      <div className="card overflow-hidden">
        <div className="bg-gradient-to-l from-brand-500 to-brand-700 p-6 text-white">
          <p className="text-sm opacity-80">کد سفارش</p>
          <p className="text-3xl font-black tracking-wider" dir="ltr">{order.code}</p>
          <p className="mt-2 text-sm opacity-90">
            {order.orderType === "dine-in" ? `میز ${faNum(order.tableNumber || "")}` : "بیرون‌بر"} · {faDate(order.createdAt)}
          </p>
        </div>

        <div className="p-6">
          {cancelled ? (
            <div className="rounded-2xl bg-rose-50 p-5 text-center font-bold text-rose-600 ring-1 ring-rose-200">این سفارش لغو شده است</div>
          ) : (
            <ol className="relative grid grid-cols-5 gap-2">
              <div className="absolute right-[10%] left-[10%] top-6 h-1 rounded bg-brand-100" />
              <div className="absolute right-[10%] top-6 h-1 rounded bg-brand-500 transition-all duration-700" style={{ width: `${(Math.max(idx, 0) / 4) * 80}%` }} />
              {STATUS_FLOW.map((s, i) => {
                const Icon = ICONS[s];
                const done = i <= idx;
                return (
                  <li key={s} className="relative flex flex-col items-center text-center">
                    <span className={clsx("grid h-12 w-12 place-items-center rounded-full ring-4 ring-white transition", done ? "bg-brand-500 text-white" : "bg-brand-100 text-brand-300", i === idx && "animate-pulse")}>
                      <Icon size={20} />
                    </span>
                    <span className={clsx("mt-2 text-[11px] font-bold sm:text-xs", done ? "text-coffee-900" : "text-stone-400")}>{STATUS_LABELS[s]}</span>
                  </li>
                );
              })}
            </ol>
          )}
          <p className="mt-6 text-center text-xs text-stone-400">این صفحه هر ۵ ثانیه به‌روز می‌شود</p>

          <div className="mt-6 space-y-2 border-t border-brand-100 pt-5">
            {order.items.map((i, k) => (
              <div key={k} className="flex justify-between text-sm">
                <span>{i.name} × {faNum(i.quantity)}</span>
                <span className="font-bold">{toman(i.price * i.quantity)}</span>
              </div>
            ))}
            <div className="flex justify-between border-t border-dashed border-brand-200 pt-3 font-black">
              <span>مجموع</span><span>{toman(order.subtotal)}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 text-center">
        <Link href="/menu" className="btn-ghost">سفارش بیشتر</Link>
      </div>
    </div>
  );
}
