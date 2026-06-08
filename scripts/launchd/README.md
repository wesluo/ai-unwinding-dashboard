# Weekly auto-refresh (macOS launchd + Claude Code CLI)

This drives the **fully hands-off weekly data refresh** on macOS without the Claude
app's Scheduled panel (which requires a newer macOS / Cowork). A `launchd`
LaunchAgent runs the Claude Code CLI headlessly each week; the agent researches the
latest data, validates it, and **pushes to `main` (auto-deploys to the live site)**.

## Pieces

| File | Role |
|------|------|
| `weekly_refresh_cli.sh` (parent dir) | launchd entrypoint — runs `claude -p` headless with the runbook prompt, logs to `~/Library/Logs/ai-unwinding-monitor/` |
| `weekly_refresh.sh` (parent dir) | deterministic git scaffolding (`prepare` / `finalize`); the **only** path to `main` — the validation gate cannot be bypassed |
| `weekly_refresh_prompt.md` (parent dir) | the runbook the agent follows |
| `validate_tracking.py` (parent dir) | strict validation gate run inside `finalize` |
| `com.wesluo.ai-unwinding-weekly.plist` | the LaunchAgent (Mondays 08:30 local) |
| `install.sh` | install / uninstall / status / test |

## Install (one command)

```bash
bash scripts/launchd/install.sh
```

Then optionally prove it end-to-end now:

```bash
bash scripts/launchd/install.sh test     # does a real run (may push to main)
```

Inspect / remove:

```bash
bash scripts/launchd/install.sh status
bash scripts/launchd/install.sh uninstall
```

## Behavior & safety

- Runs **Mondays 08:30 local**. If the Mac is asleep/off then, launchd runs it on
  next wake. Requires you to be logged into your macOS user session (it runs as a
  user LaunchAgent and uses your existing Claude Code + `gh` auth).
- Cadence-aware (per the runbook): Tier-1 leading indicators weekly, the rest of the
  leading layer monthly, the lagging layer quarterly.
- **Auto-pushes to `main`** → Vercel deploys to https://ai-bubble-monitor.vercel.app.
  Every push is gated by `validate_tracking.py`; malformed/out-of-bounds/inconsistent
  data restores the snapshot and aborts without pushing.
- The CLI runs with `--dangerously-skip-permissions` so it never hangs on a prompt.
  The guardrails are: the validation gate, the "only touch `data/*.json`" rule, and
  git history (every change is a reviewable, revertable commit). A bad run can be
  undone with `git revert`.
