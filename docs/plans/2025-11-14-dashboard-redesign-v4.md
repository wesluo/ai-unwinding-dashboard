# AI Infrastructure Unwinding Monitor - Dashboard Redesign v4.0

**Date:** 2025-11-14
**Status:** Design Finalized - Reference-Based Design
**Previous Version:** v3.0 (light theme, 3-card hero)
**Reference:** https://ai-bubble-monitor.vercel.app/

## Design Goals

Redesign the AI Infrastructure Unwinding Monitor dashboard with:
- Clean, professional aesthetic with dark color scheme (matching reference)
- Grid-based responsive layout: flexible 3-column system for optimal space usage
- Progressive disclosure: details hidden by default, revealed via info icon popovers
- Mobile-friendly responsive design with touch-optimized interactions
- Information hierarchy through card types, sizing, and strategic use of color
- Muted dark baseline with bright lime green accents for positive metrics
- Modern, data-focused visual language inspired by financial/ops dashboards

## Key Changes from v3.0

1. **Reference-based dark theme** - Strictly following ai-bubble-monitor.vercel.app design
2. **Color palette update** - Dark charcoal background (#3d4044), lime green accents (#c0ff00)
3. **Grid layout system** - Responsive 3-column grid with flexible card spanning
4. **Card component types** - Metric cards, chart cards, and detail cards with consistent styling
5. **Professional header** - Search bar, settings icon, Download Report, AI Assistant button
6. **Enhanced typography** - Large bold metrics (48-72px) with clear hierarchy
7. **Multi-color charts** - Lime, coral, and sky blue palette for data visualization

## Core Design Principles

### 1. Progressive Disclosure
- **Default state:** Clean cards showing only essential information (title, value, trend)
- **Focused state:** Floating popovers reveal detailed descriptions, metadata, and context
- **Smart hybrid:** Hover on desktop (instant), tap on mobile (reliable)
- **No layout shifts:** Popovers overlay content without pushing other elements

### 2. Visual Aesthetic - Dark Theme

**Color Palette (matching reference):**
- Background: Dark charcoal (#3d4044) - professional, modern feel
- Cards: Slightly lighter dark (#2e3135 to #35383c depending on card type)
- Card hover: Subtle brightness increase (opacity +5%)
- Text primary: Pure white (#ffffff) - high contrast for readability
- Text secondary: Light gray (#b0b3b8) - for labels and secondary info
- Text tertiary: Muted gray (#8a8d91) - for hints and auxiliary text

**Accent Colors:**
- Positive/Success: Bright lime green (#c0ff00 / #b8e986) - for positive trends, badges
- Critical alerts: Coral red (#ef5350 / #ff6b6b) - for warnings, negative trends
- Warning/Neutral: Amber/Orange (#ffa726) - for caution states
- Info/Links: Sky blue (#64b5f6) - for interactive elements
- Chart accent: Pastel green (#90ee90), Blue (#87ceeb), Pink/Coral for multi-series

**Borders & Shadows:**
- Border: Subtle dark border (rgba(255,255,255,0.1)) - minimal use on cards
- Shadow subtle: `0 2px 4px rgba(0,0,0,0.2)` - default cards
- Shadow medium: `0 4px 8px rgba(0,0,0,0.3)` - emphasized cards
- Shadow strong: `0 8px 16px rgba(0,0,0,0.4)` - popovers and modals

**Card Design:**
- Background: Dark gray (#2e3135) for primary cards, (#35383c) for secondary
- Rounded corners: 12px for all cards (consistent)
- Subtle shadow for depth
- Very thin border (1px, rgba(255,255,255,0.08)) for card separation
- Clean, professional aesthetic with glass-like subtle elevation

**Typography:**
- Large metric numbers: 48-72px, bold (700-800), #ffffff
- Card labels: 12-13px, normal weight, #8a8d91
- Card titles: 14-16px, medium weight (500), #ffffff
- Body text: 13-15px, regular (400), #b0b3b8
- Percentage badges: 12px, bold, on colored background (#c0ff00 for positive)

**Charts:**
- Multi-color palette: Lime green (#c0ff00), Coral (#ff6b6b), Sky blue (#87ceeb)
- Gridlines: rgba(255,255,255,0.08) - very subtle
- Axes/labels: #8a8d91
- Chart background: Transparent or very subtle (#2a2d31)

### 3. Variable Information Density

Information density increases as you move down the page:

- **Hero section:** Spacious, generous padding (32-40px on large card, 24px on small cards)
- **Key sections:** Moderate density, balanced spacing (24px padding)
- **Company details:** Dense, efficient (16-20px padding), maximizes data per viewport
- **Supporting charts:** Moderate density, charts need space (20-24px padding)

This hierarchy communicates importance through spatial design.

### 4. Adaptive Charts

Charts reveal detail progressively:

- **Default:** Clean sparklines (no gridlines, minimal chrome, pattern recognition)
- **Hover/tap:** Gridlines, axes, precise tooltips fade in (200ms transition)
- **Detailed sections:** Fuller charts with subtle grids always visible
- **Smooth transitions:** 200-300ms for all state changes

## Page Structure

### Header - Top Navigation Bar

- **Behavior:** Sticky at top, always visible
- **Height:** 64px desktop, 56px mobile
- **Background:** Same as page background (#3d4044) - seamless integration
- **Content Layout (left to right):**
  - Dashboard title: "Dashboard" (32px, bold, #ffffff) - left aligned
  - Search bar: Centered (dark input field with subtle border)
  - Settings icon: Gear icon button (right side)
  - "Download Report" button: Dark button with subtle border (right side)
  - "AI Assistant" button: Bright lime green (#c0ff00) pill button with dark text (right side)
- **Search Bar Styling:**
  - Background: rgba(0,0,0,0.2)
  - Border: 1px solid rgba(255,255,255,0.1)
  - Placeholder: "Type to search for everything..." (#8a8d91)
  - Text: #ffffff
  - Border radius: 24px (pill shape)
  - Width: ~400px desktop, adjusts on tablet/mobile
- **Responsive:** On mobile, search may collapse to icon, buttons may stack or hide

### Tab Navigation

Two tabs at the top level:
- **Lagging Indicators** - Shows quarterly earnings data and confirmed signals
- **Leading Indicators** - Shows real-time market signals and predictive data

Each tab has its own dedicated hero section and content below.

### Main Content - Grid-Based Card Layout

**Layout: Responsive Grid (matching reference)**
```
Desktop (3-column grid):
┌─────────────┐ ┌──────────────────┐ ┌─────────────┐
│  Card 1     │ │   Card 2 (wide)  │ │  Card 3     │
│  (compact)  │ │   (chart/donut)  │ │  (detail)   │
└─────────────┘ └──────────────────┘ └─────────────┘
┌─────────────┐ ┌──────────────────┐
│  Card 4     │ │   Card 5 (wide)  │
│  (compact)  │ │   (chart/table)  │
└─────────────┘ └──────────────────┘
┌──────┐ ┌──────┐ [more cards...]
│ Card │ │ Card │
└──────┘ └──────┘
```

**Grid Specifications:**
- Columns: 3 on desktop (1fr 1fr 1fr), auto-fit with minmax for responsiveness
- Gap: 20px between cards (both row and column)
- Cards can span multiple columns (e.g., chart cards span 2 columns)
- Tablet: 2 columns
- Mobile: 1 column (all cards full width)

**Visual Treatment:**
- All cards: Dark background (#2e3135 or #35383c)
- Border: 1px solid rgba(255,255,255,0.08)
- Border radius: 12px (consistent)
- Shadow: 0 2px 4px rgba(0,0,0,0.2)
- Padding: 20-24px
- Gaps: 20px between cards
- No tab-specific hero sections - unified grid for all content

---

### Card Component Types (matching reference)

#### Type 1: Metric Card (Compact)
**Visual Structure:**
```
┌─────────────────────────┐
│ ⓘ                       │  ← Info icon (top right)
│ 300                     │  ← Large number (48-72px, bold, #fff)
│ +16.5%                  │  ← Percentage badge (lime green pill)
│                         │
│ Total volume of services│  ← Description (13px, #b0b3b8)
│ More detail →          │  ← Link (13px, #64b5f6)
└─────────────────────────┘
```
- Background: #2e3135 or lighter (#35383c)
- Large metric: 48-72px, bold, #ffffff
- Badge: Lime green (#c0ff00) for positive, red (#ff6b6b) for negative
- Description: 13px, #b0b3b8, 2-3 lines max
- "More detail" link: Optional, blue (#64b5f6)
- Info icon: Top right corner, clickable for popover

#### Type 2: Chart Card (Wide - spans 2 columns)
**Visual Structure:**
```
┌────────────────────────────────────┐
│ Customer Satisfaction  More detail→│
│                                    │
│     [Donut Chart or Line Chart]    │
│                                    │
│ Legend items with percentages      │
└────────────────────────────────────┘
```
- Title: 16px, medium, #ffffff, top left
- "More detail" link: Top right
- Chart: Center, takes most card space
- Legend: Below chart, with colored dots and percentages

#### Type 3: Detail Card (Stats/Comparison)
**Visual Structure:**
```
┌────────────────────────────┐
│ Corporate Year Plan        │
│                More detail→│
│ Current result             │
│ $22,567,081.00             │  ← Large number
│ ▓▓▓▓▓▓▓▓▓▓░░░░░░           │  ← Progress bar (lime)
│                            │
│ Last path  $8,432,119.00   │
│                            │
│ ┌──────────┐ ┌──────────┐ │
│ │Before AI │ │ After AI │ │  ← Sub-cards
│ └──────────┘ └──────────┘ │
└────────────────────────────┘
```
- Title: 16px, medium, #ffffff
- Large numbers: 24-32px, bold, #ffffff
- Progress bars: Lime green (#c0ff00) fill
- Sub-cards within card: Nested dark backgrounds

---

#### Leading Indicators Tab - Hero Section

**Large Primary Card:**
- **Title:** "LEADING INDICATORS" (12px, uppercase, #6b7280)
- **Score:** Composite leading score (56px, bold, color based on severity)
- **Trend:** Arrow + text (e.g., "↔ Monitoring") - 18px, #6b7280
- **Badge:** Status badge (e.g., "LOW RISK") - color-coded

**Popover Content:**
- Explains composite leading score calculation
- Scale: 0-12 (LOW), 13-24 (MODERATE), 25-36 (HIGH), 37-48 (CRITICAL)
- Data sources: GPU pricing, cloud costs, funding activity, supply chain
- Update frequency: Weekly/Monthly
- Prediction horizon: 1-3 quarters ahead
- Confidence level: Medium (predictive)

**Small Card - Left: Quantitative/Qualitative Alignment**
- **Title:** "QUANT/QUAL ALIGNMENT" (12px, uppercase, #6b7280)
- **Value:** Agreement percentage or status (e.g., "85%" or "ALIGNED") - 24px
- **Badge:** "ALIGNED" (green) or "DIVERGENT" (red) when significant gap

**Popover Content:**
- Explains dual-track validation approach
- **Quantitative:** Data-driven metrics from specific sources
- **Qualitative:** LLM research with unrestricted sources
- Why alignment matters for confidence
- What divergence means (requires investigation)

**Small Card - Right: Divergent Indicators**
- **Title:** "DIVERGENT INDICATORS" (12px, uppercase, #6b7280)
- **Value:** Count of divergent signals (e.g., "2") - 24px, #ef4444 if >0
- **Badge:** "Needs Review" if count > 0

**Popover Content:**
- Which indicators show divergence
- Why divergence requires investigation
- Link to detailed indicator cards below
- Validation protocol

---

### Content Sections Below Hero

Both tabs show their relevant content sections below the hero:

**Lagging Tab Sections:**
1. Risk Assessment Rationale
2. Phase Progression Tracker
3. Capex Trends Chart
4. AI Revenue Growth Chart
5. Active Warning Signals
6. Company Metrics (dense grid)

**Leading Tab Sections:**
1. Validation Status Overview
2. Price Signals (Primary Indicators)
3. Supply Chain Signals (Primary Indicators)
4. Financial Market Signals (Primary Indicators)
5. Activity-Based Signals (Secondary Indicators)

All sections use white cards on #f1f3f5 background with appropriate shadows.

## Interaction Design

### Popover System

**Visual Design (Dark Theme):**
- Background: Dark card (#2a2d31 or #2e3135)
- Border: 1px solid rgba(255,255,255,0.15) - slightly more visible than cards
- Shadow: 0 8px 16px rgba(0,0,0,0.4) - strong elevation
- Rounded corners: 12px
- Max width: 350px
- Padding: 20px

**Content Structure:**
```
[Title/Metric Name] (#ffffff, 16px, bold)
Description text explaining what this means... (#b0b3b8, 14px)

Last updated: Nov 14, 2025 9:30 PM (#8a8d91, 12px)
Source: Q3 2025 Earnings Report
Confidence: High
```

**Positioning:**
- Smart placement near hovered/tapped element
- Avoids screen edges (auto-repositions if needed)
- Arrow pointer to originating element (optional)
- On mobile: centers or anchors to bottom
- Slight delay on hover (150ms) to prevent accidental triggers
- No delay on tap (immediate)

**Dismissal:**
- Desktop hover: disappears when mouse leaves (200ms delay)
- Mobile tap: tap outside to close, or tap same info icon to toggle
- Keyboard: ESC key closes
- Visual indicator: Semi-transparent backdrop on mobile (rgba(0,0,0,0.3))

### Device Detection

**CSS Media Query:**
```css
@media (hover: hover) {
  /* Hover-enabled styles for desktop */
}

@media (hover: none) {
  /* Tap-only styles for mobile */
}
```

**Behavior:**
- Hover-capable devices: instant popover on hover
- Touch devices: tap to toggle popover
- Keyboard: focus + Enter/Space activates

### Chart Interactions

**Default State:**
- Clean, visible charts with subtle gridlines
- Multi-color scheme: Lime (#c0ff00), Coral/Pink (#ff6b6b), Sky Blue (#87ceeb)
- Gridlines: rgba(255,255,255,0.08) - very subtle, always visible
- Axes: #8a8d91 - muted but readable

**Chart Types:**
- **Donut/Pie Charts:** Multi-color segments with legend, center value display
- **Line Charts:** Single or multi-series with smooth curves, subtle grid
- **Bar Charts:** Vertical or horizontal, consistent color scheme

**Hover/Interaction State:**
- Tooltip appears on hover: dark background (#2a2d31), white text
- Tooltip shows: value, percentage, label
- Segment/point highlights slightly (opacity +10%)
- Crosshair or indicator line (optional)

**Legend Styling:**
- Colored dots (12px diameter) matching chart colors
- Label text: 13px, #b0b3b8
- Percentage values: 13px, #ffffff, right-aligned
- Horizontal layout below chart, or vertical if space constrained

**Implementation:**
- Chart.js 4.x for visualizations
- Custom color palette defined in config
- Responsive sizing
- Smooth animations (300ms)

## Responsive Behavior

### Breakpoints

- **Desktop:** 1024px+ (full multi-column layouts)
- **Tablet:** 768-1023px (2 columns, adjusted spacing)
- **Mobile:** <768px (single column, stacked)

### Mobile Adaptations

**Header:**
- Compact height (56px)
- Title may truncate with ellipsis
- Tabs remain visible (essential navigation)

**Hero Section:**
- All 3 cards stack vertically
- Large card maintains generous padding (32px)
- Small cards slightly reduced padding (20px)
- Full width each

**Content Sections:**
- Single column
- Charts full width, height ~250px
- Company cards single column
- Maintains readability and tap targets

**Touch Targets:**
- Minimum 44x44px touch targets on mobile
- Adequate spacing between interactive elements
- Visual feedback on tap (background change to #f8f9fa)

## Technical Considerations

### Performance

**Optimization:**
- CSS transitions for smooth animations (GPU-accelerated: transform, opacity)
- Minimal JavaScript - CSS handles most interactions
- Chart.js canvas rendering (efficient for many data points)
- Lazy-load popovers (render on first interaction)

### Accessibility

**Keyboard Navigation:**
- Tab through all interactive cards
- Enter/Space activates popovers
- ESC closes popovers
- Visible focus states (2px solid #3b82f6 outline)

**Screen Readers:**
- ARIA labels on interactive elements
- `aria-describedby` linking cards to popover content
- Semantic HTML (proper heading hierarchy)
- Alt text for status indicators

**Visual Accessibility:**
- WCAG AA contrast ratios minimum
- Color not sole indicator (icons + text + badges)
- Scalable text (rem units)
- Focus indicators for keyboard users

### Browser Support

**Target:**
- Modern evergreen browsers (Chrome, Firefox, Safari, Edge)
- Last 2 versions

**Technologies:**
- CSS Grid for layouts
- CSS Custom Properties for theming
- Flexbox for component layout
- Chart.js 4.x
- ES6+ JavaScript

## Design System Reference

### Spacing Scale
- XS: 8px
- SM: 12px
- MD: 16px
- LG: 20px
- XL: 24px
- 2XL: 32px
- 3XL: 40px

### Typography Scale
- Tiny: 12px (labels, metadata)
- Small: 13-14px (body, popovers)
- Base: 14-16px (main content)
- Medium: 18px (card subtitles)
- Large: 24px (small card values)
- XL: 32px (section headers)
- 2XL: 56px (hero large card score)

### Border Radius
- Small: 8px (badges)
- Medium: 12px (small cards, popovers)
- Large: 16px (large hero card)

### Shadows
- Subtle: `0 1px 3px rgba(0,0,0,0.08)` (small cards)
- Medium: `0 2px 8px rgba(0,0,0,0.12)` (large card)
- Strong: `0 8px 24px rgba(0,0,0,0.15)` (popovers)

### Color Application Logic

**When to show bold red (#ef4444):**
- Risk score ≥ 7/10 (high risk threshold for lagging)
- Risk score ≥ 25/48 (high risk threshold for leading)
- Multiple aligned indicators in warning state
- Divergent indicators count > 0

**Default (muted) colors:**
- All normal/moderate risk states
- Positive trends (use soft green #10b981)
- Stable metrics

## Terminology Updates

**Leading Indicators - Validation Tracking:**
- ~~Track A~~ → **Quantitative** (data-driven metrics, programmatic collection)
- ~~Track B~~ → **Qualitative** (LLM research assessment, unrestricted sources)

This terminology appears in:
- Hero card title: "Quant/Qual Alignment"
- Indicator detail cards: "Quantitative Data" and "Qualitative Assessment" sections
- Validation status displays
- Popover explanations

**Rationale:** "Quantitative/Qualitative" is immediately understandable; "Track A/B" requires explanation.

## Implementation Notes

### Tab Switching Behavior
- Tabs are in header (always visible)
- Clicking a tab shows/hides the entire tab content (hero + sections)
- Smooth fade transition (200ms)
- URL hash updates (#lagging or #leading) for bookmarking
- Default tab: Lagging Indicators

### Data Loading
- Lagging data: From `tracking_data.json`
- Leading data: From `tracking_data_leading.json`
- Both datasets loaded on page load
- Tab switching is instant (no network calls)

### Empty States
- If leading data not populated: show placeholder in leading tab
- Lagging data should always be present (required)
- Graceful handling of missing metrics (show "N/A")

## Next Steps

**Ready for Implementation:**

1. Update CSS color palette to dark theme matching reference (#3d4044, #2e3135, #c0ff00, etc.)
2. Restructure layout to responsive 3-column grid system
3. Implement card component types (metric, chart, detail)
4. Build header with search bar, settings, and AI Assistant button
5. Update chart styling with multi-color palette
6. Implement popover system with dark theme styling
7. Update terminology (Track A/B → Quantitative/Qualitative)
8. Test responsive behavior on all breakpoints (desktop, tablet, mobile)
9. Accessibility audit (keyboard navigation, screen readers, WCAG AA)
10. Visual QA for color contrast and readability

**CSS Variables to Define:**
```css
:root {
  /* Backgrounds */
  --bg-primary: #3d4044;
  --bg-card: #2e3135;
  --bg-card-alt: #35383c;
  --bg-hover: rgba(255,255,255,0.05);

  /* Text */
  --text-primary: #ffffff;
  --text-secondary: #b0b3b8;
  --text-tertiary: #8a8d91;

  /* Accents */
  --accent-positive: #c0ff00;
  --accent-negative: #ff6b6b;
  --accent-warning: #ffa726;
  --accent-info: #64b5f6;

  /* Chart colors */
  --chart-lime: #c0ff00;
  --chart-coral: #ff6b6b;
  --chart-blue: #87ceeb;
  --chart-green: #90ee90;

  /* Borders & Shadows */
  --border-subtle: rgba(255,255,255,0.08);
  --border-medium: rgba(255,255,255,0.15);
  --shadow-sm: 0 2px 4px rgba(0,0,0,0.2);
  --shadow-md: 0 4px 8px rgba(0,0,0,0.3);
  --shadow-lg: 0 8px 16px rgba(0,0,0,0.4);

  /* Spacing */
  --gap: 20px;
  --card-padding: 24px;
  --border-radius: 12px;
}
```

---

**Design approved:** v4.0 ready to proceed with implementation.

## Version History

- **v4.0** (2025-11-14): Reference-based redesign matching ai-bubble-monitor.vercel.app
  - Dark theme with #3d4044 background
  - Grid-based responsive layout
  - Lime green (#c0ff00) accent colors
  - Professional header with search and AI Assistant
  - Multi-color chart palette

- **v3.0** (2025-11-14): Light theme with 3-card hero layout
  - Cool neutral light background (#f1f3f5)
  - Single-focus tabs with dedicated hero sections
  - Soft green accents

- **v2.0**: Dark theme with 2-card hero layout
  - Original dark background (#2a2d35)
  - Two-card hero design
