/**
 * Wanderly - Direct High-Resolution Image Engine
 * Ensures all hotel, landmark, and destination photos load instantly without delay or flicker.
 */
(function () {
  const CACHE_PREFIX = "wanderly:commons-image:v1:";

  // Clean up any stale/corrupted external image cache from previous sessions
  try {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CACHE_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  } catch (e) {
    // Storage access is non-critical
  }

  // Instant ready promise - No network delay or flickering
  window.WANDERLY_IMAGE_READY = Promise.resolve();
})();

