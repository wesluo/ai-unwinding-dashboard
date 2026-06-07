#!/usr/bin/env bash
#
# weekly_refresh.sh — deterministic scaffolding for the hands-off weekly data refresh.
#
# The research + JSON rewrite in between is LLM-driven (see weekly_refresh_prompt.md),
# but everything that touches git or decides what deploys is deterministic and lives
# here, so the validation gate can never be bypassed:
#
#   weekly_refresh.sh prepare    # pull latest, snapshot prior data into data/history/<date>/
#   <agent researches + rewrites data/*.json>
#   weekly_refresh.sh finalize   # validate; if green, commit + push (auto-deploys); else abort
#
# Usage from repo root. Requires git + python3 + (for finalize) push rights / gh auth.

set -euo pipefail
cd "$(dirname "$0")/.."   # repo root

GH="${GH_BIN:-$HOME/.local/bin/gh}"
TODAY="$(date -u +%Y-%m-%d)"
HIST="data/history/${TODAY}"

cmd="${1:-}"

prepare() {
  echo "==> weekly_refresh prepare ($TODAY)"
  git fetch origin main
  git checkout main
  git pull --ff-only origin main
  mkdir -p "$HIST"
  cp data/tracking_data.json "$HIST/tracking_data.json"
  cp data/tracking_data_leading.json "$HIST/tracking_data_leading.json"
  echo "    snapshot saved -> $HIST/"
  echo "    prior state: $(python3 -c "import json;d=json.load(open('data/tracking_data.json'));print('lagging',d['composite_risk_score'],d['risk_level'])")"
  echo "==> ready. Research latest data and rewrite data/*.json, then run: $0 finalize"
}

finalize() {
  echo "==> weekly_refresh finalize ($TODAY)"
  # Validate against the snapshot we took in prepare (freshness monotonicity).
  if [ -d "$HIST" ]; then PREV_ARG="--prev $HIST"; else PREV_ARG=""; fi
  if ! python3 scripts/validate_tracking.py --data-dir data $PREV_ARG; then
    echo "==> VALIDATION FAILED — restoring snapshot, nothing committed/pushed."
    if [ -d "$HIST" ]; then
      cp "$HIST/tracking_data.json" data/tracking_data.json
      cp "$HIST/tracking_data_leading.json" data/tracking_data_leading.json
    fi
    exit 1
  fi

  if git diff --quiet -- data/; then
    echo "==> No data changes this run. Nothing to commit."
    exit 0
  fi

  git add data/
  git commit -q -m "Weekly data refresh ($TODAY)

Automated hands-off refresh: validated by scripts/validate_tracking.py before
commit. Prior state snapshotted to $HIST/.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
  git push origin main
  echo "==> Pushed. Vercel will auto-deploy https://ai-bubble-monitor.vercel.app"
}

case "$cmd" in
  prepare)  prepare ;;
  finalize) finalize ;;
  *) echo "usage: $0 {prepare|finalize}"; exit 2 ;;
esac
