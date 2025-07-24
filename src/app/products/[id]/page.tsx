'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Layout from '@/components/Layout'

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
      <Layout>
        <div className="product-detail-container">
          <div className="loading">Loading...</div>
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <div className="product-detail-container">
          <div className="error">{error}</div>
        </div>
      </Layout>
    )
  }

  if (!product) {
    return (
      <Layout>
        <div className="product-detail-container">
          <div className="error">Product not found</div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="product-detail-container">
        <div className="product-detail-content">
          <div className="product-detail-image">
            {product.image && (
              <img src={product.image} alt={product.name} />
            )}
          </div>
          <div className="product-detail-info">
            <h1 className="product-detail-name">{product.name}</h1>
            <p className="product-detail-price">Rp {product.price?.toLocaleString('id-ID')}</p>
            {product.category && (
              <p className="product-detail-category">Kategori: {product.category}</p>
            )}
            <div className="product-detail-description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>
            <a
              href={`https://wa.me/6285291413603?text=Halo,%20saya%20tertarik%20dengan%20produk%20${encodeURIComponent(product.name)}`}
              className="wa-button"
              target="_blank"
              rel="noopener noreferrer"
            >
              Tanya via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </Layout>
  )
}