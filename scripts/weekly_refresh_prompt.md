# Weekly Refresh Runbook (hands-off)

This is the instruction set for the automated weekly refresh of the AI Infrastructure
Unwinding Monitor. It runs fully hands-off and pushes to `main`, which auto-deploys to
https://ai-bubble-monitor.vercel.app. The validation gate (`scripts/validate_tracking.py`)
is the safety backbone — it must pass or nothing ships.

## Steps

1. **Prepare** — run from repo root:
   ```bash
   bash scripts/weekly_refresh.sh prepare
   ```
   This pulls latest `main` and snapshots the current data into `data/history/<date>/`.

2. **Determine what's due** (cadence-aware — don't redo everything every week):
   - **Every week:** Tier-1 leading indicators — GPU secondary pricing, cloud AI pricing,
     tech-stock correlation, analyst revisions. Refresh `track_a`/`track_b`, status, trend.
   - **Monthly (or if >30 days since last):** the remaining leading indicators (REIT, CDS,
     funding velocity + circular-flow metrics, model training, inference, NVIDIA partners,
     job postings).
   - **Quarterly (earnings season):** the lagging layer — company capex/AI-revenue/margins,
     the 8 lagging indicators, capex/revenue chart data, active_signals, quarterly_updates.
   Use `data/history/<prev>/` to compute deltas and trend direction.

3. **Research** (web search/fetch). Apply the `ai-unwinding-monitor` skill methodology and
   the green/yellow/red thresholds. The tracked company roster is `data/companies.json`
   (criteria in `docs/company-criteria.md`) — research every public name there. **Cite
   sources; never fabricate. If a figure can't be verified, keep the prior value and note it
   rather than guessing.**

4. **Rewrite** `data/tracking_data.json` and `data/tracking_data_leading.json`, preserving the
   exact schema (the dashboard renders from these field names — see `app.js`). Hard rules the
   gate enforces, so get them right:
   - every indicator `weighted_score == points * multiplier`
   - `composite_risk_score == sum(weighted_score)` (lagging); same for leading
   - `risk_level` matches the band (lagging 0-8 LOW / 9-16 MOD / 17-24 HIGH / 25+ CRIT;
     leading 0-12 / 13-24 / 25-36 / 37+)
   - statuses in {green, yellow, red}; `concentration_ratio` in [0,1.5]
   - bump both `metadata.last_updated` to now; add a `quarterly_updates` entry if lagging changed
   - update `latest_update` (headline/emoji/risk_label/accent) and `active_signals`

5. **Finalize** — run:
   ```bash
   bash scripts/weekly_refresh.sh finalize
   ```
   This validates; if green it commits + pushes (auto-deploys); if red it restores the
   snapshot and exits non-zero (nothing ships).

6. **Report** one short paragraph: what changed (composite deltas, any color flips), or — if
   finalize aborted — exactly which validation check failed, so it can be fixed next run.

## Guardrails

- Never edit `app.js`, `index.html`, or the `<style>` — this job only touches `data/*.json`.
- Never bypass `weekly_refresh.sh finalize`; it is the only sanctioned path to `main`.
- A run that finds nothing material to change should make no commit (the script handles this).
- If web research is unavailable or returns nothing usable, abort without committing.
