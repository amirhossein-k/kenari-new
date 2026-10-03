import { connectDB } from "@/lib/db";
import { fail, handle, ok } from "@/lib/api";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Ctx) {
  return handle(async () => {
    const { id } = await params;
    await connectDB();
    const b = (await req.json()) as Record<string, unknown>;
    const update: Record<string, unknown> = {};
    if (b.title !== undefined) update.title = String(b.title).trim();
    if (b.section !== undefined) update.section = b.section === "restaurant" ? "restaurant" : "cafe";
    if (b.icon !== undefined) update.icon = String(b.icon);
    if (b.sortOrder !== undefined) update.sortOrder = Number(b.sortOrder);
    if (b.isActive !== undefined) update.isActive = Boolean(b.isActive);
    const c = await Category.findByIdAndUpdate(id, update, { new: true });
    if (!c) return fail("دسته پیدا نشد", 404);
    return ok(c);
  });
}

export async function DELETE(_: Request, { params }: Ctx) {
  return handle(async () => {
    const { id } = await params;
    await connectDB();
    const used = await Product.countDocuments({ category: id });
    if (used > 0) return fail(`این دسته ${used} محصول دارد؛ اول محصولات را جابه‌جا یا حذف کنید`);
    await Category.findByIdAndDelete(id);
    return ok({ ok: true });
  });
}
