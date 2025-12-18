'use client'

import { useEffect } from 'react'
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor'

export default function WebVitals() {
  const { reportMetrics } = usePerformanceMonitor()

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered:', registration)
        })
        .catch((error) => {
          console.log('SW registration failed:', error)
        })
    }

    // Report metrics after page load
    const timer = setTimeout(() => {
      reportMetrics()
    }, 3000)

    return () => clearTimeout(timer)
  }, [reportMetrics])

  // Preload critical resources
  useEffect(() => {
    const preloadLinks = [
      { href: '/images/home.jpg', as: 'image' },
      { href: '/images/produkhero.jpg', as: 'image' },
    ]

    preloadLinks.forEach(({ href, as }) => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = href
      link.as = as
      document.head.appendChild(link)
    })
  }, [])

  return null
}