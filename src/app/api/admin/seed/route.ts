import { seedDemo } from "@/lib/data";
import { handle, ok } from "@/lib/api";

export async function POST() {
  return handle(async () => {
    await seedDemo(true);
    return ok({ ok: true });
  });
}
