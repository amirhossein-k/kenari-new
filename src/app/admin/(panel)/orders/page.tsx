"use client";
import { useCallback, useEffect, useState } from "react";
import { MessageSquare, Phone, RefreshCw, Search, Trash2 } from "lucide-react";
import clsx from "clsx";
import toast from "react-hot-toast";
import type { OrderDTO, OrderStatus } from "@/lib/types";
import { STATUS_FLOW, STATUS_LABELS } from "@/lib/types";
import { api } from "@/lib/client";
import { faDate, faNum, timeAgo, toman } from "@/lib/format";
import Modal from "@/components/ui/Modal";
import SmartImage from "@/components/ui/SmartImage";
import { Empty, PageHeader, Spinner, StatusBadge } from "@/components/admin/ui";
import { NEW_ORDER_EVENT, useNotif } from "@/components/admin/NotificationCenter";

const TABS: (OrderStatus | "all")[] = ["all", "pending", "confirmed", "preparing", "ready", "delivered", "cancelled"];

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderDTO[] | null>(null);
  const [tab, setTab] = useState<OrderStatus | "all">("all");
  const [q, setQ] = useState("");
  const [sel, setSel] = useState<OrderDTO | null>(null);
  const [fresh, setFresh] = useState<Set<string>>(new Set());
  const { refresh } = useNotif();

  const load = useCallback(async () => {
    const params = new URLSearchParams({ status: tab });
    if (q) params.set("q", q);
    const list = await api<OrderDTO[]>(`/api/admin/orders?${params}`);
    setOrders((prev) => {
      if (prev) {
        const known = new Set(prev.map((o) => o._id));
        const n = list.filter((o) => !known.has(o._id)).map((o) => o._id);
        if (n.length) setFresh((f) => new Set([...f, ...n]));
      }
      return list;
    });
  }, [tab, q]);

  useEffect(() => {
    const t = setTimeout(() => load().catch((e: Error) => toast.error(e.message)), 250);
    return () => clearTimeout(t);
  }, [load]);

  useEffect(() => {
    const f = () => { load().catch(() => {}); };
    window.addEventListener(NEW_ORDER_EVENT, f);
    const t = setInterval(f, 15000);
    return () => { window.removeEventListener(NEW_ORDER_EVENT, f); clearInterval(t); };
  }, [load]);

  const setStatus = async (o: OrderDTO, status: OrderStatus) => {
    try {
      const u = await api<OrderDTO>(`/api/admin/orders/${o._id}`, { method: "PATCH", body: { status } });
      setOrders((p) => p?.map((x) => (x._id === o._id ? u : x)) ?? null);
      if (sel?._id === o._id) setSel(u);
      toast.success(`وضعیت: ${STATUS_LABELS[status]}`);
      refresh();
    } catch (err) { toast.error(err instanceof Error ? err.message : "خطا"); }
  };

  const remove = async (o: OrderDTO) => {
    if (!confirm(`سفارش ${o.code} حذف شود؟`)) return;
    await api(`/api/admin/orders/${o._id}`, { method: "DELETE" });
    setSel(null);
    load();
  };

  const next = (s: OrderStatus): OrderStatus | null => {
    const i = STATUS_FLOW.indexOf(s);
    return i >= 0 && i < STATUS_FLOW.length - 1 ? STATUS_FLOW[i + 1] : null;
  };

  return (
    <div>
      <PageHeader title="سفارش‌ها" subtitle="سفارش‌های جدید به صورت خودکار نمایش داده می‌شوند"
        action={<button onClick={() => load()} className="btn-ghost"><RefreshCw size={16} /> بروزرسانی</button>} />

      <div className="no-scrollbar mb-4 flex gap-2 overflow-x-auto">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={clsx("shrink-0 rounded-full px-4 py-2 text-sm font-bold transition", tab === t ? "bg-coffee-900 text-white" : "bg-white text-stone-600 ring-1 ring-stone-200")}>
            {t === "all" ? "همه" : STATUS_LABELS[t]}
          </button>
        ))}
      </div>
      <div className="relative mb-5 max-w-md">
        <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400" />
        <input className="input pr-9" placeholder="جستجو: کد، نام، موبایل یا میز" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      {!orders ? <Spinner /> : orders.length === 0 ? <Empty text="سفارشی وجود ندارد" icon="🧾" /> : (
        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {orders.map((o) => {
            const n = next(o.status);
            return (
              <div key={o._id} onClick={() => { setSel(o); setFresh((f) => { const c = new Set(f); c.delete(o._id); return c; }); }}
                className={clsx("card cursor-pointer p-4 transition hover:-translate-y-0.5 hover:shadow-xl",
                  o.status === "pending" && "ring-2 ring-amber-300", fresh.has(o._id) && "animate-fade-up ring-2 ring-brand-500")}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-black" dir="ltr">{o.code}</span>
                    {fresh.has(o._id) && <span className="chip bg-brand-500 text-white ring-brand-500">جدید</span>}
                  </div>
                  <StatusBadge s={o.status} />
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="font-bold">{o.customerName}</span>
                  <span className={clsx("rounded-lg px-2 py-1 text-xs font-black", o.tableNumber ? "bg-emerald-50 text-emerald-700" : "bg-sky-50 text-sky-700")}>
                    {o.tableNumber ? `میز ${faNum(o.tableNumber)}` : "بیرون‌بر"}
                  </span>
                </div>
                <p className="mt-2 line-clamp-1 text-xs text-stone-500">{o.items.map((i) => `${i.name} ×${faNum(i.quantity)}`).join(" · ")}</p>
                <div className="mt-3 flex items-center justify-between border-t border-stone-100 pt-3">
                  <div>
                    <p className="text-sm font-black">{toman(o.subtotal)}</p>
                    <p className="text-[11px] text-stone-400">{timeAgo(o.createdAt)}</p>
                  </div>
                  <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    {o.status === "pending" && <button onClick={() => setStatus(o, "cancelled")} className="btn-danger px-3 py-2 text-xs">رد</button>}
                    {n && <button onClick={() => setStatus(o, n)} className="btn-primary px-3 py-2 text-xs">{STATUS_LABELS[n]}</button>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal open={!!sel} onClose={() => setSel(null)} title={sel ? `سفارش ${sel.code}` : ""}>
        {sel && (
          <div className="space-y-5 p-5">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-stone-50 p-3"><p className="text-xs text-stone-500">مشتری</p><p className="font-bold">{sel.customerName}</p></div>
              <a href={`tel:${sel.phone}`} className="rounded-xl bg-stone-50 p-3"><p className="text-xs text-stone-500">موبایل</p><p className="flex items-center gap-1 font-bold" dir="ltr"><Phone size={14} />{sel.phone}</p></a>
              <div className="rounded-xl bg-stone-50 p-3"><p className="text-xs text-stone-500">نوع</p><p className="font-bold">{sel.tableNumber ? `سرو در میز ${faNum(sel.tableNumber)}` : "بیرون‌بر"}</p></div>
              <div className="rounded-xl bg-stone-50 p-3"><p className="text-xs text-stone-500">زمان ثبت</p><p className="font-bold">{faDate(sel.createdAt)}</p></div>
            </div>
            {sel.note && <p className="flex gap-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-900"><MessageSquare size={16} className="mt-0.5 shrink-0" />{sel.note}</p>}
            <div className="space-y-2">
              {sel.items.map((i, k) => (
                <div key={k} className="flex items-center gap-3">
                  <SmartImage src={i.image} alt={i.name} className="h-12 w-12 rounded-xl" />
                  <span className="flex-1 text-sm font-bold">{i.name}</span>
                  <span className="text-xs text-stone-500">×{faNum(i.quantity)}</span>
                  <span className="w-28 text-left text-sm font-bold">{toman(i.price * i.quantity)}</span>
                </div>
              ))}
              <div className="flex justify-between border-t border-dashed pt-3 font-black"><span>مجموع</span><span>{toman(sel.subtotal)}</span></div>
            </div>
            <div>
              <p className="label">تغییر وضعیت</p>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(STATUS_LABELS) as OrderStatus[]).map((s) => (
                  <button key={s} onClick={() => setStatus(sel, s)}
                    className={clsx("rounded-xl px-3 py-2 text-xs font-bold ring-1 transition", sel.status === s ? "bg-coffee-900 text-white ring-coffee-900" : "ring-stone-200 hover:bg-stone-50")}>
                    {STATUS_LABELS[s]}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={() => remove(sel)} className="btn-danger w-full"><Trash2 size={16} /> حذف سفارش</button>
          </div>
        )}
      </Modal>
    </div>
  );
}
