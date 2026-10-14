import { useLocale, useTranslations } from "next-intl";
import { deleteNote } from "@/app/note-actions";
import { ConfirmDialogButton } from "@/components/confirm-dialog";
import { NoteDialogButton } from "@/components/note-dialog-button";
import { NoteUpdatedAt } from "@/components/note-updated-at";
import { PriorityBadge } from "@/components/priority-badge";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { NoteView } from "@/lib/note-form";

export function NoteCard({ note }: { note: NoteView }) {
  const t = useTranslations("notes");
  const locale = useLocale();
  const { id, title, content, priority, updatedAt } = note;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="section-heading break-words">{title}</CardTitle>
        <CardAction>
          <PriorityBadge priority={priority} />
        </CardAction>
      </CardHeader>
      {content ? (
        <CardContent>
          <p className="whitespace-pre-wrap break-words">{content}</p>
        </CardContent>
      ) : null}
      <CardFooter className="mt-auto flex flex-wrap items-center justify-between gap-3">
        <NoteUpdatedAt updatedAt={updatedAt} />
        <div className="ml-auto flex gap-2">
          <ConfirmDialogButton
            triggerLabel={t("delete")}
            title={t("deleteTitle")}
            description={t("deleteDescription", { title })}
            confirmLabel={t("deleteConfirm")}
            failureMessage={t("deleteFailed")}
            onConfirm={deleteNote.bind(null, { id, locale })}
          />
          <NoteDialogButton
            note={note}
            label={t("edit")}
            title={t("editTitle")}
            variant="outline"
            size="sm"
          />
        </div>
      </CardFooter>
    </Card>
  );
}
