import { connectDB } from "@/lib/db";
import { getSettings } from "@/lib/data";
import { handle, ok } from "@/lib/api";
import { Setting } from "@/models/Setting";

export const dynamic = "force-dynamic";

const FIELDS = ["siteName", "tagline", "description", "phone", "address", "instagram", "openingHours", "heroImage", "tableCount", "isOpen"] as const;

export async function GET() {
  return handle(async () => ok(await getSettings()));
}

export async function PUT(req: Request) {
  return handle(async () => {
    await connectDB();
    const b = (await req.json()) as Record<string, unknown>;
    const update: Record<string, unknown> = {};
    for (const f of FIELDS) if (b[f] !== undefined) update[f] = b[f];
    if (update.tableCount !== undefined) update.tableCount = Math.max(1, Math.min(100, Number(update.tableCount)));
    if (update.isOpen !== undefined) update.isOpen = Boolean(update.isOpen);
    await Setting.updateOne({ key: "site" }, { $set: update }, { upsert: true });
    return ok(await getSettings());
  });
}
