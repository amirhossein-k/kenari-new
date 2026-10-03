"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container-x py-24 text-center">
      <div className="text-5xl">😵</div>
      <h2 className="mt-4 text-xl font-black">مشکلی پیش اومد</h2>
      <p className="mt-2 text-sm text-stone-500">{error.message || "اتصال به دیتابیس برقرار نشد. فایل .env.local را بررسی کنید."}</p>
      <button onClick={reset} className="btn-primary mt-6">تلاش مجدد</button>
    </div>
  );
}
