import type { EntityManager } from "@mikro-orm/mariadb";
import type { NoteInput } from "@notes/contracts";
import { notImplemented } from "../not-implemented.ts";

type UpdateNote = { em: EntityManager; ownerId: string; id: string; input: NoteInput };

export const updateNote = async (_: UpdateNote) => notImplemented();
