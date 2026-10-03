import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-dvh place-items-center p-6 text-center">
      <div>
        <div className="text-7xl">☕</div>
        <h1 className="mt-4 text-3xl font-black">۴۰۴</h1>
        <p className="mt-2 text-stone-500">این صفحه پیدا نشد، ولی قهوه هنوز داغه!</p>
        <Link href="/" className="btn-primary mt-6">برگشت به خانه</Link>
      </div>
    </div>
  );
}
