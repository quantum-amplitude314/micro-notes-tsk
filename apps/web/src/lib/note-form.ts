import {
  NOTE_CONTENT_MAX_LENGTH,
  NOTE_TITLE_MAX_LENGTH,
  type NoteFieldErrors,
  type NoteValidationError,
  type Priority,
} from "@notes/contracts";

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

export const noteValidationMessages: Record<NoteValidationError, string> = {
  titleRequired: "Enter a title.",
  titleTooLong: `Use at most ${NOTE_TITLE_MAX_LENGTH} characters.`,
  contentTooLong: `Use at most ${NOTE_CONTENT_MAX_LENGTH.toLocaleString("en")} characters.`,
  priorityRequired: "Choose a priority.",
};

export const noteSaveErrorMessages: Record<NoteSaveError, string> = {
  notFound: "This note no longer exists.",
  saveFailed: "The note could not be saved. Please try again.",
};
