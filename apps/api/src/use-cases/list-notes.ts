import type { EntityManager } from "@mikro-orm/mariadb";
import type { NoteFilter } from "@notes/contracts";
import { notImplemented } from "../not-implemented.ts";

type ListNotes = { em: EntityManager; ownerId: string; filter: NoteFilter };

export const listNotes = async (_: ListNotes) => notImplemented();
