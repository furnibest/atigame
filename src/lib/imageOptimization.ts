// Utility functions untuk optimasi gambar

export interface ImageTransformOptions {
  width?: number
  height?: number
  quality?: number
  format?: 'webp' | 'avif' | 'jpeg' | 'png'
  resize?: 'cover' | 'contain' | 'fill'
}

/**
 * Mengoptimalkan URL gambar Supabase dengan parameter transform
 */
export function optimizeSupabaseImage(
  url: string, 
  options: ImageTransformOptions = {}
): string {
  if (!url || !url.includes('supabase.co')) {
    return url
  }

  const {
    width,
    height,
    quality = 80,
    format = 'webp',
    resize = 'cover'
  } = options

  const params = new URLSearchParams()
  
  if (width) params.append('width', width.toString())
  if (height) params.append('height', height.toString())
  params.append('quality', quality.toString())
  params.append('format', format)
  params.append('resize', resize)

  return `${url}?${params.toString()}`
}

/**
 * Generate multiple sizes untuk responsive images
 */
export function generateResponsiveSizes(
  baseUrl: string,
  sizes: number[] = [400, 800, 1200]
): { src: string; width: number }[] {
  return sizes.map(width => ({
    src: optimizeSupabaseImage(baseUrl, { width, quality: 80 }),
    width
  }))
}

/**
 * Generate low quality placeholder
 */
export function generateLowQualityPlaceholder(url: string): string {
  return optimizeSupabaseImage(url, {
    width: 50,
    height: 50,
    quality: 20,
    format: 'jpeg'
  })
}

/**
 * Generate srcSet untuk responsive images
 */
export function generateSrcSet(baseUrl: string): string {
  const sizes = [400, 800, 1200, 1600]
  return sizes
    .map(width => {
      const optimizedUrl = optimizeSupabaseImage(baseUrl, { width, quality: 80 })
      return `${optimizedUrl} ${width}w`
    })
    .join(', ')
}

/**
 * Preload critical images with priority hints
 */
export function preloadImage(src: string, priority: 'high' | 'low' = 'low'): Promise<void> {
  return new Promise((resolve, reject) => {
    // Use link preload for high priority images
    if (priority === 'high' && typeof document !== 'undefined') {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = src
      link.onload = () => resolve()
      link.onerror = reject
      document.head.appendChild(link)
      return
    }

    // Standard image preload
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = reject
    img.src = src
  })
}

/**
 * Preload multiple images dengan priority
 */
export async function preloadImages(
  urls: string[], 
  options: { priority?: boolean; maxConcurrent?: number } = {}
): Promise<void> {
  const { priority = false, maxConcurrent = 3 } = options

  if (priority) {
    // Load semua sekaligus untuk priority images
    await Promise.allSettled(urls.map(url => preloadImage(url, 'high')))
  } else {
    // Load dengan batasan concurrent untuk non-priority
    for (let i = 0; i < urls.length; i += maxConcurrent) {
      const batch = urls.slice(i, i + maxConcurrent)
      await Promise.allSettled(batch.map(url => preloadImage(url, 'low')))
    }
  }
}

/**
 * Check if image format is supported
 */
export function isFormatSupported(format: string): boolean {
  if (typeof window === 'undefined') return false
  
  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  
  try {
    return canvas.toDataURL(`image/${format}`).indexOf(`image/${format}`) === 5
  } catch {
    return false
  }
}

/**
 * Get optimal format based on browser support
 */
export function getOptimalFormat(): 'avif' | 'webp' | 'jpeg' {
  if (isFormatSupported('avif')) return 'avif'
  if (isFormatSupported('webp')) return 'webp'
  return 'jpeg'
}
/*
*
 * Create intersection observer for lazy loading
 */
export function createLazyLoadObserver(
  callback: (entry: IntersectionObserverEntry) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver {
  const defaultOptions = {
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  }

  return new IntersectionObserver((entries) => {
    entries.forEach(callback)
  }, defaultOptions)
}

/**
 * Generate blur data URL for placeholder
 */
export function generateBlurDataURL(width: number = 10, height: number = 10): string {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''
  
  // Create gradient blur effect
  const gradient = ctx.createLinearGradient(0, 0, width, height)
  gradient.addColorStop(0, '#f0f0f0')
  gradient.addColorStop(1, '#e0e0e0')
  
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
  
  return canvas.toDataURL()
}

/**
 * Optimize image loading with WebP/AVIF detection
 */
export async function loadOptimizedImage(src: string, options: ImageTransformOptions = {}): Promise<string> {
  const format = getOptimalFormat()
  const optimizedSrc = optimizeSupabaseImage(src, { ...options, format })
  
  // Test if optimized image loads successfully
  try {
    await preloadImage(optimizedSrc)
    return optimizedSrc
  } catch {
    // Fallback to original if optimized fails
    return src
  }
}

/**
 * Batch image optimization for multiple images
 */
export async function batchOptimizeImages(
  images: Array<{ src: string; options?: ImageTransformOptions }>,
  concurrency: number = 3
): Promise<Array<{ original: string; optimized: string }>> {
  const results: Array<{ original: string; optimized: string }> = []
  
  for (let i = 0; i < images.length; i += concurrency) {
    const batch = images.slice(i, i + concurrency)
    const batchResults = await Promise.allSettled(
      batch.map(async ({ src, options }) => ({
        original: src,
        optimized: await loadOptimizedImage(src, options)
      }))
    )
    
    batchResults.forEach((result) => {
      if (result.status === 'fulfilled') {
        results.push(result.value)
      }
    })
  }
  
  return results
}