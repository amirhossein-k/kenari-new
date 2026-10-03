import { connectDB } from "@/lib/db";
import { ensureSeeded } from "@/lib/data";
import { fail, handle, ok } from "@/lib/api";
import { slugify } from "@/lib/format";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";

export const dynamic = "force-dynamic";

export async function GET() {
  return handle(async () => {
    await ensureSeeded();
    const [cats, counts] = await Promise.all([
      Category.find().sort({ sortOrder: 1 }).lean(),
      Product.aggregate<{ _id: unknown; count: number }>([{ $group: { _id: "$category", count: { $sum: 1 } } }]),
    ]);
    const m = new Map(counts.map((c) => [String(c._id), c.count] as const));
    return ok(cats.map((c) => ({ ...c, productCount: m.get(String(c._id)) ?? 0 })));
  });
}

export async function POST(req: Request) {
  return handle(async () => {
    await connectDB();
    const b = (await req.json()) as Record<string, unknown>;
    const title = String(b.title ?? "").trim();
    if (!title) return fail("عنوان دسته الزامی است");
    let slug = slugify(String(b.slug || title));
    if (await Category.exists({ slug })) slug = `${slug}-${Date.now().toString(36)}`;
    const c = await Category.create({
      title,
      slug,
      section: b.section === "restaurant" ? "restaurant" : "cafe",
      icon: String(b.icon || "☕"),
      sortOrder: Number(b.sortOrder ?? 0),
      isActive: b.isActive !== false,
    });
    return ok(c, 201);
  });
}
