# Micro Notes

Write notes, update them and filter them by priority. Each user sees only their own notes.

- [Use cases](docs/USE-CASES.md)
- [Domain](docs/DOMAIN.md)
- [Architecture](docs/ARCHITECTURE.md)

## Repo layout

```text
packages/contracts   oRPC contract: Zod schemas, routes
apps/api             Node API: Hono, oRPC, Better Auth, MikroORM on MariaDB
apps/web             Next.js frontend
docs                 use cases, domain, architecture
```

## Requirements

- Node.js 24 LTS
- pnpm 12
- Podman or Docker, for MariaDB 12.3 LTS

## Local setup

```sh
pnpm install
pnpm db:up        # MariaDB in Podman; with Docker: docker compose up -d
pnpm db:migrate
pnpm dev          # web on http://localhost:3000, API on http://127.0.0.1:3001
```

The local settings are in `apps/api/.env.development` and `apps/web/.env.development`.

## Development

```sh
pnpm test         # API tests against the notes_test database; needs MariaDB running
pnpm typecheck
pnpm lint-fix
pnpm build
```
