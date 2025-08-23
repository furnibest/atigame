'use client'

import { useEffect, useRef } from 'react'

interface PerformanceMetrics {
  lcp?: number
  fid?: number
  cls?: number
  fcp?: number
  ttfb?: number
}

interface PerformanceEventTiming extends PerformanceEntry {
  processingStart: number
}

interface LayoutShift extends PerformanceEntry {
  value: number
  hadRecentInput: boolean
}

export function usePerformanceMonitor() {
  const metricsRef = useRef<PerformanceMetrics>({})

  useEffect(() => {
    // Web Vitals monitoring
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        switch (entry.entryType) {
          case 'largest-contentful-paint':
            metricsRef.current.lcp = entry.startTime
            break
          case 'first-input':
            metricsRef.current.fid = (entry as PerformanceEventTiming).processingStart - entry.startTime
            break
          case 'layout-shift':
            if (!(entry as LayoutShift).hadRecentInput) {
              metricsRef.current.cls = (metricsRef.current.cls || 0) + (entry as LayoutShift).value
            }
            break
        }
      }
    })

    // Observe Web Vitals
    observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] })

    // Navigation timing
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    if (navigationEntry) {
      metricsRef.current.fcp = navigationEntry.responseStart - navigationEntry.fetchStart
      metricsRef.current.ttfb = navigationEntry.responseStart - navigationEntry.requestStart
    }

    return () => observer.disconnect()
  }, [])

  const reportMetrics = () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Performance Metrics:', metricsRef.current)
    }
    
    // Send to analytics service in production
    if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
      // Example: gtag('event', 'web_vitals', metricsRef.current)
    }
  }

  return { metrics: metricsRef.current, reportMetrics }
}