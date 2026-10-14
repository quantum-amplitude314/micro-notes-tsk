import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { AuthPage } from "@/components/auth-page";
import { getCurrentUser } from "@/lib/auth";

export default async function RegisterPage() {
  const user = await getCurrentUser();
  if (user) redirect("/");

  return (
    <AuthPage heading="Create an account">
      <AuthForm mode="register" />
    </AuthPage>
  );
}
