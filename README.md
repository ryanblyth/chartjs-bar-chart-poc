# Colorado Cities Chart.js Bar Chart

A responsive, interactive bar chart showing the Top 15 Colorado cities by population, built with Chart.js v4.x. Features click selection, density-based coloring, mobile scroll, and CSV export.

## 🚀 Features

- **Interactive Bar Chart**: Click bars to select cities, double-click to clear selection
- **Population Data**: Top 15 Colorado cities sorted by population  
- **Density Coloring**: Optional color coding by population density
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Mobile Scroll**: Horizontal scroll on mobile devices (≤480px)
- **Accessibility**: ARIA labels, keyboard navigation, high contrast support
- **Data Export**: Download selected data as CSV
- **Smooth Animations**: Chart.js built-in animations with staggered bar reveals
- **Configurable**: Easy to customize colors, fonts, animations, and mobile behavior

## 📱 Mobile Features

- **Responsive Layout**: Chart adapts to screen size
- **Horizontal Scroll**: 480px fixed width on mobile with scroll indicator
- **Touch-Friendly**: Optimized for touch interactions
- **Configurable Scroll**: Enable/disable mobile scroll via CSS classes

## Quick Start

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Static Server

If you prefer a static server without Vite:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## 📁 Project Structure

```
├── index.html                           # Main HTML file
├── src/
│   ├── main.js                          # Application entry point
│   ├── styles.css                       # Responsive CSS styles
│   ├── chartjs/
│   │   ├── buildChart.js                # Chart.js configuration
│   │   └── theme.js                     # Colors, formatters, utilities
│   └── utils/
│       ├── mobile.js                    # Mobile scroll & responsive logic
│       └── csv.js                       # CSV export utilities
├── data/
│   └── colorado-cities-enriched.geojson # Sample data
├── specs/                               # Project specifications
│   ├── speckit.build.yml                # Build requirements
│   ├── speckit.plan.md                 # Project plan
│   └── speckit.tasks.md                 # Task list
├── MAINTENANCE.md                       # Maintenance guide
└── package.json
```

## 🛠️ Configuration

### Mobile Scroll Control
```html
<!-- Enable mobile scroll (default) -->
<div class="chart-container mobile-scroll">

<!-- Disable mobile scroll -->
<div class="chart-container no-horizontal-mobile-scroll">
```

### Animation Control
Edit `src/chartjs/buildChart.js`:
```javascript
// Disable animations
animation: false,

// Custom animation
animation: {
  duration: 1200,
  easing: 'easeInOut',
  delay: (ctx) => ctx.dataIndex * 100
}
```

See [MAINTENANCE.md](./MAINTENANCE.md) for detailed configuration options.

## How to Embed in Any CMS

### Option 1: Standalone HTML

Copy the built files to your server and include:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Colorado Cities Chart</title>
    <link rel="stylesheet" href="src/styles.css">
</head>
<body>
    <div class="chart-container" role="img" aria-label="Bar chart showing top 15 Colorado cities by population">
        <div class="chart-wrap">
            <canvas id="chart"></canvas>
        </div>
        <div class="chart-controls">
            <button id="download-csv" class="btn">Download data (CSV)</button>
            <p class="data-source">Data source: Colorado cities GeoJSON</p>
        </div>
    </div>
    
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.min.js"></script>
    <script type="module" src="src/main.js"></script>
</body>
</html>
```

### Option 2: Iframe Embed

```html
<iframe 
    src="path/to/your/chart.html" 
    width="100%" 
    height="600" 
    frameborder="0"
    title="Colorado Cities Population Chart">
</iframe>
```

### Option 3: WordPress/Other CMS

1. Upload the built files to your server
2. Create a new page/post
3. Add this HTML block:

```html
<div class="colorado-chart-embed">
    <div class="chart-container" role="img" aria-label="Bar chart showing top 15 Colorado cities by population">
        <div class="chart-wrap">
            <canvas id="chart"></canvas>
        </div>
        <div class="chart-controls">
            <button id="download-csv" class="btn">Download data (CSV)</button>
            <p class="data-source">Data source: Colorado cities GeoJSON</p>
        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.min.js"></script>
<script type="module" src="path/to/src/main.js"></script>
```

## 🎨 Customization

### Change Colors
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

### Change Fonts
Edit `src/chartjs/theme.js`:
```javascript
fonts: {
  family: 'system-ui, -apple-system, sans-serif',
  size: 12,           // Desktop font size
  mobileSize: 10      // Mobile font size
}
```

### Change Animation
Edit `src/chartjs/buildChart.js`:
```javascript
animation: {
  duration: 1200,                    // Slower animation
  easing: 'easeInOut',              // Different easing
  delay: (ctx) => ctx.dataIndex * 100 // Longer delay
}
```

### Mobile Breakpoints
Edit `src/utils/mobile.js`:
```javascript
export function isMobile() {
  return window.innerWidth <= 480;  // Change breakpoint
}
```

For detailed customization options, see [MAINTENANCE.md](./MAINTENANCE.md).

## 🔌 API Events

The chart dispatches custom events you can listen to:

```javascript
// Listen for selection changes
window.addEventListener('chart:selection', (event) => {
  const { geoids } = event.detail;
  console.log('Selected cities:', geoids);
  // Update your map or other components
});
```

## 📊 Data Format

The chart expects GeoJSON with this structure:

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "GEOID": "08031",
        "NAME": "Denver", 
        "pop": 715522,
        "density": 4689.2
      }
    }
  ]
}
```

## 🌐 Browser Support

- Chrome 60+
- Firefox 55+  
- Safari 12+
- Edge 79+

## 📚 Documentation

- **[MAINTENANCE.md](./MAINTENANCE.md)** - Detailed maintenance and configuration guide
- **[specs/](./specs/)** - Project specifications and requirements

## 📄 License

MIT License - feel free to use in your projects.