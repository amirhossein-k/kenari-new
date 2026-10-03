import { connectDB } from "@/lib/db";
import { handle, ok } from "@/lib/api";
import { Notification } from "@/models/Notification";
import { Order } from "@/models/Order";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  return handle(async () => {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const since = searchParams.get("since");
    const limit = Math.min(100, Number(searchParams.get("limit") || 20));
    const [items, unread, pending, fresh] = await Promise.all([
      Notification.find().sort({ createdAt: -1 }).limit(limit).lean(),
      Notification.countDocuments({ read: false }),
      Order.countDocuments({ status: "pending" }),
      since
        ? Notification.find({ createdAt: { $gt: new Date(since) } }).sort({ createdAt: -1 }).lean()
        : Promise.resolve([]),
    ]);
    return ok({ items, unread, pending, fresh, now: new Date().toISOString() });
  });
}

export async function PATCH(req: Request) {
  return handle(async () => {
    await connectDB();
    const { id } = (await req.json().catch(() => ({}))) as { id?: string };
    if (id) await Notification.updateOne({ _id: id }, { read: true });
    else await Notification.updateMany({ read: false }, { read: true });
    return ok({ ok: true });
  });
}

export async function DELETE() {
  return handle(async () => {
    await connectDB();
    await Notification.deleteMany({ read: true });
    return ok({ ok: true });
  });
}
