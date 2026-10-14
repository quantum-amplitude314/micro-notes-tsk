import type { EntityManager } from "@mikro-orm/mariadb";
import type { NoteFilter } from "@notes/contracts";
import { Note } from "../db/note.entity.ts";

export const listNotes = async ({
  em,
  ownerId,
  filter,
}: {
  em: EntityManager;
  ownerId: string;
  filter: NoteFilter;
}) => {
  const { priority } = filter;
  const ownedNotes = priority ? { ownerId, priority } : { ownerId };
  const notes = await em.find(Note, ownedNotes, { orderBy: { updatedAt: "desc" } });

  return notes;
};
