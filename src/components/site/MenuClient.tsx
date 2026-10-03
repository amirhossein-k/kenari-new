"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Search, ShoppingBag } from "lucide-react";
import clsx from "clsx";
import type { CategoryDTO, ProductDTO, Section } from "@/lib/types";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";
import { useCart } from "./CartContext";
import { faNum, toman } from "@/lib/format";

export default function MenuClient({
  categories, products, table, isOpen,
}: { categories: CategoryDTO[]; products: ProductDTO[]; table?: string; isOpen: boolean }) {
  const { setTable, count, total, setOpen, table: savedTable } = useCart();
  const [section, setSection] = useState<Section | "all">("all");
  const [q, setQ] = useState("");
  const [active, setActive] = useState<string>(categories[0]?._id ?? "");
  const [selected, setSelected] = useState<ProductDTO | null>(null);
  const refs = useRef<Record<string, HTMLElement | null>>({});
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (table) setTable(table);
  }, [table, setTable]);

  const groups = useMemo(() => {
    const term = q.trim();
    return categories
      .filter((c) => section === "all" || c.section === section)
      .map((c) => ({
        cat: c,
        items: products.filter(
          (p) => p.category === c._id && (!term || p.name.includes(term) || p.description.includes(term) || p.tags.some((t) => t.includes(term)))
        ),
      }))
      .filter((g) => g.items.length > 0);
  }, [categories, products, section, q]);

  // scroll-spy
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.getAttribute("data-id") || "");
      },
      { rootMargin: "-140px 0px -60% 0px" }
    );
    Object.values(refs.current).forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, [groups]);

  useEffect(() => {
    const el = tabsRef.current?.querySelector<HTMLElement>(`[data-tab="${active}"]`);
    el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [active]);

  const jump = (id: string) => {
    const el = refs.current[id];
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 130, behavior: "smooth" });
  };

  const emojiOf = (id: string) => categories.find((c) => c._id === id)?.icon;

  return (
    <div className="pb-28">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-100 to-brand-50">
        <div className="grain absolute inset-0 opacity-40" />
        <div className="container-x relative py-10 sm:py-14">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="animate-fade-up">
              <p className="text-sm font-bold text-brand-600">منوی دیجیتال</p>
              <h1 className="mt-1 text-3xl font-black sm:text-4xl">چی میل داری امروز؟</h1>
              {(table || savedTable) && (
                <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-bold text-emerald-700 shadow-sm ring-1 ring-emerald-200">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" /> سفارش برای میز {faNum((table || savedTable)!)}
                </p>
              )}
              {!isOpen && (
                <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-sm font-bold text-rose-600 ring-1 ring-rose-200">
                  در حال حاضر سفارش‌گیری بسته است؛ می‌تونی منو رو ببینی.
                </p>
              )}
            </div>
            <div className="flex rounded-2xl bg-white p-1 shadow-soft ring-1 ring-brand-100">
              {([["all", "همه"], ["cafe", "کافه ☕"], ["restaurant", "رستوران 🍽️"]] as const).map(([k, l]) => (
                <button
                  key={k}
                  onClick={() => setSection(k)}
                  className={clsx("rounded-xl px-4 py-2 text-sm font-bold transition", section === k ? "bg-coffee-900 text-white shadow" : "text-stone-600 hover:bg-brand-50")}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
          <div className="relative mt-6 max-w-xl">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="جستجو در منو... مثلا لاته" className="input py-3.5 pr-11 text-base shadow-soft" />
          </div>
        </div>
      </section>

      {/* Sticky tabs */}
      <div className="sticky top-16 z-40 border-y border-brand-100 bg-brand-50/90 backdrop-blur-xl">
        <div ref={tabsRef} className="container-x no-scrollbar flex gap-2 overflow-x-auto py-3">
          {groups.map((g) => (
            <button
              key={g.cat._id}
              data-tab={g.cat._id}
              onClick={() => jump(g.cat._id)}
              className={clsx(
                "flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold transition",
                active === g.cat._id ? "bg-brand-500 text-white shadow-soft" : "bg-white text-stone-700 ring-1 ring-brand-100 hover:ring-brand-300"
              )}
            >
              <span>{g.cat.icon}</span>{g.cat.title}
              <span className={clsx("rounded-full px-1.5 text-[10px]", active === g.cat._id ? "bg-white/25" : "bg-brand-100")}>{faNum(g.items.length)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="container-x mt-6 space-y-12">
        {groups.length === 0 && (
          <div className="py-20 text-center text-stone-500">
            <div className="text-5xl">🔍</div>
            <p className="mt-3 font-bold">چیزی پیدا نشد</p>
          </div>
        )}
        {groups.map((g) => (
          <section key={g.cat._id} data-id={g.cat._id} ref={(el) => { refs.current[g.cat._id] = el; }} className="scroll-mt-36">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-black">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-xl shadow-sm ring-1 ring-brand-100">{g.cat.icon}</span>
              {g.cat.title}
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
              {g.items.map((p, i) => (
                <ProductCard key={p._id} p={p} index={i} emoji={emojiOf(p.category)} onOpen={() => setSelected(p)} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {count > 0 && (
        <div className="fixed inset-x-0 bottom-4 z-50 px-4 animate-fade-up">
          <button onClick={() => setOpen(true)} className="mx-auto flex w-full max-w-md items-center justify-between rounded-2xl bg-coffee-900 px-5 py-4 text-white shadow-2xl ring-4 ring-white/50">
            <span className="flex items-center gap-2 font-bold"><ShoppingBag size={18} /> مشاهده سبد ({faNum(count)})</span>
            <span className="font-black">{toman(total)}</span>
          </button>
        </div>
      )}

      <ProductModal p={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
