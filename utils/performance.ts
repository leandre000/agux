import { Platform } from 'react-native';

// Performance optimization utilities
export class PerformanceOptimizer {
  private static instance: PerformanceOptimizer;
  private preloadedResources: Set<string> = new Set();

  static getInstance(): PerformanceOptimizer {
    if (!PerformanceOptimizer.instance) {
      PerformanceOptimizer.instance = new PerformanceOptimizer();
    }
    return PerformanceOptimizer.instance;
  }

  // Preload critical resources
  async preloadCriticalResources(): Promise<void> {
    try {
      // Preload essential images and assets
      const criticalAssets = [
        // Add critical asset paths here
      ];

      for (const asset of criticalAssets) {
        if (!this.preloadedResources.has(asset)) {
          // Implement asset preloading logic
          this.preloadedResources.add(asset);
        }
      }
    } catch (error) {
      console.warn('Failed to preload critical resources:', error);
    }
  }

  // Optimize bundle loading
  optimizeBundleLoading(): void {
    if (Platform.OS === 'web') {
      // Web-specific optimizations
      this.enableWebOptimizations();
    } else {
      // Native-specific optimizations
      this.enableNativeOptimizations();
    }
  }

  private enableWebOptimizations(): void {
    // Implement web-specific optimizations
    // - Code splitting
    // - Lazy loading
    // - Service worker caching
  }

  private enableNativeOptimizations(): void {
    // Implement native-specific optimizations
    // - Image caching
    // - Memory management
    // - Background processing
  }

  // Measure performance metrics
  measurePerformance(operation: string, callback: () => void): void {
    const startTime = performance.now();
    
    try {
      callback();
    } finally {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Log performance metrics
      console.log(`Performance: ${operation} took ${duration.toFixed(2)}ms`);
      
      // Send to analytics if needed
      this.sendPerformanceMetrics(operation, duration);
    }
  }

  private sendPerformanceMetrics(operation: string, duration: number): void {
    // Implement analytics reporting
    // This could send data to Firebase Analytics, Mixpanel, etc.
  }

  // Optimize image loading
  optimizeImageLoading(imageUri: string): string {
    // Add image optimization parameters
    // - Resize for mobile
    // - WebP format for web
    // - Progressive loading
    return imageUri;
  }

  // Cache management
  clearCache(): void {
    this.preloadedResources.clear();
    
    if (Platform.OS === 'web') {
      // Clear web cache
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => caches.delete(name));
        });
      }
    }
  }
}

// Export singleton instance
export const performanceOptimizer = PerformanceOptimizer.getInstance();

// Performance monitoring hooks
export const usePerformanceMonitor = () => {
  const measureOperation = (operation: string, callback: () => void) => {
    performanceOptimizer.measurePerformance(operation, callback);
  };

  return { measureOperation };
};

// Lazy loading utility
export const lazyLoad = <T>(importFn: () => Promise<{ default: T }>): T => {
  let component: T | null = null;
  let promise: Promise<T> | null = null;

  return new Proxy({} as T, {
    get(target, prop) {
      if (!component) {
        if (!promise) {
          promise = importFn().then(module => {
            component = module.default;
            return component;
          });
        }
        throw promise;
      }
      return (component as any)[prop];
    },
  });
};
