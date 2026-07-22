---
name: Market research safety
description: Durable product rule for AI-generated Indian stock research and assistant responses.
---

AI-generated stock analysis must be framed as educational research, show confidence and uncertainty, and identify risks or thesis invalidation points. It must never promise returns or present a trade as certain.

**Why:** Financial research is inherently uncertain, upstream data can be delayed or incomplete, and personal-use tooling still needs clear boundaries to avoid overstating model output.

**How to apply:** Keep disclaimers in API responses and visible UI surfaces; include evidence/sources and risk context in new agents, reports, alerts, and strategy outputs.

Candidate names, current technical claims, and source labels must be grounded in the market context actually supplied to the model. A plausible stock outside the verified universe is a research lead, not a ranked trade candidate.

**Why:** A confident shortlist is misleading when the model silently expands a small tracked universe or invents current indicators, prices, flows, or catalysts.

**How to apply:** Gate rankings and trade-plan fields on verified symbol/data availability; use explicit `data required` labels when the provider layer is incomplete.