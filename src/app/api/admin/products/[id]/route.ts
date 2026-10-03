import { connectDB } from "@/lib/db";
import { fail, handle, ok } from "@/lib/api";
import { Product } from "@/models/Product";
import { pickProduct } from "@/lib/validators";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Ctx) {
  return handle(async () => {
    const { id } = await params;
    await connectDB();
    const body = (await req.json()) as Record<string, unknown>;
    // پشتیبانی از آپدیت جزئی (مثلا فقط موجود/ناموجود)
    const keys = Object.keys(body);
    const update =
      keys.length <= 2 && keys.every((k) => ["isAvailable", "isFeatured"].includes(k))
        ? body
        : pickProduct(body);
    const p = await Product.findByIdAndUpdate(id, update, { new: true });
    if (!p) return fail("محصول پیدا نشد", 404);
    return ok(p);
  });
}

export async function DELETE(_: Request, { params }: Ctx) {
  return handle(async () => {
    const { id } = await params;
    await connectDB();
    await Product.findByIdAndDelete(id);
    return ok({ ok: true });
  });
}
