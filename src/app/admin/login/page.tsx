import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import LoginForm from "@/components/admin/LoginForm";

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) redirect("/admin");

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <div className="mb-10">
          <span className="text-[10px] uppercase tracking-[0.6em] text-[#C56E3D] font-black block mb-4">
            Restricted
          </span>
          <h1 className="font-[family-name:var(--font-fraunces)] text-5xl font-black tracking-tighter leading-none">
            Admin{" "}
            <span className="italic font-[family-name:var(--font-playfair)] text-[#C56E3D]">
              Console.
            </span>
          </h1>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
