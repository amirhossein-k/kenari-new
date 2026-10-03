"use client";
import Link from "next/link";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Bell, BellRing, CheckCheck, Volume2, VolumeX } from "lucide-react";
import clsx from "clsx";
import toast from "react-hot-toast";
import type { NotificationDTO } from "@/lib/types";
import { faNum, timeAgo } from "@/lib/format";

type Ctx = {
  items: NotificationDTO[];
  unread: number;
  pending: number;
  refresh: () => Promise<void>;
  markAll: () => Promise<void>;
  markOne: (id: string) => Promise<void>;
  sound: boolean;
  setSound: (v: boolean) => void;
};
const NotifCtx = createContext<Ctx | null>(null);
export const NEW_ORDER_EVENT = "kenari:new-order";

function beep() {
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AC();
    [0, 0.18].forEach((t, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = i ? 1046 : 784;
      g.gain.setValueAtTime(0.0001, ctx.currentTime + t);
      g.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + t + 0.25);
      o.connect(g).connect(ctx.destination);
      o.start(ctx.currentTime + t);
      o.stop(ctx.currentTime + t + 0.3);
    });
  } catch {}
}

export function NotifProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<NotificationDTO[]>([]);
  const [unread, setUnread] = useState(0);
  const [pending, setPending] = useState(0);
  const [sound, setSoundState] = useState(true);
  const since = useRef<string | null>(null);
  const soundRef = useRef(true);

  useEffect(() => {
    const v = localStorage.getItem("kenari_sound") !== "off";
    setSoundState(v);
    soundRef.current = v;
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().catch(() => {});
    }
  }, []);

  const setSound = (v: boolean) => {
    setSoundState(v);
    soundRef.current = v;
    localStorage.setItem("kenari_sound", v ? "on" : "off");
  };

  const refresh = useCallback(async () => {
    try {
      const qs = since.current ? `?since=${encodeURIComponent(since.current)}` : "";
      const r = await fetch(`/api/admin/notifications${qs}`, { cache: "no-store" });
      if (!r.ok) return;
      const d = (await r.json()) as { items: NotificationDTO[]; unread: number; pending: number; fresh: NotificationDTO[]; now: string };
      setItems(d.items);
      setUnread(d.unread);
      setPending(d.pending);
      if (since.current && d.fresh.length) {
        if (soundRef.current) beep();
        d.fresh.forEach((n) => {
          toast.custom(
            (t) => (
              <Link href="/admin/orders" onClick={() => toast.dismiss(t.id)}
                className={clsx("flex w-80 items-center gap-3 rounded-2xl bg-coffee-900 p-4 text-white shadow-2xl", t.visible ? "animate-fade-up" : "opacity-0")}>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-500"><BellRing size={18} /></span>
                <span>
                  <span className="block text-sm font-black">{n.title}</span>
                  <span className="block text-xs text-brand-100/80">{n.message}</span>
                </span>
              </Link>
            ),
            { duration: 6000, position: "top-left" }
          );
          if ("Notification" in window && Notification.permission === "granted" && document.hidden) {
            new Notification(n.title, { body: n.message });
          }
        });
        window.dispatchEvent(new CustomEvent(NEW_ORDER_EVENT));
      }
      since.current = d.now;
    } catch {}
  }, []);

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 6000);
    return () => clearInterval(t);
  }, [refresh]);

  useEffect(() => {
    const base = document.title.replace(/^\(\S+\)\s*/, "");
    document.title = pending > 0 ? `(${faNum(pending)}) ${base}` : base;
  }, [pending]);

  const markAll = async () => {
    await fetch("/api/admin/notifications", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: "{}" });
    await refresh();
  };
  const markOne = async (id: string) => {
    await fetch("/api/admin/notifications", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    await refresh();
  };

  return <NotifCtx.Provider value={{ items, unread, pending, refresh, markAll, markOne, sound, setSound }}>{children}</NotifCtx.Provider>;
}

export function useNotif() {
  const c = useContext(NotifCtx);
  if (!c) throw new Error("useNotif must be used inside NotifProvider");
  return c;
}

/** زنگوله اعلان در هدر پنل */
export default function NotificationCenter() {
  const { items, unread, markAll, markOne, sound, setSound } = useNotif();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const f = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", f);
    return () => document.removeEventListener("mousedown", f);
  }, []);

  return (
    <div ref={ref} className="relative mr-auto flex items-center gap-2">
      <button onClick={() => setSound(!sound)} className="rounded-xl p-2.5 text-stone-500 ring-1 ring-stone-200 hover:bg-stone-50" title="صدای اعلان">
        {sound ? <Volume2 size={18} /> : <VolumeX size={18} />}
      </button>
      <button onClick={() => setOpen((v) => !v)} className="relative rounded-xl bg-coffee-900 p-2.5 text-white">
        {unread > 0 ? <BellRing size={18} className="animate-[pulse_1.5s_ease-in-out_infinite]" /> : <Bell size={18} />}
        {unread > 0 && (
          <span className="absolute -left-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-black">{faNum(unread)}</span>
        )}
      </button>
      {open && (
        <div className="absolute left-0 top-12 z-50 w-[22rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-stone-200 animate-fade-up">
          <div className="flex items-center justify-between border-b border-stone-100 px-4 py-3">
            <p className="text-sm font-black">اعلان‌ها</p>
            <button onClick={markAll} className="flex items-center gap-1 text-xs font-bold text-brand-600"><CheckCheck size={14} /> خواندن همه</button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {items.length === 0 && <p className="p-6 text-center text-sm text-stone-400">اعلانی نداری</p>}
            {items.slice(0, 10).map((n) => (
              <Link key={n._id} href="/admin/orders" onClick={() => { markOne(n._id); setOpen(false); }}
                className={clsx("flex gap-3 border-b border-stone-50 px-4 py-3 transition hover:bg-brand-50", !n.read && "bg-brand-50/60")}>
                <span className={clsx("mt-1.5 h-2 w-2 shrink-0 rounded-full", n.read ? "bg-stone-200" : "bg-brand-500")} />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold">{n.title}</span>
                  <span className="block truncate text-xs text-stone-500">{n.message}</span>
                  <span className="mt-1 block text-[10px] text-stone-400">{timeAgo(n.createdAt)}</span>
                </span>
              </Link>
            ))}
          </div>
          <Link href="/admin/notifications" onClick={() => setOpen(false)} className="block bg-stone-50 py-2.5 text-center text-xs font-bold text-stone-600 hover:bg-stone-100">
            مشاهده همه
          </Link>
        </div>
      )}
    </div>
  );
}
