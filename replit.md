# Redline Lab Console

A safe-by-default operations console for coordinating defensive AI agents across isolated Utah and Nevada research labs.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/redline-lab-console/src/App.tsx` — the working console surface and its local lab/agent/task state
- `artifacts/redline-lab-console/src/index.css` — the console theme, typography, responsive layout, and motion
- `artifacts/api-server` — shared API service, currently retained for future lab connector endpoints

## Architecture decisions

- The first build is frontend-only with local in-memory state so the safety model and operator experience can be reviewed before connecting real lab systems.
- Utah and Nevada are treated as separate site boundaries in the UI; dispatch records a single site and an allowlisted scope.
- Human approval is explicit for sensitive actions, with visible audit events for dispatches, agent state changes, and approval decisions.
- The console does not model autonomous egress or boundary crossing; these are presented as prohibited posture checks.

## Product

- Overview of both isolated sites, agent health, task activity, approvals, and boundary posture.
- Task queue with scoped dispatch flow and human-gate warning copy.
- Agent fleet controls for pausing and resuming workers.
- Site operating picture and audit log filters.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- The current data is intentionally local demo state; no real database, connector, or autonomous agent runtime is attached yet.
- Preserve the explicit site and scope boundaries when adding persistence or connectors.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
