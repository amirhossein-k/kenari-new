import CheckoutClient from "@/components/site/CheckoutClient";
import { getSettings } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata = { title: "ثبت سفارش" };

export default async function CheckoutPage() {
  const s = await getSettings();
  return <CheckoutClient tableCount={s.tableCount} isOpen={s.isOpen} />;
}
