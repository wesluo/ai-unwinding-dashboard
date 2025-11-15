# AI Infrastructure Unwinding Monitor - Dashboard Redesign

**Date:** 2025-11-14
**Status:** Design Complete, Ready for Implementation

## Design Goals

Redesign the AI Infrastructure Unwinding Monitor dashboard with:
- Clean, professional monitoring/ops aesthetic
- Progressive disclosure: details hidden by default, revealed on hover/tap
- Mobile-friendly responsive design
- Information hierarchy through variable density
- Muted baseline with bold colors only for critical alerts

## Core Design Principles

### 1. Progressive Disclosure
- **Default state:** Clean cards showing only essential information (title, value, trend)
- **Focused state:** Floating popovers reveal detailed descriptions, metadata, and context
- **Smart hybrid:** Hover on desktop (instant), tap on mobile (reliable)
- **No layout shifts:** Popovers overlay content without pushing other elements

### 2. Visual Aesthetic
Inspired by modern business dashboards but adapted for monitoring/ops use.

**Color Palette:**
- Background: Soft dark gray (#2a2d35) - warmer than pure black
- Cards: Slightly lighter (#363940) with subtle elevation/shadow
- Text primary: Light gray (#e5e7eb)
- Text secondary: Muted gray (#9ca3af)
- Muted accent: Soft green (#6ee7b7) for positive indicators
- Critical alerts: Bold red (#ef4444) only when high-risk thresholds hit
- Charts: Muted blues and teals for normal state

**Card Design:**
- Rounded corners (12-16px radius)
- Subtle shadow for depth
- No borders or minimal 1px in very subtle gray
- Background contrast for separation, not lines
- Clean, modern aesthetic

**Typography:**
- Metric numbers: 48-64px, bold
- Card labels: 12-14px, uppercase, tracked spacing, muted
- Body text: 14-16px, regular
- Popover text: 13-14px, muted, tighter line-height

### 3. Variable Information Density

Information density increases as you move down the page:

- **Hero section:** Spacious, generous padding (32-40px), breathing room
- **Key section:** Moderate density, balanced spacing (24px padding)
- **Company details:** Dense, efficient (16-20px padding), maximizes data per viewport
- **Supporting charts:** Moderate density, charts need space

This hierarchy communicates importance through spatial design.

### 4. Adaptive Charts

Charts reveal detail progressively:

- **Default:** Clean sparklines (no gridlines, minimal chrome, pattern recognition)
- **Hover/tap:** Gridlines, axes, precise tooltips fade in
- **Detailed sections:** Fuller charts with subtle grids always visible
- **Smooth transitions:** 200-300ms for all state changes

## Page Structure

### Header - Collapsible Navigation
- **Behavior:** Scrolls away when moving down, reappears immediately on upward scroll
- **Height:** 60-70px (minimal to maximize content)
- **Content:**
  - Dashboard title: "AI Infrastructure Unwinding Monitor"
  - Current timestamp/last updated
  - Key action button (Export/Download)
- **Responsive:** Compact on mobile (56px), title may truncate

### Hero Section - Risk Overview

Two large cards side-by-side showing the most critical status.

**Layout:**
- 50/50 split on desktop
- Stack vertically on mobile
- Spacious padding (32-40px)
- Clear visual hierarchy

**Left Card - Lagging Indicators:**
- Small label: "LAGGING INDICATORS" (12px, uppercase, muted)
- Large score number (48-64px, bold)
- Trend indicator: arrow + percentage (e.g., "↑ +15%")
- Status badge: "STABLE" / "ELEVATED" / "WARNING"
- Color: Muted unless critical threshold hit

**Right Card - Leading Indicators:**
- Same structure as lagging
- "LEADING INDICATORS" label
- Independent score, trend, status
- Can show different state than lagging

**Hover/Tap Popover:**
- Explanation of lagging vs leading indicators
- Calculation methodology (brief)
- Data sources (quarterly reports vs real-time signals)
- Last updated timestamp
- Confidence level

### Key Section - Mixed Layout

Side-by-side on desktop, stacked on mobile. Provides immediate supporting evidence.

**Left: Primary Chart (60% width desktop)**
- Title: Key metric name (e.g., "AI Infrastructure Spending Trend")
- Clean sparkline by default (no gridlines/axes)
- Shows 6-12 months trend
- Height: ~300-350px
- Moderate padding (24px)

**Hover/Tap:**
- Gridlines and axes fade in
- Interactive tooltip at cursor
- Popover with:
  - Chart description and significance
  - Data sources and methodology
  - Last updated
  - Trend analysis (e.g., "Down 23% from peak")

**Right: Key Market Signals (40% width desktop)**
- 3-5 most important current signals
- Compact vertical stack
- Each signal shows:
  - Title (14px, medium weight)
  - Status indicator (colored dot/icon)
  - No description by default
- Tight spacing (12-16px gaps)

**Signal Hover/Tap:**
- Popover reveals:
  - Full description
  - Current status details
  - Data source and last updated
  - Why it matters for unwinding detection

### Company Details Section - Dense Drill-Down

Grid of company cards, information-dense for efficiency.

**Layout:**
- 2-3 columns on desktop (responsive to viewport)
- Single column on mobile
- Modest padding (16-20px)
- Fits 4-6 companies without scrolling

**Company Card Structure:**
- **Header:** Company name (18px, bold) + risk badge
- **Metrics grid:** 3-4 key metrics per company
  - Row format: Label (muted) | Value + trend arrow
  - Tight spacing (8-10px between rows)
  - Small font (13-14px) for density
  - Subtle separators between rows

**Hover/Tap on Metric:**
- Popover explaining:
  - What metric measures
  - Why it matters for AI unwinding
  - Quarter-over-quarter details
  - Data source (earnings report reference)
  - Confidence level

**Hover/Tap on Company Header:**
- Company overview popover:
  - Role in AI infrastructure
  - Overall assessment
  - Latest earnings date
  - Link to full report

**Visual Treatment:**
- Minimal color: only risk badges and critical values
- Clean through consistent structure
- Efficient data presentation

### Additional Charts Section

Grid of supporting visualizations.

**Layout:**
- 2 columns on desktop, stacked on mobile
- Medium height (~250-300px per chart)
- Moderate padding (20-24px)
- 16-20px gaps between cards
- Fits 4-6 charts on desktop viewport

**Chart Types:**
- Capex Growth by Quarter
- GPU Pricing Trends
- Cloud Pricing Index
- Startup Funding Volume
- Other relevant metrics

**Default State:**
- Sparkline style (minimal chrome)
- Focus on pattern/shape recognition
- Muted colors (blues, teals, grays)
- No gridlines, minimal axes

**Hover/Tap:**
- Full detail: gridlines, axes, labels
- Interactive tooltip
- Popover with:
  - Chart description and methodology
  - Key insights ("Up 45% YoY")
  - Data sources and frequency
  - Last updated

## Interaction Design

### Popover System

**Visual Design:**
- Matches card aesthetic (rounded corners, shadow)
- Slightly elevated with stronger shadow
- White/light text on dark background
- Max width: ~300-400px
- Padding: 16-20px

**Content Structure:**
```
[Title/Metric Name]
Description text explaining what this means...

Last updated: Nov 14, 2025 9:30 PM
Source: Q3 2025 Earnings Report
Confidence: High
```

**Positioning:**
- Smart placement near hovered element
- Avoids screen edges (repositions if needed)
- On mobile: may center or anchor to bottom
- Slight delay on hover (100ms) to prevent accidental triggers
- No delay on tap (immediate)

**Dismissal:**
- Desktop hover: disappears when mouse leaves
- Mobile tap: tap outside or X button to close
- Keyboard: ESC key closes

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
- Minimal visual noise
- Pattern recognition focus
- Muted colors

**Focused State (hover/tap):**
- Gridlines fade in (200ms transition)
- Axes become visible
- Tooltip follows cursor (desktop) or shows at tap point (mobile)
- Chart description popover appears

**Implementation:**
- Chart.js for visualizations
- Custom hover handlers
- Coordinate popover with chart tooltip

## Responsive Behavior

### Breakpoints

- **Desktop:** 1024px+ (full multi-column layouts)
- **Tablet:** 768-1023px (2 columns, adjusted spacing)
- **Mobile:** <768px (single column, stacked)

### Mobile Adaptations

**Header:**
- Compact height (56px)
- Title may truncate with ellipsis
- Action button may collapse to icon

**Hero Section:**
- Cards stack vertically
- Maintain generous padding
- Full width each

**Key Section:**
- Chart stacks above signals
- Each takes full width
- Chart height reduces slightly (~250px)

**Company Cards:**
- Single column
- Slightly reduced padding (12-16px)
- Maintains metric grid structure

**Charts Grid:**
- Single column
- Full width per chart
- Consistent height (~250px)

**Popovers:**
- May center on screen for small viewports
- Or anchor to bottom sheet style
- Ensure doesn't extend off screen

### Touch Targets

- Minimum 44x44px touch targets on mobile
- Adequate spacing between interactive elements
- Visual feedback on tap (subtle highlight)

## Technical Considerations

### Performance

**Optimization:**
- CSS transitions for smooth animations (GPU-accelerated: transform, opacity)
- Lazy-load popovers (don't render until needed)
- Debounce hover events (prevent jank on rapid mouse movement)
- Chart.js canvas rendering (efficient for many data points)
- Minimal JavaScript - CSS handles most hover states

**Loading:**
- Progressive rendering: hero → key section → details
- Skeleton screens while data loads
- Graceful degradation if data unavailable

### Accessibility

**Keyboard Navigation:**
- Tab through all interactive cards
- Enter/Space activates popovers
- ESC closes popovers
- Visible focus states (outline or highlight)

**Screen Readers:**
- ARIA labels on interactive elements
- `aria-describedby` linking cards to popover content
- Semantic HTML (proper heading hierarchy)
- Alt text for status indicators

**Visual Accessibility:**
- Sufficient contrast ratios (WCAG AA minimum)
- Color not sole indicator (icons + text accompany color)
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

**Graceful Degradation:**
- No hover capability → defaults to tap/click
- No CSS Grid → fallback to flexbox
- No custom properties → fallback colors

## Implementation Notes

### Color Threshold Logic

**When to show bold red:**
- Risk score ≥ 7/10 (high risk threshold)
- Multiple aligned indicators in warning state
- Rapid deterioration in key metrics

**Default (muted) colors:**
- All normal/moderate risk states
- Positive trends
- Stable metrics

**Color application:**
- Risk badges
- Trend indicators when critical
- Chart lines when crossing thresholds
- Status dots in signals

### Data Updates

**Update frequency:**
- Lagging indicators: Quarterly (after earnings)
- Leading indicators: Weekly/daily (market signals)
- Charts: Varies by data source
- Company metrics: Quarterly

**Timestamp display:**
- "Last updated: Nov 14, 2025 9:30 PM" format
- Show in header (overall dashboard)
- Show in popovers (specific metric)
- Relative time for recent updates ("2 hours ago")

### Popover Content Guidelines

**Structure:**
- Title (if different from card)
- 2-3 sentence description (clear, concise)
- Key data point or insight
- Metadata block (source, timestamp, confidence)

**Tone:**
- Professional, informative
- Avoid jargon where possible
- Explain why it matters
- Link context to AI unwinding detection

**Length:**
- Descriptions: 40-80 words
- Keep scannable
- Use line breaks for readability

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
- Tiny: 12px (labels)
- Small: 13-14px (body, popovers)
- Base: 14-16px (main content)
- Large: 18px (card titles)
- XL: 24px (section headers)
- 2XL: 48-64px (hero metrics)

### Border Radius
- Small: 8px
- Medium: 12px
- Large: 16px
- Pills: 20px (badges)

### Shadows
- Subtle: `0 1px 3px rgba(0,0,0,0.3)`
- Medium: `0 4px 6px rgba(0,0,0,0.4)`
- Strong: `0 10px 25px rgba(0,0,0,0.5)` (popovers)

## Next Steps

### Ready for Implementation

This design is complete and validated. To implement:

1. **Create implementation plan** - Use superpowers:writing-plans to break down into detailed tasks
2. **Set up development environment** - Use superpowers:using-git-worktrees for isolated workspace
3. **Implement in phases:**
   - Phase 1: New visual system and card structure
   - Phase 2: Popover system and progressive disclosure
   - Phase 3: Responsive behavior and mobile optimization
   - Phase 4: Accessibility and polish

4. **Testing:**
   - Visual QA across breakpoints
   - Interaction testing (hover, tap, keyboard)
   - Accessibility audit
   - Performance testing

### Open Questions

None - design is complete and ready to implement.

---

**Design approved:** Ready to proceed with implementation planning.
