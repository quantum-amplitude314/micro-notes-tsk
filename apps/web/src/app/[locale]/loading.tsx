import { LoaderCircle } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Loading() {
  const t = useTranslations("shell");

  return (
    <main className="page-shell grid min-h-[60svh] flex-1 place-items-center">
      <p
        role="status"
        className="app-loader flex flex-col items-center gap-3 text-xs text-muted-foreground"
      >
        <LoaderCircle aria-hidden="true" className="size-8 animate-spin text-primary" />
        {t("loading")}
      </p>
    </main>
  );
}
