'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
  category: string
  featured: boolean
}

export default function ProductDetailPage() {
  const params = useParams()
  const id = params?.id as string
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    if (!id) return

    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error)
        } else {
          setProduct(data)
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching product:', err)
        setError('Failed to load product')
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <div className="loading-container">
        <img 
          src="https://i.pinimg.com/originals/b6/cb/9d/b6cb9d4f07d283faecec75a3613984ff.gif" 
          alt="Loading..." 
          className="loading-gif"
        />
        <p>Memuat detail produk...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="product-detail-container">
        <div className="error-container">
          <h2>Terjadi Kesalahan</h2>
          <p>{error}</p>
          <button 
            onClick={() => window.history.back()} 
            className="back-button"
          >
            ← Kembali
          </button>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="product-detail-container">
        <div className="error-container">
          <h2>Produk Tidak Ditemukan</h2>
          <p>Produk yang Anda cari tidak tersedia.</p>
          <button 
            onClick={() => window.history.back()} 
            className="back-button"
          >
            ← Kembali ke Produk
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        <button 
          onClick={() => window.history.back()} 
          className="back-button"
        >
          ← Kembali ke Produk
        </button>
        
        <div className="product-detail-content">
          <div className="product-detail-image">
            {product.image && !imageError ? (
              <div className="detail-image-container">
                {imageLoading && (
                  <div className="detail-image-loading">
                    <img 
                      src="https://i.pinimg.com/originals/b6/cb/9d/b6cb9d4f07d283faecec75a3613984ff.gif" 
                      alt="Loading..." 
                      className="detail-loading-gif"
                    />
                    <p>Memuat gambar...</p>
                  </div>
                )}
                <img 
                  src={product.image} 
                  alt={product.name}
                  onLoad={() => setImageLoading(false)}
                  onError={() => {
                    setImageLoading(false)
                    setImageError(true)
                  }}
                  style={{ display: imageLoading ? 'none' : 'block' }}
                />
              </div>
            ) : (
              <div className="no-image-placeholder-detail">
                No Image Available
              </div>
            )}
          </div>
          
          <div className="product-detail-info">
            <div className="product-detail-header">
              <h1 className="product-detail-name">{product.name}</h1>
              <div className="product-detail-price">Rp {product.price?.toLocaleString('id-ID')}</div>
              
              <div className="product-detail-badges">
                <span className="category-badge-detail">{product.category}</span>
                {product.featured && (
                  <span className="featured-badge-detail">UNGGULAN</span>
                )}
              </div>
            </div>

            <div className="product-detail-description">
              <h3>Deskripsi Produk</h3>
              <p>{product.description}</p>
            </div>

            <div className="product-detail-actions">
              <a
                href={`https://wa.me/6285291413603?text=Halo, saya tertarik dengan ${encodeURIComponent(product.name)} - Rp ${product.price?.toLocaleString('id-ID')}. Bisa minta info lebih detail?`}
                className="wa-button-detail"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                Order via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}