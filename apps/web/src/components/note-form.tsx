"use client";

import {
  getNoteFieldErrors,
  NOTE_CONTENT_MAX_LENGTH,
  NOTE_TITLE_MAX_LENGTH,
  type NoteField,
  noteInputSchema,
} from "@notes/contracts";
import { type SubmitEvent, useState, useTransition } from "react";
import { createNote, updateNote } from "@/app/note-actions";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  emptyNoteValues,
  type NoteFormState,
  type NoteValues,
  type NoteView,
  noteSaveErrorMessages,
  noteValidationMessages,
} from "@/lib/note-form";
import { priorityOptions } from "@/lib/priority";

const toNoteValues = ({ title, content, priority }: NoteView) => {
  const values: NoteValues = { title, content, priority };

  return values;
};

export function NoteForm({ note, onSaved }: { note?: NoteView; onSaved?: () => void }) {
  const [values, setValues] = useState(note ? toNoteValues(note) : emptyNoteValues);
  const [feedback, setFeedback] = useState<NoteFormState>({});
  const [pending, startTransition] = useTransition();
  const idPrefix = note ? `note-${note.id}` : "new-note";
  const { error, fieldErrors } = feedback;

  const fieldError = (field: NoteField) => {
    const validationError = fieldErrors?.[field];
    const message = validationError ? noteValidationMessages[validationError] : undefined;

    return message;
  };
  const titleError = fieldError("title");
  const contentError = fieldError("content");
  const priorityError = fieldError("priority");

  const changeField = ({ field, value }: { field: NoteField; value: string }) => {
    setValues((current) => ({ ...current, [field]: value }));
    if (!fieldErrors?.[field] && !error) return;
    setFeedback(({ fieldErrors: current }) => {
      const { [field]: _cleared, ...remaining } = current ?? {};

      return { fieldErrors: remaining };
    });
  };

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = noteInputSchema.safeParse(values);
    if (!parsed.success) return setFeedback({ fieldErrors: getNoteFieldErrors(parsed.error) });

    startTransition(async () => {
      const result = note
        ? await updateNote({ id: note.id, values })
        : await createNote({ values });
      setFeedback(result);
      if (!result.saved) return;
      if (!note) setValues(emptyNoteValues);
      onSaved?.();
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5" aria-busy={pending}>
      <FieldGroup>
        <Field data-invalid={!!titleError}>
          <FieldLabel htmlFor={`${idPrefix}-title`}>Title</FieldLabel>
          <Input
            id={`${idPrefix}-title`}
            required
            maxLength={NOTE_TITLE_MAX_LENGTH}
            value={values.title}
            readOnly={pending}
            onChange={(event) => changeField({ field: "title", value: event.target.value })}
            aria-invalid={!!titleError}
            aria-describedby={titleError ? `${idPrefix}-title-error` : undefined}
          />
          <FieldError id={`${idPrefix}-title-error`}>{titleError}</FieldError>
        </Field>
        <Field data-invalid={!!contentError}>
          <FieldLabel htmlFor={`${idPrefix}-content`}>Content</FieldLabel>
          <Textarea
            id={`${idPrefix}-content`}
            rows={4}
            maxLength={NOTE_CONTENT_MAX_LENGTH}
            value={values.content}
            readOnly={pending}
            onChange={(event) => changeField({ field: "content", value: event.target.value })}
            aria-invalid={!!contentError}
            aria-describedby={contentError ? `${idPrefix}-content-error` : undefined}
          />
          <FieldError id={`${idPrefix}-content-error`}>{contentError}</FieldError>
        </Field>
        <Field data-invalid={!!priorityError}>
          <FieldLabel htmlFor={`${idPrefix}-priority`}>Priority</FieldLabel>
          <Select
            items={priorityOptions}
            value={values.priority || null}
            disabled={pending}
            onValueChange={(next: string | null) =>
              changeField({ field: "priority", value: next ?? "" })
            }
          >
            <SelectTrigger
              id={`${idPrefix}-priority`}
              className="w-full sm:w-48"
              aria-invalid={!!priorityError}
              aria-describedby={priorityError ? `${idPrefix}-priority-error` : undefined}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {priorityOptions.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <FieldError id={`${idPrefix}-priority-error`}>{priorityError}</FieldError>
        </Field>
      </FieldGroup>
      <FieldError role="alert">
        {error && !pending ? noteSaveErrorMessages[error] : null}
      </FieldError>
      <div className="flex justify-end">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : note ? "Save changes" : "Add note"}
        </Button>
      </div>
    </form>
  );
}
