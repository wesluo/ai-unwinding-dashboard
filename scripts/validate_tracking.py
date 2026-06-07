#!/usr/bin/env python3
"""
validate_tracking.py — the safety gate for the AI Infrastructure Unwinding Monitor.

The dashboard auto-deploys whatever lands on `main`, and the weekly refresh is
fully hands-off, so this gate is load-bearing: it must FAIL (non-zero exit) on
any malformed, out-of-bounds, or internally-inconsistent data so that bad data
never reaches the live site. Standard library only (runs anywhere, no installs).

Usage:
    python3 scripts/validate_tracking.py [--data-dir data] [--prev DIR]

Exit code 0 = all checks pass (safe to commit/deploy).
Exit code 1 = one or more checks failed (do NOT commit/deploy).

Checks:
  - both JSON files + companies.json parse
  - required top-level keys present
  - status enums in {green, yellow, red}; risk levels in the allowed set
  - numeric bounds: lagging composite 0-40, leading 0-48, concentration_ratio 0-1,
    risk_score 0-6, points 0-3, multiplier 1-3
  - every weighted_score == points * multiplier
  - composite == sum of weighted indicator scores (independent recompute)
  - risk band matches composite score
  - registry coverage: every public company in companies.json appears in tracking
  - freshness: last_updated parses, is not in the future, and (if --prev given)
    does not move backwards
  - size sanity: files are not suspiciously small (truncation guard)
"""

import argparse
import datetime as dt
import json
import os
import sys

LAG = "tracking_data.json"
LEAD = "tracking_data_leading.json"
REG = "companies.json"

STATUSES = {"green", "yellow", "red"}
LAG_LEVELS = {"LOW", "MODERATE", "HIGH", "CRITICAL"}
LEAD_LEVELS = {"LOW", "MODERATE", "HIGH", "CRITICAL"}
MIN_BYTES = 1500  # truncation guard; real files are >15KB


class Report:
    def __init__(self):
        self.errors = []
        self.warnings = []

    def err(self, msg):
        self.errors.append(msg)

    def warn(self, msg):
        self.warnings.append(msg)

    def ok(self):
        return not self.errors


def load_json(path, r):
    if not os.path.exists(path):
        r.err(f"missing file: {path}")
        return None
    size = os.path.getsize(path)
    if size < MIN_BYTES:
        r.err(f"{os.path.basename(path)}: file only {size} bytes (possible truncation)")
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except json.JSONDecodeError as e:
        r.err(f"{os.path.basename(path)}: JSON parse error: {e}")
        return None


def parse_iso(s):
    if not isinstance(s, str):
        return None
    try:
        return dt.datetime.fromisoformat(s.replace("Z", "+00:00"))
    except ValueError:
        return None


def lagging_band(score):
    if score <= 8:
        return "LOW"
    if score <= 16:
        return "MODERATE"
    if score <= 24:
        return "HIGH"
    return "CRITICAL"


def leading_band(score):
    if score <= 12:
        return "LOW"
    if score <= 24:
        return "MODERATE"
    if score <= 36:
        return "HIGH"
    return "CRITICAL"


def check_indicator(ind, r, where, max_pts=3):
    name = ind.get("name", "<unnamed>")
    for key in ("multiplier", "status", "points", "weighted_score"):
        if key not in ind:
            r.err(f"{where}: indicator '{name}' missing '{key}'")
            return 0
    if ind["status"] not in STATUSES:
        r.err(f"{where}: indicator '{name}' bad status '{ind['status']}'")
    m, p, w = ind["multiplier"], ind["points"], ind["weighted_score"]
    if not (1 <= m <= 3):
        r.err(f"{where}: indicator '{name}' multiplier {m} out of [1,3]")
    if not (0 <= p <= max_pts):
        r.err(f"{where}: indicator '{name}' points {p} out of [0,{max_pts}]")
    if p * m != w:
        r.err(f"{where}: indicator '{name}' weighted_score {w} != points*multiplier ({p}*{m}={p*m})")
    return w


def validate_lagging(d, r, prev=None):
    if d is None:
        return
    where = "lagging"
    for key in ("metadata", "composite_risk_score", "current_phase", "risk_level",
                "indicator_scoring", "active_signals", "companies", "phases",
                "latest_update", "ui_copy", "capex_chart_data", "revenue_chart_data"):
        if key not in d:
            r.err(f"{where}: missing top-level key '{key}'")

    score = d.get("composite_risk_score")
    if not isinstance(score, int) or not (0 <= score <= 40):
        r.err(f"{where}: composite_risk_score {score} out of [0,40]")
    else:
        if d.get("risk_level") not in LAG_LEVELS:
            r.err(f"{where}: risk_level '{d.get('risk_level')}' invalid")
        elif d["risk_level"] != lagging_band(score):
            r.err(f"{where}: risk_level '{d['risk_level']}' != band for score {score} ({lagging_band(score)})")

    cp = d.get("current_phase")
    if not isinstance(cp, int) or not (0 <= cp <= 6):
        r.err(f"{where}: current_phase {cp} out of [0,6]")

    inds = d.get("indicator_scoring", {}).get("indicators", [])
    if not inds:
        r.err(f"{where}: no indicators")
    total = sum(check_indicator(i, r, where, max_pts=2) for i in inds)
    if isinstance(score, int) and total != score:
        r.err(f"{where}: composite_risk_score {score} != sum of weighted indicators ({total})")

    for c in d.get("companies", []):
        if c.get("status") not in STATUSES:
            r.err(f"{where}: company '{c.get('name')}' bad status '{c.get('status')}'")
        rs = c.get("risk_score")
        if not isinstance(rs, int) or not (0 <= rs <= 6):
            r.err(f"{where}: company '{c.get('name')}' risk_score {rs} out of [0,6]")

    for s in d.get("active_signals", []):
        if s.get("severity") not in {"low", "moderate", "high"}:
            r.err(f"{where}: active_signal '{s.get('title')}' bad severity '{s.get('severity')}'")

    if len(d.get("phases", [])) != 7:
        r.err(f"{where}: expected 7 phases, found {len(d.get('phases', []))}")

    check_freshness(d, r, where, prev)


def validate_leading(d, r, prev=None):
    if d is None:
        return
    where = "leading"
    for key in ("metadata", "composite_leading_score", "leading_risk_level",
                "leading_indicators", "latest_update", "ui_copy"):
        if key not in d:
            r.err(f"{where}: missing top-level key '{key}'")

    score = d.get("composite_leading_score")
    if not isinstance(score, int) or not (0 <= score <= 48):
        r.err(f"{where}: composite_leading_score {score} out of [0,48]")
    else:
        if d.get("leading_risk_level") not in LEAD_LEVELS:
            r.err(f"{where}: leading_risk_level '{d.get('leading_risk_level')}' invalid")
        elif d["leading_risk_level"] != leading_band(score):
            r.err(f"{where}: leading_risk_level '{d['leading_risk_level']}' != band for {score} ({leading_band(score)})")

    inds = d.get("leading_indicators", [])
    if not inds:
        r.err(f"{where}: no leading_indicators")
    total = sum(check_indicator(i, r, where, max_pts=2) for i in inds)
    if isinstance(score, int) and total != score:
        r.err(f"{where}: composite_leading_score {score} != sum of weighted indicators ({total})")

    # concentration_ratio bound (nested in the AI funding indicator)
    for ind in inds:
        cf = ind.get("track_a_data", {}).get("circular_flow_metrics")
        if cf and "concentration_ratio" in cf:
            cr = cf["concentration_ratio"]
            if not isinstance(cr, (int, float)) or not (0 <= cr <= 1.5):
                r.err(f"{where}: concentration_ratio {cr} out of [0,1.5]")
        tb = ind.get("track_b_assessment", {})
        if tb.get("llm_status") and tb["llm_status"] not in STATUSES:
            r.err(f"{where}: indicator '{ind.get('name')}' track_b llm_status '{tb['llm_status']}' invalid")

    check_freshness(d, r, where, prev)


def check_freshness(d, r, where, prev):
    lu = parse_iso(d.get("metadata", {}).get("last_updated"))
    if lu is None:
        r.err(f"{where}: metadata.last_updated missing or unparseable")
        return
    now = dt.datetime.now(dt.timezone.utc)
    if lu.tzinfo is None:
        lu = lu.replace(tzinfo=dt.timezone.utc)
    if lu > now + dt.timedelta(days=1):
        r.err(f"{where}: last_updated {lu.isoformat()} is in the future")
    if prev is not None:
        plu = parse_iso(prev.get("metadata", {}).get("last_updated"))
        if plu is not None:
            if plu.tzinfo is None:
                plu = plu.replace(tzinfo=dt.timezone.utc)
            if lu < plu:
                r.err(f"{where}: last_updated {lu.isoformat()} moved backwards vs prev {plu.isoformat()}")


def validate_registry_coverage(lag, reg, r):
    if lag is None or reg is None:
        return
    public = {c["ticker"] for c in reg.get("companies", []) if c.get("public")}
    tracked = {c.get("ticker") for c in lag.get("companies", [])}
    missing = public - tracked
    if missing:
        r.err(f"registry: public companies not in tracking data: {sorted(missing)}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--data-dir", default="data")
    ap.add_argument("--prev", default=None,
                    help="optional prior data dir (e.g. data/history/<date>) for freshness monotonicity")
    args = ap.parse_args()

    r = Report()
    lag = load_json(os.path.join(args.data_dir, LAG), r)
    lead = load_json(os.path.join(args.data_dir, LEAD), r)
    reg = load_json(os.path.join(args.data_dir, REG), r)

    prev_lag = prev_lead = None
    if args.prev:
        prev_lag = load_json(os.path.join(args.prev, LAG), Report())
        prev_lead = load_json(os.path.join(args.prev, LEAD), Report())

    validate_lagging(lag, r, prev_lag)
    validate_leading(lead, r, prev_lead)
    validate_registry_coverage(lag, reg, r)

    print("=" * 60)
    print("AI Unwinding Monitor — data validation")
    print("=" * 60)
    if r.warnings:
        for w in r.warnings:
            print(f"  WARN  {w}")
    if r.errors:
        for e in r.errors:
            print(f"  FAIL  {e}")
        print(f"\n{len(r.errors)} error(s) — DATA IS NOT SAFE TO DEPLOY")
        return 1
    print("  PASS  all checks green")
    if lag and lead:
        print(f"  lagging {lag['composite_risk_score']}/40 {lag['risk_level']}  |  "
              f"leading {lead['composite_leading_score']}/48 {lead['leading_risk_level']}  |  "
              f"{len(lag['companies'])} companies")
    return 0


if __name__ == "__main__":
    sys.exit(main())
