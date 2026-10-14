import type { EntityManager } from "@mikro-orm/mariadb";
import type { NoteInput } from "@notes/contracts";
import { Note } from "../db/note.entity.ts";

export const createNote = async ({
  em,
  ownerId,
  input,
}: {
  em: EntityManager;
  ownerId: string;
  input: NoteInput;
}) => {
  const note = em.create(Note, { ownerId, ...input });
  await em.flush();

  return note;
};
