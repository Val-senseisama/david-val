// Performance monitoring utilities

export interface PerformanceMetrics {
  initialLoadTime: number;
  componentLoadTimes: Record<string, number>;
  modelLoadTimes: Record<string, number>;
  memoryUsage?: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    initialLoadTime: 0,
    componentLoadTimes: {},
    modelLoadTimes: {}
  };

  private startTime = performance.now();

  constructor() {
    this.initializeMonitoring();
  }

  private initializeMonitoring() {
    // Track initial page load
    if (typeof window !== 'undefined') {
      window.addEventListener('load', () => {
        this.metrics.initialLoadTime = performance.now() - this.startTime;
        this.logMetrics();
      });
    }
  }

  trackComponentLoad(componentName: string, loadTime: number) {
    this.metrics.componentLoadTimes[componentName] = loadTime;
  }

  trackModelLoad(modelName: string, loadTime: number) {
    this.metrics.modelLoadTimes[modelName] = loadTime;
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  private logMetrics() {
    if (process.env.NODE_ENV === 'development') {
      console.group('🚀 Performance Metrics');
      console.log('Initial Load Time:', `${this.metrics.initialLoadTime.toFixed(2)}ms`);
      
      if (Object.keys(this.metrics.componentLoadTimes).length > 0) {
        console.group('Component Load Times:');
        Object.entries(this.metrics.componentLoadTimes).forEach(([name, time]) => {
          console.log(`${name}: ${time.toFixed(2)}ms`);
        });
        console.groupEnd();
      }

      if (Object.keys(this.metrics.modelLoadTimes).length > 0) {
        console.group('3D Model Load Times:');
        Object.entries(this.metrics.modelLoadTimes).forEach(([name, time]) => {
          console.log(`${name}: ${time.toFixed(2)}ms`);
        });
        console.groupEnd();
      }
      
      console.groupEnd();
    }
  }
}

// Create singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Utility functions
export function measureComponentLoad(componentName: string, loadStart: number) {
  const loadTime = performance.now() - loadStart;
  performanceMonitor.trackComponentLoad(componentName, loadTime);
  return loadTime;
}

export function measureModelLoad(modelName: string, loadStart: number) {
  const loadTime = performance.now() - loadStart;
  performanceMonitor.trackModelLoad(modelName, loadTime);
  return loadTime;
}

// Memory usage tracking (if available)
export function getMemoryUsage(): number | undefined {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    return memory.usedJSHeapSize / 1024 / 1024; // Convert to MB
  }
  return undefined;
} 