"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Info, Loader2, Minus, Plus, Trash2 } from "lucide-react";
import clsx from "clsx";
import toast from "react-hot-toast";
import { useCart } from "./CartContext";
import SmartImage from "@/components/ui/SmartImage";
import { faNum, toman } from "@/lib/format";

export default function CheckoutClient({ tableCount, isOpen }: { tableCount: number; isOpen: boolean }) {
  const router = useRouter();
  const { items, total, table, setTable, inc, dec, remove, clear } = useCart();
  const [type, setType] = useState<"dine-in" | "takeaway">("dine-in");
  const [form, setForm] = useState({ name: "", phone: "", note: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("kenari_customer");
    if (saved) {
      try { const d = JSON.parse(saved) as { name: string; phone: string }; setForm((f) => ({ ...f, name: d.name, phone: d.phone })); } catch {}
    }
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (type === "dine-in" && !table) return toast.error("شماره میز را انتخاب کن");
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: form.name, phone: form.phone, note: form.note, orderType: type,
          tableNumber: type === "dine-in" ? table : null,
          items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
        }),
      });
      const data = (await res.json()) as { code?: string; error?: string };
      if (!res.ok || !data.code) throw new Error(data.error || "خطا در ثبت سفارش");
      localStorage.setItem("kenari_customer", JSON.stringify({ name: form.name, phone: form.phone }));
      const mine = JSON.parse(localStorage.getItem("kenari_orders") || "[]") as string[];
      localStorage.setItem("kenari_orders", JSON.stringify([data.code, ...mine].slice(0, 10)));
      clear();
      toast.success("سفارشت ثبت شد 🎉");
      router.push(`/order/${data.code}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "خطا");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container-x py-24 text-center">
        <div className="text-6xl animate-float">🛒</div>
        <h1 className="mt-4 text-2xl font-black">سبد خرید خالیه</h1>
        <Link href="/menu" className="btn-primary mt-6">رفتن به منو</Link>
      </div>
    );
  }

  return (
    <div className="container-x py-10">
      <h1 className="text-3xl font-black">تکمیل سفارش</h1>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_400px]">
        <form onSubmit={submit} className="card space-y-6 p-6">
          <div className="grid grid-cols-2 gap-2 rounded-2xl bg-brand-50 p-1.5">
            {([["dine-in", "سرو در کافه 🪑"], ["takeaway", "بیرون‌بر 🥡"]] as const).map(([k, l]) => (
              <button type="button" key={k} onClick={() => setType(k)}
                className={clsx("rounded-xl py-3 text-sm font-bold transition", type === k ? "bg-white shadow-soft" : "text-stone-500")}>
                {l}
              </button>
            ))}
          </div>

          {type === "dine-in" && (
            <div>
              <label className="label">شماره میز</label>
              <div className="grid grid-cols-6 gap-2 sm:grid-cols-8">
                {Array.from({ length: tableCount }, (_, i) => String(i + 1)).map((t) => (
                  <button type="button" key={t} onClick={() => setTable(t)}
                    className={clsx("aspect-square rounded-xl text-sm font-black ring-1 transition",
                      table === t ? "bg-brand-500 text-white ring-brand-500 shadow-soft" : "bg-white ring-brand-200 hover:ring-brand-400")}>
                    {faNum(t)}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">نام و نام خانوادگی</label>
              <input required className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="مثلا سارا محمدی" />
            </div>
            <div>
              <label className="label">شماره موبایل</label>
              <input required dir="ltr" inputMode="numeric" className="input text-left" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="09121234567" />
            </div>
          </div>
          <div>
            <label className="label">توضیحات (اختیاری)</label>
            <textarea rows={3} className="input" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="مثلا قهوه بدون شکر باشه" />
          </div>

          <div className="flex items-start gap-2 rounded-xl bg-sky-50 p-3 text-xs leading-6 text-sky-800 ring-1 ring-sky-100">
            <Info size={16} className="mt-0.5 shrink-0" />
            این یک نسخه دمو است؛ پرداخت آنلاین انجام نمی‌شود و سفارش مستقیم برای پنل مدیریت ارسال می‌شود.
          </div>

          <button disabled={loading || !isOpen} className="btn-primary w-full py-4 text-base">
            {loading ? <Loader2 className="animate-spin" size={20} /> : null}
            {isOpen ? `ثبت سفارش · ${toman(total)}` : "سفارش‌گیری بسته است"}
          </button>
        </form>

        <aside className="card h-fit space-y-3 p-5 lg:sticky lg:top-24">
          <h3 className="font-extrabold">خلاصه سفارش</h3>
          {items.map((i) => (
            <div key={i.id} className="flex items-center gap-3 border-b border-brand-50 pb-3">
              <SmartImage src={i.image} alt={i.name} className="h-14 w-14 rounded-xl" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">{i.name}</p>
                <p className="text-xs text-stone-500">{toman(i.price)}</p>
              </div>
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => inc(i.id)} className="rounded-lg bg-brand-50 p-1"><Plus size={14} /></button>
                <span className="w-5 text-center text-sm font-black">{faNum(i.quantity)}</span>
                {i.quantity > 1
                  ? <button type="button" onClick={() => dec(i.id)} className="rounded-lg bg-brand-50 p-1"><Minus size={14} /></button>
                  : <button type="button" onClick={() => remove(i.id)} className="rounded-lg bg-rose-50 p-1 text-rose-500"><Trash2 size={14} /></button>}
              </div>
            </div>
          ))}
          <div className="flex justify-between pt-2 text-sm"><span className="text-stone-500">جمع</span><span className="font-black">{toman(total)}</span></div>
        </aside>
      </div>
    </div>
  );
}
