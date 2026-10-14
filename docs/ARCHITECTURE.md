# Architecture

```text
browser → web (Next.js) ── oRPC client, session cookie ──→ api (Hono + oRPC)
                                                              → use cases → MikroORM → MariaDB
```

## Stack

| Concern | Choice |
|---|---|
| Runtime | Node.js 24 LTS; TypeScript runs through Node's type stripping, so only erasable syntax |
| Monorepo | pnpm workspaces, Biome, tsc |
| Contract | oRPC contract with Zod schemas and REST routes |
| API | Hono with the oRPC OpenAPI handler, served by `@hono/node-server` |
| Auth | Better Auth, email and password, database sessions |
| Database | MariaDB 12.3 LTS in Podman, MikroORM 7 with migrations |
| Web | Next.js App Router, React 19, shadcn/ui on Base UI, Tailwind |
| Tests | `node:test` and `node:assert` |

## Repo layout

```text
packages/contracts   oRPC contract: Zod schemas, routes
apps/api             backend: use cases, HTTP, auth, database
apps/web             frontend
docs                 use cases, domain, architecture
```

The backend is a separate package behind the contract. Any backend that implements
`packages/contracts` can serve the web.

## Layers

| Layer | Holds | Location |
|---|---|---|
| Domain | note rules as Zod schemas, shared with the web | `packages/contracts` |
| Domain interfaces | `NoteRepository`, `UserRepository` | `apps/api/src/notes`, `apps/api/src/users` |
| Use cases | business logic that crosses domains | `apps/api/src/use-cases` |
| Adapters | MikroORM note repository, Better Auth user repository, Hono and oRPC router | `apps/api/src/notes`, `src/users`, `src/http` |
| Composition root | wires the layers together | `apps/api/src/create-api.ts` |

## Testing

- Tests follow the use cases: one test file per use case, and each test is named after its
  scenario step, for example `UC-3 2a`.
- Tests start red: use case stubs throw `Not implemented`.
- Tests call the API in process through Hono's `app.request`, against the `notes_test` database.
