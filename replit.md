# India Stock Intelligence

Personal AI-assisted research cockpit for Indian NSE/BSE equities, with market overview, technical signals, Gemini research reports, and conversational analysis.

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

- `artifacts/india-stock-intelligence/` — responsive React/Vite dashboard and routes
- `artifacts/api-server/src/routes/market.ts` — market, research, and chat API handlers
- `lib/api-spec/openapi.yaml` — source-of-truth API contract
- `lib/api-client-react/` and `lib/api-zod/` — generated client and validation types

## Architecture decisions

- The first slice uses a tracked Indian equity universe while upstream data-provider adapters are added behind the API boundary.
- Gemini is called only from the server with `GEMINI_API_KEY`; it is never exposed to the browser.
- Research output is framed as evidence-led educational analysis with confidence and explicit uncertainty, not guaranteed recommendations.

## Product

- Market Desk overview with NIFTY/SENSEX/breadth and live tape
- Searchable NSE/BSE stock intelligence with chart and technical signals
- Gemini-powered research report generation and AI chat
- Responsive routes for portfolio, watchlist, research, backtesting, news, and settings

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Run `pnpm --filter @workspace/api-spec run codegen` after changing `lib/api-spec/openapi.yaml`.
- Frontend builds require workflow-provided `PORT` and `BASE_PATH`; use the managed web workflow for preview verification.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
