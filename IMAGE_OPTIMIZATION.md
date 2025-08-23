# Optimasi Loading Gambar Produk

## Masalah yang Diperbaiki
- Loading gambar produk yang lambat
- Tidak ada feedback visual saat loading
- Gambar dimuat sekaligus tanpa prioritas
- Tidak ada optimasi format gambar

## Solusi yang Diimplementasikan

### 1. Komponen LazyImage
- **Lazy Loading**: Gambar hanya dimuat saat mendekati viewport (100px sebelum terlihat)
- **Intersection Observer**: Menggunakan API browser untuk deteksi visibility yang efisien
- **Priority Loading**: Gambar featured dimuat dengan prioritas tinggi
- **Progressive Loading**: Menampilkan skeleton loading dan blur placeholder

### 2. Optimasi URL Gambar Supabase
- **Format Modern**: Otomatis menggunakan WebP/AVIF jika didukung browser
- **Responsive Sizing**: Mengoptimalkan ukuran gambar berdasarkan device
- **Quality Control**: Mengatur kualitas gambar (85% untuk balance size/quality)
- **Transform Parameters**: Menggunakan Supabase transform API

### 3. Komponen OptimizedImage & ProgressiveImage
- **Multiple Loading States**: Skeleton → Low Quality → High Quality
- **Error Handling**: Fallback UI yang user-friendly
- **Blur Placeholder**: Base64 encoded placeholder untuk smooth transition

### 4. Konfigurasi Next.js
- **Image Formats**: WebP dan AVIF untuk kompresi optimal
- **Device Sizes**: Responsive breakpoints yang optimal
- **Cache TTL**: 60 detik minimum cache untuk performa

### 5. Hooks Custom
- **useImagePreloader**: Preload gambar dengan priority control
- **useMultipleImagePreloader**: Batch preloading dengan concurrency limit
- **useProductImagePreloader**: Preload multiple sizes untuk product images
- **useRelatedProductsPreloader**: Batch preload untuk related products

### 6. Komponen Khusus Detail Page
- **ProductDetailImage**: Progressive loading dengan low→high quality transition
- **ImageZoomModal**: Modal untuk melihat gambar resolusi tinggi
- **Multiple Resolution Support**: 400px (card) → 1000px (detail) → 1920px (zoom)

## Fitur Utama

### Lazy Loading dengan Intersection Observer
```typescript
// Gambar dimuat 100px sebelum masuk viewport
<LazyImage
  src={product.image}
  rootMargin="100px"
  priority={product.featured}
/>
```

### Optimasi URL Otomatis
```typescript
// Otomatis mengoptimalkan URL Supabase
const optimizedUrl = optimizeSupabaseImage(originalUrl, {
  width: 400,
  height: 300,
  quality: 85,
  format: 'webp'
})
```

### Progressive Loading
```typescript
// Menampilkan skeleton → blur → gambar asli
<ProgressiveImage
  src={highQualityUrl}
  lowQualitySrc={lowQualityUrl}
  placeholder="blur"
/>
```

## Peningkatan Performa

### Before (Masalah):
- ❌ Semua gambar dimuat sekaligus
- ❌ Tidak ada loading indicator
- ❌ Format gambar tidak optimal
- ❌ Ukuran gambar tidak responsive

### After (Solusi):
- ✅ Lazy loading dengan Intersection Observer
- ✅ Skeleton loading dan blur placeholder
- ✅ Format WebP/AVIF otomatis
- ✅ Responsive image sizing
- ✅ Priority loading untuk featured products
- ✅ Error handling yang baik
- ✅ Preloading untuk critical images

## Penggunaan

### ProductCard (Lazy Loading)
```typescript
<LazyImage
  src={product.image}
  alt={product.name}
  width={400}
  height={300}
  priority={product.featured}
  rootMargin="100px"
/>
```

### ProductQuickView (Priority Loading)
```typescript
<OptimizedImage
  src={product.image}
  alt={product.name}
  width={800}
  height={600}
  priority={true}
/>
```

### ProductDetailPage (Progressive + Zoom)
```typescript
<ProductDetailImage
  src={product.image}
  alt={product.name}
  onLoad={() => setImageLoading(false)}
  onError={() => setImageError(true)}
/>
```

## Metrics yang Diharapkan
- **Loading Time**: Berkurang 40-60%
- **Bandwidth Usage**: Berkurang 30-50% dengan WebP/AVIF
- **User Experience**: Loading visual yang smooth
- **Core Web Vitals**: Peningkatan LCP dan CLS scores

## Browser Support
- **WebP**: 95%+ browser modern
- **AVIF**: 85%+ browser terbaru
- **Intersection Observer**: 95%+ browser modern
- **Fallback**: JPEG untuk browser lama