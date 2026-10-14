"use server";

import { getNoteFieldErrors, type NoteInput, noteInputSchema } from "@notes/contracts";
import { refresh } from "next/cache";
import { redirect } from "@/i18n/navigation";
import { toLocale } from "@/i18n/routing";
import { apiClient, hasStatus } from "@/lib/api";
import type { NoteFormState, NoteValues } from "@/lib/note-form";

const redirectToSignIn = (locale: string) => redirect({ href: "/login", locale: toLocale(locale) });

const toSaveFailure = ({ error, locale }: { error: unknown; locale: string }) => {
  if (hasStatus({ error, status: 401 })) redirectToSignIn(locale);
  const failure: NoteFormState = {
    error: hasStatus({ error, status: 404 }) ? "notFound" : "saveFailed",
  };

  return failure;
};

const saveNote = async ({
  values,
  locale,
  save,
}: {
  values: NoteValues;
  locale: string;
  save: (input: NoteInput) => Promise<unknown>;
}) => {
  const parsed = noteInputSchema.safeParse(values);
  if (!parsed.success) {
    const invalid: NoteFormState = { fieldErrors: getNoteFieldErrors(parsed.error) };

    return invalid;
  }

  try {
    await save(parsed.data);
  } catch (error) {
    return toSaveFailure({ error, locale });
  }

  refresh();
  const saved: NoteFormState = { saved: true };

  return saved;
};

export const createNote = async ({ values, locale }: { values: NoteValues; locale: string }) =>
  saveNote({ values, locale, save: (input) => apiClient.notes.create(input) });

export const updateNote = async ({
  id,
  values,
  locale,
}: {
  id: string;
  values: NoteValues;
  locale: string;
}) => saveNote({ values, locale, save: (input) => apiClient.notes.update({ id, ...input }) });

export const deleteNote = async ({ id, locale }: { id: string; locale: string }) => {
  try {
    await apiClient.notes.remove({ id });
  } catch (error) {
    if (hasStatus({ error, status: 401 })) redirectToSignIn(locale);
    if (!hasStatus({ error, status: 404 })) {
      const failed = { deleted: false };

      return failed;
    }
  }

  refresh();
  const deleted = { deleted: true };

  return deleted;
};
