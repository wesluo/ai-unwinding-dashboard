# Plan: Activate the weekly auto-refresh scheduler (Claude Code CLI)

> **Handoff doc.** The dashboard, data pipeline, validation gate, and all scheduler
> *artifacts* are built and committed. The one remaining step — turning the committed
> LaunchAgent into a live job (`launchctl load`) — was intentionally blocked when run
> from the Claude **desktop app** (its auto-mode classifier refuses to activate a
> self-running agent that uses `--dangerously-skip-permissions` and auto-pushes to a
> public site). Finish it from **Claude Code CLI**, where you can approve the action.

## Goal / scope

A **fully hands-off weekly refresh** of the AI Infrastructure Unwinding Monitor that
runs on macOS 12 (Monterey) — i.e. **without** the desktop app's Scheduled panel /
Cowork (which needs a newer macOS). Each week it must:

1. Pull latest `main`, snapshot prior data to `data/history/<date>/`.
2. Research what's due (cadence-aware) and rewrite `data/*.json`.
3. Validate, then **push to `main` automatically** → Vercel auto-deploys to
   https://ai-bubble-monitor.vercel.app.
4. Abort safely (no push) on any validation failure.

Mechanism: a macOS **`launchd` LaunchAgent** runs the **Claude Code CLI headlessly**
(`claude -p … --dangerously-skip-permissions`) on a weekly cron. This reuses the
existing local Claude Code + `gh` auth; no API key, no GitHub Actions, no Cowork.

## Current state (already done & on `main`)

| Artifact | Status |
|----------|--------|
| `scripts/weekly_refresh.sh` | ✅ committed — deterministic `prepare`/`finalize`; the only path to `main`; runs the gate |
| `scripts/validate_tracking.py` | ✅ committed — strict gate (passes good data, blocks 9 corruption cases) |
| `scripts/weekly_refresh_prompt.md` | ✅ committed — the runbook the agent follows |
| `scripts/weekly_refresh_cli.sh` | ✅ committed — launchd entrypoint; runs `claude -p` headless, logs to `~/Library/Logs/ai-unwinding-monitor/` |
| `scripts/launchd/com.wesluo.ai-unwinding-weekly.plist` | ✅ committed — LaunchAgent (Mon 08:30 local) |
| `scripts/launchd/install.sh` | ✅ committed — `install` / `uninstall` / `status` / `test` |
| `scripts/launchd/README.md` | ✅ committed — usage docs |
| **`launchctl load` (activation)** | ⛔ **NOT done** — blocked in desktop app; do this from CLI |
| Old in-app task `ai-unwinding-weekly-refresh` | ⚠️ exists at `~/.claude/scheduled-tasks/`; inert on Monterey; remove to avoid double-fire if macOS is ever upgraded |

Verified working: headless `claude -p` runs with existing auth; `weekly_refresh.sh
finalize` validates green and correctly no-ops when there are no data changes.

## Implementation steps (run from Claude Code CLI in the repo)

```bash
cd "$HOME/Documents/AI Monitor"
```

### 1. (Optional) allow `launchctl` without repeated prompts
Add a Bash permission rule so the CLI agent can run the installer. Either approve
interactively when prompted, or add to `.claude/settings.json`:

```json
{
  "permissions": {
    "allow": [
      "Bash(launchctl:*)",
      "Bash(bash scripts/launchd/install.sh:*)"
    ]
  }
}
```

### 2. Activate the LaunchAgent
```bash
bash scripts/launchd/install.sh
```
This copies the plist to `~/Library/LaunchAgents/` and `launchctl load -w`s it.
Expected: prints "Installed and loaded …" and a `launchctl list` line containing
`com.wesluo.ai-unwinding-weekly`.

### 3. Prove it end-to-end now (real run; may push to main)
```bash
bash scripts/launchd/install.sh test
# watch it:
tail -f ~/Library/Logs/ai-unwinding-monitor/refresh-*.log
```
Success = it executes the runbook, validates, and either pushes a commit or reports
"No data changes this run." (Data was last refreshed 2026-06-07, so a same-week run
may legitimately no-op on the Tier-1 cadence.)

### 4. Verify scheduling
```bash
bash scripts/launchd/install.sh status
launchctl list | grep ai-unwinding
```

### 5. Remove the redundant in-app task (optional, recommended)
```bash
rm -rf ~/.claude/scheduled-tasks/ai-unwinding-weekly-refresh
```

## Behavior & cadence

- **When:** Mondays 08:30 local (`StartCalendarInterval` Weekday=1). Runs on next wake
  if the Mac is asleep/off. Needs you logged into your macOS user session (user
  LaunchAgent; uses your Claude Code + `gh` keychain auth).
- **What's due** (per `weekly_refresh_prompt.md`): Tier-1 leading indicators weekly;
  rest of the leading layer monthly; lagging layer quarterly (earnings season).
- **Publish:** auto-push to `main` → Vercel deploy.

## Safety model (important, since it's hands-off + skip-permissions)

- The CLI runs with `--dangerously-skip-permissions` so it can't hang on a prompt.
  The **real guardrails** are:
  1. `validate_tracking.py` — JSON parse, schema, enums, numeric bounds,
     `weighted_score==points*multiplier`, `composite==sum(weighted)`, risk-band match,
     registry coverage, freshness (no future/backwards), truncation guard.
  2. `weekly_refresh.sh finalize` is the **only** sanctioned path to `main`; on
     failure it restores the snapshot and exits non-zero (nothing ships).
  3. Prompt rule: the agent may touch **only** `data/*.json`.
  4. Git history — every change is one revertable commit (`git revert`).
- **Residual risk to accept:** the weekly agent does live web research. A malicious
  page (prompt injection) could in principle steer a skip-permissions run; the gate
  catches malformed data but not plausible-but-wrong data. Mitigations if this matters
  more later: switch `finalize` to open a **PR** instead of pushing to `main`, or add a
  bounded-delta check (reject if a composite moves more than N points in a week).

## Rollback

```bash
bash scripts/launchd/install.sh uninstall   # stop + remove the scheduled job
git revert <sha>                            # undo a bad auto-pushed refresh
```

## Possible future upgrades (not in scope now)

- **PR mode** for review-before-publish (safer than auto-push to main).
- **Remote execution** (GitHub Actions on a schedule, or a cloud runner) so it doesn't
  depend on this Mac being awake — would need an Anthropic API key as a CI secret.
- **Bounded-delta guard** in `validate_tracking.py` to catch implausible week-over-week
  jumps.
