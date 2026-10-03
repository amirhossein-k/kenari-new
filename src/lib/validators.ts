export function pickProduct(b: Record<string, unknown>) {
  const num = (v: unknown) => (v === "" || v === null || v === undefined ? null : Number(v));
  return {
    name: String(b.name ?? "").trim(),
    description: String(b.description ?? ""),
    price: Number(b.price ?? 0),
    discountPrice: num(b.discountPrice),
    image: String(b.image ?? ""),
    category: String(b.category ?? ""),
    tags: Array.isArray(b.tags) ? b.tags.map(String).filter(Boolean) : [],
    isAvailable: b.isAvailable !== false,
    isFeatured: Boolean(b.isFeatured),
    prepTime: Number(b.prepTime ?? 10),
    calories: num(b.calories),
    sortOrder: Number(b.sortOrder ?? 0),
  };
}
