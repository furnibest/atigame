'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { optimizeSupabaseImage, generateLowQualityPlaceholder } from '@/lib/imageOptimization'
import ImageZoomModal from './ImageZoomModal'

interface ProductDetailImageProps {
  src: string
  alt: string
  onLoad?: () => void
  onError?: () => void
}

export default function ProductDetailImage({ 
  src, 
  alt, 
  onLoad, 
  onError 
}: ProductDetailImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [showLowQuality, setShowLowQuality] = useState(true)
  const [isZoomOpen, setIsZoomOpen] = useState(false)

  // Generate optimized URLs
  const highQualityUrl = optimizeSupabaseImage(src, {
    width: 1000,
    height: 750,
    quality: 90,
    format: 'webp'
  })

  const lowQualityUrl = optimizeSupabaseImage(src, {
    width: 100,
    height: 75,
    quality: 30,
    format: 'jpeg'
  })

  const blurDataURL = generateLowQualityPlaceholder(src)

  const handleHighQualityLoad = useCallback(() => {
    setIsLoading(false)
    setShowLowQuality(false)
    onLoad?.()
  }, [onLoad])

  const handleError = useCallback(() => {
    setIsLoading(false)
    setHasError(true)
    onError?.()
  }, [onError])

  // Preload high quality image
  useEffect(() => {
    const img = new window.Image()
    img.onload = handleHighQualityLoad
    img.onerror = handleError
    img.src = highQualityUrl
  }, [highQualityUrl, handleHighQualityLoad, handleError])

  if (hasError) {
    return (
      <div className="product-detail-image-error">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21,15 16,10 5,21"/>
        </svg>
        <h3>Gambar tidak dapat dimuat</h3>
        <p>Terjadi kesalahan saat memuat gambar produk</p>
      </div>
    )
  }

  return (
    <>
      <div 
        className="product-detail-image-wrapper"
        onClick={() => !isLoading && !hasError && setIsZoomOpen(true)}
      >
        {/* Loading skeleton */}
        {isLoading && (
          <div className="product-detail-image-skeleton">
            <div className="skeleton-shimmer" />
            <div className="loading-text">
              <div className="spinner spinner-lg" />
              <p>Memuat gambar berkualitas tinggi...</p>
            </div>
          </div>
        )}

        {/* Low quality placeholder */}
        {showLowQuality && (
          <Image
            src={lowQualityUrl}
            alt={alt}
            width={1000}
            height={750}
            className="product-detail-image-low-quality"
            placeholder="blur"
            blurDataURL={blurDataURL}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'blur(8px)',
              transition: 'opacity 0.5s ease',
              opacity: isLoading ? 1 : 0
            }}
          />
        )}

        {/* High quality image */}
        <Image
          src={highQualityUrl}
          alt={alt}
          width={1000}
          height={750}
          sizes="(max-width: 768px) 100vw, 800px"
          priority
          className="product-detail-image-high-quality"
          style={{
            width: '100%',
            height: 'auto',
            opacity: isLoading ? 0 : 1,
            transition: 'opacity 0.5s ease',
            position: 'relative',
            zIndex: 2
          }}
        />

        {/* Image zoom hint */}
        {!isLoading && !hasError && (
          <div className="image-zoom-hint">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
              <path d="M11 8v6"/>
              <path d="M8 11h6"/>
            </svg>
            <span>Klik untuk memperbesar</span>
          </div>
        )}
      </div>

      {/* Zoom Modal */}
      <ImageZoomModal
        src={src}
        alt={alt}
        isOpen={isZoomOpen}
        onClose={() => setIsZoomOpen(false)}
      />
    </>
  )
}