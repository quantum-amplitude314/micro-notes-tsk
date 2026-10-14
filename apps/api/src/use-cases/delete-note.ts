import type { EntityManager } from "@mikro-orm/mariadb";
import { notImplemented } from "../not-implemented.ts";

type DeleteNote = { em: EntityManager; ownerId: string; id: string };

export const deleteNote = async (_: DeleteNote) => notImplemented();
