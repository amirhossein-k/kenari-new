"use client";
import { useEffect, useState } from "react";
import { Copy, ExternalLink, Loader2, RotateCcw, Save } from "lucide-react";
import toast from "react-hot-toast";
import type { SettingsDTO } from "@/lib/types";
import { api } from "@/lib/client";
import { faNum } from "@/lib/format";
import ImageInput from "@/components/admin/ImageInput";
import { PageHeader, Spinner, Toggle } from "@/components/admin/ui";

export default function SettingsPage() {
  const [s, setS] = useState<SettingsDTO | null>(null);
  const [saving, setSaving] = useState(false);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
    api<SettingsDTO>("/api/admin/settings").then(setS).catch((e: Error) => toast.error(e.message));
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!s) return;
    setSaving(true);
    try { setS(await api<SettingsDTO>("/api/admin/settings", { method: "PUT", body: s })); toast.success("تنظیمات ذخیره شد"); }
    catch (err) { toast.error(err instanceof Error ? err.message : "خطا"); }
    finally { setSaving(false); }
  };

  const reset = async () => {
    if (!confirm("همه داده‌ها (محصولات، سفارش‌ها، اعلان‌ها) پاک و داده‌های نمونه دوباره ساخته شوند؟")) return;
    await api("/api/admin/seed", { method: "POST" });
    toast.success("داده‌های دمو بازنشانی شد");
    window.location.reload();
  };

  if (!s) return <Spinner />;
  const field = (k: keyof SettingsDTO, label: string, opts: { area?: boolean; ltr?: boolean } = {}) => (
    <div className={opts.area ? "sm:col-span-2" : ""}>
      <label className="label">{label}</label>
      {opts.area ? (
        <textarea rows={3} className="input" value={String(s[k] ?? "")} onChange={(e) => setS({ ...s, [k]: e.target.value })} />
      ) : (
        <input dir={opts.ltr ? "ltr" : undefined} className="input" value={String(s[k] ?? "")} onChange={(e) => setS({ ...s, [k]: e.target.value })} />
      )}
    </div>
  );

  return (
    <div className="max-w-4xl space-y-6">
      <PageHeader title="تنظیمات سایت" subtitle="اطلاعاتی که در صفحه اصلی و فوتر نمایش داده می‌شوند" />
      <form onSubmit={save} className="card grid gap-4 p-6 sm:grid-cols-2">
        <div className="flex items-center justify-between rounded-2xl bg-brand-50 p-4 sm:col-span-2">
          <div>
            <p className="font-bold">وضعیت سفارش‌گیری</p>
            <p className="text-xs text-stone-500">وقتی خاموش باشد مشتری فقط منو را می‌بیند</p>
          </div>
          <Toggle checked={s.isOpen} onChange={(v) => setS({ ...s, isOpen: v })} label={s.isOpen ? "باز" : "بسته"} />
        </div>
        {field("siteName", "نام کافه")}
        {field("tagline", "شعار")}
        {field("description", "توضیحات", { area: true })}
        {field("phone", "تلفن", { ltr: true })}
        {field("instagram", "اینستاگرام", { ltr: true })}
        {field("openingHours", "ساعت کاری")}
        <div>
          <label className="label">تعداد میزها</label>
          <input type="number" min={1} max={100} className="input" value={s.tableCount} onChange={(e) => setS({ ...s, tableCount: Number(e.target.value) })} />
        </div>
        {field("address", "آدرس", { area: true })}
        <div className="sm:col-span-2"><label className="label">تصویر بنر صفحه اصلی</label><ImageInput value={s.heroImage} onChange={(heroImage) => setS({ ...s, heroImage })} /></div>
        <div className="sm:col-span-2">
          <button disabled={saving} className="btn-primary px-8 py-3">{saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} ذخیره تنظیمات</button>
        </div>
      </form>

      <div className="card p-6">
        <h3 className="font-extrabold">لینک منوی میزها</h3>
        <p className="mt-1 text-xs text-stone-500">این لینک‌ها را به QR تبدیل کن و روی هر میز بگذار؛ سفارش خودکار با شماره میز ثبت می‌شود.</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: s.tableCount }, (_, i) => i + 1).map((t) => {
            const url = `${origin}/menu/table/${t}`;
            return (
              <div key={t} className="flex items-center gap-2 rounded-xl bg-stone-50 p-2 pr-3 text-sm">
                <span className="font-black">میز {faNum(t)}</span>
                <span className="flex-1" />
                <button type="button" onClick={() => { navigator.clipboard.writeText(url); toast.success("کپی شد"); }} className="rounded-lg p-1.5 hover:bg-white"><Copy size={14} /></button>
                <a href={url} target="_blank" className="rounded-lg p-1.5 hover:bg-white"><ExternalLink size={14} /></a>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card flex flex-wrap items-center justify-between gap-3 border border-rose-100 p-6">
        <div>
          <h3 className="font-extrabold text-rose-600">بازنشانی دمو</h3>
          <p className="text-xs text-stone-500">همه داده‌ها پاک شده و آیتم‌ها و سفارش‌های نمونه دوباره ساخته می‌شوند.</p>
        </div>
        <button onClick={reset} className="btn-danger"><RotateCcw size={16} /> بازنشانی داده‌ها</button>
      </div>
    </div>
  );
}
