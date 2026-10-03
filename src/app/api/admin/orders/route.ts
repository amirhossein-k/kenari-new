import { connectDB } from "@/lib/db";
import { handle, ok } from "@/lib/api";
import { Order } from "@/models/Order";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  return handle(async () => {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const q = searchParams.get("q")?.trim();
    const filter: Record<string, unknown> = {};
    if (status && status !== "all") filter.status = status;
    if (q) {
      const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      filter.$or = [{ code: rx }, { customerName: rx }, { phone: rx }, { tableNumber: rx }];
    }
    const orders = await Order.find(filter).sort({ createdAt: -1 }).limit(200).lean();
    return ok(orders);
  });
}
