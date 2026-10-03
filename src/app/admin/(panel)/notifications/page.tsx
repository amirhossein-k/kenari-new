"use client";
import Link from "next/link";
import { BellRing, CheckCheck, Trash2 } from "lucide-react";
import clsx from "clsx";
import toast from "react-hot-toast";
import { useNotif } from "@/components/admin/NotificationCenter";
import { Empty, PageHeader } from "@/components/admin/ui";
import { faDate, timeAgo } from "@/lib/format";

export default function NotificationsPage() {
  const { items, unread, markAll, markOne, refresh } = useNotif();
  const clearRead = async () => {
    await fetch("/api/admin/notifications", { method: "DELETE" });
    toast.success("اعلان‌های خوانده‌شده پاک شدند");
    refresh();
  };
  return (
    <div className="max-w-3xl">
      <PageHeader title="اعلان‌ها" subtitle={unread ? `${unread.toLocaleString("fa-IR")} اعلان خوانده‌نشده` : "همه رو خوندی 👌"}
        action={
          <div className="flex gap-2">
            <button onClick={markAll} className="btn-ghost"><CheckCheck size={16} /> خواندن همه</button>
            <button onClick={clearRead} className="btn-danger"><Trash2 size={16} /> پاک‌سازی</button>
          </div>
        } />
      {items.length === 0 ? <Empty text="اعلانی وجود ندارد" icon="🔔" /> : (
        <div className="card divide-y divide-stone-100 overflow-hidden">
          {items.map((n) => (
            <Link key={n._id} href="/admin/orders" onClick={() => markOne(n._id)}
              className={clsx("flex items-center gap-4 p-4 transition hover:bg-brand-50/60", !n.read && "bg-brand-50/50")}>
              <span className={clsx("grid h-11 w-11 shrink-0 place-items-center rounded-xl", n.read ? "bg-stone-100 text-stone-400" : "bg-brand-500 text-white")}>
                <BellRing size={18} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-bold">{n.title}</p>
                <p className="truncate text-sm text-stone-500">{n.message}</p>
              </div>
              <div className="text-left text-[11px] text-stone-400">
                <p>{timeAgo(n.createdAt)}</p>
                <p className="hidden sm:block">{faDate(n.createdAt)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
