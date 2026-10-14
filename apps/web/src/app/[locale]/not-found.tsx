import { getTranslations } from "next-intl/server";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <main className="page-shell flex flex-1 flex-col items-start justify-center gap-4 py-16">
      <p aria-hidden="true" className="font-heading text-7xl font-medium text-accent">
        404
      </p>
      <h1 className="page-heading">{t("heading")}</h1>
      <p className="text-muted-foreground">{t("description")}</p>
      <Link href="/" className={buttonVariants()}>
        {t("home")}
      </Link>
    </main>
  );
}
