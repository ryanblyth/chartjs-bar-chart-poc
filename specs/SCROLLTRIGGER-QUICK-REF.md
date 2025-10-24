# ScrollTrigger Animation - Quick Reference

## 📋 TL;DR

Bars animate from 0 to full height as you scroll. Y-axis stays fixed. Chart pins during animation.

## 🎯 Key Behavior

| Aspect | Behavior |
|--------|----------|
| **Y-Axis Scale** | Fixed at `max(data) × 1.1`, never changes |
| **Bar Heights** | Animate from 0% to 100% of their data value |
| **Chart Position** | Pins in viewport during animation |
| **Scroll Distance** | 600px of scrolling for full animation |
| **Start Trigger** | Chart top reaches 100px from viewport top |

## ⚙️ Configuration (src/main.js)

```javascript
enableScrollTrigger(this.chart, {
  trigger: '.chart-container',
  start: 'top top+=100px',  // When to start
  end: '+=600',              // How long to animate
  scrub: 1,                  // Smoothing delay
  pin: true,                 // Pin during animation
  markers: false             // Debug markers
})
```

## 🔧 Quick Adjustments

### Adjust Total Scroll Distance
**File:** `src/main.js` line ~225
```javascript
end: '+=800'   // Shorter (480px animate, 320px hold)
end: '+=1000'  // Default (600px animate, 400px hold)
end: '+=1500'  // Longer (900px animate, 600px hold)
```

### Adjust Animation vs Hold Ratio
**File:** `src/scroll/scrolltrigger.js` line ~51
```javascript
// Current: 60% animation, 40% hold
const animationProgress = Math.min(rawProgress / 0.6, 1);

// More hold time: 50% animation, 50% hold
const animationProgress = Math.min(rawProgress / 0.5, 1);

// Less hold time: 70% animation, 30% hold  
const animationProgress = Math.min(rawProgress / 0.7, 1);

// No hold: 100% animation, 0% hold (immediate unpin)
const animationProgress = Math.min(rawProgress / 1.0, 1);
```

### Timing Calculation
```
Total Distance = 1000px (from 'end' config)
Animation Ratio = 0.6 (from code)

Animation Distance = 1000 × 0.6 = 600px
Hold Distance = 1000 × (1 - 0.6) = 400px
```

### Start Position Adjustments
**File:** `src/main.js` line ~224
```javascript
start: 'top top'              // Flush to top (no gap when pinned)
start: 'top center'           // Start when chart center hits viewport center
start: 'top top+=100px'       // Start 100px from top (creates gap)
start: 'top bottom-=200px'    // Start before chart reaches top
```

### Other Controls
```javascript
pin: false      // Disable pinning (chart scrolls normally)
markers: true   // Show visual debug markers
scrub: 2        // Slower/smoother scrubbing (2 second delay)
```

## 🐛 Debugging

### Check if ScrollTrigger is Loaded
Open console and look for:
```
ScrollTrigger enabled - loading GSAP and ScrollTrigger
ScrollTrigger loaded and ready
ScrollTrigger is now available
ScrollTrigger enabled for chart with pinning
```

### View Trigger Points
Set `markers: true` in configuration to see visual indicators

### Check Y-Axis Max Value
In console:
```javascript
chart.options.scales.y.max  // Should be a fixed number
```

### Check Original Data
In console:
```javascript
chart._originalData  // Should show array of original values
chart._maxValue      // Should show the fixed Y-axis max
```

## 📁 Key Files

| File | Purpose |
|------|---------|
| `src/scroll/scrolltrigger.js` | ScrollTrigger logic, data scaling |
| `src/chartjs/buildChart.js` | Fixed Y-axis, store original data |
| `src/main.js` | ScrollTrigger initialization, config |
| `specs/scrolltrigger-animation.spec.yml` | Full specification |

## 🔄 How It Works

1. **Chart loads**: Store original data, set fixed Y-axis, bars at 0
2. **User scrolls down**: Chart enters viewport
3. **Chart top hits trigger point**: Animation starts, chart pins
4. **User scrolls 600px**: Bars grow from 0 to 100%, Y-axis stays fixed
5. **Animation complete**: Pin releases, normal scrolling resumes

## 🎨 Visual Example

```
Scroll Position 0px    : Bars at 0% height
Scroll Position 150px  : Bars at 25% height
Scroll Position 300px  : Bars at 50% height  
Scroll Position 450px  : Bars at 75% height
Scroll Position 600px  : Bars at 100% height (animation complete)
```

## ⚠️ Common Issues

### Bars animate before scrolling to chart
- Check `start` value - should be `'top top+=100px'` or similar
- Make sure chart isn't at top of page on load

### Y-axis numbers changing during scroll
- Check `chart.options.scales.y.max` is set to fixed value
- Ensure `maxYValue` is enforced in `onUpdate` callback

### Chart not pinning
- Verify `pin: true` in configuration
- Check CSS doesn't have conflicting `position` rules on `.chart-container`

### Animation too fast/slow
- Adjust `end` value (lower = faster, higher = slower)
- Default is `'+=600'` (600px of scrolling)

### Bars don't return to 0 on scroll up
- This is expected behavior (scrubbing works both directions)
- Scroll up and bars will shrink back to 0

## 🚀 Enable/Disable

### Enable ScrollTrigger
Add class to `<body>` tag:
```html
<body class="scrolltrigger-enabled">
```

Or use URL parameter:
```
http://localhost:5173/?scrolltrigger=true
```

### Disable ScrollTrigger
Remove class or parameter - chart will use standard Chart.js animations

## 📊 Data Flow

```
Original Data (715522, 478961, 386261...)
         ↓
On Scroll Progress = 0.5
         ↓
Scaled Data = Original × 0.5 (357761, 239480, 193130...)
         ↓
Chart Updates (Y-axis max stays at 787674)
         ↓
Bars render at 50% height
```

## 🔗 Full Documentation

See **[scrolltrigger-animation.spec.yml](./scrolltrigger-animation.spec.yml)** for complete specification including:
- Technical implementation details
- All configuration options
- Test scenarios
- Edge cases
- Performance notes
- Future enhancements

