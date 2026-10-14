import type { EntityManager } from "@mikro-orm/mariadb";
import { Note } from "../db/note.entity.ts";

export const deleteOwnedNotes = async ({ em, ownerId }: { em: EntityManager; ownerId: string }) => {
  await em.nativeDelete(Note, { ownerId });
};
