import { connectDB } from "@/lib/db";
import { ensureSeeded } from "@/lib/data";
import { handle, ok } from "@/lib/api";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";

export const dynamic = "force-dynamic";

export async function GET() {
  return handle(async () => {
    await ensureSeeded();
    await connectDB();
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const week = new Date(start);
    week.setDate(week.getDate() - 6);

    const [products, categories, pending, active, todayAgg, totalAgg, recent, daily, top] = await Promise.all([
      Product.countDocuments(),
      Category.countDocuments(),
      Order.countDocuments({ status: "pending" }),
      Order.countDocuments({ status: { $in: ["confirmed", "preparing", "ready"] } }),
      Order.aggregate<{ count: number; revenue: number }>([
        { $match: { createdAt: { $gte: start }, status: { $ne: "cancelled" } } },
        { $group: { _id: null, count: { $sum: 1 }, revenue: { $sum: "$subtotal" } } },
      ]),
      Order.aggregate<{ count: number; revenue: number }>([
        { $match: { status: { $ne: "cancelled" } } },
        { $group: { _id: null, count: { $sum: 1 }, revenue: { $sum: "$subtotal" } } },
      ]),
      Order.find().sort({ createdAt: -1 }).limit(6).lean(),
      Order.aggregate<{ _id: string; revenue: number; count: number }>([
        { $match: { createdAt: { $gte: week }, status: { $ne: "cancelled" } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, revenue: { $sum: "$subtotal" }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      Order.aggregate<{ _id: string; qty: number }>([
        { $match: { status: { $ne: "cancelled" } } },
        { $unwind: "$items" },
        { $group: { _id: "$items.name", qty: { $sum: "$items.quantity" } } },
        { $sort: { qty: -1 } },
        { $limit: 5 },
      ]),
    ]);

    const days: { date: string; revenue: number; count: number }[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(week);
      d.setDate(week.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      const f = daily.find((x) => x._id === key);
      days.push({ date: d.toISOString(), revenue: f?.revenue ?? 0, count: f?.count ?? 0 });
    }

    return ok({
      products,
      categories,
      pending,
      active,
      todayOrders: todayAgg[0]?.count ?? 0,
      todayRevenue: todayAgg[0]?.revenue ?? 0,
      totalOrders: totalAgg[0]?.count ?? 0,
      totalRevenue: totalAgg[0]?.revenue ?? 0,
      recent,
      days,
      top,
    });
  });
}
