import MenuClient from "@/components/site/MenuClient";
import { getMenu, getSettings } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata = { title: "منو" };

export default async function MenuPage() {
  const [{ categories, products }, s] = await Promise.all([getMenu(), getSettings()]);
  return <MenuClient categories={categories} products={products} isOpen={s.isOpen} />;
}
