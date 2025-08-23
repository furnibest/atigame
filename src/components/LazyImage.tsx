'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { optimizeSupabaseImage, generateLowQualityPlaceholder } from '@/lib/imageOptimization'

interface LazyImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  priority?: boolean
  sizes?: string
  rootMargin?: string
  threshold?: number
  onLoad?: () => void
  onError?: () => void
  style?: React.CSSProperties
}

export default function LazyImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  sizes,
  rootMargin = '50px',
  threshold = 0.1,
  onLoad,
  onError,
  style
}: LazyImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isInView, setIsInView] = useState(priority)
  const [hasStartedLoading, setHasStartedLoading] = useState(priority)
  const imgRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries
    if (entry.isIntersecting && !hasStartedLoading) {
      setIsInView(true)
      setHasStartedLoading(true)
      // Disconnect observer setelah mulai loading
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [hasStartedLoading])

  useEffect(() => {
    if (priority || hasStartedLoading) return

    // Setup Intersection Observer
    observerRef.current = new IntersectionObserver(handleIntersection, {
      rootMargin,
      threshold
    })

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [priority, hasStartedLoading, handleIntersection, rootMargin, threshold])

  const handleLoad = useCallback(() => {
    setIsLoading(false)
    onLoad?.()
  }, [onLoad])

  const handleError = useCallback(() => {
    setIsLoading(false)
    setHasError(true)
    onError?.()
  }, [onError])

  // Optimize image URL
  const optimizedSrc = optimizeSupabaseImage(src, { 
    width, 
    height, 
    quality: 85 
  })
  
  const blurDataURL = generateLowQualityPlaceholder(src)

  if (hasError) {
    return (
      <div className={`lazy-image-error ${className}`} style={style}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21,15 16,10 5,21"/>
        </svg>
        <span>Gambar tidak dapat dimuat</span>
      </div>
    )
  }

  return (
    <div ref={imgRef} className={`lazy-image-wrapper ${className}`} style={style}>
      {/* Loading skeleton */}
      {isLoading && (
        <div className="lazy-image-skeleton">
          <div className="skeleton-shimmer" />
        </div>
      )}

      {/* Actual image - only render when in view */}
      {isInView && (
        <Image
          src={optimizedSrc}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          priority={priority}
          placeholder="blur"
          blurDataURL={blurDataURL}
          onLoad={handleLoad}
          onError={handleError}
          className="lazy-image-content"
          style={{
            width: '100%',
            height: 'auto',
            opacity: isLoading ? 0 : 1,
            transition: 'opacity 0.3s ease'
          }}
        />
      )}

      {/* Placeholder when not in view */}
      {!isInView && (
        <div 
          className="lazy-image-placeholder"
          style={{ 
            aspectRatio: `${width}/${height}`,
            background: '#f8f9fa',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div className="spinner" />
        </div>
      )}
    </div>
  )
}