# Company Inclusion Criteria

How the AI Infrastructure Unwinding Monitor decides which companies to track. The
goal is a roster that covers every node of the AI-infrastructure value chain with
the *fewest* names that still give full signal coverage — not an index of "AI stocks."

The machine-readable roster lives in [`data/companies.json`](../data/companies.json).
Adding or removing a name is a one-file edit there; this doc is the rationale.

## A company is tracked only if it meets ALL four tests

1. **Value-chain role** — it occupies a node in the AI-infrastructure chain:
   **compute demand → chips → systems/servers → data centers → power → capital**.
   A name that doesn't sit on this chain (e.g. a pure application/SaaS company) is
   out, however "AI" it is.

2. **Materiality** — AI is material to the company, or the company is material to AI
   buildout. Rule of thumb: AI-related revenue or capex is **≥15%** of the business,
   **or** the company is a **top-3 player** in its node (so its data is a bellwether
   even if AI is a smaller revenue share).

3. **Distinct signal** — it surfaces an early-warning or confirming signal not already
   covered by an existing name. Redundant proxies for the same node are dropped to
   keep the roster lean.

4. **Data availability** — public quarterly financials, **or**, for private AI labs,
   credible third-party spend/revenue estimates. Private names are flagged
   `"public": false` and carry estimates only (never treated as hard data).

A name failing any test is excluded. A name that *starts* failing (e.g. AI exposure
falls below materiality, or a cleaner proxy emerges) should be retired.

## Tiers (value-chain nodes)

| Tier | Node | What its data tells us | Members |
|------|------|------------------------|---------|
| **Hyperscaler** | Compute demand / capex | Capex guidance is the primary lagging signal; cuts here lead the unwind | MSFT, AMZN, GOOGL, META |
| **Semiconductor** | AI chips | Order/revenue trajectory = real-time demand for AI compute | NVDA, TSMC, AMD, AVGO |
| **Infrastructure** | Servers, neoclouds, data centers, power | Buildout pace + supply-chain/power stress | ORCL, CRWV, NBIS, IREN, APLD, DELL, SMCI, VRT |
| **AI lab (private)** | Compute demand (FOMO) | Demand side of the circular flow; burn vs revenue drives fragility | OpenAI, Anthropic, xAI |

## Roster notes

- **TSMC** — closes a documented gap (referenced as tracked in the README but absent
  from the data). Sole leading-edge foundry; its AI/HPC revenue mix is the cleanest
  read on whether chip *demand* is real vs. inventory.
- **AMD / Broadcom (AVGO)** — extend the semiconductor node beyond NVIDIA: AMD as the
  merchant-GPU #2, AVGO as the custom-silicon (ASIC) + AI-networking proxy. Divergence
  between NVDA and these two is itself a signal.
- **Super Micro (SMCI) / Vertiv (VRT)** — supply-chain stress sensors. SMCI = AI-server
  assembly throughput (and an accounting-scrutiny watch); VRT = data-center power &
  cooling demand, a direct read on the power bottleneck that Phase 5 tracks.
- **AI labs (OpenAI, Anthropic, xAI)** — already present implicitly in the FOMO
  circular-flow block; formalized here as tracked entities. Private, so estimates only:
  compute spend, revenue, burn multiple, last funding round.

## Review cadence

Re-confirm the roster each quarterly (lagging) refresh: check that every member still
passes the four tests, and that no newly-material node player is missing. The weekly
automated run reads `data/companies.json` as its company list, so the registry is the
single control point.
