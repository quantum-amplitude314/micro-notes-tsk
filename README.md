# Micro Notes

Write notes, update them and filter them by priority. Each user sees only their own notes.

- [Use cases](docs/USE-CASES.md)
- [Domain](docs/DOMAIN.md)
- [Architecture](docs/ARCHITECTURE.md)

## Requirements

- Node.js and pnpm in the versions set by `engines` and `packageManager` in `package.json`
- Podman or Docker, for the MariaDB image in `compose.yml`

## Local setup

```sh
pnpm install
pnpm db:up        # starts MariaDB in Podman and waits until it is ready
pnpm db:migrate
pnpm dev          # web on http://localhost:3000, API on http://127.0.0.1:3001
```

The `db:up` and `db:down` scripts use Podman. With Docker, run `docker compose up -d --wait` and
`docker compose down` instead.

The local settings are in `apps/api/.env.development` and `apps/web/.env.development`.

## Development

```sh
pnpm test         # API tests against the notes_test database; needs MariaDB running
pnpm typecheck
pnpm lint-fix
pnpm build
```
