'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { optimizeSupabaseImage } from '@/lib/imageOptimization'

interface ImageZoomModalProps {
  src: string
  alt: string
  isOpen: boolean
  onClose: () => void
}

export default function ImageZoomModal({ src, alt, isOpen, onClose }: ImageZoomModalProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  // High resolution image for zoom
  const zoomImageUrl = optimizeSupabaseImage(src, {
    width: 1920,
    height: 1440,
    quality: 95,
    format: 'webp'
  })

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div 
      className="image-zoom-modal-overlay" 
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={`Gambar diperbesar: ${alt}`}
    >
      <div className="image-zoom-modal-content">
        <button 
          className="image-zoom-modal-close"
          onClick={onClose}
          aria-label="Tutup gambar"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <div className="image-zoom-modal-image">
          {isLoading && (
            <div className="image-zoom-loading">
              <div className="spinner spinner-xl" />
              <p>Memuat gambar resolusi tinggi...</p>
            </div>
          )}

          {hasError ? (
            <div className="image-zoom-error">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21,15 16,10 5,21"/>
              </svg>
              <p>Gagal memuat gambar resolusi tinggi</p>
            </div>
          ) : (
            <Image
              src={zoomImageUrl}
              alt={alt}
              width={1920}
              height={1440}
              className="zoom-image"
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false)
                setHasError(true)
              }}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                opacity: isLoading ? 0 : 1,
                transition: 'opacity 0.3s ease'
              }}
            />
          )}
        </div>

        <div className="image-zoom-modal-info">
          <h3>{alt}</h3>
          <p>Klik di luar gambar atau tekan ESC untuk menutup</p>
        </div>
      </div>
    </div>
  )
}