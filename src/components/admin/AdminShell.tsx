"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Bell, Coffee, ExternalLink, LayoutDashboard, LayoutGrid, LogOut, Menu, Package, Settings, ShoppingCart, X } from "lucide-react";
import clsx from "clsx";
import NotificationCenter, { NotifProvider, useNotif } from "./NotificationCenter";
import { faNum } from "@/lib/format";

const nav = [
  { href: "/admin", label: "داشبورد", icon: LayoutDashboard },
  { href: "/admin/orders", label: "سفارش‌ها", icon: ShoppingCart, badge: "orders" },
  { href: "/admin/products", label: "محصولات", icon: Package },
  { href: "/admin/categories", label: "دسته‌بندی‌ها", icon: LayoutGrid },
  { href: "/admin/notifications", label: "اعلان‌ها", icon: Bell, badge: "notif" },
  { href: "/admin/settings", label: "تنظیمات سایت", icon: Settings },
] as const;

function Sidebar({ onNav }: { onNav?: () => void }) {
  const path = usePathname();
  const router = useRouter();
  const { unread, pending } = useNotif();
  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
  };
  return (
    <div className="flex h-full flex-col bg-coffee-900 p-4 text-brand-100">
      <Link href="/admin" className="mb-8 flex items-center gap-2 px-2 pt-2">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-700 text-white"><Coffee size={18} /></span>
        <div>
          <p className="font-black text-white">پنل کناری</p>
          <p className="text-[11px] text-brand-300/60">مدیریت کافه رستوران</p>
        </div>
      </Link>
      <nav className="flex-1 space-y-1">
        {nav.map((n) => {
          const active = n.href === "/admin" ? path === "/admin" : path.startsWith(n.href);
          const badge = !("badge" in n) ? 0 : n.badge === "orders" ? pending : unread;
          return (
            <Link key={n.href} href={n.href} onClick={onNav}
              className={clsx("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition",
                active ? "bg-brand-500 text-white shadow-soft" : "text-brand-100/80 hover:bg-white/5 hover:text-white")}>
              <n.icon size={18} /> <span className="flex-1">{n.label}</span>
              {badge > 0 && <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[10px] text-white">{faNum(badge)}</span>}
            </Link>
          );
        })}
      </nav>
      <div className="space-y-1 border-t border-white/10 pt-4">
        <Link href="/menu" target="_blank" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-brand-100/80 hover:bg-white/5">
          <ExternalLink size={18} /> مشاهده سایت
        </Link>
        <button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-rose-300 hover:bg-white/5">
          <LogOut size={18} /> خروج
        </button>
      </div>
    </div>
  );
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  useEffect(() => setOpen(false), [path]);
  return (
    <NotifProvider>
      <div className="min-h-dvh bg-stone-100/70">
        <aside className="fixed inset-y-0 right-0 z-40 hidden w-64 lg:block"><Sidebar /></aside>
        {open && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
            <aside className="absolute inset-y-0 right-0 w-72 animate-fade-up"><Sidebar onNav={() => setOpen(false)} /></aside>
          </div>
        )}
        <div className="lg:pr-64">
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-stone-200 bg-white/80 px-4 backdrop-blur-xl sm:px-6">
            <button onClick={() => setOpen(true)} className="rounded-xl p-2 ring-1 ring-stone-200 lg:hidden">{open ? <X size={18} /> : <Menu size={18} />}</button>
            <p className="hidden text-sm text-stone-500 sm:block">سلام مدیر 👋 امروز چه خبر؟</p>
            <NotificationCenter />
          </header>
          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </NotifProvider>
  );
}
