'use client'

import { useEffect } from 'react'
import { optimizeSupabaseImage, preloadImage } from '@/lib/imageOptimization'

interface UseProductImagePreloaderProps {
  imageSrc: string | null
  priority?: boolean
}

export function useProductImagePreloader({ 
  imageSrc, 
  priority = false 
}: UseProductImagePreloaderProps) {
  useEffect(() => {
    if (!imageSrc) return

    const preloadImages = async () => {
      try {
        // Preload multiple sizes untuk responsive
        const sizes = [
          { width: 400, height: 300 }, // Card size
          { width: 800, height: 600 }, // Medium size
          { width: 1000, height: 750 } // Detail size
        ]

        const preloadPromises = sizes.map(({ width, height }) => {
          const optimizedUrl = optimizeSupabaseImage(imageSrc, {
            width,
            height,
            quality: 85,
            format: 'webp'
          })
          return preloadImage(optimizedUrl)
        })

        if (priority) {
          // Untuk priority images, preload semua size sekaligus
          await Promise.allSettled(preloadPromises)
        } else {
          // Untuk non-priority, preload secara bertahap
          for (const promise of preloadPromises) {
            await promise.catch(() => {}) // Ignore errors
            // Small delay between preloads
            await new Promise(resolve => setTimeout(resolve, 100))
          }
        }
      } catch (error) {
        console.warn('Image preload failed:', error)
      }
    }

    if (priority) {
      // Immediate preload for priority images
      preloadImages()
    } else {
      // Delayed preload for non-priority images
      const timeoutId = setTimeout(preloadImages, 500)
      return () => clearTimeout(timeoutId)
    }
  }, [imageSrc, priority])
}

// Hook untuk preload related products images
export function useRelatedProductsPreloader(products: Array<{ image: string | null }>) {
  useEffect(() => {
    if (!products.length) return

    const preloadRelatedImages = async () => {
      const imageSources = products
        .map(p => p.image)
        .filter(Boolean) as string[]

      if (!imageSources.length) return

      // Preload dengan delay untuk tidak mengganggu main content
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Preload card-sized images untuk related products
      const preloadPromises = imageSources.map(src => {
        const optimizedUrl = optimizeSupabaseImage(src, {
          width: 400,
          height: 300,
          quality: 80,
          format: 'webp'
        })
        return preloadImage(optimizedUrl)
      })

      // Preload dengan batasan concurrent
      const batchSize = 3
      for (let i = 0; i < preloadPromises.length; i += batchSize) {
        const batch = preloadPromises.slice(i, i + batchSize)
        await Promise.allSettled(batch)
        // Small delay between batches
        await new Promise(resolve => setTimeout(resolve, 200))
      }
    }

    preloadRelatedImages()
  }, [products])
}