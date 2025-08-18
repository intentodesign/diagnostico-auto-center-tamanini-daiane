/**
 * COMPACT BRAND DIAGNOSIS - MAIN JAVASCRIPT
 * Interactive functionality and scroll animations
 * Optimized for performance and accessibility
 */

// ===== CONFIGURATION =====
const CONFIG = {
  // Animation settings
  animation: {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
    duration: 600,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
  },
  
  // Scroll settings
  scroll: {
    smooth: true,
    offset: 80
  },
  
  // Performance settings
  performance: {
    throttleDelay: 16,
    debounceDelay: 250
  }
};

// ===== UTILITY FUNCTIONS =====

/**
 * Throttle function for performance optimization
 */
function throttle(func, delay) {
  let timeoutId;
  let lastExecTime = 0;
  
  return function (...args) {
    const currentTime = Date.now();
    
    if (currentTime - lastExecTime > delay) {
      func.apply(this, args);
      lastExecTime = currentTime;
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  };
}

/**
 * Debounce function for performance optimization
 */
function debounce(func, delay) {
  let timeoutId;
  
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

/**
 * Check if user prefers reduced motion
 */
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get scroll position
 */
function getScrollPosition() {
  return window.pageYOffset || document.documentElement.scrollTop;
}

/**
 * Smooth scroll to element
 */
function smoothScrollTo(targetId, offset = CONFIG.scroll.offset) {
  const target = document.getElementById(targetId);
  if (!target) return;
  
  const targetPosition = target.offsetTop - offset;
  
  if (CONFIG.scroll.smooth && !prefersReducedMotion()) {
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  } else {
    window.scrollTo(0, targetPosition);
  }
}

// ===== INTERSECTION OBSERVER =====

/**
 * Initialize scroll animations using Intersection Observer
 */
function initScrollAnimations() {
  if (prefersReducedMotion()) return;
  
  const observerOptions = {
    threshold: CONFIG.animation.threshold,
    rootMargin: CONFIG.animation.rootMargin
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        
        // Add animation class
        element.classList.add('in-view');
        
        // Add specific animation classes based on data attributes
        const animationType = element.dataset.animation;
        if (animationType) {
          element.classList.add(`animate-${animationType}`);
        }
        
        // Stop observing this element
        observer.unobserve(element);
      }
    });
  }, observerOptions);
  
  // Observe all elements with animation classes
  const animatedElements = document.querySelectorAll([
    '.animate-fade-up',
    '.animate-fade-down', 
    '.animate-fade-left',
    '.animate-fade-right',
    '.animate-scale-in',
    '.scroll-fade',
    '.scroll-slide-left',
    '.scroll-slide-right',
    '.scroll-scale',
    '.reveal-on-scroll',
    '.reveal-stagger'
  ].join(', '));
  
  animatedElements.forEach(element => {
    observer.observe(element);
  });
}

// ===== NAVBAR FUNCTIONALITY =====

/**
 * Handle navbar scroll effects
 */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  
  const handleScroll = throttle(() => {
    const scrolled = getScrollPosition() > 50;
    navbar.classList.toggle('scrolled', scrolled);
  }, CONFIG.performance.throttleDelay);
  
  window.addEventListener('scroll', handleScroll);
  
  // Handle nav links
  const navLinks = document.querySelectorAll('a[href^="#"]');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      smoothScrollTo(targetId);
      
      // Track navigation click
      trackEvent('Navigation', 'Click', targetId);
    });
  });
}

// ===== FORM HANDLING =====

/**
 * Handle contact form submissions
 */
function initForms() {
  const forms = document.querySelectorAll('form[data-form]');
  
  forms.forEach(form => {
    form.addEventListener('submit', handleFormSubmission);
  });
}

/**
 * Handle form submission
 */
function handleFormSubmission(e) {
  e.preventDefault();
  
  const form = e.target;
  const formData = new FormData(form);
  const formType = form.dataset.form;
  
  // Basic validation
  if (!validateForm(form)) {
    showMessage('Por favor, preencha todos os campos obrigatórios.', 'error');
    return;
  }
  
  // Show loading state
  const submitButton = form.querySelector('[type="submit"]');
  const originalText = submitButton.textContent;
  submitButton.textContent = 'Enviando...';
  submitButton.disabled = true;
  
  // Track form submission
  trackEvent('Form', 'Submit', formType);
  
  // Simulate form submission (replace with actual endpoint)
  setTimeout(() => {
    showMessage('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
    form.reset();
    submitButton.textContent = originalText;
    submitButton.disabled = false;
  }, 2000);
}

/**
 * Basic form validation
 */
function validateForm(form) {
  const requiredFields = form.querySelectorAll('[required]');
  let isValid = true;
  
  requiredFields.forEach(field => {
    if (!field.value.trim()) {
      field.classList.add('error');
      isValid = false;
    } else {
      field.classList.remove('error');
    }
  });
  
  return isValid;
}

/**
 * Show user message
 */
function showMessage(message, type = 'info') {
  // Remove existing messages
  const existingMessages = document.querySelectorAll('.user-message');
  existingMessages.forEach(msg => msg.remove());
  
  // Create message element
  const messageElement = document.createElement('div');
  messageElement.className = `user-message user-message--${type}`;
  messageElement.textContent = message;
  
  // Style the message
  Object.assign(messageElement.style, {
    position: 'fixed',
    top: '100px',
    right: '20px',
    padding: '16px 24px',
    borderRadius: '8px',
    backgroundColor: type === 'success' ? '#38a169' : type === 'error' ? '#e53e3e' : '#4299e1',
    color: 'white',
    fontWeight: '500',
    fontSize: '14px',
    zIndex: '10000',
    transform: 'translateX(100%)',
    transition: 'transform 0.3s ease-out',
    maxWidth: '300px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)'
  });
  
  document.body.appendChild(messageElement);
  
  // Animate in
  requestAnimationFrame(() => {
    messageElement.style.transform = 'translateX(0)';
  });
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    messageElement.style.transform = 'translateX(100%)';
    setTimeout(() => messageElement.remove(), 300);
  }, 5000);
}

// ===== INTERACTIVE ELEMENTS =====

/**
 * Initialize button interactions
 */
function initButtons() {
  const buttons = document.querySelectorAll('.btn, .nav-cta');
  
  buttons.forEach(button => {
    // Add hover sound effect (optional)
    button.addEventListener('mouseenter', () => {
      if (!prefersReducedMotion()) {
        button.style.transform = 'translateY(-2px)';
      }
    });
    
    button.addEventListener('mouseleave', () => {
      button.style.transform = '';
    });
    
    // Add click tracking
    button.addEventListener('click', (e) => {
      const trackingId = button.dataset.track;
      if (trackingId) {
        trackEvent('Button', 'Click', trackingId);
      }
      
      // Add ripple effect
      if (!prefersReducedMotion()) {
        createRippleEffect(e, button);
      }
    });
  });
}

/**
 * Create ripple effect on button click
 */
function createRippleEffect(event, element) {
  const ripple = document.createElement('span');
  const rect = element.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;
  
  ripple.style.cssText = `
    position: absolute;
    width: ${size}px;
    height: ${size}px;
    left: ${x}px;
    top: ${y}px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    transform: scale(0);
    pointer-events: none;
    animation: ripple 0.6s ease-out;
  `;
  
  // Add ripple keyframes if not exists
  if (!document.getElementById('ripple-styles')) {
    const style = document.createElement('style');
    style.id = 'ripple-styles';
    style.textContent = `
      @keyframes ripple {
        to {
          transform: scale(2);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  element.style.position = 'relative';
  element.style.overflow = 'hidden';
  element.appendChild(ripple);
  
  setTimeout(() => ripple.remove(), 600);
}

// ===== SCROLL PROGRESS INDICATOR =====

/**
 * Initialize scroll progress indicator
 */
function initScrollProgress() {
  // Create progress bar
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 3px;
    background: linear-gradient(90deg, var(--brand-primary), var(--brand-accent));
    z-index: 10001;
    transition: width 0.1s ease-out;
  `;
  
  document.body.appendChild(progressBar);
  
  // Update progress on scroll
  const updateProgress = throttle(() => {
    const scrollTop = getScrollPosition();
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    progressBar.style.width = `${Math.min(scrollPercent, 100)}%`;
  }, CONFIG.performance.throttleDelay);
  
  window.addEventListener('scroll', updateProgress);
}

// ===== LAZY LOADING =====

/**
 * Initialize lazy loading for images
 */
function initLazyLoading() {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.dataset.src || img.dataset.lazySrc;
          
          if (src) {
            img.src = src;
            img.classList.remove('lazy');
            img.classList.add('loaded');
            imageObserver.unobserve(img);
          }
        }
      });
    });
    
    const lazyImages = document.querySelectorAll('img[data-src], img[data-lazy-src], img.lazy');
    lazyImages.forEach(img => imageObserver.observe(img));
  }
}

// ===== PERFORMANCE MONITORING =====

/**
 * Monitor page performance
 */
function initPerformanceMonitoring() {
  // Monitor page load time
  window.addEventListener('load', () => {
    const loadTime = performance.now();
    trackEvent('Performance', 'Page Load Time', Math.round(loadTime));
    
    // Track Core Web Vitals if available
    if ('web-vitals' in window) {
      // This would require the web-vitals library
      // getCLS(trackEvent.bind(null, 'Performance', 'CLS'));
      // getFID(trackEvent.bind(null, 'Performance', 'FID'));
      // getLCP(trackEvent.bind(null, 'Performance', 'LCP'));
    }
  });
  
  // Monitor scroll depth
  let maxScrollDepth = 0;
  const trackScrollDepth = throttle(() => {
    const scrollTop = getScrollPosition();
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = Math.round((scrollTop / docHeight) * 100);
    
    if (scrollPercent > maxScrollDepth) {
      maxScrollDepth = scrollPercent;
      
      // Track milestone percentages
      if (scrollPercent >= 25 && maxScrollDepth < 25) {
        trackEvent('Engagement', 'Scroll Depth', '25%');
      } else if (scrollPercent >= 50 && maxScrollDepth < 50) {
        trackEvent('Engagement', 'Scroll Depth', '50%');
      } else if (scrollPercent >= 75 && maxScrollDepth < 75) {
        trackEvent('Engagement', 'Scroll Depth', '75%');
      } else if (scrollPercent >= 90 && maxScrollDepth < 90) {
        trackEvent('Engagement', 'Scroll Depth', '90%');
      }
    }
  }, 1000);
  
  window.addEventListener('scroll', trackScrollDepth);
}

// ===== TIME ON PAGE TRACKING =====

/**
 * Track time spent on page
 */
function initTimeTracking() {
  const startTime = Date.now();
  let isActive = true;
  let totalTime = 0;
  
  // Track when user becomes inactive
  const inactiveEvents = ['blur', 'visibilitychange'];
  const activeEvents = ['focus', 'visibilitychange'];
  
  inactiveEvents.forEach(event => {
    window.addEventListener(event, () => {
      if (isActive) {
        totalTime += Date.now() - startTime;
        isActive = false;
      }
    });
  });
  
  activeEvents.forEach(event => {
    window.addEventListener(event, () => {
      if (!isActive && document.visibilityState === 'visible') {
        isActive = true;
      }
    });
  });
  
  // Track on page unload
  window.addEventListener('beforeunload', () => {
    if (isActive) {
      totalTime += Date.now() - startTime;
    }
    
    const timeInMinutes = Math.round(totalTime / 1000 / 60);
    trackEvent('Engagement', 'Time on Page', `${timeInMinutes} minutes`);
  });
}

// ===== ACCESSIBILITY ENHANCEMENTS =====

/**
 * Initialize accessibility features
 */
function initAccessibility() {
  // Skip to content link
  const skipLink = document.createElement('a');
  skipLink.href = '#hero';
  skipLink.textContent = 'Pular para o conteúdo principal';
  skipLink.className = 'skip-link sr-only';
  skipLink.style.cssText = `
    position: absolute;
    top: -40px;
    left: 6px;
    background: var(--brand-primary);
    color: white;
    padding: 8px;
    text-decoration: none;
    border-radius: 4px;
    z-index: 10002;
    transition: top 0.3s;
  `;
  
  skipLink.addEventListener('focus', () => {
    skipLink.style.top = '6px';
    skipLink.classList.remove('sr-only');
  });
  
  skipLink.addEventListener('blur', () => {
    skipLink.style.top = '-40px';
    skipLink.classList.add('sr-only');
  });
  
  document.body.insertBefore(skipLink, document.body.firstChild);
  
  // Enhanced focus indicators
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-navigation');
    }
  });
  
  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
  });
  
  // Announce dynamic content changes
  const announcer = document.createElement('div');
  announcer.setAttribute('aria-live', 'polite');
  announcer.setAttribute('aria-atomic', 'true');
  announcer.className = 'sr-only';
  document.body.appendChild(announcer);
  
  window.announceToScreenReader = (message) => {
    announcer.textContent = message;
    setTimeout(() => announcer.textContent = '', 1000);
  };
}

// ===== TRACKING FUNCTION =====

/**
 * Generic event tracking function
 */
function trackEvent(category, action, label, value) {
  // Google Analytics 4
  if (typeof gtag !== 'undefined') {
    gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value
    });
  }
  
  // Facebook Pixel
  if (typeof fbq !== 'undefined') {
    fbq('trackCustom', `${category}_${action}`, {
      label: label,
      value: value
    });
  }
  
  // Custom analytics
  if (window.customAnalytics) {
    window.customAnalytics.track(category, action, label, value);
  }
  
  // Console log for debugging
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log(`Track: ${category} | ${action} | ${label} | ${value}`);
  }
}

// ===== INITIALIZATION =====

/**
 * Initialize all functionality when DOM is ready
 */
function init() {
  // Check if DOM is already loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
  } else {
    initializeApp();
  }
}

/**
 * Main initialization function
 */
function initializeApp() {
  try {
    // Core functionality
    initScrollAnimations();
    initNavbar();
    initButtons();
    initForms();
    
    // Enhanced features
    initScrollProgress();
    initLazyLoading();
    initAccessibility();
    
    // Analytics and monitoring
    initPerformanceMonitoring();
    initTimeTracking();
    
    // Track page view
    trackEvent('Page', 'View', 'Compact Diagnosis');
    
    console.log('✅ Compact Brand Diagnosis: All systems initialized');
    
  } catch (error) {
    console.error('❌ Initialization error:', error);
    trackEvent('Error', 'Initialization', error.message);
  }
}

// ===== ERROR HANDLING =====

/**
 * Global error handler
 */
window.addEventListener('error', (e) => {
  trackEvent('Error', 'JavaScript', e.message);
  console.error('JavaScript error:', e);
});

window.addEventListener('unhandledrejection', (e) => {
  trackEvent('Error', 'Promise Rejection', e.reason);
  console.error('Unhandled promise rejection:', e);
});

// ===== EXPORT FOR TESTING =====
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CONFIG,
    throttle,
    debounce,
    trackEvent,
    smoothScrollTo
  };
}

// ===== START APPLICATION =====
init();