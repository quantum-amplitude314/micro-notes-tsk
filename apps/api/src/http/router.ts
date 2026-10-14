import type { EntityManager } from "@mikro-orm/mariadb";
import { contract } from "@notes/contracts";
import { implement } from "@orpc/server";
import { createNote } from "../use-cases/create-note.ts";
import { deleteNote } from "../use-cases/delete-note.ts";
import { listNotes } from "../use-cases/list-notes.ts";
import { updateNote } from "../use-cases/update-note.ts";
import type { SessionUser } from "./require-session.ts";

export type ApiContext = { em: EntityManager; user: SessionUser };

const os = implement(contract).$context<ApiContext>();

export const router = os.router({
  notes: {
    list: os.notes.list.handler(({ context, input }) => {
      const { em, user } = context;

      return listNotes({ em, ownerId: user.id, filter: input });
    }),
    create: os.notes.create.handler(({ context, input }) => {
      const { em, user } = context;

      return createNote({ em, ownerId: user.id, input });
    }),
    update: os.notes.update.handler(async ({ context, input, errors }) => {
      const { em, user } = context;
      const { id, ...changes } = input;
      const note = await updateNote({ em, ownerId: user.id, id, input: changes });
      if (!note) throw errors.NOT_FOUND();

      return note;
    }),
    remove: os.notes.remove.handler(async ({ context, input, errors }) => {
      const { em, user } = context;
      const { id } = input;
      const deleted = await deleteNote({ em, ownerId: user.id, id });
      if (!deleted) throw errors.NOT_FOUND();
    }),
  },
});
