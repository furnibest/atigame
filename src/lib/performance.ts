// Performance utilities for optimization
import React from 'react'

/**
 * Debounce function to limit function calls
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Throttle function to limit function calls
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

/**
 * Lazy load component with dynamic import
 */
export function lazyLoad<T extends React.ComponentType>(
  importFunc: () => Promise<{ default: T }>
) {
  return React.lazy(importFunc)
}

/**
 * Measure component render time
 */
export function measureRenderTime(componentName: string) {
  if (process.env.NODE_ENV === 'development') {
    const startTime = performance.now()
    
    setTimeout(() => {
      const endTime = performance.now()
      console.log(`${componentName} render time: ${endTime - startTime}ms`)
    }, 0)
  }
}

/**
 * Virtual scrolling for large lists
 */
export function useVirtualScroll<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number
) {
  const [scrollTop, setScrollTop] = React.useState(0)
  
  const startIndex = Math.floor(scrollTop / itemHeight)
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  )
  
  const visibleItems = items.slice(startIndex, endIndex)
  const totalHeight = items.length * itemHeight
  const offsetY = startIndex * itemHeight
  
  return {
    visibleItems,
    totalHeight,
    offsetY,
    onScroll: (e: React.UIEvent<HTMLDivElement>) => {
      setScrollTop(e.currentTarget.scrollTop)
    }
  }
}

/**
 * Intersection observer hook for visibility tracking
 */
export function useIntersectionObserver(
  ref: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = React.useState(false)
  
  React.useEffect(() => {
    const element = ref.current
    if (!element) return
    
    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      options
    )
    
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref, options])
  
  return isIntersecting
}

/**
 * Preload route for faster navigation
 */
export function preloadRoute(href: string) {
  if (typeof window !== 'undefined') {
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = href
    document.head.appendChild(link)
  }
}

/**
 * Memory usage monitor (development only)
 */
export function useMemoryMonitor() {
  React.useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return
    
    const logMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as Performance & { memory: { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number } }).memory
        console.log('Memory usage:', {
          used: Math.round(memory.usedJSHeapSize / 1048576) + ' MB',
          total: Math.round(memory.totalJSHeapSize / 1048576) + ' MB',
          limit: Math.round(memory.jsHeapSizeLimit / 1048576) + ' MB'
        })
      }
    }
    
    const interval = setInterval(logMemory, 10000) // Log every 10 seconds
    return () => clearInterval(interval)
  }, [])
}