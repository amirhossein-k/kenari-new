export function toman(n: number) {
  return `${Math.round(n).toLocaleString("fa-IR")} تومان`;
}

export function faNum(n: number | string) {
  return Number(n).toLocaleString("fa-IR");
}

export function faDate(d: string | Date) {
  return new Intl.DateTimeFormat("fa-IR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(d));
}

export function timeAgo(d: string | Date) {
  const diff = (Date.now() - new Date(d).getTime()) / 1000;
  if (diff < 60) return "همین الان";
  if (diff < 3600) return `${faNum(Math.floor(diff / 60))} دقیقه پیش`;
  if (diff < 86400) return `${faNum(Math.floor(diff / 3600))} ساعت پیش`;
  return `${faNum(Math.floor(diff / 86400))} روز پیش`;
}

export function slugify(s: string) {
  return (
    s
      .trim()
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, "-")
      .replace(/^-+|-+$/g, "") || `cat-${Date.now()}`
  );
}

export function finalPrice(p: { price: number; discountPrice?: number | null }) {
  return p.discountPrice && p.discountPrice > 0 && p.discountPrice < p.price ? p.discountPrice : p.price;
}
