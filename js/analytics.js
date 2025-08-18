/**
 * COMPACT BRAND DIAGNOSIS - ANALYTICS
 * Conversion tracking and user behavior analytics
 * Optimized for privacy and performance
 */

// ===== ANALYTICS CONFIGURATION =====
const ANALYTICS_CONFIG = {
  // Google Analytics
  ga: {
    measurementId: 'GA_MEASUREMENT_ID', // Replace with actual GA4 ID
    enabled: true
  },
  
  // Facebook Pixel
  facebook: {
    pixelId: 'FB_PIXEL_ID', // Replace with actual Pixel ID
    enabled: false
  },
  
  // Custom analytics
  custom: {
    endpoint: '/api/analytics',
    enabled: false
  },
  
  // Privacy settings
  privacy: {
    respectDoNotTrack: true,
    cookieConsent: false // Will be set based on user consent
  },
  
  // Conversion goals
  conversions: {
    'contact_whatsapp': { value: 50, currency: 'BRL' },
    'contact_email': { value: 40, currency: 'BRL' },
    'contact_phone': { value: 45, currency: 'BRL' },
    'form_submit': { value: 30, currency: 'BRL' },
    'scroll_75': { value: 5, currency: 'BRL' },
    'time_5min': { value: 10, currency: 'BRL' }
  }
};

// ===== PRIVACY & CONSENT =====

/**
 * Check if tracking is allowed
 */
function isTrackingAllowed() {
  // Respect Do Not Track
  if (ANALYTICS_CONFIG.privacy.respectDoNotTrack && navigator.doNotTrack === '1') {
    return false;
  }
  
  // Check cookie consent (implement based on your consent system)
  if (ANALYTICS_CONFIG.privacy.cookieConsent) {
    return localStorage.getItem('analytics_consent') === 'true';
  }
  
  return true;
}

/**
 * Set analytics consent
 */
function setAnalyticsConsent(consent) {
  ANALYTICS_CONFIG.privacy.cookieConsent = consent;
  localStorage.setItem('analytics_consent', consent.toString());
  
  if (consent) {
    initializeAnalytics();
  } else {
    disableAnalytics();
  }
}

// ===== GOOGLE ANALYTICS 4 =====

/**
 * Initialize Google Analytics 4
 */
function initGoogleAnalytics() {
  if (!ANALYTICS_CONFIG.ga.enabled || !isTrackingAllowed()) return;
  
  // Load GA4 script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_CONFIG.ga.measurementId}`;
  document.head.appendChild(script);
  
  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  
  // Configure GA4
  gtag('config', ANALYTICS_CONFIG.ga.measurementId, {
    // Privacy settings
    anonymize_ip: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    
    // Enhanced measurement
    enhanced_measurements: {
      scrolls: true,
      outbound_clicks: true,
      site_search: false,
      video_engagement: false,
      file_downloads: true
    },
    
    // Custom parameters
    custom_map: {
      'custom_parameter_1': 'page_type',
      'custom_parameter_2': 'user_journey_stage'
    }
  });
  
  // Set default parameters
  gtag('config', ANALYTICS_CONFIG.ga.measurementId, {
    'page_type': 'diagnosis',
    'user_journey_stage': 'awareness',
    'client_name': 'compact',
    'location': 'cuiaba_mt'
  });
  
  window.gtag = gtag;
  console.log('✅ Google Analytics 4 initialized');
}

/**
 * Track GA4 event
 */
function trackGA4Event(eventName, parameters = {}) {
  if (typeof gtag === 'undefined' || !isTrackingAllowed()) return;
  
  // Add default parameters
  const eventData = {
    ...parameters,
    client_name: 'compact',
    page_type: 'diagnosis',
    timestamp: new Date().toISOString()
  };
  
  gtag('event', eventName, eventData);
}

/**
 * Track GA4 conversion
 */
function trackGA4Conversion(conversionId, value = null, currency = 'BRL') {
  if (typeof gtag === 'undefined' || !isTrackingAllowed()) return;
  
  const conversionData = {
    send_to: conversionId,
    value: value,
    currency: currency,
    client_name: 'compact',
    conversion_timestamp: new Date().toISOString()
  };
  
  gtag('event', 'conversion', conversionData);
}

// ===== FACEBOOK PIXEL =====

/**
 * Initialize Facebook Pixel
 */
function initFacebookPixel() {
  if (!ANALYTICS_CONFIG.facebook.enabled || !isTrackingAllowed()) return;
  
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  
  fbq('init', ANALYTICS_CONFIG.facebook.pixelId, {
    em: 'hashed_email', // If available
    external_id: 'user_id' // If available
  });
  
  fbq('track', 'PageView', {
    content_name: 'Compact Brand Diagnosis',
    content_category: 'Brand Analysis',
    content_type: 'diagnosis'
  });
  
  console.log('✅ Facebook Pixel initialized');
}

/**
 * Track Facebook Pixel event
 */
function trackFacebookEvent(eventName, parameters = {}) {
  if (typeof fbq === 'undefined' || !isTrackingAllowed()) return;
  
  fbq('track', eventName, {
    ...parameters,
    client_name: 'compact',
    source: 'brand_diagnosis'
  });
}

// ===== CUSTOM ANALYTICS =====

/**
 * Initialize custom analytics
 */
function initCustomAnalytics() {
  if (!ANALYTICS_CONFIG.custom.enabled || !isTrackingAllowed()) return;
  
  window.customAnalytics = {
    sessionId: generateSessionId(),
    userId: getUserId(),
    events: [],
    
    track: function(category, action, label, value) {
      const event = {
        timestamp: new Date().toISOString(),
        sessionId: this.sessionId,
        userId: this.userId,
        category: category,
        action: action,
        label: label,
        value: value,
        url: window.location.href,
        userAgent: navigator.userAgent,
        client: 'compact'
      };
      
      this.events.push(event);
      this.sendEvent(event);
    },
    
    sendEvent: function(event) {
      // Send to custom endpoint
      fetch(ANALYTICS_CONFIG.custom.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
      }).catch(error => {
        console.warn('Custom analytics error:', error);
      });
    }
  };
  
  console.log('✅ Custom analytics initialized');
}

/**
 * Generate session ID
 */
function generateSessionId() {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Get or create user ID
 */
function getUserId() {
  let userId = localStorage.getItem('user_id');
  if (!userId) {
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('user_id', userId);
  }
  return userId;
}

// ===== CONVERSION TRACKING =====

/**
 * Track conversion event
 */
function trackConversion(conversionType, additionalData = {}) {
  if (!isTrackingAllowed()) return;
  
  const conversion = ANALYTICS_CONFIG.conversions[conversionType];
  if (!conversion) {
    console.warn('Unknown conversion type:', conversionType);
    return;
  }
  
  const conversionData = {
    conversion_type: conversionType,
    conversion_value: conversion.value,
    currency: conversion.currency,
    client_name: 'compact',
    timestamp: new Date().toISOString(),
    ...additionalData
  };
  
  // Track in Google Analytics
  trackGA4Event('conversion', conversionData);
  
  // Track in Facebook Pixel
  trackFacebookEvent('Lead', {
    value: conversion.value,
    currency: conversion.currency,
    content_name: conversionType
  });
  
  // Track in custom analytics
  if (window.customAnalytics) {
    window.customAnalytics.track('Conversion', conversionType, '', conversion.value);
  }
  
  console.log('🎯 Conversion tracked:', conversionType, conversionData);
}

// ===== ENGAGEMENT TRACKING =====

/**
 * Track scroll depth
 */
function trackScrollDepth() {
  let maxScrollDepth = 0;
  const milestones = [25, 50, 75, 90, 100];
  
  const trackScroll = throttle(() => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = Math.round((scrollTop / docHeight) * 100);
    
    if (scrollPercent > maxScrollDepth) {
      maxScrollDepth = scrollPercent;
      
      milestones.forEach(milestone => {
        if (scrollPercent >= milestone && maxScrollDepth < milestone) {
          trackGA4Event('scroll', {
            percent_scrolled: milestone
          });
          
          // Track 75% as conversion
          if (milestone === 75) {
            trackConversion('scroll_75');
          }
        }
      });
    }
  }, 1000);
  
  window.addEventListener('scroll', trackScroll);
}

/**
 * Track time on page
 */
function trackTimeOnPage() {
  const startTime = Date.now();
  const timeCheckpoints = [30, 60, 180, 300]; // 30s, 1m, 3m, 5m
  let trackedCheckpoints = [];
  
  const checkTime = () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    
    timeCheckpoints.forEach(checkpoint => {
      if (timeSpent >= checkpoint && !trackedCheckpoints.includes(checkpoint)) {
        trackedCheckpoints.push(checkpoint);
        
        trackGA4Event('timing_complete', {
          name: 'time_on_page',
          value: checkpoint
        });
        
        // Track 5 minutes as conversion
        if (checkpoint === 300) {
          trackConversion('time_5min');
        }
      }
    });
  };
  
  setInterval(checkTime, 5000); // Check every 5 seconds
}

/**
 * Track form interactions
 */
function trackFormInteractions() {
  // Track form starts
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    const inputs = form.querySelectorAll('input, textarea, select');
    let hasInteracted = false;
    
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        if (!hasInteracted) {
          hasInteracted = true;
          trackGA4Event('form_start', {
            form_id: form.id || 'unnamed_form'
          });
        }
      });
    });
  });
  
  // Track form submissions
  document.addEventListener('submit', (e) => {
    const form = e.target;
    const formId = form.id || 'unnamed_form';
    
    trackGA4Event('form_submit', {
      form_id: formId
    });
    
    trackConversion('form_submit', {
      form_id: formId
    });
  });
}

/**
 * Track CTA clicks
 */
function trackCTAClicks() {
  const ctaButtons = document.querySelectorAll('[data-track]');
  
  ctaButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const trackingId = button.dataset.track;
      const buttonText = button.textContent.trim();
      const buttonHref = button.href || '';
      
      trackGA4Event('cta_click', {
        cta_id: trackingId,
        cta_text: buttonText,
        cta_destination: buttonHref
      });
      
      // Track specific conversions
      if (trackingId.includes('whatsapp')) {
        trackConversion('contact_whatsapp');
      } else if (trackingId.includes('email')) {
        trackConversion('contact_email');
      } else if (trackingId.includes('phone')) {
        trackConversion('contact_phone');
      }
    });
  });
}

// ===== HEATMAP & SESSION RECORDING =====

/**
 * Initialize heatmap tracking (Hotjar, FullStory, etc.)
 */
function initHeatmapTracking() {
  // Hotjar example (replace with actual implementation)
  if (window.hj) {
    hj('trigger', 'compact_diagnosis_view');
  }
  
  // FullStory example
  if (window.FS) {
    FS.setUserVars({
      client_str: 'compact',
      page_str: 'brand_diagnosis'
    });
  }
}

// ===== ERROR TRACKING =====

/**
 * Track JavaScript errors
 */
function trackErrors() {
  window.addEventListener('error', (e) => {
    trackGA4Event('exception', {
      description: e.message,
      fatal: false,
      filename: e.filename,
      lineno: e.lineno
    });
  });
  
  window.addEventListener('unhandledrejection', (e) => {
    trackGA4Event('exception', {
      description: 'Unhandled Promise Rejection: ' + e.reason,
      fatal: false
    });
  });
}

// ===== UTILITY FUNCTIONS =====

/**
 * Throttle function for performance
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

// ===== DISABLE ANALYTICS =====

/**
 * Disable all analytics tracking
 */
function disableAnalytics() {
  // Disable Google Analytics
  if (typeof gtag !== 'undefined') {
    gtag('consent', 'update', {
      'analytics_storage': 'denied',
      'ad_storage': 'denied'
    });
  }
  
  // Disable Facebook Pixel
  if (typeof fbq !== 'undefined') {
    fbq('consent', 'revoke');
  }
  
  // Clear custom analytics
  if (window.customAnalytics) {
    window.customAnalytics = null;
  }
  
  console.log('🚫 Analytics disabled');
}

// ===== INITIALIZATION =====

/**
 * Initialize all analytics
 */
function initializeAnalytics() {
  if (!isTrackingAllowed()) {
    console.log('🚫 Analytics tracking not allowed');
    return;
  }
  
  try {
    // Initialize tracking services
    initGoogleAnalytics();
    initFacebookPixel();
    initCustomAnalytics();
    
    // Initialize engagement tracking
    trackScrollDepth();
    trackTimeOnPage();
    trackFormInteractions();
    trackCTAClicks();
    
    // Initialize additional features
    initHeatmapTracking();
    trackErrors();
    
    console.log('✅ Analytics fully initialized');
    
  } catch (error) {
    console.error('❌ Analytics initialization error:', error);
  }
}

// ===== AUTO-INITIALIZE =====

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeAnalytics);
} else {
  initializeAnalytics();
}

// ===== EXPORT FOR EXTERNAL USE =====
window.CompactAnalytics = {
  trackConversion,
  trackGA4Event,
  trackFacebookEvent,
  setAnalyticsConsent,
  isTrackingAllowed,
  disableAnalytics
};