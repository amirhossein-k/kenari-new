import { getMenu } from "@/lib/data";
import { handle, ok } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  return handle(async () => ok(await getMenu()));
}
