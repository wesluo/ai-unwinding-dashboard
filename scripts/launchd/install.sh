#!/usr/bin/env bash
#
# install.sh — install/activate (or remove) the weekly-refresh LaunchAgent.
#
#   bash scripts/launchd/install.sh           # install + load (runs Mondays 08:30)
#   bash scripts/launchd/install.sh uninstall  # unload + remove
#   bash scripts/launchd/install.sh status     # show load state + next info
#   bash scripts/launchd/install.sh test       # run the job once now (foreground-ish)
#
# This is the step that turns the committed artifact into a live scheduled job on
# THIS machine. It is intentionally a manual, explicit action.

set -euo pipefail

LABEL="com.wesluo.ai-unwinding-weekly"
PLIST="$LABEL.plist"
HERE="$(cd "$(dirname "$0")" && pwd)"
SRC="$HERE/$PLIST"
DEST="$HOME/Library/LaunchAgents/$PLIST"

cmd="${1:-install}"

case "$cmd" in
  install)
    mkdir -p "$HOME/Library/LaunchAgents" "$HOME/Library/Logs/ai-unwinding-monitor"
    cp "$SRC" "$DEST"
    launchctl unload "$DEST" 2>/dev/null || true
    launchctl load -w "$DEST"
    echo "Installed and loaded: $DEST"
    echo "Next run: Monday 08:30 local. Logs: ~/Library/Logs/ai-unwinding-monitor/"
    launchctl list | grep "$LABEL" || true
    ;;
  uninstall)
    launchctl unload "$DEST" 2>/dev/null || true
    rm -f "$DEST"
    echo "Uninstalled: $DEST"
    ;;
  status)
    echo "Loaded?"; launchctl list | grep "$LABEL" || echo "  (not loaded)"
    echo "Installed file:"; ls -la "$DEST" 2>/dev/null || echo "  (not installed)"
    ;;
  test)
    echo "Running the weekly job once now (this does real research + may push to main)..."
    bash "$HERE/../weekly_refresh_cli.sh"
    echo "Done. See ~/Library/Logs/ai-unwinding-monitor/ for the run log."
    ;;
  *)
    echo "usage: $0 {install|uninstall|status|test}"; exit 2 ;;
esac
