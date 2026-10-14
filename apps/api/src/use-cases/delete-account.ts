import type { NoteRepository } from "../notes/note-repository.ts";
import type { UserRepository } from "../users/user-repository.ts";

export const deleteAccount = async ({
  users,
  notes,
  userId,
}: {
  users: UserRepository;
  notes: NoteRepository;
  userId: string;
}) => {
  const user = await users.getUser({ id: userId });
  if (!user) return false;

  await notes.deleteAllOwnedBy({ ownerId: user.id });
  await users.deleteUser({ id: user.id });

  return true;
};
