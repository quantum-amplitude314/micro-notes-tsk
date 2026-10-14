import { oc } from "@orpc/contract";
import { z } from "zod";

export const PRIORITIES = ["low", "medium", "high"] as const;
export const prioritySchema = z.enum(PRIORITIES);
export type Priority = z.infer<typeof prioritySchema>;

export const NOTE_TITLE_MAX_LENGTH = 200;
export const NOTE_CONTENT_MAX_LENGTH = 10_000;

export const noteIdSchema = z.uuid();

const noteValidationErrorSchema = z.enum([
  "titleRequired",
  "titleTooLong",
  "contentTooLong",
  "priorityRequired",
]);
export type NoteValidationError = z.infer<typeof noteValidationErrorSchema>;
const { enum: validationErrors } = noteValidationErrorSchema;

export const noteInputSchema = z.object({
  title: z
    .string({ error: validationErrors.titleRequired })
    .trim()
    .min(1, { error: validationErrors.titleRequired })
    .max(NOTE_TITLE_MAX_LENGTH, { error: validationErrors.titleTooLong }),
  content: z
    .string()
    .trim()
    .max(NOTE_CONTENT_MAX_LENGTH, { error: validationErrors.contentTooLong }),
  priority: z.enum(PRIORITIES, { error: validationErrors.priorityRequired }),
});
export type NoteInput = z.infer<typeof noteInputSchema>;

export const noteSchema = noteInputSchema.extend({
  id: noteIdSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Note = z.infer<typeof noteSchema>;

export const noteFilterSchema = z.object({ priority: prioritySchema.optional() });
export type NoteFilter = z.infer<typeof noteFilterSchema>;

const notFound = { NOT_FOUND: { message: "Note not found" } };

export const notesContract = {
  list: oc
    .route({
      method: "GET",
      path: "/notes",
      summary: "List the user's notes, optionally by priority",
    })
    .input(noteFilterSchema)
    .output(z.array(noteSchema)),
  create: oc
    .route({ method: "POST", path: "/notes", successStatus: 201, summary: "Create a note" })
    .input(noteInputSchema)
    .output(noteSchema),
  update: oc
    .route({ method: "PUT", path: "/notes/{id}", summary: "Update one of the user's notes" })
    .input(noteInputSchema.extend({ id: noteIdSchema }))
    .output(noteSchema)
    .errors(notFound),
  remove: oc
    .route({
      method: "DELETE",
      path: "/notes/{id}",
      successStatus: 204,
      summary: "Delete one of the user's notes",
    })
    .input(z.object({ id: noteIdSchema }))
    .errors(notFound),
};
