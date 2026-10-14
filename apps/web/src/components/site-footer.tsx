import { getTranslations } from "next-intl/server";
import { QaCredit } from "@/components/qa-credit";
import { appVersion } from "@/lib/app-version";

export async function SiteFooter() {
  const t = await getTranslations("shell");

  return (
    <footer className="mt-auto border-t">
      <div className="page-shell flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-6 text-xs text-muted-foreground">
        <span>{t("brand")}</span>
        <QaCredit label={t("credit")} />
        <span>{appVersion}</span>
      </div>
    </footer>
  );
}
