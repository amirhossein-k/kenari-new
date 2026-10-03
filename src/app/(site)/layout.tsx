import { CartProvider } from "@/components/site/CartContext";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import CartDrawer from "@/components/site/CartDrawer";
import { getSettings } from "@/lib/data";
import { seedSettings } from "@/lib/seed-data";
import type { SettingsDTO } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  let s: SettingsDTO = seedSettings;
  try {
    s = await getSettings();
  } catch (e) {
    console.error("DB error:", e);
  }
  return (
    <CartProvider>
      <Header siteName={s.siteName} />
      <main>{children}</main>
      <Footer s={s} />
      <CartDrawer />
    </CartProvider>
  );
}
