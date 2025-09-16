// Global analytics disable mechanism
// This file prevents Firebase Analytics from being initialized anywhere in the app

// Disable analytics globally (web only)
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  // Disable Google Analytics
  // @ts-ignore
  window.gtag = () => {};
  // @ts-ignore
  window.dataLayer = [];
  // @ts-ignore
  window.ga = () => {};
  
  // Disable Firebase Analytics
  // @ts-ignore
  window.analytics = undefined;
  // @ts-ignore
  window.firebase = window.firebase || {};
  // @ts-ignore
  window.firebase.analytics = undefined;
  
  // Disable any analytics-related DOM access
  const originalGetElementsByTagName = document.getElementsByTagName;
  document.getElementsByTagName = function(tagName: string) {
    if (tagName === 'script' && arguments[0]?.includes?.('analytics')) {
      return [] as any;
    }
    return originalGetElementsByTagName.call(this, tagName);
  };
  
  // Disable analytics-related console methods
  const originalConsoleLog = console.log;
  console.log = function(...args: any[]) {
    if (args.some(arg => typeof arg === 'string' && arg.includes('analytics'))) {
      return;
    }
    return originalConsoleLog.apply(this, args);
  };
}

// Export a function to ensure analytics is disabled
export function disableAnalytics() {
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    // @ts-ignore
    window.gtag = () => {};
    // @ts-ignore
    window.dataLayer = [];
    // @ts-ignore
    window.ga = () => {};
    // @ts-ignore
    window.analytics = undefined;
    // @ts-ignore
    window.firebase = window.firebase || {};
    // @ts-ignore
    window.firebase.analytics = undefined;
  }
}
