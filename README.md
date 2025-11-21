# AI Infrastructure Unwinding Monitor

**Dual-Layer Early Warning System for AI Infrastructure Bubble Unwinding**

[![Version](https://img.shields.io/badge/version-1.3.0-blue.svg)](https://github.com/yourusername/ai-monitor)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Last Updated](https://img.shields.io/badge/last%20updated-Nov%202025-brightgreen.svg)](https://github.com/yourusername/ai-monitor)

## Overview

The AI Infrastructure Unwinding Monitor is a comprehensive monitoring system that detects early warning signals of AI infrastructure bubble unwinding using a dual-layer approach:

1. **Lagging Indicators** - Quarterly earnings analysis from hyperscalers, semiconductors, and AI infrastructure operators
2. **Leading Indicators** - Real-time market signals including GPU pricing, cloud costs, AI lab funding velocity, and FOMO circular flow tracking

The system tracks **Scenario 3 Phase 1** unwinding via operating fundamentals (capex guidance, AI revenue growth) and detects **FOMO circular flow collapse** (AI labs spending 75-90% of hyperscaler AI revenue while burning 2-10x their revenue).

## Key Features

### Lagging Indicators (Quarterly Earnings)
- ✅ **Automated earnings analysis** for 11+ companies (MSFT, AMZN, GOOGL, META, NVDA, TSMC, ORCL, CRWV, NBIS, IREN, APLD)
- ✅ **Phase progression tracking** (6 phases from capex cuts to equity repricing)
- ✅ **Composite risk scoring** (0-40 scale with weighted indicators)
- ✅ **AI infrastructure operator stress monitoring** (counterparty risk, GPU-backed debt)
- ✅ **Interactive HTML dashboards** with Dark Glassmorphism design
- ✅ **Comprehensive markdown reports** with change analysis

### Leading Indicators (Real-Time Market Signals)
- ✅ **Dual-track validation** (Quantitative data + Qualitative LLM research)
- ✅ **12 leading indicators** predicting unwinding 1-3 quarters ahead
- ✅ **GPU secondary market pricing** tracking (vast.ai, Lambda, CoreWeave)
- ✅ **Cloud AI service pricing wars** (Azure OpenAI, AWS Bedrock, Google Vertex)
- ✅ **Data center REIT monitoring** (Digital Realty, Equinix)
- ✅ **FOMO circular flow tracking** (AI lab spending vs hyperscaler AI revenue)

### FOMO Circular Flow Analysis (NEW)
- ✅ **Concentration ratio tracking**: AI lab spending as % of hyperscaler AI revenue (currently ~80-86%)
- ✅ **Individual lab tracking**: OpenAI ($12B+ spending), Anthropic ($7B), xAI ($12B)
- ✅ **Burn rate monitoring**: Labs burning 2-10x their revenue on compute
- ✅ **Funding velocity analysis**: Mega-rounds frequency, valuation trends, deal terms
- ✅ **Faster unwinding detection**: FOMO collapse predicts 1-2 quarters faster than traditional signals

## Architecture

```
AI_Monitor/
├── ai-unwinding-monitor/           # Monitor skill (logic)
│   ├── SKILL.md                    # Complete monitoring methodology
│   ├── references/                 # Indicator definitions, baselines
│   └── scripts/                    # Analysis scripts
├── data/                           # Data storage
│   ├── tracking_data.json          # Lagging indicators (quarterly)
│   └── tracking_data_leading.json  # Leading indicators (weekly/monthly)
├── docs/                           # Plans and designs
│   └── plans/
│       └── 2025-11-14-dashboard-redesign-v4.md
├── FOMO_CIRCULAR_FLOW_ANALYSIS.md  # Circular flow methodology
└── dashboard_YYYYMMDD.html         # Generated dashboards
```

## Quick Start

### Monitor Lagging Indicators (Quarterly)

Use the `ai-unwinding-monitor` skill to analyze earnings:

```
"Run the ai-unwinding-monitor skill to analyze Q3 2025 earnings"
```

The skill will:
1. Identify all earnings reports from last 90 days
2. Analyze transcripts for warning signals
3. Update `data/tracking_data.json`
4. Generate `dashboard_YYYYMMDD.html`
5. Generate `RISK_ASSESSMENT_YYYY-MM-DD.md`

### Monitor Leading Indicators (Weekly/Monthly)

Update leading indicators manually or via script:

**Weekly (Tier 1):**
```bash
python scripts/collect_leading_indicators.py --tier 1 --output data/leading_indicators_raw.json
```

**Monthly (Tier 2 + Circular Flow):**
```bash
python scripts/collect_leading_indicators.py --tier 2 --circular-flow --output data/leading_indicators_raw.json
```

### Generate Dashboard

Use the `ai-dashboard-generator` skill:

```
"Generate dashboard using Dark Glassmorphism style from the latest tracking data"
```

## Current Status (as of Nov 20, 2025)

### Lagging Indicators: **7/40 (LOW RISK)** ✅
- All hyperscalers raised capex guidance in Q3 2025 (collective >$380B)
- NVIDIA Q3 FY2026 crushed estimates (+62.5% YoY, Blackwell "off the charts")
- No Phase 1 unwinding signals detected
- Meta investor skepticism isolated (lacks cloud revenue story)

### Leading Indicators: **5/48 (LOW RISK)** ✅
- GPU pricing showing minor volatility (YELLOW)
- AI funding decelerating from hypergrowth but still robust (YELLOW)
- All other indicators GREEN
- 4 Track A/B divergences flagged for investigation

### FOMO Circular Flow: **YELLOW (Concentration Risk)**
- **AI lab spending**: ~$30-40B annually (OpenAI $12B+, Anthropic $7B, xAI $12B)
- **Hyperscaler AI revenue**: ~$35-50B annually (Azure AI $15-18B, AWS AI/ML $8-15B, GCP AI $10-18B)
- **Concentration ratio**: **75-90%** (systemic fragility)
- **Burn rates**: Labs burning 2-10x revenue (unsustainable without FOMO funding)

## Monitored Companies

### Primary Hyperscalers
- **Microsoft (MSFT)** - Azure AI, $64.6B FY2025 capex
- **Amazon (AMZN)** - AWS AI/ML, $125B 2025 capex
- **Alphabet (GOOGL)** - Google Cloud AI, $91-93B 2025 capex
- **Meta (META)** - Infrastructure capex, $70-72B 2025 capex

### Critical Semiconductors
- **NVIDIA (NVDA)** - Data Center revenue $51.2B/quarter (+66% YoY)
- **TSMC (TSM)** - HPC segment, monthly revenue reports

### AI Infrastructure Operators (Phase 3 Canaries)
- **CoreWeave (CRWV)** - GPU cloud, $1.36B Q3 revenue
- **Nebius (NBIS)** - AI infrastructure, $146M Q3 revenue
- **Iris Energy (IREN)** - Bitcoin→AI pivot, $674M GPU procurement
- **Applied Digital (APLD)** - HPC hosting, $64.2M Q1 revenue

### Secondary Players
- **Oracle (ORCL)** - OpenAI $30B contract, cloud infrastructure

### AI Labs (Funding & Spending Tracked)
- **OpenAI** - $157B valuation, $12B+ Azure spending, $7B revenue
- **Anthropic** - $7.3B raised, $7B compute spending, $3B revenue
- **xAI** - $6B raised, $12B infrastructure spending
- **Mistral AI, Cohere** - Combined ~$3B spending

## Unwinding Scenarios

### Traditional Unwinding (Gradual - 2-4 Quarters)
1. Enterprise AI adoption disappoints
2. Hyperscalers see GPU utilization softness
3. Hyperscalers cut capex guidance (Phase 1)
4. NVIDIA/TSMC see order declines (Phase 2)
5. AI infrastructure operators face financing stress (Phase 3)
6. Private credit distress (Phase 4)
7. Credit market contagion (Phase 5)
8. Equity repricing (Phase 6)

### FOMO Circular Flow Unwinding (Fast - 1-2 Quarters)
1. **AI lab funding dries up** (VC/PE FOMO ends)
2. **AI labs immediately cut compute spending** (no profitability buffer)
3. **Hyperscaler AI revenue collapses** (lose 75-90% of AI revenue)
4. Hyperscaler capex cuts follow (accelerated Phase 1→2 transition)
5. Cascade accelerates through remaining phases

**Key Difference**: FOMO unwinding is **binary and fast** because AI labs have no profit cushion. Traditional unwinding is **gradual** as enterprises slowly reduce adoption.

## Risk Scoring

### Lagging Indicators (Quarterly Earnings)
- **0-8 points**: LOW RISK ✅ (ecosystem healthy)
- **9-16 points**: MODERATE RISK ⚠️ (warning signals emerging)
- **17-24 points**: HIGH RISK 🔴 (Phase 1 likely underway)
- **25+ points**: CRITICAL RISK 🚨 (Phase 2 transition risk)

**Current Score**: 7/40 (LOW)

### Leading Indicators (Real-Time Signals)
- **0-12 points**: LOW RISK ✅ (no deterioration detected)
- **13-24 points**: MODERATE RISK ⚠️ (early warning signals)
- **25-36 points**: HIGH RISK 🔴 (unwinding likely 1-2 quarters ahead)
- **37-48 points**: CRITICAL RISK 🚨 (imminent unwinding)

**Current Score**: 5/48 (LOW)

### FOMO Circular Flow (Quarterly)
- **<50% concentration**: GREEN ✅ (diverse customer base)
- **50-80% concentration**: YELLOW ⚠️ (current state - 75-90%)
- **>80% concentration + funding stress**: RED 🔴 (systemic fragility)

**Current Status**: YELLOW (concentration risk building)

## Key Indicators

### Primary Indicators (3x Weight)
1. **Capex Guidance Reductions** - GREEN ✅ (all raising guidance)
2. **AI Revenue Growth Deceleration** - YELLOW ⚠️ (decelerating from hypergrowth)
3. **GPU Secondary Market Pricing** (Leading) - YELLOW ⚠️ (minor volatility)
4. **AI Startup Funding Velocity** (Leading) - YELLOW ⚠️ (FOMO concentration risk)

### Secondary Indicators (2x Weight)
5. **GPU Utilization Rates** - GREEN ✅ (demand strong)
6. **Margin Compression** - YELLOW ⚠️ (Meta investor concerns)
7. **Infrastructure Timeline Changes** - GREEN ✅ (on schedule)

### Tertiary Indicators (1x Weight)
8. **Semiconductor Orders** - GREEN ✅ (NVIDIA blowout results)
9. **Enterprise Adoption Sentiment** - YELLOW ⚠️ (proving ROI)
10. **Inference Cost Economics** - YELLOW ⚠️ (improving but not viable everywhere)

## Data Sources

### Lagging Indicators
- SEC EDGAR filings (10-Q, 10-K)
- Earnings call transcripts (investor relations websites)
- Quarterly investor presentations
- SEC 8-K filings (material events)

### Leading Indicators - Track A (Quantitative)
- vast.ai GPU spot pricing API
- Azure OpenAI pricing page
- AWS Bedrock pricing
- Google Vertex AI pricing
- Yahoo Finance (stock correlations)
- Digital Realty / Equinix investor updates

### Leading Indicators - Track B (Qualitative)
- Web search across unrestricted sources
- News aggregation (TechCrunch, Bloomberg, Reuters)
- Leaked documents (when available)
- Industry reports (Gartner, McKinsey, SemiAnalysis)
- Analyst research (Goldman Sachs, Morgan Stanley)

### Circular Flow Analysis
- Public funding announcements (Crunchbase, PitchBook)
- Leaked financial documents (OpenAI/Microsoft disclosure Nov 2025)
- Hyperscaler earnings analysis (Azure AI, AWS AI/ML, GCP AI revenue)
- Training cost estimates (Epoch AI, academic research)
- Cloud spending disclosures (when available)

## Update Frequency

| Indicator Type | Update Frequency | Next Update |
|---------------|------------------|-------------|
| Lagging Indicators | Quarterly (90-day window) | Q4 2025 (Jan/Feb 2026) |
| Leading Tier 1 | Weekly | Nov 22, 2025 |
| Leading Tier 2 | Monthly | Dec 1, 2025 |
| Circular Flow | Quarterly | Q4 2025 (Feb 2026) |

## Output Files

### Generated Automatically
- `dashboard_YYYYMMDD.html` - Interactive visual dashboard (Dark Glassmorphism style)
- `RISK_ASSESSMENT_YYYY-MM-DD.md` - Comprehensive analysis report with change comparisons
- `data/tracking_data.json` - Lagging indicators data (updated quarterly)
- `data/tracking_data_leading.json` - Leading indicators data (updated weekly/monthly)

### Reference Documentation
- `FOMO_CIRCULAR_FLOW_ANALYSIS.md` - Detailed circular flow analysis methodology
- `ai-unwinding-monitor/SKILL.md` - Complete monitoring methodology
- `ai-unwinding-monitor/references/phase1_indicators.md` - Indicator definitions
- `ai-unwinding-monitor/references/companies_tracked.md` - Company details
- `ai-unwinding-monitor/references/historical_baselines.md` - Baseline values

## Skills

### ai-unwinding-monitor
Primary monitoring skill for analyzing earnings reports, updating tracking data, and generating dashboards.

**Capabilities:**
- Quarterly earnings analysis (90-day window requirement)
- Leading indicators monitoring (dual-track validation)
- FOMO circular flow tracking
- Warning signal detection
- Composite risk scoring
- HTML dashboard generation
- Markdown report generation

**Installation:**
The skill is packaged and ready for distribution: `ai-unwinding-monitor.zip` (79KB)

Contains:
- SKILL.md with complete methodology
- 3 Python scripts (parse earnings, generate dashboard, news sentiment)
- 4 reference documents (indicators, companies, baselines, FOMO analysis)
- 2 asset files (tracking data templates, signal weights)

**Usage:**
```
"Run ai-unwinding-monitor to analyze latest earnings and update all indicators"
```

### ai-dashboard-generator
Dashboard generation skill that creates interactive HTML dashboards from tracking data.

**Usage:**
```
"Generate dashboard using Dark Glassmorphism style"
```

## Technology Stack

- **Data Storage**: JSON files (tracking_data.json, tracking_data_leading.json)
- **Dashboard**: HTML + Chart.js 4.x + Dark Glassmorphism CSS
- **Analysis Scripts**: Python 3.11+
- **LLM Research**: Claude with web search (Track B qualitative research)
- **Version Control**: Git

## Recent Updates

### November 20, 2025
- ✅ Added comprehensive leading indicators documentation to SKILL.md
- ✅ Enhanced AI Startup Funding indicator with FOMO circular flow tracking
- ✅ Documented dual-track validation methodology (Track A/B)
- ✅ Added quarterly circular flow analysis workflow
- ✅ Created FOMO_CIRCULAR_FLOW_ANALYSIS.md with detailed methodology
- ✅ Calculated current concentration ratio (75-90%)
- ✅ Identified AI lab burn rates (2-10x revenue)

### November 19, 2025
- ✅ Updated with NVIDIA Q3 FY2026 earnings (blowout results)
- ✅ Composite lagging score: 7/40 (LOW RISK confirmed)
- ✅ All hyperscalers raised capex guidance in Q3 2025
- ✅ Meta concerns identified as isolated (company-specific)

### November 17, 2025
- ✅ Integrated Dark Glassmorphism style into dashboard generator
- ✅ Created style library in frontend-design skill
- ✅ Updated dashboard to v5.0 with new visual aesthetic

## Version History

- **v1.3.0** (Nov 20, 2025) - Added leading indicators documentation, FOMO circular flow tracking
- **v1.2.0** (Nov 19, 2025) - NVIDIA Q3 update, composite score refinement
- **v1.1.0** (Nov 17, 2025) - Dark Glassmorphism dashboard redesign
- **v1.0.0** (Nov 11, 2025) - Initial release with lagging indicators

## Contributing

This is a personal monitoring system. For questions or suggestions, please reach out via GitHub Issues.

## License

MIT License - See LICENSE file for details

## Disclaimer

This monitoring system is for informational purposes only. It does not constitute investment advice. Always conduct your own research and consult with qualified financial advisors before making investment decisions.

---

**Last Updated**: November 20, 2025
**Current Risk Level**: LOW (Lagging: 7/40, Leading: 5/48, Circular Flow: YELLOW)
**Next Major Update**: Q4 2025 Earnings Season (January/February 2026)
