import AdminShell from "@/components/admin/AdminShell";

export const metadata = { title: { default: "داشبورد", template: "%s | پنل کناری" } };

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
