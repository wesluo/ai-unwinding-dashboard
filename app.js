/*
 * AI Infrastructure Unwinding Monitor — runtime renderer
 *
 * The dashboard's CONTENT lives in data/tracking_data.json (lagging) and
 * data/tracking_data_leading.json (leading). The PRESENTATION lives in
 * index.html's <style> block. This file is the bridge: it fetches the JSON
 * on load and renders the existing design from it. Edit the JSON, reload —
 * the dashboard updates with zero HTML edits.
 */
(function () {
  'use strict';

  /* ---------------------------------------------------------------- helpers */

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function cap(s) {
    s = String(s == null ? '' : s);
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  // status (green/yellow/red) -> CSS accent variable
  function statusVar(s) {
    s = String(s || '').toLowerCase();
    return s === 'green' ? 'var(--accent-positive)'
      : s === 'yellow' ? 'var(--accent-warning)'
      : s === 'red' ? 'var(--accent-negative)'
      : 'var(--text-secondary)';
  }

  // risk level (LOW/MODERATE/HIGH/CRITICAL) -> accent name
  function riskAccent(level) {
    level = String(level || '').toUpperCase();
    if (level === 'LOW') return 'positive';
    if (level === 'MODERATE') return 'warning';
    return 'negative';
  }

  function fmtUTC(iso) {
    var d = new Date(iso);
    if (isNaN(d.getTime())) return esc(iso);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var hh = String(d.getUTCHours()).padStart(2, '0');
    var mi = String(d.getUTCMinutes()).padStart(2, '0');
    return months[d.getUTCMonth()] + ' ' + d.getUTCDate() + ', ' + d.getUTCFullYear() + ' ' + hh + ':' + mi + ' UTC';
  }

  async function fetchJSON(url) {
    var r = await fetch(url, { cache: 'no-cache' });
    if (!r.ok) throw new Error(url + ' → HTTP ' + r.status);
    return r.json();
  }

  function errorCard(section, e) {
    return '<div class="card" style="border-left:3px solid var(--accent-negative);">'
      + '<h4 style="color:var(--accent-negative);">Could not load ' + esc(section) + '</h4>'
      + '<p style="color:var(--text-secondary);font-size:0.875rem;">' + esc(e && e.message ? e.message : String(e)) + '</p></div>';
  }

  /* -------------------------------------------------------- shared sections */

  function renderUpdateBanner(meta, latest) {
    latest = latest || {};
    var accent = 'var(--accent-' + esc(latest.accent || 'positive') + ')';
    return ''
      + '<div style="background: var(--bg-card-alt); border-left: 3px solid ' + accent + '; padding: 12px 20px; margin-bottom: var(--gap); border-radius: 6px; display: flex; align-items: center; gap: 12px;">'
      + '<span style="font-size: 1.25rem;">' + esc(latest.emoji || '') + '</span>'
      + '<div style="flex: 1;">'
      + '<span style="color: var(--text-secondary); font-size: 0.875rem;">Latest Update:</span>'
      + '<strong style="color: var(--text-primary); margin-left: 8px;">' + esc(latest.headline || '') + '</strong>'
      + '<span style="background: rgba(255,255,255,0.1); padding: 3px 10px; border-radius: 10px; font-size: 0.75rem; color: ' + accent + '; margin-left: 12px; font-weight: 600;">' + esc(latest.risk_label || '') + '</span>'
      + '<span style="color: var(--text-tertiary); margin-left: 12px; font-size: 0.8125rem;">' + fmtUTC(meta && meta.last_updated) + '</span>'
      + '</div></div>';
  }

  /* ----------------------------------------------------------- lagging view */

  function renderLaggingMetricCards(d) {
    var u = (d.ui_copy && d.ui_copy.lagging_popover) || {};
    var phasePop = (d.ui_copy && d.ui_copy.phase_popover) || {};
    var signalsPop = (d.ui_copy && d.ui_copy.signals_popover) || {};
    var scoreColor = 'var(--accent-' + riskAccent(d.risk_level) + ')';
    var badgeClass = String(d.risk_level).toUpperCase() === 'LOW' ? '' : 'negative';

    var phases = d.phases || [];
    var cur = phases[d.current_phase] || phases[0] || { title: '' };
    var next = phases[d.current_phase + 1];

    var signals = d.active_signals || [];
    var total = signals.length;
    var positive = signals.filter(function (s) { return s.severity === 'low'; }).length;
    var negative = total - positive;

    var nextMeta = next
      ? '<div><strong>Next Phase:</strong> ' + esc(next.title) + '</div><div><strong>Estimated Duration:</strong> ' + esc(next.duration) + '</div>'
      : '';

    return '<div class="dashboard-grid">'
      + '<div class="card metric-card">'
      + '<div class="info-icon" tabindex="0">i</div>'
      + '<div class="popover">'
      + '<div class="popover-title">Lagging Indicators</div>'
      + '<div class="popover-description">' + esc(u.description) + '</div>'
      + '<div class="popover-meta"><div><strong>Scale:</strong> ' + esc(u.scale) + '</div><div><strong>Data Source:</strong> ' + esc(u.data_source) + '</div><div><strong>Update Frequency:</strong> ' + esc(u.update_frequency) + '</div><div><strong>Confidence:</strong> ' + esc(u.confidence) + '</div></div>'
      + '</div>'
      + '<div class="metric-title" style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 8px;">Lagging Indicators</div>'
      + '<div class="metric-value" style="color: ' + scoreColor + ';">' + esc(d.composite_risk_score) + '/40</div>'
      + '<div class="metric-badge ' + badgeClass + '">' + esc(d.risk_level) + ' RISK</div>'
      + '<div class="metric-description">Composite risk from quarterly earnings</div>'
      + '</div>'

      + '<div class="card metric-card">'
      + '<div class="info-icon" tabindex="0">i</div>'
      + '<div class="popover">'
      + '<div class="popover-title">Phase Status</div>'
      + '<div class="popover-description">' + esc(phasePop.description) + '</div>'
      + '<div class="popover-meta"><div><strong>Current:</strong> ' + esc(cur.title) + '</div>' + nextMeta + '</div>'
      + '</div>'
      + '<div class="metric-title" style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 8px;">Phase Status</div>'
      + '<div class="metric-value" style="color: var(--text-primary);">' + esc(cur.title) + '</div>'
      + '<div class="metric-badge ">Monitoring</div>'
      + '<div class="metric-description">Current unwinding phase</div>'
      + '</div>'

      + '<div class="card metric-card">'
      + '<div class="info-icon" tabindex="0">i</div>'
      + '<div class="popover">'
      + '<div class="popover-title">Active Signals Breakdown</div>'
      + '<div class="popover-description">' + esc(signalsPop.description) + '</div>'
      + '<div class="popover-meta"><div><strong>Total Signals:</strong> ' + total + '</div><div><strong>Positive (Low Severity):</strong> ' + positive + '</div><div><strong>Negative (Mod/High Severity):</strong> ' + negative + '</div><div><strong>Status:</strong> Monitoring</div></div>'
      + '</div>'
      + '<div class="metric-title" style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 8px;">Alert Signals</div>'
      + '<div class="metric-value" style="color: var(--text-primary);">' + total + '</div>'
      + '<div class="metric-badge negative">' + total + ' Total</div>'
      + '<div class="metric-description"><span style=\'color: var(--accent-positive); font-size: 0.875rem;\'>+' + positive + ' Positive</span> <span style=\'color: var(--text-tertiary); margin: 0 6px;\'>|</span> <span style=\'color: var(--accent-negative); font-size: 0.875rem;\'>-' + negative + ' Negative</span></div>'
      + '</div>'
      + '</div>';
  }

  function renderChartsRow() {
    return '<div class="dashboard-grid">'
      + '<div class="card chart-card card--wide">'
      + '<div class="card-title"><span>Capex Trends</span></div>'
      + '<div class="chart-container"><canvas id="capexChart"></canvas></div>'
      + '</div>'
      + '<div class="card chart-card card--wide">'
      + '<div class="card-title"><span>AI Revenue Growth</span></div>'
      + '<div class="chart-container"><canvas id="revenueChart"></canvas></div>'
      + '</div>'
      + '</div>';
  }

  function renderPhaseGrid(d) {
    var sec = (d.ui_copy && d.ui_copy.phases_section) || { heading: 'Unwinding Phases', intro: '' };
    var phases = d.phases || [];
    var cur = phases[d.current_phase];
    var intro = esc(sec.intro) + (cur ? ' Currently in ' + esc(cur.title) + '.' : '');

    var cards = phases.map(function (p) {
      var isCur = p.number === d.current_phase;
      var border = isCur ? 'var(--accent-positive)' : 'var(--border-subtle)';
      var badge = isCur
        ? '<span class="status-badge green">CURRENT</span>'
        : '<span class="status-badge" style="background: rgba(255,255,255,0.1); color: var(--text-tertiary);">FUTURE</span>';
      var lis = (p.criteria || []).map(function (c) {
        return '<li style="font-size: 0.75rem; color: var(--text-secondary);">' + esc(c) + '</li>';
      }).join('');
      return '<div style="background: var(--bg-card-alt); border-left: 3px solid ' + border + '; border-radius: 8px; padding: 16px;">'
        + '<div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">'
        + '<div><div style="font-size: 0.75rem; color: var(--text-tertiary); font-weight: 600;">PHASE ' + esc(p.number) + '</div>'
        + '<h4 style="font-size: 1rem; color: var(--text-primary); margin: 4px 0;">' + esc(p.title) + '</h4></div>'
        + badge + '</div>'
        + '<p style="font-size: 0.8125rem; color: var(--text-secondary); margin: 8px 0;">' + esc(p.description) + '</p>'
        + '<ul style="margin: 8px 0 8px 20px; padding: 0;">' + lis + '</ul>'
        + '<p style="font-size: 0.75rem; color: var(--text-tertiary); margin-top: 8px;"><strong>Duration:</strong> ' + esc(p.duration) + '</p>'
        + '</div>';
    }).join('');

    return '<div class="section"><h2>' + esc(sec.heading) + '</h2>'
      + '<p style="color: var(--text-secondary); margin-bottom: 20px; font-size: 0.875rem;">' + intro + '</p>'
      + '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">' + cards + '</div></div>';
  }

  function renderCompanyGrid(companies) {
    var cards = (companies || []).map(function (c) {
      return '<div class="company-card">'
        + '<div class="company-header"><div class="company-name">' + esc(c.name) + '</div>'
        + '<span class="status-badge ' + esc(c.status) + '">' + esc(String(c.status).toUpperCase()) + '</span></div>'
        + '<div class="metric-row"><span class="metric-label">Latest Capex</span><span class="metric-value-text">' + esc(c.capex) + '</span></div>'
        + '<div class="metric-row"><span class="metric-label">AI Revenue Growth</span><span class="metric-value-text">' + esc(c.ai_growth) + '</span></div>'
        + '<div class="metric-row"><span class="metric-label">Risk Score</span><span class="metric-value-text">' + esc(c.risk_score) + '</span></div>'
        + '</div>';
    }).join('');
    return '<div class="section"><h2>Company Metrics</h2><div class="company-grid">' + cards + '</div></div>';
  }

  function severityClass(sev) {
    return sev === 'low' ? 'positive' : (sev === 'moderate' ? 'moderate' : 'critical');
  }

  function renderActiveSignals(signals) {
    var cards = (signals || []).map(function (s) {
      return '<div class="signal-card ' + severityClass(s.severity) + '">'
        + '<h4>' + esc(s.title) + '</h4>'
        + '<p>' + esc(s.description) + '</p>'
        + '<p style="margin-top: 8px; font-size: 0.75rem; color: var(--text-tertiary);"><strong>Source:</strong> ' + esc(s.source) + '</p>'
        + '</div>';
    }).join('');
    return '<div class="section"><h2>Active Warning Signals</h2><div class="signals-grid">' + cards + '</div></div>';
  }

  function renderLagging(d) {
    return renderUpdateBanner(d.metadata, d.latest_update)
      + renderLaggingMetricCards(d)
      + renderChartsRow()
      + renderPhaseGrid(d)
      + renderCompanyGrid(d.companies)
      + renderActiveSignals(d.active_signals);
  }

  /* ----------------------------------------------------------- leading view */

  var LEADING_GROUPS = [
    { cat: 'Price Signal', heading: '💰 Price Signals' },
    { cat: 'Supply Chain Signal', heading: '🏭 Supply Chain Signals' },
    { cat: 'Financial Market Signal', heading: '📈 Financial Market Signals' },
    { cat: 'Activity-Based Signal', heading: '⚡ Activity-Based Signals' }
  ];

  var TRACKA_LABELS = {
    h100_80gb_spot_price: 'H100 80GB Spot Price',
    a100_40gb_spot_price: 'A100 40GB Spot Price',
    trend_30d: 'Trend 30D',
    availability: 'Availability',
    offers_count: 'Offers Count',
    last_collected: 'Last Collected',
    azure_model: 'Azure Model',
    azure_price_input: 'Azure Price Input',
    azure_price_output: 'Azure Price Output',
    aws_model: 'AWS Model',
    aws_price_input: 'AWS Price Input',
    aws_price_output: 'AWS Price Output',
    gcp_model: 'GCP Model',
    gcp_price_input: 'GCP Price Input',
    gcp_price_output: 'GCP Price Output',
    correlation_30d: 'Correlation 30D',
    correlation_90d: 'Correlation 90D',
    recent_movements: 'Recent Movements',
    assessment: 'Assessment',
    revision_direction: 'Revision Direction'
  };

  function prettyKey(k) {
    if (TRACKA_LABELS[k]) return TRACKA_LABELS[k];
    return k.replace(/_/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); });
  }

  // Render the Track A (quantitative) block as clean "Label: value" lines.
  // Values are rendered raw (never title-cased) and nested objects are skipped
  // so the circular-flow dict never leaks as a raw literal.
  function renderTrackA(data) {
    var lines = [];
    Object.keys(data || {}).forEach(function (k) {
      var v = data[k];
      if (v === null || v === undefined) return;
      if (typeof v === 'object') {
        if (k === 'circular_flow_metrics') {
          if (v.concentration_ratio != null) lines.push('<strong>Concentration Ratio:</strong> ' + esc(v.concentration_ratio));
          if (v.burn_rate_alert != null) lines.push('<strong>Burn Rate Alert:</strong> ' + (v.burn_rate_alert ? 'Yes' : 'No'));
        }
        return; // skip arrays (rendered as sparkline) and other nested objects
      }
      lines.push('<strong>' + esc(prettyKey(k)) + ':</strong> ' + esc(v));
    });
    return lines.join('<br>');
  }

  // Generic sparkline from a track_a_history array (uses correlation_30d).
  function renderSparkline(history) {
    var pts = (history || []).filter(function (h) { return h.correlation_30d != null; });
    if (pts.length < 2) return '';
    var vals = pts.map(function (h) { return h.correlation_30d; });
    var min = Math.min.apply(null, vals);
    var max = Math.max.apply(null, vals);
    var range = (max - min) || 1;
    var x0 = 35, x1 = 135, yTop = 5, yBot = 40, n = pts.length;
    function coord(v, i) {
      var x = x0 + (x1 - x0) * (i / (n - 1));
      var y = yTop + (yBot - yTop) * (1 - (v - min) / range);
      return [x, y];
    }
    var poly = pts.map(function (h, i) {
      var c = coord(h.correlation_30d, i);
      return c[0].toFixed(1) + ',' + c[1].toFixed(1);
    }).join(' ');
    var circles = pts.map(function (h, i) {
      var c = coord(h.correlation_30d, i);
      return '<circle cx="' + c[0].toFixed(1) + '" cy="' + c[1].toFixed(1) + '" r="3" fill="#c0ff00"/>';
    }).join('');
    var labels = pts.map(function (h, i) {
      var c = coord(h.correlation_30d, i);
      var d = h.last_collected ? new Date(h.last_collected) : null;
      var lab = d && !isNaN(d.getTime()) ? ((d.getUTCMonth() + 1) + '/' + d.getUTCDate()) : '';
      return '<text x="' + c[0].toFixed(1) + '" y="55" text-anchor="middle" fill="#999" font-size="9">' + lab + '</text>';
    }).join('');
    return '<svg width="140" height="60" style="display: block; margin: 8px 0; background: rgba(0,0,0,0.2); border-radius: 4px;">'
      + '<line x1="35" y1="5" x2="35" y2="40" stroke="#666" stroke-width="1"/>'
      + '<line x1="35" y1="40" x2="135" y2="40" stroke="#666" stroke-width="1"/>'
      + '<text x="30" y="9" text-anchor="end" fill="#999" font-size="9">' + max.toFixed(2) + '</text>'
      + '<text x="30" y="44" text-anchor="end" fill="#999" font-size="9">' + min.toFixed(2) + '</text>'
      + labels
      + '<polyline points="' + poly + '" fill="none" stroke="#c0ff00" stroke-width="2.5" opacity="1"/>'
      + circles
      + '</svg>';
  }

  function renderLeadingMetricCards(L) {
    var u = L.ui_copy || {};
    var lp = u.leading_popover || {}, ap = u.alignment_popover || {}, dp = u.divergent_popover || {};
    var inds = L.leading_indicators || [];
    var total = inds.length;
    var divergentInds = inds.filter(function (i) { return i.divergence_flag; });
    var divergent = divergentInds.length;
    var aligned = total - divergent;
    var alignment = total ? Math.round((aligned / total) * 100) : 0;
    var scoreColor = 'var(--accent-' + riskAccent(L.leading_risk_level) + ')';
    var badgeClass = String(L.leading_risk_level).toUpperCase() === 'LOW' ? '' : 'negative';

    var divList = divergentInds.map(function (i) {
      var tb = i.track_b_assessment || {};
      return '<li style="margin-bottom: 8px; font-size: 0.8125rem; line-height: 1.4;">'
        + '<strong>' + esc(i.name) + '</strong><br>'
        + '<span style="font-size: 0.75rem;">Quant: <span style="color: ' + statusVar(i.status) + '; font-weight: 600;">' + esc(String(i.status).toUpperCase()) + '</span> | '
        + 'Qual: <span style="color: ' + statusVar(tb.llm_status) + '; font-weight: 600;">' + esc(String(tb.llm_status).toUpperCase()) + '</span></span></li>';
    }).join('');
    var divBlock = divergent > 0
      ? '<div style="margin-top: 12px;"><strong>Indicators Requiring Review:</strong><ul style="margin: 8px 0 0 20px; padding: 0;">' + divList + '</ul></div>'
      : '';

    return '<div class="dashboard-grid">'
      + '<div class="card metric-card">'
      + '<div class="info-icon" tabindex="0">i</div>'
      + '<div class="popover">'
      + '<div class="popover-title">Leading Indicators</div>'
      + '<div class="popover-description">' + esc(lp.description) + '</div>'
      + '<div class="popover-meta"><div><strong>Scale:</strong> ' + esc(lp.scale) + '</div><div><strong>Update Frequency:</strong> ' + esc(lp.update_frequency) + '</div><div><strong>Prediction Horizon:</strong> ' + esc(lp.prediction_horizon) + '</div></div>'
      + '</div>'
      + '<div class="metric-title" style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 8px;">Leading Indicators</div>'
      + '<div class="metric-value" style="color: ' + scoreColor + ';">' + esc(L.composite_leading_score) + '/48</div>'
      + '<div class="metric-badge ' + badgeClass + '">' + esc(L.leading_risk_level) + ' RISK</div>'
      + '<div class="metric-description">Predictive market signals</div>'
      + '</div>'

      + '<div class="card metric-card">'
      + '<div class="info-icon" tabindex="0">i</div>'
      + '<div class="popover">'
      + '<div class="popover-title">Quantitative/Qualitative Alignment</div>'
      + '<div class="popover-description">' + esc(ap.description) + '</div>'
      + '<div class="popover-meta"><div><strong>Quantitative:</strong> ' + esc(ap.quantitative) + '</div><div><strong>Qualitative:</strong> ' + esc(ap.qualitative) + '</div><div><strong>Agreement:</strong> ' + alignment + '%</div><div><strong>Divergent Indicators:</strong> ' + divergent + '</div></div>'
      + '</div>'
      + '<div class="metric-title" style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 8px;">Quant/Qual Alignment</div>'
      + '<div class="metric-value" style="color: var(--text-primary);">' + alignment + '%</div>'
      + '<div class="metric-badge ' + (divergent > 0 ? 'negative' : '') + '">' + (divergent > 0 ? 'DIVERGENT' : 'ALIGNED') + '</div>'
      + '<div class="metric-description">Data vs Research agreement</div>'
      + '</div>'

      + '<div class="card metric-card">'
      + '<div class="info-icon" tabindex="0">i</div>'
      + '<div class="popover">'
      + '<div class="popover-title">Divergent Indicators</div>'
      + '<div class="popover-description">' + esc(dp.description) + divBlock + '</div>'
      + '<div class="popover-meta"><div><strong>Total Indicators:</strong> ' + total + '</div><div><strong>Aligned:</strong> ' + aligned + '</div><div><strong>Divergent:</strong> ' + divergent + '</div></div>'
      + '</div>'
      + '<div class="metric-title" style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 8px;">Divergent Indicators</div>'
      + '<div class="metric-value" style="color: var(--text-primary);">' + divergent + '</div>'
      + '<div class="metric-badge negative">Needs Review</div>'
      + '<div class="metric-description">Requires investigation</div>'
      + '</div>'
      + '</div>';
  }

  function renderSignalCard(ind) {
    var tb = ind.track_b_assessment || {};
    var qStatus = ind.status;
    var qBody = renderTrackA(ind.track_a_data || {});
    var divergeMeta = ind.divergence_flag ? '<div style="color: var(--accent-negative);"><strong>⚠️ Divergence Detected</strong></div>' : '';
    var divergeBadge = ind.divergence_flag ? '<span class="status-badge red" style="margin-left: 8px;">⚠️ DIVERGENT</span>' : '';
    var spark = ind.track_a_history ? renderSparkline(ind.track_a_history) : '';
    var confTxt = tb.llm_confidence ? ' | Confidence: ' + esc(cap(tb.llm_confidence)) : '';

    return '<div class="signal-card" style="position: relative;">'
      + '<div class="info-icon" tabindex="0">i</div>'
      + '<div class="popover">'
      + '<div class="popover-title">' + esc(ind.name) + '</div>'
      + '<div class="popover-description">'
      + '<div style="margin-bottom: 12px;"><strong>Quantitative Analysis</strong>'
      + '<div style="margin-top: 4px; padding: 8px; background: rgba(0,0,0,0.2); border-radius: 6px; border-left: 3px solid ' + statusVar(qStatus) + ';">'
      + '<div style="color: ' + statusVar(qStatus) + '; font-weight: 600; margin-bottom: 4px;">Status: ' + esc(String(qStatus).toUpperCase()) + '</div>'
      + '<div style="font-size: 0.8125rem; line-height: 1.4;">' + qBody + '</div></div></div>'
      + '<div><strong>Qualitative Assessment</strong>'
      + '<div style="margin-top: 4px; padding: 8px; background: rgba(0,0,0,0.2); border-radius: 6px; border-left: 3px solid ' + statusVar(tb.llm_status) + ';">'
      + '<div style="color: ' + statusVar(tb.llm_status) + '; font-weight: 600; margin-bottom: 4px;">Status: ' + esc(String(tb.llm_status || '').toUpperCase()) + confTxt + '</div>'
      + '<div style="font-size: 0.8125rem; line-height: 1.4;"><em>' + esc(tb.llm_rationale || '') + '</em></div></div></div>'
      + '</div>'
      + '<div class="popover-meta">'
      + '<div><strong>Tier:</strong> ' + esc(ind.tier) + ' (×' + esc(ind.multiplier) + ' multiplier)</div>'
      + '<div><strong>Weighted Score:</strong> +' + esc(ind.weighted_score) + ' points</div>'
      + divergeMeta
      + '</div></div>'
      + '<h4>' + esc(ind.name) + '</h4>'
      + '<div style="margin: 8px 0;">'
      + '<span class="status-badge ' + esc(qStatus) + '">' + esc(String(qStatus).toUpperCase()) + '</span>'
      + '<span style="margin-left: 8px; color: var(--text-tertiary); font-size: 0.75rem;">+' + esc(ind.weighted_score) + ' pts | Tier ' + esc(ind.tier) + '</span>'
      + divergeBadge
      + spark
      + '</div>'
      + '<p style="margin: 8px 0; font-size: 0.875rem;"><strong>Trend:</strong> ' + esc(cap(ind.trend_30d || 'Unknown')) + '</p>'
      + '</div>';
  }

  function renderLeadingGroups(L) {
    var inds = L.leading_indicators || [];
    return LEADING_GROUPS.map(function (g) {
      var cards = inds.filter(function (i) { return i.category === g.cat; }).map(renderSignalCard).join('');
      if (!cards) return '';
      return '<div class="section"><h2>' + esc(g.heading) + '</h2><div class="signals-grid">' + cards + '</div></div>';
    }).join('');
  }

  function renderLeading(L) {
    return renderUpdateBanner(L.metadata, L.latest_update)
      + renderLeadingMetricCards(L)
      + renderLeadingGroups(L);
  }

  /* ---------------------------------------------------------------- charts */

  var chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#b0b3b8', font: { size: 13 }, usePointStyle: true } },
      tooltip: {
        backgroundColor: '#2a2d31', titleColor: '#ffffff', bodyColor: '#b0b3b8',
        borderColor: 'rgba(255,255,255,0.15)', borderWidth: 1, padding: 12, cornerRadius: 8
      }
    },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.08)' }, ticks: { color: '#8a8d91', font: { size: 11 } }, border: { color: 'rgba(255,255,255,0.08)' } },
      y: { grid: { color: 'rgba(255,255,255,0.08)' }, ticks: { color: '#8a8d91', font: { size: 11 } }, border: { color: 'rgba(255,255,255,0.08)' } }
    },
    interaction: { intersect: false, mode: 'index' },
    animation: { duration: 300 }
  };

  function withTitle(text) {
    return Object.assign({}, chartOptions, {
      plugins: Object.assign({}, chartOptions.plugins, {
        title: { display: true, text: text, color: '#ffffff', font: { size: 14, weight: '600' } }
      })
    });
  }

  function initCharts(d) {
    if (typeof Chart === 'undefined') return;
    var cap = document.getElementById('capexChart');
    if (cap && d.capex_chart_data) new Chart(cap, { type: 'line', data: d.capex_chart_data, options: withTitle('Quarterly Capex ($B)') });
    var rev = document.getElementById('revenueChart');
    if (rev && d.revenue_chart_data) new Chart(rev, { type: 'line', data: d.revenue_chart_data, options: withTitle('AI Revenue YoY Growth (%)') });
  }

  /* ------------------------------------------------------ behavior bindings */

  function bindModeToggle() {
    document.querySelectorAll('.toggle-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var mode = this.dataset.mode;
        document.querySelectorAll('.toggle-btn').forEach(function (b) { b.classList.remove('active'); });
        this.classList.add('active');
        document.querySelectorAll('.dashboard-view').forEach(function (view) { view.classList.remove('active'); });
        var target = document.getElementById(mode + '-view');
        if (target) target.classList.add('active');
      });
    });
  }

  function bindPopoverTouch() {
    if (!('ontouchstart' in window)) return;
    document.querySelectorAll('.info-icon').forEach(function (icon) {
      icon.addEventListener('click', function (e) {
        e.stopPropagation();
        this.classList.toggle('active');
        document.querySelectorAll('.info-icon.active').forEach(function (other) {
          if (other !== icon) other.classList.remove('active');
        });
      });
    });
    document.addEventListener('click', function () {
      document.querySelectorAll('.info-icon.active').forEach(function (icon) { icon.classList.remove('active'); });
    });
  }

  function setFooter(lag, lead) {
    var el = document.getElementById('footer-updated');
    if (!el) return;
    var times = [lag && lag.metadata && lag.metadata.last_updated, lead && lead.metadata && lead.metadata.last_updated]
      .filter(Boolean).map(function (s) { return new Date(s); }).filter(function (d) { return !isNaN(d.getTime()); });
    if (!times.length) { el.textContent = '—'; return; }
    var latest = new Date(Math.max.apply(null, times.map(function (d) { return d.getTime(); })));
    el.textContent = fmtUTC(latest.toISOString());
  }

  /* ------------------------------------------------------------------ init */

  async function init() {
    var lag, lead;
    try {
      var res = await Promise.all([
        fetchJSON('./data/tracking_data.json'),
        fetchJSON('./data/tracking_data_leading.json')
      ]);
      lag = res[0]; lead = res[1];
    } catch (e) {
      var c = document.querySelector('.container');
      if (c) c.innerHTML = errorCard('dashboard data', e);
      return;
    }

    var lagEl = document.getElementById('lagging-view');
    var leadEl = document.getElementById('leading-view');
    try { lagEl.innerHTML = renderLagging(lag); }
    catch (e) { console.error('lagging render', e); lagEl.innerHTML = errorCard('lagging indicators', e); }
    try { leadEl.innerHTML = renderLeading(lead); }
    catch (e) { console.error('leading render', e); leadEl.innerHTML = errorCard('leading indicators', e); }

    try { initCharts(lag); } catch (e) { console.error('charts', e); }
    setFooter(lag, lead);
    bindModeToggle();
    bindPopoverTouch();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
