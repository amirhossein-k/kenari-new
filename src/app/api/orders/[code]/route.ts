import { connectDB } from "@/lib/db";
import { fail, handle, ok } from "@/lib/api";
import { Order } from "@/models/Order";

export const dynamic = "force-dynamic";

export async function GET(_: Request, { params }: { params: Promise<{ code: string }> }) {
  return handle(async () => {
    const { code } = await params;
    await connectDB();
    const order = await Order.findOne({ code: decodeURIComponent(code) }).select("-phone").lean();
    if (!order) return fail("سفارش پیدا نشد", 404);
    return ok(order);
  });
}
