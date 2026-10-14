import type { EntityManager } from "@mikro-orm/mariadb";
import { Note } from "../db/note.entity.ts";

export const deleteNote = async ({
  em,
  ownerId,
  id,
}: {
  em: EntityManager;
  ownerId: string;
  id: string;
}) => {
  const deletedCount = await em.nativeDelete(Note, { id, ownerId });
  const deleted = deletedCount > 0;

  return deleted;
};
