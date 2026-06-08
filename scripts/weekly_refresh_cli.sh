#!/usr/bin/env bash
#
# weekly_refresh_cli.sh — entrypoint for the launchd-driven weekly refresh.
#
# A macOS LaunchAgent (~/Library/LaunchAgents/com.wesluo.ai-unwinding-weekly.plist)
# runs this weekly. It invokes the Claude Code CLI headlessly to perform the
# hands-off research + data refresh, following scripts/weekly_refresh_prompt.md.
# The deterministic git/validate safety still lives in weekly_refresh.sh, which
# the agent calls via the runbook — the validation gate cannot be bypassed.
#
# Manual test:  bash scripts/weekly_refresh_cli.sh
# Logs:         ~/Library/Logs/ai-unwinding-monitor/

set -uo pipefail

# launchd gives a minimal PATH; restore what we need (claude, gh, git, python3).
export PATH="$HOME/.local/bin:/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"

REPO="$HOME/Documents/AI Monitor"
LOGDIR="$HOME/Library/Logs/ai-unwinding-monitor"
mkdir -p "$LOGDIR"
TS="$(date -u +%Y%m%dT%H%M%SZ)"
LOG="$LOGDIR/refresh-$TS.log"

cd "$REPO" || { echo "repo not found: $REPO" >>"$LOG"; exit 1; }

{
  echo "=== AI Unwinding Monitor weekly refresh — $TS ==="
  echo "claude: $(command -v claude)  |  gh: $(command -v gh)  |  python3: $(command -v python3)"
} >>"$LOG" 2>&1

PROMPT='You are the automated weekly refresh for the AI Infrastructure Unwinding Monitor in this repository (current working directory). Read scripts/weekly_refresh_prompt.md and follow it EXACTLY. In short: run `bash scripts/weekly_refresh.sh prepare`; load the ai-unwinding-monitor skill for methodology; decide what is due this week (Tier-1 leading indicators weekly, rest of leading monthly, lagging layer quarterly); research the due items with web search (cite sources, NEVER fabricate — keep prior values if unverifiable); rewrite ONLY data/tracking_data.json and/or data/tracking_data_leading.json preserving the exact schema and the scoring invariants (weighted_score==points*multiplier; composite==sum of weighted; risk_level matches band; statuses green/yellow/red; bump metadata.last_updated); then run `bash scripts/weekly_refresh.sh finalize`, which validates and pushes only if green (or restores the snapshot and aborts). Never edit app.js, index.html, the style block, or any script. If nothing material changed, make no commit. End with a one-paragraph report of composite deltas and key sources, or which validation check aborted the run.'

# Headless, unattended. --dangerously-skip-permissions is required so tool prompts
# do not hang the cron run; the validation gate + "only touch data/*.json" rule +
# git are the real guardrails.
claude -p "$PROMPT" --dangerously-skip-permissions >>"$LOG" 2>&1
code=$?

echo "=== finished (exit $code) at $(date -u +%Y%m%dT%H%M%SZ) ===" >>"$LOG"
# Keep only the 12 most recent logs.
ls -1t "$LOGDIR"/refresh-*.log 2>/dev/null | tail -n +13 | xargs rm -f 2>/dev/null || true
exit $code
