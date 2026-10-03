"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Coffee, Loader2, Lock } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const [u, setU] = useState("admin");
  const [p, setP] = useState("admin123");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const r = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: u, password: p }),
    });
    setLoading(false);
    if (!r.ok) {
      const d = await r.json().catch(() => ({}));
      return toast.error((d as { error?: string }).error || "ورود ناموفق");
    }
    toast.success("خوش اومدی 👋");
    router.replace(sp.get("next") || "/admin");
    router.refresh();
  };

  return (
    <form onSubmit={submit} className="relative w-full max-w-sm space-y-5 rounded-3xl bg-white p-8 shadow-2xl animate-fade-up">
      <div className="text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-700 text-white shadow-soft"><Coffee /></span>
        <h1 className="mt-4 text-xl font-black">پنل مدیریت کناری</h1>
        <p className="mt-1 text-xs text-stone-500">برای دمو: admin / admin123</p>
      </div>
      <div>
        <label className="label">نام کاربری</label>
        <input className="input" dir="ltr" value={u} onChange={(e) => setU(e.target.value)} />
      </div>
      <div>
        <label className="label">رمز عبور</label>
        <input className="input" dir="ltr" type="password" value={p} onChange={(e) => setP(e.target.value)} />
      </div>
      <button disabled={loading} className="btn-primary w-full py-3">
        {loading ? <Loader2 size={18} className="animate-spin" /> : <Lock size={16} />} ورود
      </button>
    </form>
  );
}
