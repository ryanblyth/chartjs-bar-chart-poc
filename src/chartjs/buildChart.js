import { formatK, comma, makeDensityRamp, chartTheme } from './theme.js';
import { isMobile } from '../utils/mobile.js';
import { Chart, CategoryScale, LinearScale, BarElement, BarController, Title, Tooltip, Legend } from 'chart.js';

// Register required components
Chart.register(CategoryScale, LinearScale, BarElement, BarController, Title, Tooltip, Legend);

/**
 * Create a Chart.js bar chart for Top 15 Colorado cities
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @param {Object} model - Data model with labels, values, densities, geoids
 * @param {Object} opts - Chart options
 * @returns {Chart} Chart.js instance
 */
export function createTop15Chart(canvas, model, opts = {}) {
  const { labels, values, densities, geoids } = model;
  
  
  // Create density color ramp if densities are available
  let densityRamp = null;
  if (densities && densities.some(d => d != null)) {
    const validDensities = densities.filter(d => d != null);
    if (validDensities.length > 0) {
      const minDensity = Math.min(...validDensities);
      const maxDensity = Math.max(...validDensities);
      densityRamp = makeDensityRamp(minDensity, maxDensity);
    }
  }
  
  // Selection state
  const selected = new Set();
  
  // Chart configuration - simplified for debugging
  const config = {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Population',
        data: values,
        backgroundColor: (ctx) => {
          const i = ctx.dataIndex;
          const base = densityRamp && densities[i] != null 
            ? densityRamp(densities[i]) 
            : chartTheme.colors.primary;
          
          // Apply selection highlighting
          if (selected.size > 0 && !selected.has(geoids[i])) {
            return chartTheme.colors.unselected;
          }
          
          return base;
        },
        borderColor: (ctx) => {
          const i = ctx.dataIndex;
          return selected.has(geoids[i]) 
            ? chartTheme.colors.selected 
            : chartTheme.colors.border;
        },
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      
      // Chart.js built-in animations (use default)
      animation: {
        duration: 900,
        easing: 'easeOutQuart',
        delay: (ctx) => ctx.dataIndex * 50
      },
      
      // Scales configuration
      scales: {
        x: {
          ticks: {
            autoSkip: true,
            maxRotation: 40,
            minRotation: 0,
            font: {
              family: chartTheme.fonts.family,
              size: isMobile() ? chartTheme.fonts.mobileSize : chartTheme.fonts.size
            },
            color: chartTheme.colors.text
          },
          grid: {
            display: false
          }
        },
        y: {
          beginAtZero: true,
          ticks: {
            callback: formatK,
            font: {
              family: chartTheme.fonts.family,
              size: isMobile() ? chartTheme.fonts.mobileSize : chartTheme.fonts.size
            },
            color: chartTheme.colors.text
          },
          grid: {
            color: chartTheme.colors.grid,
            drawBorder: false
          }
        }
      },
      
      // Plugins
      plugins: {
        legend: {
          display: false
        },
        
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: 'white',
          bodyColor: 'white',
          borderColor: chartTheme.colors.border,
          borderWidth: 1,
          cornerRadius: 6,
          displayColors: false,
          callbacks: {
            title: (context) => {
              const index = context[0].dataIndex;
              return `${labels[index]} (${geoids[index]})`;
            },
            label: (context) => {
              const index = context.dataIndex;
              const population = comma(values[index]);
              const density = densities[index];
              
              if (density != null) {
                return `Population: ${population} (${Math.round(density)}/mi²)`;
              }
              return `Population: ${population}`;
            }
          }
        }
      }
    }
  };
  
  // Create chart instance
  const chart = new Chart(canvas, config);
  
  // Add click handler for selection
  canvas.addEventListener('click', (evt) => {
    const elements = chart.getElementsAtEventForMode(evt, 'nearest', { intersect: true }, false);
    
    if (elements.length > 0) {
      const index = elements[0].index;
      const geoid = geoids[index];
      
      // Toggle selection
      if (selected.has(geoid)) {
        selected.delete(geoid);
      } else {
        selected.add(geoid);
      }
      
      // Update chart without animation
      chart.update('none');
      
      // Dispatch selection event
      window.dispatchEvent(new CustomEvent('chart:selection', {
        detail: { geoids: [...selected] }
      }));
    }
  });
  
  // Add double-click handler to clear selection
  canvas.addEventListener('dblclick', () => {
    selected.clear();
    chart.update('none');
    
    window.dispatchEvent(new CustomEvent('chart:selection', {
      detail: { geoids: [] }
    }));
  });
  
  // Expose selection state and methods
  chart.selection = {
    getSelected: () => [...selected],
    clearSelection: () => {
      selected.clear();
      chart.update('none');
    },
    setSelected: (geoids) => {
      selected.clear();
      geoids.forEach(geoid => selected.add(geoid));
      chart.update('none');
    }
  };
  
  return chart;
}
