/**
 * Theme utilities for Chart.js configuration
 */

/**
 * Format numbers with K notation (e.g., 12500 -> "12.5k", 1200000 -> "1.2M")
 * @param {number} value - The number to format
 * @returns {string} Formatted string
 */
export function formatK(value) {
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (value >= 1000) {
    return (value / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return value.toString();
}

/**
 * Format numbers with comma separators
 * @param {number} value - The number to format
 * @returns {string} Formatted string with commas
 */
export function comma(value) {
  return value.toLocaleString();
}

/**
 * Create a color ramp function for density values
 * @param {number} min - Minimum density value
 * @param {number} max - Maximum density value
 * @returns {function} Function that takes a density value and returns a CSS color
 */
export function makeDensityRamp(min, max) {
  const range = max - min;
  
  return (density) => {
    if (density == null || range === 0) {
      return 'rgba(78, 121, 167, 0.85)'; // Default blue
    }
    
    // Normalize density to 0-1 range
    const normalized = (density - min) / range;
    
    // Create a sequential color ramp from light blue to dark blue
    const hue = 210; // Blue hue
    const saturation = 60 + (normalized * 40); // 60% to 100% saturation
    const lightness = 70 - (normalized * 30); // 70% to 40% lightness
    
    return `hsla(${hue}, ${saturation}%, ${lightness}%, 0.85)`;
  };
}

/**
 * Default chart colors and styling
 */
export const chartTheme = {
  colors: {
    primary: 'rgba(78, 121, 167, 0.85)',
    selected: 'rgba(78, 121, 167, 1)',
    unselected: 'rgba(210, 215, 223, 0.6)',
    border: 'rgba(78, 121, 167, 1)',
    text: '#2c3e50',
    grid: 'rgba(0, 0, 0, 0.1)'
  },
  
  fonts: {
    family: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
    size: 12,
    mobileSize: 10,
    weight: 'normal'
  },
  
  animation: {
    duration: 900,
    easing: 'easeOutQuart'
  }
};
