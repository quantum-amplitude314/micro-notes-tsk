"use client";

import { useFormatter, useTranslations } from "next-intl";

export function NoteUpdatedAt({ updatedAt }: { updatedAt: string }) {
  const t = useTranslations("notes");
  const format = useFormatter();

  return (
    <p className="text-xs text-muted-foreground">
      {t.rich("updated", {
        date: format.dateTime(new Date(updatedAt), {
          day: "numeric",
          month: "numeric",
          year: "numeric",
        }),
        time: (chunks) => <time dateTime={updatedAt}>{chunks}</time>,
      })}
    </p>
  );
}
