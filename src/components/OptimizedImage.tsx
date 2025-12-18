'use client'

import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { optimizeSupabaseImage, generateLowQualityPlaceholder, getOptimalFormat } from '@/lib/imageOptimization'

interface OptimizedImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  priority?: boolean
  sizes?: string
  onLoad?: () => void
  onError?: () => void
  style?: React.CSSProperties
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  sizes,
  onLoad,
  onError,
  style
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isInView, setIsInView] = useState(priority)
  const imgRef = useRef<HTMLDivElement>(null)

  // Enhanced Intersection Observer untuk lazy loading
  useEffect(() => {
    if (priority) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: '100px', // Increased for better UX
        threshold: 0.1
      }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [priority])

  // Preload on hover for better perceived performance
  useEffect(() => {
    if (!priority && isInView) return

    const handleMouseEnter = () => {
      if (!isInView) {
        setIsInView(true)
      }
    }

    const element = imgRef.current
    if (element) {
      element.addEventListener('mouseenter', handleMouseEnter, { once: true })
      return () => element.removeEventListener('mouseenter', handleMouseEnter)
    }
  }, [isInView, priority])

  const handleLoad = () => {
    setIsLoading(false)
    onLoad?.()
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
    onError?.()
  }

  // Optimize image URL dan generate placeholder
  const optimizedSrc = optimizeSupabaseImage(src, { 
    width, 
    height, 
    quality: 85,
    format: getOptimalFormat()
  })
  
  const blurDataURL = generateLowQualityPlaceholder(src)

  return (
    <div ref={imgRef} className={`optimized-image-wrapper ${className}`} style={style}>
      {isLoading && (
        <div className="image-loading-placeholder">
          <div className="spinner" />
        </div>
      )}
      
      {hasError ? (
        <div className="image-error-placeholder">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21,15 16,10 5,21"/>
          </svg>
          <span>Gambar tidak dapat dimuat</span>
        </div>
      ) : isInView ? (
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
          style={{
            display: isLoading ? 'none' : 'block',
            width: '100%',
            height: 'auto'
          }}
        />
      ) : (
        <div className="image-placeholder" style={{ aspectRatio: `${width}/${height}` }}>
          <div className="spinner" />
        </div>
      )}
    </div>
  )
}