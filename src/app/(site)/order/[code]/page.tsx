import OrderTracker from "@/components/site/OrderTracker";

export const metadata = { title: "پیگیری سفارش" };

export default async function OrderPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  return <OrderTracker code={decodeURIComponent(code)} />;
}
