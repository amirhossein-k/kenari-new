import { connectDB } from "@/lib/db";
import { ensureSeeded } from "@/lib/data";
import { fail, handle, ok } from "@/lib/api";
import { Product } from "@/models/Product";
import { pickProduct } from "@/lib/validators";

export const dynamic = "force-dynamic";

export async function GET() {
  return handle(async () => {
    await ensureSeeded();
    const products = await Product.find().sort({ sortOrder: 1, createdAt: -1 }).lean();
    return ok(products);
  });
}

export async function POST(req: Request) {
  return handle(async () => {
    await connectDB();
    const data = pickProduct(await req.json());
    if (!data.name) return fail("نام محصول الزامی است");
    if (!data.category) return fail("دسته‌بندی را انتخاب کنید");
    if (!(data.price >= 0)) return fail("قیمت نامعتبر است");
    const p = await Product.create(data);
    return ok(p, 201);
  });
}
