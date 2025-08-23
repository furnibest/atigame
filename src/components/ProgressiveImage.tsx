'use client'

import React, { useState } from 'react'
import Image from 'next/image'

interface ProgressiveImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  priority?: boolean
  sizes?: string
  lowQualitySrc?: string
  onLoad?: () => void
  onError?: () => void
  style?: React.CSSProperties
}

export default function ProgressiveImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  sizes,
  lowQualitySrc,
  onLoad,
  onError,
  style
}: ProgressiveImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [showLowQuality, setShowLowQuality] = useState(!!lowQualitySrc)

  // Generate low quality placeholder jika tidak disediakan
  const generateLowQualityUrl = (originalSrc: string) => {
    if (originalSrc.includes('supabase.co')) {
      // Untuk Supabase, tambahkan parameter transform
      return `${originalSrc}?width=50&height=50&quality=20`
    }
    return originalSrc
  }

  const lowQualityUrl = lowQualitySrc || generateLowQualityUrl(src)

  const handleHighQualityLoad = () => {
    setIsLoading(false)
    setShowLowQuality(false)
    onLoad?.()
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
    onError?.()
  }

  const blurDataURL = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="

  if (hasError) {
    return (
      <div className={`progressive-image-error ${className}`} style={style}>
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
    <div className={`progressive-image-wrapper ${className}`} style={style}>
      {/* Loading skeleton */}
      {isLoading && (
        <div className="progressive-image-skeleton">
          <div className="skeleton-shimmer" />
        </div>
      )}

      {/* Low quality image (blur placeholder) */}
      {showLowQuality && lowQualityUrl !== src && (
        <Image
          src={lowQualityUrl}
          alt={alt}
          width={width}
          height={height}
          className="progressive-image-low-quality"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'blur(10px)',
            transition: 'opacity 0.3s ease'
          }}
        />
      )}

      {/* High quality image */}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        priority={priority}
        placeholder="blur"
        blurDataURL={blurDataURL}
        onLoad={handleHighQualityLoad}
        onError={handleError}
        className="progressive-image-high-quality"
        style={{
          width: '100%',
          height: 'auto',
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.3s ease'
        }}
      />
    </div>
  )
}