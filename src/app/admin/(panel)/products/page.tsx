"use client";
import { useEffect, useMemo, useState } from "react";
import { Edit3, Loader2, Plus, Search, Star, Trash2 } from "lucide-react";
import clsx from "clsx";
import toast from "react-hot-toast";
import type { CategoryDTO, ProductDTO } from "@/lib/types";
import { api } from "@/lib/client";
import { faNum, finalPrice, toman } from "@/lib/format";
import Modal from "@/components/ui/Modal";
import SmartImage from "@/components/ui/SmartImage";
import ImageInput from "@/components/admin/ImageInput";
import { Empty, PageHeader, Spinner, Toggle } from "@/components/admin/ui";

type Form = Omit<ProductDTO, "_id" | "createdAt" | "price" | "discountPrice" | "calories" | "prepTime" | "sortOrder"> & {
  _id?: string; price: string; discountPrice: string; calories: string; prepTime: string; sortOrder: string; tagsText: string;
};

const empty = (cat = ""): Form => ({
  name: "", description: "", price: "", discountPrice: "", image: "", category: cat, tags: [], tagsText: "",
  isAvailable: true, isFeatured: false, prepTime: "10", calories: "", sortOrder: "0",
});

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductDTO[] | null>(null);
  const [cats, setCats] = useState<CategoryDTO[]>([]);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [form, setForm] = useState<Form | null>(null);
  const [saving, setSaving] = useState(false);
  const [del, setDel] = useState<ProductDTO | null>(null);

  const load = async () => {
    const [p, c] = await Promise.all([api<ProductDTO[]>("/api/admin/products"), api<CategoryDTO[]>("/api/admin/categories")]);
    setProducts(p);
    setCats(c);
  };
  useEffect(() => { load().catch((e) => toast.error(e.message)); }, []);

  const list = useMemo(
    () => (products ?? []).filter((p) => (cat === "all" || p.category === cat) && (!q || p.name.includes(q))),
    [products, q, cat]
  );
  const catName = (id: string) => cats.find((c) => c._id === id);

  const openEdit = (p: ProductDTO) =>
    setForm({
      ...p, price: String(p.price), discountPrice: p.discountPrice ? String(p.discountPrice) : "",
      calories: p.calories ? String(p.calories) : "", prepTime: String(p.prepTime), sortOrder: String(p.sortOrder), tagsText: p.tags.join("، "),
    });

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    try {
      const body = { ...form, tags: form.tagsText.split(/[,،]/).map((t) => t.trim()).filter(Boolean) };
      if (form._id) await api(`/api/admin/products/${form._id}`, { method: "PUT", body });
      else await api("/api/admin/products", { method: "POST", body });
      toast.success(form._id ? "محصول ویرایش شد" : "محصول اضافه شد");
      setForm(null);
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "خطا");
    } finally {
      setSaving(false);
    }
  };

  const quick = async (p: ProductDTO, patch: Partial<ProductDTO>) => {
    setProducts((prev) => prev?.map((x) => (x._id === p._id ? { ...x, ...patch } : x)) ?? null);
    try { await api(`/api/admin/products/${p._id}`, { method: "PUT", body: patch }); }
    catch (err) { toast.error(err instanceof Error ? err.message : "خطا"); load(); }
  };

  const remove = async () => {
    if (!del) return;
    try {
      await api(`/api/admin/products/${del._id}`, { method: "DELETE" });
      toast.success("حذف شد");
      setDel(null);
      load();
    } catch (err) { toast.error(err instanceof Error ? err.message : "خطا"); }
  };

  if (!products) return <Spinner />;

  return (
    <div>
      <PageHeader title="محصولات" subtitle={`${faNum(products.length)} آیتم در منو`}
        action={<button onClick={() => setForm(empty(cats[0]?._id))} className="btn-primary"><Plus size={18} /> محصول جدید</button>} />

      <div className="mb-5 flex flex-wrap gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input className="input pr-9" placeholder="جستجوی محصول..." value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <select className="input w-auto" value={cat} onChange={(e) => setCat(e.target.value)}>
          <option value="all">همه دسته‌ها</option>
          {cats.map((c) => <option key={c._id} value={c._id}>{c.icon} {c.title}</option>)}
        </select>
      </div>

      {list.length === 0 ? <Empty text="محصولی پیدا نشد" /> : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((p) => (
            <div key={p._id} className={clsx("card flex gap-4 p-4 transition", !p.isAvailable && "opacity-60")}>
              <SmartImage src={p.image} alt={p.name} emoji={catName(p.category)?.icon} className="h-24 w-24 shrink-0 rounded-2xl" />
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="truncate font-extrabold">{p.name}</h3>
                  <button onClick={() => quick(p, { isFeatured: !p.isFeatured })} title="ویژه">
                    <Star size={18} className={p.isFeatured ? "fill-amber-400 text-amber-400" : "text-stone-300"} />
                  </button>
                </div>
                <p className="text-xs text-stone-500">{catName(p.category)?.title ?? "بدون دسته"}</p>
                <p className="mt-1 text-sm font-black text-brand-700">
                  {toman(finalPrice(p))} {finalPrice(p) < p.price && <span className="text-[11px] font-normal text-stone-400 line-through">{toman(p.price)}</span>}
                </p>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <Toggle checked={p.isAvailable} onChange={(v) => quick(p, { isAvailable: v })} label={p.isAvailable ? "موجود" : "ناموجود"} />
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(p)} className="rounded-lg p-2 text-sky-600 hover:bg-sky-50"><Edit3 size={16} /></button>
                    <button onClick={() => setDel(p)} className="rounded-lg p-2 text-rose-500 hover:bg-rose-50"><Trash2 size={16} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={!!form} onClose={() => setForm(null)} title={form?._id ? "ویرایش محصول" : "افزودن محصول"} size="lg">
        {form && (
          <form onSubmit={save} className="grid gap-4 p-5 sm:grid-cols-2">
            <div className="sm:col-span-2"><label className="label">تصویر</label><ImageInput value={form.image} onChange={(image) => setForm({ ...form, image })} /></div>
            <div><label className="label">نام محصول *</label><input required className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div>
              <label className="label">دسته‌بندی *</label>
              <select required className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                <option value="" disabled>انتخاب کنید</option>
                {cats.map((c) => <option key={c._id} value={c._id}>{c.icon} {c.title}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2"><label className="label">توضیحات</label><textarea rows={3} className="input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div><label className="label">قیمت (تومان) *</label><input required type="number" min={0} className="input" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></div>
            <div><label className="label">قیمت با تخفیف</label><input type="number" min={0} className="input" value={form.discountPrice} onChange={(e) => setForm({ ...form, discountPrice: e.target.value })} /></div>
            <div><label className="label">زمان آماده‌سازی (دقیقه)</label><input type="number" min={0} className="input" value={form.prepTime} onChange={(e) => setForm({ ...form, prepTime: e.target.value })} /></div>
            <div><label className="label">کالری</label><input type="number" min={0} className="input" value={form.calories} onChange={(e) => setForm({ ...form, calories: e.target.value })} /></div>
            <div><label className="label">برچسب‌ها (با ، جدا کنید)</label><input className="input" placeholder="پرفروش، جدید" value={form.tagsText} onChange={(e) => setForm({ ...form, tagsText: e.target.value })} /></div>
            <div><label className="label">ترتیب نمایش</label><input type="number" className="input" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} /></div>
            <div className="flex flex-wrap gap-6 sm:col-span-2">
              <Toggle checked={form.isAvailable} onChange={(v) => setForm({ ...form, isAvailable: v })} label="موجود است" />
              <Toggle checked={form.isFeatured} onChange={(v) => setForm({ ...form, isFeatured: v })} label="نمایش در محبوب‌ها" />
            </div>
            <div className="flex gap-2 border-t border-brand-100 pt-4 sm:col-span-2">
              <button disabled={saving} className="btn-primary flex-1 py-3">{saving && <Loader2 size={16} className="animate-spin" />} ذخیره</button>
              <button type="button" onClick={() => setForm(null)} className="btn-ghost">انصراف</button>
            </div>
          </form>
        )}
      </Modal>

      <Modal open={!!del} onClose={() => setDel(null)} title="حذف محصول" size="sm">
        <div className="space-y-4 p-5">
          <p className="text-sm">مطمئنی می‌خوای «{del?.name}» رو حذف کنی؟ این کار قابل برگشت نیست.</p>
          <div className="flex gap-2">
            <button onClick={remove} className="btn flex-1 bg-rose-500 text-white hover:bg-rose-600">بله، حذف کن</button>
            <button onClick={() => setDel(null)} className="btn-ghost">انصراف</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
