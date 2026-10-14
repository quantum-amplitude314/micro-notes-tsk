import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";

const placeholderCards = ["first", "second", "third"];

export function NotesSkeleton() {
  const t = useTranslations("shell");

  return (
    <div aria-busy="true" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <p role="status" className="sr-only">
        {t("loading")}
      </p>
      {placeholderCards.map((card) => (
        <Skeleton key={card} className="h-44 rounded-xl" />
      ))}
    </div>
  );
}
