import type { Metadata, Viewport } from "next";
import { Vazirmatn } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const vazir = Vazirmatn({ subsets: ["arabic", "latin"], variable: "--font-vazir", display: "swap" });

export const metadata: Metadata = {
  title: { default: "کافه کناری", template: "%s | کافه کناری" },
  description: "منوی آنلاین و سفارش از سر میز کافه رستوران کناری",
};

export const viewport: Viewport = { themeColor: "#cf7a3a", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={vazir.variable}>
      <body className="min-h-dvh font-sans">
        {children}
        <Toaster position="top-center" toastOptions={{ style: { fontFamily: "var(--font-vazir)", borderRadius: 14 } }} />
      </body>
    </html>
  );
}
