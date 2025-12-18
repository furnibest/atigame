'use client'

import { useEffect, useState } from 'react'

interface UseImagePreloaderProps {
  src: string
  priority?: boolean
}

export function useImagePreloader({ src, priority = false }: UseImagePreloaderProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (!src) return

    // Jika priority, langsung preload
    if (priority) {
      const img = new Image()
      img.onload = () => setIsLoaded(true)
      img.onerror = () => setHasError(true)
      img.src = src
      return
    }

    // Untuk non-priority, gunakan requestIdleCallback jika tersedia
    const preloadImage = () => {
      const img = new Image()
      img.onload = () => setIsLoaded(true)
      img.onerror = () => setHasError(true)
      img.src = src
    }

    if ('requestIdleCallback' in window) {
      requestIdleCallback(preloadImage)
    } else {
      setTimeout(preloadImage, 100)
    }
  }, [src, priority])

  return { isLoaded, hasError }
}

// Hook untuk preload multiple images
export function useMultipleImagePreloader(sources: string[], priority = false) {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())
  const [errorImages, setErrorImages] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!sources.length) return

    const preloadImages = () => {
      sources.forEach(src => {
        const img = new Image()
        img.onload = () => {
          setLoadedImages(prev => new Set(prev).add(src))
        }
        img.onerror = () => {
          setErrorImages(prev => new Set(prev).add(src))
        }
        img.src = src
      })
    }

    if (priority) {
      preloadImages()
    } else if ('requestIdleCallback' in window) {
      requestIdleCallback(preloadImages)
    } else {
      setTimeout(preloadImages, 200)
    }
  }, [sources, priority])

  return {
    loadedImages,
    errorImages,
    allLoaded: loadedImages.size === sources.length,
    loadedCount: loadedImages.size
  }
}