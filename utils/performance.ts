import { Platform } from 'react-native';

export class PerformanceOptimizer {
  private static instance: PerformanceOptimizer;
  private isInitialized = false;

  static getInstance(): PerformanceOptimizer {
    if (!PerformanceOptimizer.instance) {
      PerformanceOptimizer.instance = new PerformanceOptimizer();
    }
    return PerformanceOptimizer.instance;
  }

  // Preload critical assets
  preloadCriticalAssets(): void {
    if (this.isInitialized) return;

    const criticalAssets: string[] = [
      // Add critical asset paths here
    ];

    // Platform-specific optimizations
    if (Platform.OS === 'web') {
      this.preloadWebAssets(criticalAssets);
    } else {
      this.preloadNativeAssets(criticalAssets);
    }

    this.isInitialized = true;
  }

  // Web-specific asset preloading
  private preloadWebAssets(assets: string[]): void {
    assets.forEach(asset => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = asset;
      link.as = 'image';
      document.head.appendChild(link);
    });
  }

  // Native-specific asset preloading
  private preloadNativeAssets(assets: string[]): void {
    // Native asset preloading logic
    console.log('Preloading native assets:', assets);
  }

  // Optimize bundle loading
  optimizeBundleLoading(): void {
    if (Platform.OS === 'web') {
      // Web-specific bundle optimization
      this.optimizeWebBundle();
    } else {
      // Native bundle optimization
      this.optimizeNativeBundle();
    }
  }

  private optimizeWebBundle(): void {
    // Implement web bundle optimization
    console.log('Optimizing web bundle...');
  }

  private optimizeNativeBundle(): void {
    // Implement native bundle optimization
    console.log('Optimizing native bundle...');
  }

  // Measure performance
  measurePerformance(operation: string, fn: () => void): void {
    const start = performance.now();
    fn();
    const end = performance.now();
    console.log(`${operation} took ${end - start}ms`);
  }

  // Optimize image loading
  optimizeImageLoading(): void {
    // Implement image loading optimization
    console.log('Optimizing image loading...');
  }

  // Cache management
  manageCache(): void {
    // Implement cache management
    console.log('Managing cache...');
  }
}

// Performance monitoring hook
export const usePerformanceMonitor = () => {
  const optimizer = PerformanceOptimizer.getInstance();

  return {
    preloadAssets: () => optimizer.preloadCriticalAssets(),
    optimizeBundle: () => optimizer.optimizeBundleLoading(),
    measurePerformance: optimizer.measurePerformance.bind(optimizer),
    optimizeImages: () => optimizer.optimizeImageLoading(),
    manageCache: () => optimizer.manageCache(),
  };
};

// Lazy loading utility
export const lazyLoad = <T extends object>(importFn: () => Promise<{ default: T }>): T => {
  let module: T | null = null;
  let isLoading = false;
  let error: Error | null = null;

  const load = async (): Promise<T> => {
    if (module) return module;
    if (error) throw error;
    if (isLoading) {
      // Wait for current loading to complete
      while (isLoading) {
        await new Promise(resolve => setTimeout(resolve, 10));
      }
      if (module) return module;
      if (error) throw error;
    }

    isLoading = true;
    try {
      const result = await importFn();
      module = result.default;
      return module;
    } catch (err) {
      error = err as Error;
      throw error;
    } finally {
      isLoading = false;
    }
  };

  return new Proxy({} as T, {
    get(target, prop) {
      if (module && prop in module) {
        return (module as any)[prop];
      }
      // Trigger loading if accessed
      load().then(() => {
        if (module && prop in module) {
          return (module as any)[prop];
        }
      });
      return undefined;
    },
  });
};
