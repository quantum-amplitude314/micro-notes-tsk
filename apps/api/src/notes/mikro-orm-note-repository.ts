import type { EntityManager } from "@mikro-orm/mariadb";
import type { NoteFilter, NoteInput } from "@notes/contracts";
import { NoteEntity } from "./note.entity.ts";
import type { NoteRepository } from "./note-repository.ts";

export class MikroOrmNoteRepository implements NoteRepository {
  readonly #em: EntityManager;

  constructor({ em }: { em: EntityManager }) {
    this.#em = em;
  }

  async create({ ownerId, note }: { ownerId: string; note: NoteInput }) {
    const created = this.#em.create(NoteEntity, { ownerId, ...note });
    await this.#em.flush();

    return created;
  }

  async findOwned({ ownerId, filter }: { ownerId: string; filter: NoteFilter }) {
    const { priority } = filter;
    const ownedNotes = priority ? { ownerId, priority } : { ownerId };
    const notes = await this.#em.find(NoteEntity, ownedNotes, { orderBy: { updatedAt: "desc" } });

    return notes;
  }

  async updateOwned({ ownerId, id, changes }: { ownerId: string; id: string; changes: NoteInput }) {
    const note = await this.#em.findOne(NoteEntity, { id, ownerId });
    if (!note) return null;

    this.#em.assign(note, changes);
    await this.#em.flush();

    return note;
  }

  async deleteOwned({ ownerId, id }: { ownerId: string; id: string }) {
    const deletedCount = await this.#em.nativeDelete(NoteEntity, { id, ownerId });
    const deleted = deletedCount > 0;

    return deleted;
  }

  async deleteAllOwnedBy({ ownerId }: { ownerId: string }) {
    await this.#em.nativeDelete(NoteEntity, { ownerId });
  }
}
