import { accountContract } from "./account.ts";
import { notesContract } from "./notes.ts";

export const contract = {
  notes: notesContract,
  account: accountContract,
};

export type Contract = typeof contract;

export {
  getNoteFieldErrors,
  NOTE_CONTENT_MAX_LENGTH,
  NOTE_TITLE_MAX_LENGTH,
  type Note,
  type NoteField,
  type NoteFieldErrors,
  type NoteFilter,
  type NoteInput,
  type NoteValidationError,
  noteFilterSchema,
  noteIdSchema,
  noteInputSchema,
  noteSchema,
  PRIORITIES,
  type Priority,
  prioritySchema,
} from "./notes.ts";
