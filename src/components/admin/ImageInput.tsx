"use client";
import { useRef } from "react";
import { ImagePlus, Link2 } from "lucide-react";
import toast from "react-hot-toast";
import SmartImage from "@/components/ui/SmartImage";

/** تصویر را در مرورگر کوچک می‌کند و به صورت data URL برمی‌گرداند (بدون نیاز به سرویس آپلود) */
async function compress(file: File, max = 900): Promise<string> {
  const url = URL.createObjectURL(file);
  const img = new Image();
  await new Promise<void>((res, rej) => { img.onload = () => res(); img.onerror = () => rej(new Error("فایل تصویر نامعتبر است")); img.src = url; });
  const scale = Math.min(1, max / Math.max(img.width, img.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
  URL.revokeObjectURL(url);
  return canvas.toDataURL("image/jpeg", 0.8);
}

export default function ImageInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="flex gap-3">
      <SmartImage src={value} alt="preview" className="h-24 w-24 shrink-0 rounded-2xl ring-1 ring-brand-100" />
      <div className="flex-1 space-y-2">
        <div className="relative">
          <Link2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input dir="ltr" className="input pr-9 text-left text-xs" placeholder="https://..." value={value.startsWith("data:") ? "" : value} onChange={(e) => onChange(e.target.value)} />
        </div>
        <button type="button" onClick={() => ref.current?.click()} className="btn-ghost w-full text-xs">
          <ImagePlus size={16} /> {value.startsWith("data:") ? "تصویر آپلود شد · تغییر" : "یا آپلود از دستگاه"}
        </button>
        <input ref={ref} type="file" accept="image/*" hidden onChange={async (e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          try { onChange(await compress(f)); } catch (err) { toast.error(err instanceof Error ? err.message : "خطا"); }
          e.target.value = "";
        }} />
      </div>
    </div>
  );
}
