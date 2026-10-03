"use client";
import clsx from "clsx";
import type { OrderStatus } from "@/lib/types";
import { STATUS_COLORS, STATUS_LABELS } from "@/lib/types";

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-black">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-stone-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatusBadge({ s }: { s: OrderStatus }) {
  return <span className={clsx("chip", STATUS_COLORS[s])}>{STATUS_LABELS[s]}</span>;
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button type="button" onClick={() => onChange(!checked)} className="inline-flex items-center gap-2 text-sm font-bold">
      <span className={clsx("relative h-6 w-11 rounded-full transition", checked ? "bg-emerald-500" : "bg-stone-300")}>
        <span className={clsx("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all", checked ? "right-0.5" : "right-[1.375rem]")} />
      </span>
      {label}
    </button>
  );
}

export function Empty({ text, icon = "📭" }: { text: string; icon?: string }) {
  return (
    <div className="card py-16 text-center text-stone-500">
      <div className="text-5xl">{icon}</div>
      <p className="mt-3 font-bold">{text}</p>
    </div>
  );
}

export function Spinner() {
  return <div className="mx-auto my-16 h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-500" />;
}
