import { notesContract } from "./notes.ts";

export const contract = {
  notes: notesContract,
};

export type Contract = typeof contract;

export {
  NOTE_CONTENT_MAX_LENGTH,
  NOTE_TITLE_MAX_LENGTH,
  type Note,
  type NoteFilter,
  type NoteInput,
  noteFilterSchema,
  noteIdSchema,
  noteInputSchema,
  noteSchema,
  PRIORITIES,
  type Priority,
  prioritySchema,
} from "./notes.ts";
