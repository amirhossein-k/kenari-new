"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Clock, DollarSign, Flame, Package, ShoppingCart } from "lucide-react";
import type { OrderDTO } from "@/lib/types";
import { api } from "@/lib/client";
import { faNum, timeAgo, toman } from "@/lib/format";
import { PageHeader, Spinner, StatusBadge } from "@/components/admin/ui";
import { NEW_ORDER_EVENT } from "@/components/admin/NotificationCenter";

type Stats = {
  products: number; categories: number; pending: number; active: number;
  todayOrders: number; todayRevenue: number; totalOrders: number; totalRevenue: number;
  recent: OrderDTO[]; days: { date: string; revenue: number; count: number }[]; top: { _id: string; qty: number }[];
};

export default function Dashboard() {
  const [s, setS] = useState<Stats | null>(null);
  const load = useCallback(() => api<Stats>("/api/admin/stats").then(setS).catch(() => {}), []);
  useEffect(() => {
    load();
    window.addEventListener(NEW_ORDER_EVENT, load);
    return () => window.removeEventListener(NEW_ORDER_EVENT, load);
  }, [load]);

  if (!s) return <Spinner />;
  const max = Math.max(1, ...s.days.map((d) => d.revenue));
  const cards = [
    { label: "سفارش امروز", value: faNum(s.todayOrders), icon: ShoppingCart, color: "from-brand-400 to-brand-600" },
    { label: "فروش امروز", value: toman(s.todayRevenue), icon: DollarSign, color: "from-emerald-400 to-emerald-600" },
    { label: "در انتظار تایید", value: faNum(s.pending), icon: Clock, color: "from-amber-400 to-orange-500" },
    { label: "محصولات", value: faNum(s.products), icon: Package, color: "from-violet-400 to-violet-600" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="داشبورد" subtitle={`کل فروش: ${toman(s.totalRevenue)} · ${faNum(s.totalOrders)} سفارش`} />
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {cards.map((c, i) => (
          <div key={c.label} style={{ animationDelay: `${i * 70}ms` }} className="card relative overflow-hidden p-5 animate-fade-up">
            <div className={`absolute -left-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${c.color} opacity-15`} />
            <span className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${c.color} text-white shadow-soft`}><c.icon size={20} /></span>
            <p className="mt-4 text-xs font-bold text-stone-500">{c.label}</p>
            <p className="mt-1 text-lg font-black sm:text-xl">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="card p-5 xl:col-span-2">
          <h3 className="font-extrabold">فروش ۷ روز اخیر</h3>
          <div className="mt-6 flex h-52 items-end gap-2 sm:gap-4">
            {s.days.map((d) => (
              <div key={d.date} className="group flex flex-1 flex-col items-center gap-2">
                <div className="relative flex w-full flex-1 items-end">
                  <div className="w-full rounded-t-xl bg-gradient-to-t from-brand-600 to-brand-300 transition-all duration-700 group-hover:from-brand-700"
                    style={{ height: `${Math.max(4, (d.revenue / max) * 100)}%` }} />
                  <span className="pointer-events-none absolute -top-8 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-coffee-900 px-2 py-1 text-[10px] text-white group-hover:block">
                    {toman(d.revenue)}
                  </span>
                </div>
                <span className="text-[10px] text-stone-500">{new Intl.DateTimeFormat("fa-IR", { weekday: "short" }).format(new Date(d.date))}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-5">
          <h3 className="flex items-center gap-2 font-extrabold"><Flame size={18} className="text-brand-500" /> پرفروش‌ها</h3>
          <ul className="mt-4 space-y-3">
            {s.top.length === 0 && <li className="text-sm text-stone-400">هنوز فروشی ثبت نشده</li>}
            {s.top.map((t, i) => (
              <li key={t._id} className="flex items-center gap-3">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-50 text-xs font-black text-brand-700">{faNum(i + 1)}</span>
                <span className="flex-1 text-sm font-bold">{t._id}</span>
                <span className="text-xs text-stone-500">{faNum(t.qty)} عدد</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="flex items-center justify-between p-5">
          <h3 className="font-extrabold">آخرین سفارش‌ها</h3>
          <Link href="/admin/orders" className="flex items-center gap-1 text-xs font-bold text-brand-600">همه <ArrowLeft size={14} /></Link>
        </div>
        <div className="divide-y divide-stone-100">
          {s.recent.map((o) => (
            <Link key={o._id} href="/admin/orders" className="flex flex-wrap items-center gap-3 px-5 py-3 transition hover:bg-brand-50/50">
              <span className="font-mono text-sm font-black" dir="ltr">{o.code}</span>
              <span className="flex-1 text-sm">{o.customerName} · {o.tableNumber ? `میز ${faNum(o.tableNumber)}` : "بیرون‌بر"}</span>
              <span className="text-xs text-stone-400">{timeAgo(o.createdAt)}</span>
              <span className="text-sm font-bold">{toman(o.subtotal)}</span>
              <StatusBadge s={o.status} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
