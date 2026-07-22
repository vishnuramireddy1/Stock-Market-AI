---
name: Trade journal boundary
description: Persistence and monitoring boundary for personal trade follow-up
---

Stored trade records are the durable source of truth for the user's entry, quantity, stop, target, planned exit, status, and follow-up notes. The assistant may use open records as context when answering follow-up questions.

**Why:** A journal preserves the original decision and later outcome for review without implying that the system saw or executed the trade.

**How to apply:** Keep journal persistence separate from live monitoring. Do not claim timely exit alerts until a live market-data worker and notification channel are implemented and verified.