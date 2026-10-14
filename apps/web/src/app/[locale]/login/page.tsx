import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth-form";
import { AuthPage } from "@/components/auth-page";
import { RedirectIfSignedIn } from "@/components/redirect-if-signed-in";

export default async function LoginPage() {
  const t = await getTranslations("auth");

  return (
    <>
      <Suspense fallback={null}>
        <RedirectIfSignedIn />
      </Suspense>
      <AuthPage heading={t("signInHeading")}>
        <AuthForm mode="signIn" />
      </AuthPage>
    </>
  );
}
