import { deleteNote } from "@/app/note-actions";
import { ConfirmDialogButton } from "@/components/confirm-dialog-button";
import { EditNoteButton } from "@/components/edit-note-button";
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

const dateFormat = new Intl.DateTimeFormat("en", { dateStyle: "medium" });

export function NoteCard({ note }: { note: NoteView }) {
  const { id, title, content, priority, updatedAt } = note;

  return (
    <Card>
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
      <CardFooter className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          Updated <time dateTime={updatedAt}>{dateFormat.format(new Date(updatedAt))}</time>
        </p>
        <div className="flex gap-2">
          <EditNoteButton note={note} />
          <ConfirmDialogButton
            triggerLabel="Delete"
            title="Delete this note?"
            description={`"${title}" will be deleted. This can't be undone.`}
            confirmLabel="Delete note"
            failureMessage="The note could not be deleted. Please try again."
            onConfirm={deleteNote.bind(null, { id })}
          />
        </div>
      </CardFooter>
    </Card>
  );
}
