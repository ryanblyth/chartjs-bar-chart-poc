/**
 * ScrollTrigger-powered chart animations
 * Provides scroll-driven bar reveal animations while preserving Chart.js built-in animations
 */

// Store original data for animation
let originalData = null;

/**
 * Initialize ScrollTrigger for chart scrubbing
 * @param {Chart} chart - Chart.js instance
 * @param {Object} options - ScrollTrigger options
 */
export function initScrollTrigger(chart, options = {}) {
  // Check if GSAP and ScrollTrigger are available
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('GSAP or ScrollTrigger not available. Using fallback animation.');
    return initFallbackAnimation(chart);
  }
  
  // Store original data from chart instance (set in buildChart.js)
  if (!originalData && chart._originalData) {
    originalData = [...chart._originalData];
  } else if (!originalData) {
    originalData = [...chart.data.datasets[0].data];
  }
  
  // Store the max Y-axis value to keep it fixed
  const maxYValue = chart._maxValue || Math.max(...originalData) * 1.1;
  
  // Ensure Y-axis max is fixed
  if (chart.options.scales.y) {
    chart.options.scales.y.max = maxYValue;
  }
  
  // Set initial state (bars at 0)
  chart.data.datasets[0].data = originalData.map(() => 0);
  chart.update('none');
  
  // Set up ScrollTrigger with pinning
  const scrollTrigger = ScrollTrigger.create({
    trigger: options.trigger || '.chart-container',
    start: options.start || 'top center',
    end: options.end || 'bottom center',
    scrub: options.scrub !== false ? 1 : false,
    pin: options.pin !== false ? true : false, // Enable pinning by default
    onUpdate: (self) => {
      // Use custom easing to reach 100% faster and then hold
      // Animation reaches 100% at 60% of scroll, then holds for remaining 40%
      const rawProgress = self.progress;
      const animationProgress = Math.min(rawProgress / 0.6, 1);
      
      // Update bar heights based on animation progress
      chart.data.datasets[0].data = originalData.map(val => val * animationProgress);
      
      // Ensure Y-axis scale stays fixed
      if (chart.options.scales.y) {
        chart.options.scales.y.max = maxYValue;
      }
      
      chart.update('none');
    },
    onComplete: () => {
      // Ensure full bar height when complete
      chart.data.datasets[0].data = [...originalData];
      
      // Keep Y-axis scale fixed
      if (chart.options.scales.y) {
        chart.options.scales.y.max = maxYValue;
      }
      
      chart.update('none');
    }
  });
  
  return scrollTrigger;
}

/**
 * Fallback animation using IntersectionObserver
 * @param {Chart} chart - Chart.js instance
 */
function initFallbackAnimation(chart) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Trigger a one-time grow animation using Chart.js built-in animations
        chart.update('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });
  
  const chartContainer = document.querySelector('.chart-container');
  if (chartContainer) {
    observer.observe(chartContainer);
  }
  
  return observer;
}

/**
 * Enable ScrollTrigger scrubbing
 * @param {Chart} chart - Chart.js instance
 * @param {Object} options - ScrollTrigger configuration
 */
export function enableScrollTrigger(chart, options = {}) {
  const defaultOptions = {
    trigger: '.chart-container',
    start: 'top center',
    end: 'bottom center',
    scrub: 1,
    pin: false,
    ...options
  };
  
  return initScrollTrigger(chart, defaultOptions);
}

/**
 * Disable ScrollTrigger scrubbing
 * @param {Chart} chart - Chart.js instance
 */
export function disableScrollTrigger(chart) {
  // Restore original data if it exists
  if (originalData) {
    chart.data.datasets[0].data = [...originalData];
  }
  
  // Kill any existing ScrollTrigger instances
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.getAll().forEach(trigger => {
      if (trigger.trigger === document.querySelector('.chart-container')) {
        trigger.kill();
      }
    });
  }
  
  // Redraw chart normally
  chart.update('active');
}

/**
 * Check if ScrollTrigger is available
 * @returns {boolean} True if GSAP and ScrollTrigger are loaded
 */
export function isScrollTriggerAvailable() {
  return typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
}

/**
 * Toggle ScrollTrigger scrubbing
 * @param {Chart} chart - Chart.js instance
 * @param {boolean} enabled - Whether to enable scrubbing
 * @param {Object} options - ScrollTrigger options
 */
export function toggleScrollTrigger(chart, enabled, options = {}) {
  if (enabled) {
    return enableScrollTrigger(chart, options);
  } else {
    disableScrollTrigger(chart);
    return null;
  }
}
