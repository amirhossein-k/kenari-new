"use client";
import { useState } from "react";
import clsx from "clsx";

/** تصویر با fallback زیبا در صورت خطا یا خالی بودن آدرس */
export default function SmartImage({ src, alt, className, emoji = "☕" }: { src?: string; alt: string; className?: string; emoji?: string }) {
  const [err, setErr] = useState(false);
  if (!src || err) {
    return (
      <div className={clsx("grid place-items-center bg-gradient-to-br from-brand-200 via-brand-100 to-brand-300 text-4xl", className)} aria-label={alt}>
        <span className="drop-shadow">{emoji}</span>
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading="lazy" onError={() => setErr(true)} className={clsx("object-cover", className)} />;
}
