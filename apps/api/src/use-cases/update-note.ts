import type { EntityManager } from "@mikro-orm/mariadb";
import type { NoteInput } from "@notes/contracts";
import { Note } from "../db/note.entity.ts";

export const updateNote = async ({
  em,
  ownerId,
  id,
  input,
}: {
  em: EntityManager;
  ownerId: string;
  id: string;
  input: NoteInput;
}) => {
  const note = await em.findOne(Note, { id, ownerId });
  if (!note) return null;

  em.assign(note, input);
  await em.flush();

  return note;
};
