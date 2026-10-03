"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Coffee, Menu as MenuIcon, ShoppingBag, X } from "lucide-react";
import clsx from "clsx";
import { useCart } from "./CartContext";
import { faNum } from "@/lib/format";

const links = [
  { href: "/", label: "خانه" },
  { href: "/menu", label: "منو" },
  { href: "/#about", label: "درباره ما" },
  { href: "/#contact", label: "تماس" },
];

export default function Header({ siteName }: { siteName: string }) {
  const { count, setOpen, table } = useCart();
  const path = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [bump, setBump] = useState(false);

  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 12);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  useEffect(() => {
    if (!count) return;
    setBump(true);
    const t = setTimeout(() => setBump(false), 400);
    return () => clearTimeout(t);
  }, [count]);
  useEffect(() => setMobile(false), [path]);

  return (
    <header className={clsx("sticky top-0 z-50 transition-all", scrolled ? "bg-white/80 shadow-soft backdrop-blur-xl" : "bg-transparent")}>
      <div className="container-x flex h-16 items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-700 text-white shadow-soft">
            <Coffee size={18} />
          </span>
          <span className="text-lg font-black tracking-tight">{siteName}</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={clsx(
                "rounded-xl px-3.5 py-2 text-sm font-bold transition hover:bg-brand-100",
                path === l.href ? "text-brand-600" : "text-stone-700"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {table && (
            <span className="hidden rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200 sm:inline">
              میز {faNum(table)}
            </span>
          )}
          <button onClick={() => setOpen(true)} className="relative rounded-xl bg-coffee-900 p-2.5 text-white transition hover:bg-coffee-700" aria-label="سبد خرید">
            <ShoppingBag size={18} />
            {count > 0 && (
              <span className={clsx("absolute -left-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-brand-500 px-1 text-[10px] font-black", bump && "animate-pop")}>
                {faNum(count)}
              </span>
            )}
          </button>
          <button onClick={() => setMobile((v) => !v)} className="rounded-xl p-2.5 ring-1 ring-brand-200 md:hidden" aria-label="منو">
            {mobile ? <X size={18} /> : <MenuIcon size={18} />}
          </button>
        </div>
      </div>
      {mobile && (
        <nav className="container-x grid gap-1 pb-4 md:hidden animate-fade-up">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="rounded-xl bg-white px-4 py-3 text-sm font-bold shadow-sm ring-1 ring-brand-100">
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
