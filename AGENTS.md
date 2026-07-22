# India Stock Intelligence — Assistant Operating Framework

This file is the repo-level operating contract for any assistant working in this repository. Read it before planning or changing code. `replit.md` describes the product; `.agents/context.yaml` describes the current system state; this file describes how to work safely across every layer.

## 1. Product mission and boundaries

- Product: personal-use AI research and decision-support cockpit for Indian NSE/BSE swing trading.
- Primary horizon: approximately 1–60 trading days.
- User-facing output: evidence-led scenarios, not guaranteed recommendations.
- The product must not place trades, hold broker credentials in source, or imply certainty.
- Every AI result must expose confidence, assumptions, evidence/sources, risk, and thesis invalidation conditions.
- Global politics and macro analysis must distinguish verified facts, dated context, and scenario analysis. Never invent live events.

## 2. System map

| Layer | Responsibility | Source of truth | Current status |
|---|---|---|---|
| Product | User goals, swing-only scope, safety boundaries | `replit.md` | Active |
| Experience | Routes, forms, loading/error/empty states, responsive UI | `artifacts/india-stock-intelligence/src/` | Active |
| API contract | Request/response shapes and operation IDs | `lib/api-spec/openapi.yaml` | Active |
| API client | Generated React Query hooks and schemas | `lib/api-client-react/src/generated/` | Generated |
| Validation | Generated server-side Zod contracts | `lib/api-zod/src/generated/` | Generated |
| Application API | Express routes, orchestration boundary, provider calls | `artifacts/api-server/src/` | Active; tracked data |
| AI roles | Swing portfolio, global politics/macro, entry/exit, research/chat | API role prompts and response contracts | Initial slice |
| Data | Market, news, filings, portfolio, preferences, agent history | `lib/db/` and provider adapters | Incomplete |
| Operations | Workflows, build, typecheck, deployment configuration | `artifact.toml`, package scripts, workflow config | Active |
| Quality | Typecheck, build, audit, runtime and visual checks | package scripts and managed workflows | Active |

## 3. Current implementation truth

The assistant must verify the code before relying on these statements:

- The frontend artifact is `artifacts/india-stock-intelligence`.
- The API artifact is `artifacts/api-server`.
- OpenAPI changes require code generation before client or server types are used.
- Gemini is called server-side through `GEMINI_API_KEY`; never expose or print the key.
- The initial market universe is tracked data behind API boundaries, not a complete live NSE/BSE provider integration.
- Portfolio, watchlist, news, and backtesting surfaces may still contain placeholder or mock data; do not describe them as persistent or broker-connected without checking.
- The Swing Desk has three distinct lenses: portfolio coach, global politics/macro, and conditional entry/exit setup.

## 4. Standard assistant workflow

1. **Orient**
   - Read this file, `replit.md`, `.agents/context.yaml`, and relevant memory.
   - Search the repository before editing. Treat code and generated output as current truth over stale notes.
2. **Define the agenda**
   - State the user outcome, affected layers, dependencies, and verification plan.
   - Split independent work only when it reduces risk; preserve contract-first ordering.
3. **Check prerequisites**
   - Identify missing data providers, credentials, schema, user decisions, or environment support.
   - Continue with safe work that does not depend on the missing item.
   - Request only the smallest missing input using the request format in `.agents/REQUESTS.md`.
4. **Change in dependency order**
   - Product/contract → generated code → server → client → documentation.
   - Never hand-edit generated files as the primary fix.
5. **Verify**
   - Run focused typechecks/tests first, then build.
   - Restart affected workflows after code, package, or run-command changes.
   - Check workflow logs and exercise changed endpoints.
   - For UI changes, inspect the relevant desktop and mobile preview.
6. **Update context**
   - Update `.agents/context.yaml` when a durable layer/status/required-input changes.
   - Update `replit.md` for user-visible product decisions.
   - Update memory only for non-obvious durable decisions, not implementation logs.

## 5. Cross-layer invariants

- API callers must match the OpenAPI contract exactly.
- Server-owned fields are derived server-side.
- User input is validated at the API boundary.
- Loading, error, empty, partial, and fallback states are explicit.
- A successful mutation must show its result and refresh affected views.
- AI fallback text must never look like live market data or a confident trade signal.
- Entry/exit suggestions must be conditional and include trigger, invalidation, risk, and no-trade conditions.
- Global-politics outputs require source/date context or clearly state that live verification is unavailable.
- Credentials and secrets are accessed only through secure environment mechanisms.
- No destructive data/schema operation without explaining impact first.

## 6. When to request more information

The assistant should ask the user when progress is blocked by:

- A required product decision that changes behavior or scope.
- Missing permission, integration, data provider, or non-secret configuration.
- Ambiguous risk rules such as capital, maximum loss per trade, or holding period.
- A destructive migration, broker connection, or order-execution capability.
- Conflicting source-of-truth documents or an unsafe request.

The assistant should not ask for information that can be discovered from the repo, logs, generated contracts, or safe runtime checks. Never ask the user to paste secrets into chat.

## 7. Agenda and completion format

For meaningful work, track:

- **Goal:** the user outcome.
- **Layers:** product, experience, contract, API, AI, data, operations, quality.
- **Dependencies:** what must exist first.
- **Requests:** missing inputs, using `.agents/REQUESTS.md`.
- **Verification:** exact checks and runtime paths.
- **Known limits:** what remains tracked, mocked, delayed, or unverified.

Before declaring complete, re-read the user request and confirm each explicit behavior exists at the correct layer.