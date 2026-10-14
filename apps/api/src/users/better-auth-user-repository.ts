import type { Auth } from "./auth.ts";
import type { UserRepository } from "./user-repository.ts";

export class BetterAuthUserRepository implements UserRepository {
  readonly #auth: Auth;

  constructor({ auth }: { auth: Auth }) {
    this.#auth = auth;
  }

  async getUser({ id }: { id: string }) {
    const { internalAdapter } = await this.#auth.$context;
    const found = await internalAdapter.findUserById(id);
    const user = found ? { id: found.id, email: found.email } : null;

    return user;
  }

  async deleteUser({ id }: { id: string }) {
    const { internalAdapter } = await this.#auth.$context;
    await internalAdapter.deleteUserSessions(id);
    await internalAdapter.deleteAccounts(id);
    await internalAdapter.deleteUser(id);
  }
}
