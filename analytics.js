// Vercel Web Analytics initialization
// This script initializes Vercel Web Analytics for the portfolio site

(function() {
  'use strict';
  
  // Initialize the analytics queue
  window.va = window.va || function() {
    (window.vaq = window.vaq || []).push(arguments);
  };
  
  // Load the Vercel Analytics script
  // The script will be automatically provided by Vercel when deployed
  // For local development, this will not track events
  var script = document.createElement('script');
  script.defer = true;
  script.src = '/_vercel/insights/script.js';
  
  // Only load if we're on Vercel (production/preview)
  // In local development, this script won't exist and that's okay
  script.onerror = function() {
    // Silently fail in local development
    console.info('Vercel Analytics: Running in development mode');
  };
  
  document.head.appendChild(script);
})();
