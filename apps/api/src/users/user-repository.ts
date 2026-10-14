export type User = { id: string; email: string };

export interface UserRepository {
  getUser(input: { id: string }): Promise<User | null>;
  deleteUser(input: { id: string }): Promise<void>;
}
