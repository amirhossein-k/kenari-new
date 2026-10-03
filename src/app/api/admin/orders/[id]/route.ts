import { connectDB } from "@/lib/db";
import { fail, handle, ok } from "@/lib/api";
import { Order } from "@/models/Order";

type Ctx = { params: Promise<{ id: string }> };
const STATUSES = ["pending", "confirmed", "preparing", "ready", "delivered", "cancelled"];

export async function PATCH(req: Request, { params }: Ctx) {
  return handle(async () => {
    const { id } = await params;
    await connectDB();
    const { status } = (await req.json()) as { status?: string };
    if (!status || !STATUSES.includes(status)) return fail("وضعیت نامعتبر است");
    const o = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!o) return fail("سفارش پیدا نشد", 404);
    return ok(o);
  });
}

export async function DELETE(_: Request, { params }: Ctx) {
  return handle(async () => {
    const { id } = await params;
    await connectDB();
    await Order.findByIdAndDelete(id);
    return ok({ ok: true });
  });
}
