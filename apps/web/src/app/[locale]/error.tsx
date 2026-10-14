"use client";

import { useTranslations } from "next-intl";
import { Button, buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  const t = useTranslations("errorPage");
  const { digest } = error;

  return (
    <main className="page-shell flex flex-1 flex-col items-start justify-center gap-4 py-16">
      <p aria-hidden="true" className="font-heading text-7xl font-medium text-accent">
        500
      </p>
      <h1 className="page-heading">{t("heading")}</h1>
      <p className="text-muted-foreground">{t("description")}</p>
      <div className="flex flex-wrap gap-3">
        <Button onClick={retry}>{t("retry")}</Button>
        <Link href="/" className={buttonVariants({ variant: "outline" })}>
          {t("home")}
        </Link>
      </div>
      {digest ? <p className="text-xs text-muted-foreground">{t("code", { digest })}</p> : null}
    </main>
  );
}
