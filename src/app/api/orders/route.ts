import { connectDB } from "@/lib/db";
import { ensureSeeded } from "@/lib/data";
import { fail, handle, ok } from "@/lib/api";
import { Product } from "@/models/Product";
import { Order } from "@/models/Order";
import { Notification } from "@/models/Notification";
import { Setting } from "@/models/Setting";

export const dynamic = "force-dynamic";

type Body = {
  customerName?: string;
  phone?: string;
  orderType?: "dine-in" | "takeaway";
  tableNumber?: string | null;
  note?: string;
  items?: { id: string; quantity: number }[];
};

async function nextCode() {
  const last = await Order.findOne().sort({ createdAt: -1 }).select("code").lean();
  const n = last?.code ? parseInt(last.code.replace(/\D/g, ""), 10) || 1000 : 1000;
  return `K-${n + 1}`;
}

export async function POST(req: Request) {
  return handle(async () => {
    await ensureSeeded();
    await connectDB();
    const body = (await req.json()) as Body;
    const name = body.customerName?.trim();
    const phone = body.phone?.trim();
    if (!name) return fail("نام را وارد کنید");
    if (!phone || !/^0?9\d{9}$/.test(phone.replace(/[^\d]/g, ""))) return fail("شماره موبایل معتبر نیست");
    if (!body.items?.length) return fail("سبد خرید خالی است");

    const settings = await Setting.findOne({ key: "site" }).lean();
    if (settings && settings.isOpen === false) return fail("در حال حاضر سفارش‌گیری غیرفعال است");

    // قیمت‌ها همیشه از دیتابیس خوانده می‌شوند، نه از کلاینت
    const ids = body.items.map((i) => i.id);
    const products = await Product.find({ _id: { $in: ids }, isAvailable: true }).lean();
    const map = new Map(products.map((p) => [String(p._id), p] as const));
    const items = body.items
      .filter((i) => map.has(i.id) && i.quantity > 0)
      .map((i) => {
        const p = map.get(i.id)!;
        const price = p.discountPrice && p.discountPrice < p.price ? p.discountPrice : p.price;
        return { product: p._id, name: p.name, price, quantity: Math.min(50, Math.floor(i.quantity)), image: p.image };
      });
    if (!items.length) return fail("آیتم‌های انتخابی موجود نیستند");
    const subtotal = items.reduce((a, b) => a + b.price * b.quantity, 0);

    const orderType = body.orderType === "takeaway" ? "takeaway" : "dine-in";
    const tableNumber = orderType === "dine-in" ? String(body.tableNumber || "").trim() || null : null;
    if (orderType === "dine-in" && !tableNumber) return fail("شماره میز را انتخاب کنید");

    let order: { _id: unknown; code: string } | null = null;
    for (let attempt = 0; attempt < 3 && !order; attempt++) {
      try {
        const doc = await Order.create({
          code: await nextCode(),
          customerName: name,
          phone,
          orderType,
          tableNumber,
          items,
          note: (body.note || "").slice(0, 500),
          subtotal,
        });
        order = { _id: doc._id, code: doc.code };
      } catch (e: unknown) {
        if ((e as { code?: number }).code !== 11000) throw e;
      }
    }
    if (!order) return fail("ثبت سفارش ناموفق بود، دوباره تلاش کنید", 500);

    await Notification.create({
      title: `سفارش جدید ${order.code}`,
      message: `${name} · ${tableNumber ? `میز ${tableNumber}` : "بیرون‌بر"} · ${items.length} قلم`,
      order: order._id,
      orderCode: order.code,
    });

    return ok({ code: order.code }, 201);
  });
}
