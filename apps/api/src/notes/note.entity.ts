import { randomUUID } from "node:crypto";
import { defineEntity, p } from "@mikro-orm/core";
import { NOTE_TITLE_MAX_LENGTH, PRIORITIES } from "@notes/contracts";

export const NoteEntity = defineEntity({
  name: "Note",
  tableName: "notes",
  properties: {
    id: p
      .uuid()
      .primary()
      .onCreate(() => randomUUID()),
    ownerId: p.string().length(36).index(),
    title: p.string().length(NOTE_TITLE_MAX_LENGTH),
    content: p.text(),
    priority: p.enum(PRIORITIES),
    createdAt: p.datetime(3).onCreate(() => new Date()),
    updatedAt: p
      .datetime(3)
      .onCreate(() => new Date())
      .onUpdate(() => new Date()),
  },
});
