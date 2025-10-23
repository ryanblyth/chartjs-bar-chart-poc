# speckit.plan.md (Chart.js adaptation)

## Objective
Build a **vertical** Chart.js bar chart of **Top 15 by population** from a Colorado places GeoJSON.
Bars are sorted by population (descending). Optionally color bars by density (/mi²).
Click selection emits `chart:selection` with selected GEOIDs for map coordination.

## MVP Scope
- Data pipeline: GeoJSON FeatureCollection → table rows `{ geoid, name, pop, density }`.
- Rank by population; filter to top 15; sort descending.
- Vertical bars (Chart.js): x = name (category), y = population (linear).
- Tooltips (name, GEOID, pop, density), responsive X‑axis labels (angle, auto-skip).
- Optional color by density (sequential ramp computed in JS).
- Selection + CustomEvent `chart:selection` (click on bar toggles selection).
- **Chart animations**: use **Chart.js built‑in animations** for initial draw/update; do **not** use GSAP for these.
  - Default: bars grow from baseline with easeOutQuart (configurable).

## Non‑Goals
- Multi‑view dashboards, server rendering, persistence.

## Success Criteria
- Exactly 15 bars render (top 15 by pop), correctly sorted.
- `chart:selection` fires with accurate `geoids` (single/multi-select optional).
- Basic accessibility and keyboard operability (focusable container, ARIA label, data table link).
- **Smooth built‑in animations** (no GSAP) on initial draw and data updates.
- **Y‑axis number formatting** with K notation for thousands.
