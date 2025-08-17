'use client'

import React, { useState, useEffect, Suspense } from 'react'
import ProductCard from '@/components/ProductCard'
import LoadingSpinner from '@/components/LoadingSpinner'

interface Product {
  id: number
  name: string
  description: string
  image: string | null
  category: string
  featured: boolean
}

function ProductsContent() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [view] = useState<'grid' | 'compact'>('compact')

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        if (Array.isArray(data)) {
          setProducts(data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const featuredProducts = products.filter(p => p.featured)

  if (loading) {
    return <LoadingSpinner message="Memuat produk..." />
  }

  return (
    <>
      <div className="products-hero">
        <h1 className="products-title">Produk Unggulan</h1>
        <p className="products-subtitle">Temukan pilihan terbaik dari koleksi kami</p>
      </div>

      <div style={{ padding: '2rem 0', maxWidth: '1200px', margin: '0 auto' }}>
        <div className={`products-grid compact`}>
          {featuredProducts.length > 0 ? (
            featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: '#666' }}>
              <p>Belum ada produk unggulan.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <LoadingSpinner message="Memuat halaman..." />
    }>
      <ProductsContent />
    </Suspense>
  );
}