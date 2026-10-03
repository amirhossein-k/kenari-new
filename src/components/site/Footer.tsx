import Link from "next/link";
import { Clock, Instagram, MapPin, Phone } from "lucide-react";
import type { SettingsDTO } from "@/lib/types";

export default function Footer({ s }: { s: SettingsDTO }) {
  return (
    <footer id="contact" className="mt-24 bg-coffee-900 text-brand-100">
      <div className="container-x grid gap-10 py-14 md:grid-cols-3">
        <div>
          <h3 className="text-2xl font-black text-white">{s.siteName}</h3>
          <p className="mt-3 text-sm leading-7 text-brand-200/80">{s.description}</p>
        </div>
        <ul className="space-y-3 text-sm">
          <li className="flex items-start gap-2"><MapPin size={18} className="mt-0.5 shrink-0 text-brand-400" />{s.address}</li>
          <li className="flex items-center gap-2"><Phone size={18} className="text-brand-400" /><span dir="ltr">{s.phone}</span></li>
          <li className="flex items-center gap-2"><Clock size={18} className="text-brand-400" />{s.openingHours}</li>
          {s.instagram && (
            <li className="flex items-center gap-2"><Instagram size={18} className="text-brand-400" /><span dir="ltr">@{s.instagram}</span></li>
          )}
        </ul>
        <div className="flex flex-col items-start gap-3 md:items-end">
          <Link href="/menu" className="btn-primary">مشاهده منو و سفارش</Link>
          <Link href="/admin" className="text-xs text-brand-300/70 hover:text-white">ورود مدیر</Link>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-brand-300/60">
        © {new Date().getFullYear()} {s.siteName} · نسخه دمو
      </div>
    </footer>
  );
}
