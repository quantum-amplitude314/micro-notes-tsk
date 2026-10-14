import type { Note, NoteFilter, NoteInput } from "@notes/contracts";

export interface NoteRepository {
  create(input: { ownerId: string; note: NoteInput }): Promise<Note>;
  findOwned(input: { ownerId: string; filter: NoteFilter }): Promise<Note[]>;
  updateOwned(input: { ownerId: string; id: string; changes: NoteInput }): Promise<Note | null>;
  deleteOwned(input: { ownerId: string; id: string }): Promise<boolean>;
  deleteAllOwnedBy(input: { ownerId: string }): Promise<void>;
}
