"use client";
import { Clock, Flame } from "lucide-react";
import clsx from "clsx";
import type { ProductDTO } from "@/lib/types";
import SmartImage from "@/components/ui/SmartImage";
import QtyControl from "./QtyControl";
import { faNum, finalPrice, toman } from "@/lib/format";

export default function ProductCard({ p, onOpen, emoji, index = 0 }: { p: ProductDTO; onOpen?: () => void; emoji?: string; index?: number }) {
  const fp = finalPrice(p);
  const off = fp < p.price ? Math.round(((p.price - fp) / p.price) * 100) : 0;
  return (
    <article
      onClick={onOpen}
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
      className={clsx(
        "group card flex cursor-pointer flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-xl animate-fade-up",
        !p.isAvailable && "opacity-60 grayscale"
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <SmartImage src={p.image} alt={p.name} emoji={emoji} className="h-full w-full transition duration-500 group-hover:scale-110" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute right-2 top-2 flex flex-wrap gap-1">
          {off > 0 && <span className="chip bg-rose-500 text-white ring-rose-400">٪{faNum(off)} تخفیف</span>}
          {p.tags.filter((t) => t !== "تخفیف").slice(0, 2).map((t) => (
            <span key={t} className="chip bg-white/90 text-coffee-900 ring-white/50 backdrop-blur">{t}</span>
          ))}
        </div>
        <div className="absolute bottom-2 right-2 flex gap-2 text-[11px] font-bold text-white">
          <span className="flex items-center gap-1"><Clock size={12} />{faNum(p.prepTime)} دقیقه</span>
          {p.calories ? <span className="flex items-center gap-1"><Flame size={12} />{faNum(p.calories)}</span> : null}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-extrabold">{p.name}</h3>
        <p className="mt-1 line-clamp-2 flex-1 text-xs leading-6 text-stone-500">{p.description}</p>
        <div className="mt-3 flex items-end justify-between gap-2">
          <div>
            {off > 0 && <p className="text-[11px] text-stone-400 line-through">{toman(p.price)}</p>}
            <p className="text-sm font-black text-brand-700">{toman(fp)}</p>
          </div>
          <QtyControl product={p} />
        </div>
      </div>
    </article>
  );
}
