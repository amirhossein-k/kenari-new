"use client";
import { useEffect, useState } from "react";
import { Edit3, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import type { CategoryDTO, Section } from "@/lib/types";
import { api } from "@/lib/client";
import { faNum } from "@/lib/format";
import Modal from "@/components/ui/Modal";
import { PageHeader, Spinner, Toggle } from "@/components/admin/ui";

type Cat = CategoryDTO & { productCount: number };
type Form = { _id?: string; title: string; icon: string; section: Section; sortOrder: string; isActive: boolean };
const ICONS = ["☕", "🧋", "🍰", "🍳", "🍕", "🍔", "🥗", "🍝", "🥪", "🍹", "🧁", "🍦", "🥐", "🍟", "🌮", "🍵"];

export default function CategoriesPage() {
  const [cats, setCats] = useState<Cat[] | null>(null);
  const [form, setForm] = useState<Form | null>(null);
  const load = () => api<Cat[]>("/api/admin/categories").then(setCats).catch((e: Error) => toast.error(e.message));
  useEffect(() => { load(); }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    try {
      if (form._id) await api(`/api/admin/categories/${form._id}`, { method: "PUT", body: form });
      else await api("/api/admin/categories", { method: "POST", body: form });
      toast.success("ذخیره شد");
      setForm(null);
      load();
    } catch (err) { toast.error(err instanceof Error ? err.message : "خطا"); }
  };

  const remove = async (c: Cat) => {
    if (!confirm(`دسته «${c.title}» حذف شود؟`)) return;
    try { await api(`/api/admin/categories/${c._id}`, { method: "DELETE" }); toast.success("حذف شد"); load(); }
    catch (err) { toast.error(err instanceof Error ? err.message : "خطا"); }
  };

  const toggle = async (c: Cat, isActive: boolean) => {
    setCats((p) => p?.map((x) => (x._id === c._id ? { ...x, isActive } : x)) ?? null);
    await api(`/api/admin/categories/${c._id}`, { method: "PUT", body: { isActive } }).catch(() => load());
  };

  if (!cats) return <Spinner />;
  return (
    <div>
      <PageHeader title="دسته‌بندی‌ها" subtitle="بخش‌های منوی کافه و رستوران"
        action={<button onClick={() => setForm({ title: "", icon: "☕", section: "cafe", sortOrder: String(cats.length + 1), isActive: true })} className="btn-primary"><Plus size={18} /> دسته جدید</button>} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cats.map((c) => (
          <div key={c._id} className="card flex items-center gap-4 p-4">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-3xl">{c.icon}</span>
            <div className="min-w-0 flex-1">
              <p className="font-extrabold">{c.title}</p>
              <p className="text-xs text-stone-500">{c.section === "cafe" ? "کافه" : "رستوران"} · {faNum(c.productCount)} محصول</p>
              <div className="mt-2"><Toggle checked={c.isActive} onChange={(v) => toggle(c, v)} label={c.isActive ? "فعال" : "مخفی"} /></div>
            </div>
            <div className="flex flex-col gap-1">
              <button onClick={() => setForm({ _id: c._id, title: c.title, icon: c.icon, section: c.section, sortOrder: String(c.sortOrder), isActive: c.isActive })} className="rounded-lg p-2 text-sky-600 hover:bg-sky-50"><Edit3 size={16} /></button>
              <button onClick={() => remove(c)} className="rounded-lg p-2 text-rose-500 hover:bg-rose-50"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={!!form} onClose={() => setForm(null)} title={form?._id ? "ویرایش دسته" : "دسته جدید"} size="sm">
        {form && (
          <form onSubmit={save} className="space-y-4 p-5">
            <div><label className="label">عنوان</label><input required className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div>
              <label className="label">آیکون</label>
              <div className="grid grid-cols-8 gap-2">
                {ICONS.map((i) => (
                  <button type="button" key={i} onClick={() => setForm({ ...form, icon: i })}
                    className={`aspect-square rounded-xl text-xl ring-1 ${form.icon === i ? "bg-brand-100 ring-brand-400" : "ring-brand-100"}`}>{i}</button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">بخش</label>
                <select className="input" value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value as Section })}>
                  <option value="cafe">کافه</option><option value="restaurant">رستوران</option>
                </select>
              </div>
              <div><label className="label">ترتیب</label><input type="number" className="input" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} /></div>
            </div>
            <Toggle checked={form.isActive} onChange={(v) => setForm({ ...form, isActive: v })} label="نمایش در منو" />
            <button className="btn-primary w-full py-3">ذخیره</button>
          </form>
        )}
      </Modal>
    </div>
  );
}
