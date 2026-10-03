import { Suspense } from "react";
import LoginForm from "@/components/admin/LoginForm";

export const metadata = { title: "ورود مدیر" };

export default function LoginPage() {
  return (
    <div className="relative grid min-h-dvh place-items-center overflow-hidden bg-coffee-900 p-4">
      <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-brand-500/30 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-amber-400/20 blur-3xl" />
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
