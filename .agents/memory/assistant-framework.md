---
name: Repository assistant framework
description: Durable operating contract for keeping future work aligned across product, UI, contracts, API, AI, data, and operations.
---

The repository uses `AGENTS.md` as the assistant operating contract and `.agents/context.yaml` as the machine-readable layer/status map. Missing prerequisites are requested using `.agents/REQUESTS.md`.

**Why:** The product spans generated contracts, server AI roles, frontend routes, data-provider gaps, and workflow constraints; without a shared map, an assistant can complete one layer while silently leaving another inconsistent.

**How to apply:** Read the contract and context before implementation, change layers in dependency order, verify runtime behavior, and update context when a durable capability or prerequisite changes.

Deterministic utility questions such as the current India time/date should be answered directly by the server, not sent to Gemini. Provider fallback responses must report zero confidence and only provider-status sources.

**Why:** Model rate limits should not block basic utilities or create misleading confidence and agent-source metadata.

**How to apply:** Route deterministic requests before AI orchestration and make fallback metadata describe the actual unavailable provider.