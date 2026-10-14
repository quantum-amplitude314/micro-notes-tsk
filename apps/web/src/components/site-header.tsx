import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { AccountMenu } from "@/components/account-menu";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { Link } from "@/i18n/navigation";
import { appVersion } from "@/lib/app-version";
import { getCurrentUser } from "@/lib/auth";

async function HeaderActions() {
  const user = await getCurrentUser().catch(() => null);
  if (!user) return <LocaleSwitcher />;

  return <AccountMenu email={user.email} version={appVersion} />;
}

export async function SiteHeader() {
  const t = await getTranslations("shell");

  return (
    <header className="border-b bg-card">
      <div className="page-shell flex min-h-16 items-center justify-between gap-3 py-3">
        <Link href="/" className="font-heading text-xl font-medium">
          {t("brand")}
        </Link>
        <Suspense fallback={null}>
          <HeaderActions />
        </Suspense>
      </div>
    </header>
  );
}
