# Assistant Request Protocol

Use this file as the standard format when the assistant needs something from the user to continue an agenda. Requests should be specific, minimal, and tied to a layer.

## Request template

```md
### Request: <short title>
- Layer: product | experience | contract | API | AI | data | operations | quality
- Needed for: <user outcome>
- Why it is blocked: <concrete dependency>
- Safe default: <what the assistant will use if approved>
- Options:
  1. <option> — <tradeoff>
  2. <option> — <tradeoff>
- Not requested: secrets, passwords, API keys, private keys, or tokens in chat
- Decision needed: <one focused question>
```

## Request rules

1. Ask one focused decision at a time unless the decisions are independent and can be answered together.
2. Prefer a safe default and explain its consequence.
3. Do not ask for repo facts that can be searched or verified.
4. For integrations, identify the provider capability needed; use the platform integration flow rather than requesting credentials in chat.
5. For trading features, request explicit risk limits before turning suggestions into calculations.
6. For live global-politics analysis, request a source/provider decision or clearly label the feature as non-live.
7. Record resolved decisions in `replit.md` or `.agents/context.yaml`, not in this file.

## Typical requests for this product

- **Market data provider:** Which live NSE/BSE source should be used, and what latency/coverage is required?
- **News/politics sources:** Which licensed or public sources may be used, and is delayed context acceptable?
- **Risk policy:** What capital base, maximum loss per trade, maximum portfolio risk, and maximum concurrent positions should the Swing Desk assume?
- **Persistence:** Should the personal portfolio journal be stored in the configured PostgreSQL database?
- **Broker access:** Is the user asking for read-only positions or order execution? Execution remains disabled by default.