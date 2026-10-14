import type { NoteFieldErrors, Priority } from "@notes/contracts";

export type NoteView = {
  id: string;
  title: string;
  content: string;
  priority: Priority;
  createdAt: string;
  updatedAt: string;
};

export type NoteValues = { title: string; content: string; priority: string };

export type NoteSaveError = "notFound" | "saveFailed";

export type NoteFormState = { saved?: true; error?: NoteSaveError; fieldErrors?: NoteFieldErrors };

export const emptyNoteValues: NoteValues = { title: "", content: "", priority: "medium" };
