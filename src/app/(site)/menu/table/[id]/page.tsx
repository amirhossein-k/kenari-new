import MenuClient from "@/components/site/MenuClient";
import { getMenu, getSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return { title: `منو · میز ${id}` };
}

export default async function TableMenuPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [{ categories, products }, s] = await Promise.all([getMenu(), getSettings()]);
  return <MenuClient categories={categories} products={products} table={decodeURIComponent(id)} isOpen={s.isOpen} />;
}
