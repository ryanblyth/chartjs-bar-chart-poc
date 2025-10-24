# Chart Maintenance Guide

This guide explains how to configure and maintain the Colorado Cities Chart.js application.

## 🎛️ Configuration Options

### Mobile Scrolling Control

#### Enable/Disable Mobile Scroll
Add or remove the `mobile-scroll` class on the `.chart-container` element:

```html
<!-- Enable mobile scroll (default on mobile) -->
<div class="chart-container mobile-scroll">
  <canvas id="chart"></canvas>
</div>

<!-- Disable mobile scroll -->
<div class="chart-container">
  <canvas id="chart"></canvas>
</div>
```

#### Disable Mobile Scroll Globally
Add the `no-horizontal-mobile-scroll` class to disable mobile scroll:

```html
<div class="chart-container no-horizontal-mobile-scroll">
  <canvas id="chart"></canvas>
</div>
```

#### Programmatic Control
Use the `toggleMobileScroll()` function in the browser console:

```javascript
// Enable mobile scroll
toggleMobileScroll(true);

// Disable mobile scroll  
toggleMobileScroll(false);
```

### Chart.js Animation Control

#### Disable All Animations
Edit `src/chartjs/buildChart.js` line 68:

```javascript
// Disable all animations
animation: false,
```

#### Modify Animation Duration
Edit `src/chartjs/buildChart.js` lines 68-72:

```javascript
animation: {
  duration: 0,        // No animation
  // OR
  duration: 2000,     // Slower animation (2 seconds)
  // OR
  duration: 300,      // Faster animation
  easing: 'easeOutQuart',
  delay: (ctx) => ctx.dataIndex * 50
}
```

#### Conditional Animations (Mobile vs Desktop)
```javascript
animation: isMobile() ? false : {
  duration: 900,
  easing: 'easeOutQuart', 
  delay: (ctx) => ctx.dataIndex * 50
}
```

#### Different Easing Options
```javascript
animation: {
  duration: 900,
  easing: 'linear',        // Linear animation
  // OR
  easing: 'easeInOut',     // Smooth start/end
  // OR  
  easing: 'easeIn',        // Slow start
  delay: (ctx) => ctx.dataIndex * 50
}
```

## 🔧 Common Maintenance Tasks

### Update Chart Data
1. Replace `data/colorado-cities-enriched.geojson` with new data
2. Ensure GeoJSON has `properties.name`, `properties.pop`, and `properties.density`
3. Refresh the page to load new data

### Modify Chart Colors
Edit `src/chartjs/theme.js`:

```javascript
export const chartTheme = {
  colors: {
    primary: '#3B82F6',      // Main bar color
    selected: '#EF4444',     // Selected bar color  
    unselected: '#E5E7EB',   // Unselected bar color
    border: '#6B7280',       // Bar border color
    text: '#374151',         // Text color
    grid: '#E5E7EB'          // Grid lines
  }
}
```

### Adjust Mobile Breakpoints
Edit `src/utils/mobile.js`:

```javascript
export function isMobile() {
  return window.innerWidth <= 480;  // Change 480 to your breakpoint
}
```

### Update Font Sizes
Edit `src/chartjs/theme.js`:

```javascript
fonts: {
  family: 'system-ui, -apple-system, sans-serif',
  size: 12,           // Desktop font size
  mobileSize: 10      // Mobile font size
}
```

## 🐛 Troubleshooting

### Chart Not Loading
1. Check browser console for errors
2. Verify `data/colorado-cities-enriched.geojson` exists
3. Ensure Chart.js components are registered in `buildChart.js`

### Mobile Scroll Not Working
1. Check if `.chart-container` has `mobile-scroll` class
2. Verify viewport width is ≤480px
3. Check for `no-horizontal-mobile-scroll` class (disables scroll)

### Animations Not Working
1. Check `animation` config in `buildChart.js`
2. Verify `duration` is not 0 or `false`
3. Test in different browsers

### Performance Issues
1. Disable animations: `animation: false`
2. Reduce data points (fewer cities)
3. Simplify color calculations

## 📱 Mobile Testing

### Test Mobile Features
1. Open browser dev tools
2. Toggle device toolbar (mobile view)
3. Set width to 480px or less
4. Test horizontal scroll functionality

### Mobile Scroll Indicators
- Scroll indicator appears when chart is wider than container
- Indicator hides when scrolled or at end
- Controlled by `updateScrollIndicator()` function

## 🎨 Customization Examples

### Custom Color Scheme
```javascript
// In theme.js
colors: {
  primary: '#10B981',    // Green theme
  selected: '#F59E0B',    // Amber selection
  unselected: '#F3F4F6', // Light gray
  border: '#9CA3AF',
  text: '#1F2937',
  grid: '#E5E7EB'
}
```

### Custom Animation Timing
```javascript
// In buildChart.js
animation: {
  duration: 1200,                    // Slower
  easing: 'easeInOutCubic',          // Custom easing
  delay: (ctx) => ctx.dataIndex * 100 // Longer delay
}
```

### Responsive Font Scaling
```javascript
// In buildChart.js - x.ticks.font.size
font: {
  size: isMobile() ? 8 : 12  // Smaller mobile fonts
}
```

## 🔄 Update Process

1. **Data Updates**: Replace GeoJSON file
2. **Code Changes**: Edit source files in `src/`
3. **Test**: Refresh browser to see changes
4. **Build**: Run `npm run build` for production
5. **Deploy**: Copy `dist/` folder to server

## 📋 File Structure

```
src/
├── chartjs/
│   ├── buildChart.js    # Chart configuration & creation
│   └── theme.js         # Colors, fonts, formatting
├── utils/
│   ├── mobile.js        # Mobile scroll & responsive logic
│   └── csv.js          # CSV download functionality
├── main.js             # App initialization
└── styles.css          # Responsive styles
```

## 🚀 Performance Tips

- Keep GeoJSON file size reasonable (<1MB)
- Use `animation: false` for large datasets
- Minimize color calculations in `backgroundColor` functions
- Test on actual mobile devices for scroll performance
