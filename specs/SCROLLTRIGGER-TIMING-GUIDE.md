# ScrollTrigger Timing Control Guide

Complete guide for controlling animation speed, duration, and hold time.

## 📊 Timing Architecture

The ScrollTrigger animation has **two independent controls**:

1. **Total Scroll Distance** (`end` config) - How much scrolling from start to unpin
2. **Animation Ratio** (easing function) - What % of that distance to animate vs hold

```
┌──────────────────────────────────────────────────────────┐
│  Total Scroll Distance (from 'end' config)               │
│  ════════════════════════════════════════════════════    │
│                                                           │
│  ┌────────────────────────────┐┌─────────────────────┐   │
│  │   Animation Phase          ││   Hold Phase        │   │
│  │   (bars 0% → 100%)         ││   (bars stay 100%)  │   │
│  │   = Total × Ratio          ││   = Total × (1-Ratio)│   │
│  └────────────────────────────┘└─────────────────────┘   │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

## 🎛️ Control Points

### 1. Total Scroll Distance
**File:** `src/main.js` ~line 225  
**What it does:** Sets how many pixels to scroll from animation start to unpin

```javascript
end: '+=1000'  // 1000 pixels of scrolling total
```

### 2. Animation Ratio
**File:** `src/scroll/scrolltrigger.js` ~line 51  
**What it does:** Determines what percentage of scroll is animation vs hold

```javascript
const animationProgress = Math.min(rawProgress / 0.6, 1);
//                                                 ^^^
//                                                 This is the ratio
```

## 📐 Timing Formulas

```javascript
Animation Distance = Total Distance × Animation Ratio
Hold Distance = Total Distance × (1 - Animation Ratio)

// Example with defaults:
Total = 1000px
Ratio = 0.6

Animation = 1000 × 0.6 = 600px
Hold = 1000 × 0.4 = 400px
```

## 🎯 Common Configurations

### Quick Animation, Long Hold
**Use case:** Want bars to grow fast, then pause to appreciate

```javascript
// main.js
end: '+=1200'  // Longer total distance

// scrolltrigger.js  
const animationProgress = Math.min(rawProgress / 0.4, 1);  // Ratio 0.4

// Result:
// Animation: 1200 × 0.4 = 480px (fast)
// Hold: 1200 × 0.6 = 720px (long hold)
```

### Balanced (Default)
**Use case:** Equal emphasis on animation and hold

```javascript
// main.js
end: '+=1000'  // Medium total distance

// scrolltrigger.js
const animationProgress = Math.min(rawProgress / 0.6, 1);  // Ratio 0.6

// Result:
// Animation: 1000 × 0.6 = 600px
// Hold: 1000 × 0.4 = 400px
```

### Slow Animation, Short Hold
**Use case:** Want to watch bars grow slowly, minimal hold

```javascript
// main.js
end: '+=1000'  // Same total distance

// scrolltrigger.js
const animationProgress = Math.min(rawProgress / 0.8, 1);  // Ratio 0.8

// Result:
// Animation: 1000 × 0.8 = 800px (slow)
// Hold: 1000 × 0.2 = 200px (short hold)
```

### No Hold (Immediate Unpin)
**Use case:** Want bars to grow smoothly and unpin immediately

```javascript
// main.js
end: '+=800'  // Shorter total distance

// scrolltrigger.js
const animationProgress = Math.min(rawProgress / 1.0, 1);  // Ratio 1.0

// Result:
// Animation: 800 × 1.0 = 800px
// Hold: 800 × 0.0 = 0px (no hold)
```

## 🧮 Timing Calculator

Use this to calculate your desired timing:

```
Desired Animation Distance: _______ px
Desired Hold Distance: _______ px

Total Distance = Animation + Hold
Animation Ratio = Animation / Total

Example:
- Want 500px animation, 500px hold
- Total = 500 + 500 = 1000px
- Ratio = 500 / 1000 = 0.5

Config:
  end: '+=1000'
  ratio: 0.5
```

## 📊 Timing Table

| Total | Ratio | Animation Dist | Hold Dist | Description |
|-------|-------|---------------|-----------|-------------|
| 800px | 0.5 | 400px | 400px | Fast grow, medium hold |
| 1000px | 0.5 | 500px | 500px | Medium grow, long hold |
| 1000px | 0.6 | 600px | 400px | **Default** - balanced |
| 1000px | 0.7 | 700px | 300px | Slower grow, short hold |
| 1000px | 0.8 | 800px | 200px | Slow grow, minimal hold |
| 1200px | 0.5 | 600px | 600px | Medium grow, very long hold |
| 1500px | 0.6 | 900px | 600px | Very slow grow, long hold |
| 600px | 1.0 | 600px | 0px | Fast grow, no hold |

## 🎬 Animation Speed vs Hold Time

### To make animation FASTER:
- **Decrease** total distance (smaller `end` value)
- **Decrease** animation ratio (smaller divisor)

### To make animation SLOWER:
- **Increase** total distance (larger `end` value)  
- **Increase** animation ratio (larger divisor)

### To increase HOLD time:
- **Increase** total distance (more pixels to scroll)
- **Decrease** animation ratio (animation finishes earlier)

### To decrease HOLD time:
- **Decrease** total distance (less pixels to scroll)
- **Increase** animation ratio (animation finishes later)

## 🔍 Visual Examples

### Example 1: Very Quick Animation, Long Appreciation Time
```
Total: 1500px, Ratio: 0.4

0px    ─────────┐
              Animation
600px  ─────────┘ (bars at 100%)
              Hold/Appreciation
1500px ─────────┘ (unpin)

Result: 600px to animate, 900px to hold
Effect: Bars grow quickly, viewer has lots of time to appreciate
```

### Example 2: Slow Build, Quick Transition  
```
Total: 1000px, Ratio: 0.8

0px    ─────────┐
              Animation (slow build)
800px  ─────────┘ (bars at 100%)
              Hold
1000px ─────────┘ (unpin quickly)

Result: 800px to animate, 200px to hold
Effect: Bars grow slowly, then transition quickly to next section
```

### Example 3: Perfectly Balanced
```
Total: 1000px, Ratio: 0.6

0px    ─────────┐
              Animation
600px  ─────────┘ (bars at 100%)
              Hold
1000px ─────────┘ (unpin)

Result: 600px to animate, 400px to hold
Effect: Balanced timing - not too fast, not too slow
```

## 🛠️ How to Modify

### Step 1: Decide Your Goal
- [ ] Fast animation? Slow animation?
- [ ] Long hold? Short hold?
- [ ] Total scroll distance?

### Step 2: Calculate Values
```
Desired animation distance: _____
Desired hold distance: _____
Total = animation + hold
Ratio = animation / total
```

### Step 3: Update Code

**File: `src/main.js`** (around line 225)
```javascript
end: '+=TOTAL'  // Your calculated total
```

**File: `src/scroll/scrolltrigger.js`** (around line 51)
```javascript
const animationProgress = Math.min(rawProgress / RATIO, 1);
```

### Step 4: Test
1. Refresh page
2. Scroll through animation
3. Count scroll distance (use browser scroll position or markers)
4. Adjust if needed

## 💡 Pro Tips

1. **Start with ratio 0.6** - It's well-balanced for most use cases
2. **Adjust total distance first** - Easier to feel the difference
3. **Use markers for debugging** - Set `markers: true` to see exact triggers
4. **Test on different screen sizes** - Mobile users scroll differently
5. **Consider trackpad vs wheel** - Scrolling speed varies by input device

## 🎓 Advanced: Custom Easing Curves

The current implementation uses linear easing within the animation phase. You can modify this for more dynamic effects:

```javascript
// Current (linear)
const animationProgress = Math.min(rawProgress / 0.6, 1);

// Ease Out (fast start, slow end)
const animationProgress = rawProgress < 0.6 
  ? Math.pow(rawProgress / 0.6, 0.5)  // Square root easing
  : 1;

// Ease In (slow start, fast end)
const animationProgress = rawProgress < 0.6
  ? Math.pow(rawProgress / 0.6, 2)    // Quadratic easing
  : 1;

// Ease In-Out (slow start and end, fast middle)
const animationProgress = rawProgress < 0.6
  ? Math.sin((rawProgress / 0.6) * (Math.PI / 2))
  : 1;
```

## 📚 Related Documentation

- **[scrolltrigger-animation.spec.yml](./scrolltrigger-animation.spec.yml)** - Complete technical specification
- **[SCROLLTRIGGER-QUICK-REF.md](./SCROLLTRIGGER-QUICK-REF.md)** - Quick reference guide
- **[MAINTENANCE.md](../MAINTENANCE.md)** - General maintenance guide

