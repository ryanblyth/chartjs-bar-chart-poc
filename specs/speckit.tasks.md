# speckit.tasks.md (Chart.js adaptation)

- [x] Scaffold project (Vite) and install `chart.js`.
- [x] Implement GeoJSON → table transform (compute `density` if not present).
- [x] Rank by population in JS and filter to Top 15.
- [x] Build vertical bar chart (Chart.js): x=name, y=pop; sort desc by pop.
- [x] Responsive X‑axis labels (autoSkip, rotation).
- [x] Tooltips (name, GEOID, pop with commas, density).
- [x] Optional color by density (scriptable backgroundColor; include legend note if needed).
- [x] Click selection on bars; fade unselected; dblclick clears; dispatch `chart:selection`.
- [x] Basic a11y (container role/aria-label; data table link).
- [x] **Use Chart.js built‑in animations** (duration/easing); no GSAP.
- [x] **Y‑axis number formatting** with K notation.
- [ ] Cross-browser QA (Chrome, Safari, Firefox).
