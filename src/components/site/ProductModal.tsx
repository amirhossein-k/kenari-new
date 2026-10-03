"use client";
import { Clock, Flame } from "lucide-react";
import Modal from "@/components/ui/Modal";
import SmartImage from "@/components/ui/SmartImage";
import QtyControl from "./QtyControl";
import type { ProductDTO } from "@/lib/types";
import { faNum, finalPrice, toman } from "@/lib/format";

export default function ProductModal({ p, onClose }: { p: ProductDTO | null; onClose: () => void }) {
  if (!p) return null;
  const fp = finalPrice(p);
  return (
    <Modal open={!!p} onClose={onClose}>
      <div className="relative">
        <SmartImage src={p.image} alt={p.name} className="h-64 w-full sm:h-80" />
        <button onClick={onClose} className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold shadow">بستن</button>
      </div>
      <div className="space-y-4 p-6">
        <div className="flex flex-wrap gap-1.5">
          {p.tags.map((t) => <span key={t} className="chip bg-brand-50 text-brand-700 ring-brand-200">{t}</span>)}
        </div>
        <h2 className="text-2xl font-black">{p.name}</h2>
        <p className="leading-8 text-stone-600">{p.description}</p>
        <div className="flex gap-4 text-sm text-stone-500">
          <span className="flex items-center gap-1"><Clock size={16} /> {faNum(p.prepTime)} دقیقه</span>
          {p.calories ? <span className="flex items-center gap-1"><Flame size={16} /> {faNum(p.calories)} کالری</span> : null}
        </div>
        <div className="flex items-center justify-between border-t border-brand-100 pt-4">
          <div>
            {fp < p.price && <p className="text-xs text-stone-400 line-through">{toman(p.price)}</p>}
            <p className="text-xl font-black text-brand-700">{toman(fp)}</p>
          </div>
          <QtyControl product={p} large />
        </div>
      </div>
    </Modal>
  );
}
