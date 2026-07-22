---
name: Repository assistant framework
description: Durable operating contract for keeping future work aligned across product, UI, contracts, API, AI, data, and operations.
---

The repository uses `AGENTS.md` as the assistant operating contract and `.agents/context.yaml` as the machine-readable layer/status map. Missing prerequisites are requested using `.agents/REQUESTS.md`.

**Why:** The product spans generated contracts, server AI roles, frontend routes, data-provider gaps, and workflow constraints; without a shared map, an assistant can complete one layer while silently leaving another inconsistent.

**How to apply:** Read the contract and context before implementation, change layers in dependency order, verify runtime behavior, and update context when a durable capability or prerequisite changes.