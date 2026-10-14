"use server";

import { getNoteFieldErrors, type NoteInput, noteInputSchema } from "@notes/contracts";
import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { apiClient, hasStatus } from "@/lib/api";
import type { NoteFormState, NoteValues } from "@/lib/note-form";

const toSaveFailure = (error: unknown) => {
  if (hasStatus({ error, status: 401 })) redirect("/login");
  const failure: NoteFormState = {
    error: hasStatus({ error, status: 404 }) ? "notFound" : "saveFailed",
  };

  return failure;
};

const saveNote = async ({
  values,
  save,
}: {
  values: NoteValues;
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
    return toSaveFailure(error);
  }

  refresh();
  const saved: NoteFormState = { saved: true };

  return saved;
};

export const createNote = async ({ values }: { values: NoteValues }) =>
  saveNote({ values, save: (input) => apiClient.notes.create(input) });

export const updateNote = async ({ id, values }: { id: string; values: NoteValues }) =>
  saveNote({ values, save: (input) => apiClient.notes.update({ id, ...input }) });

export const deleteNote = async ({ id }: { id: string }) => {
  try {
    await apiClient.notes.remove({ id });
  } catch (error) {
    if (hasStatus({ error, status: 401 })) redirect("/login");
    if (!hasStatus({ error, status: 404 })) {
      const failed = { deleted: false };

      return failed;
    }
  }

  refresh();
  const deleted = { deleted: true };

  return deleted;
};
