"use client";
import { useEffect } from "react";
import { X } from "lucide-react";
import clsx from "clsx";

export default function Modal({
  open, onClose, title, children, size = "md",
}: { open: boolean; onClose: () => void; title?: string; children: React.ReactNode; size?: "sm" | "md" | "lg" }) {
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", k);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", k);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-coffee-900/50 backdrop-blur-sm animate-[fade-up_.2s_ease_both]" onClick={onClose} />
      <div
        className={clsx(
          "relative max-h-[92dvh] w-full overflow-y-auto rounded-t-3xl bg-white shadow-2xl animate-fade-up sm:rounded-3xl",
          size === "sm" && "sm:max-w-md", size === "md" && "sm:max-w-xl", size === "lg" && "sm:max-w-3xl"
        )}
      >
        {title && (
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-brand-100 bg-white/90 px-5 py-4 backdrop-blur">
            <h3 className="text-base font-extrabold">{title}</h3>
            <button onClick={onClose} className="rounded-full p-1.5 text-stone-500 hover:bg-brand-50"><X size={18} /></button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
