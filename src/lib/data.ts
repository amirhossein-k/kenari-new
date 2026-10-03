import { connectDB, plain } from "./db";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";
import { Order } from "@/models/Order";
import { Notification } from "@/models/Notification";
import { Setting } from "@/models/Setting";
import { seedCategories, seedProducts, seedSettings } from "./seed-data";
import type { CategoryDTO, OrderStatus, ProductDTO, SettingsDTO } from "./types";

/** اگر دیتابیس خالی بود، داده‌های نمونه را وارد می‌کند */
export async function ensureSeeded() {
  await connectDB();
  const count = await Category.estimatedDocumentCount();
  if (count === 0) await seedDemo(false);
}

export async function seedDemo(wipe = true) {
  await connectDB();
  if (wipe) {
    await Promise.all([
      Category.deleteMany({}),
      Product.deleteMany({}),
      Order.deleteMany({}),
      Notification.deleteMany({}),
      Setting.deleteMany({}),
    ]);
  }
  await Setting.updateOne({ key: "site" }, { $set: seedSettings }, { upsert: true });
  const cats = await Category.insertMany(seedCategories.map((c) => ({ ...c })));
  const bySlug = new Map(cats.map((c) => [c.slug, c._id] as const));
  await Product.insertMany(
    seedProducts.map((p, i) => ({ ...p, category: bySlug.get(p.category), sortOrder: i }))
  );

  // چند سفارش نمونه برای اینکه داشبورد خالی نباشد
  const products = await Product.find().limit(6).lean();
  type Sample = { customerName: string; phone: string; tableNumber: string | null; items: number[]; status: OrderStatus };
  const samples: Sample[] = [
    { customerName: "سارا محمدی", phone: "09121234567", tableNumber: "3", items: [0, 2], status: "delivered" },
    { customerName: "علی رضایی", phone: "09351234567", tableNumber: "7", items: [1, 4], status: "preparing" },
    { customerName: "مریم کریمی", phone: "09191234567", tableNumber: null, items: [3], status: "pending" },
  ];
  for (const [idx, sm] of samples.entries()) {
    const items = sm.items
      .map((i) => products[i])
      .filter(Boolean)
      .map((p) => ({ product: p._id, name: p.name, price: p.discountPrice || p.price, quantity: 1 + (idx % 2), image: p.image }));
    const subtotal = items.reduce((a, b) => a + b.price * b.quantity, 0);
    const code = `K-${1000 + idx + 1}`;
    const order = await Order.create({
      code,
      customerName: sm.customerName,
      phone: sm.phone,
      orderType: sm.tableNumber ? "dine-in" : "takeaway",
      tableNumber: sm.tableNumber,
      items,
      subtotal,
      status: sm.status,
    });
    await Notification.create({
      title: `سفارش جدید ${code}`,
      message: `${sm.customerName} · ${sm.tableNumber ? `میز ${sm.tableNumber}` : "بیرون‌بر"}`,
      order: order._id,
      orderCode: code,
      read: sm.status !== "pending",
    });
  }
}

export async function getSettings(): Promise<SettingsDTO> {
  await ensureSeeded();
  const s = await Setting.findOne({ key: "site" }).lean();
  return plain<SettingsDTO>({ ...seedSettings, ...(s ?? {}) });
}

export async function getMenu() {
  await ensureSeeded();
  const [categories, products] = await Promise.all([
    Category.find({ isActive: true }).sort({ sortOrder: 1 }).lean(),
    Product.find({}).sort({ sortOrder: 1, createdAt: 1 }).lean(),
  ]);
  return {
    categories: plain<CategoryDTO[]>(categories),
    products: plain<ProductDTO[]>(products),
  };
}

export async function getFeatured() {
  await ensureSeeded();
  const products = await Product.find({ isFeatured: true, isAvailable: true }).sort({ sortOrder: 1 }).limit(8).lean();
  return plain<ProductDTO[]>(products);
}
