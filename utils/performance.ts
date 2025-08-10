import { InteractionManager } from 'react-native';

// Performance optimization utilities for high-scale usage

/**
 * Debounce function to limit API calls and improve performance
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: number;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function to limit function execution frequency
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Run task after interactions are complete for better performance
 */
export function runAfterInteractions(task: () => void): void {
  InteractionManager.runAfterInteractions(() => {
    task();
  });
}

/**
 * Memory-efficient list rendering with windowing
 */
export const LIST_CONFIG = {
  // Number of items to render initially
  INITIAL_NUM_TO_RENDER: 10,
  // Number of items to render per batch
  MAX_TO_RENDER_PER_BATCH: 10,
  // Distance from end to start rendering more items
  WINDOW_SIZE: 5,
  // Remove items from memory when they're far from viewport
  REMOVE_CLIPPED_SUBVIEWS: true,
  // Optimize memory usage
  GET_ITEM_LAYOUT: undefined,
  // Enable performance optimizations
  MAINTAIN_VISIBLE_CONTENT_POSITION: true,
};

/**
 * Image optimization settings
 */
export const IMAGE_OPTIMIZATION = {
  // Progressive loading
  PROGRESSIVE_RENDERING: true,
  // Cache images
  CACHE_POLICY: 'memory-disk',
  // Lazy loading
  LAZY_LOADING: true,
  // Compress images
  COMPRESSION_QUALITY: 0.8,
};

/**
 * Network optimization settings
 */
export const NETWORK_OPTIMIZATION = {
  // Request timeout
  TIMEOUT: 30000,
  // Retry attempts
  MAX_RETRIES: 3,
  // Retry delay
  RETRY_DELAY: 1000,
  // Cache duration
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
  // Batch requests
  BATCH_REQUESTS: true,
  // Request deduplication
  DEDUPLICATE_REQUESTS: true,
};

/**
 * Memory management utilities
 */
export const MEMORY_MANAGEMENT = {
  // Clear memory when app goes to background
  CLEAR_ON_BACKGROUND: true,
  // Limit cache size
  MAX_CACHE_SIZE: 50 * 1024 * 1024, // 50MB
  // Garbage collection threshold
  GC_THRESHOLD: 0.8,
  // Monitor memory usage
  MONITOR_MEMORY: true,
};
