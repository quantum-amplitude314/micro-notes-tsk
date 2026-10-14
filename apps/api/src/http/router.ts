import { contract } from "@notes/contracts";
import { implement } from "@orpc/server";
import type { NoteRepository } from "../notes/note-repository.ts";
import { deleteAccount } from "../use-cases/delete-account.ts";
import type { User, UserRepository } from "../users/user-repository.ts";

export type ApiContext = { notes: NoteRepository; users: UserRepository; user: User };

const os = implement(contract).$context<ApiContext>();

export const router = os.router({
  notes: {
    list: os.notes.list.handler(({ context, input }) => {
      const { notes, user } = context;

      return notes.findOwned({ ownerId: user.id, filter: input });
    }),
    create: os.notes.create.handler(({ context, input }) => {
      const { notes, user } = context;

      return notes.create({ ownerId: user.id, note: input });
    }),
    update: os.notes.update.handler(async ({ context, input, errors }) => {
      const { notes, user } = context;
      const { id, ...changes } = input;
      const note = await notes.updateOwned({ ownerId: user.id, id, changes });
      if (!note) throw errors.NOT_FOUND();

      return note;
    }),
    remove: os.notes.remove.handler(async ({ context, input, errors }) => {
      const { notes, user } = context;
      const { id } = input;
      const deleted = await notes.deleteOwned({ ownerId: user.id, id });
      if (!deleted) throw errors.NOT_FOUND();
    }),
  },
  account: {
    delete: os.account.delete.handler(async ({ context, errors }) => {
      const { notes, users, user } = context;
      const deleted = await deleteAccount({ users, notes, userId: user.id });
      if (!deleted) throw errors.NOT_FOUND();
    }),
  },
});
