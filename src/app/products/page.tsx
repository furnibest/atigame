'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string | null
  category: string
  featured: boolean
}

function ProductsContent() {
  const [selectedCategory, setSelectedCategory] = useState('Semua Produk');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAllFeatured, setShowAllFeatured] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const searchParams = useSearchParams();
  const searchQuery = searchParams?.get('search') || '';
  
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.category-dropdown')) {
        setShowCategoryDropdown(false);
      }
    };

    if (showCategoryDropdown) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showCategoryDropdown]);

  // Get unique categories from products
  const categories = ['Semua Produk', ...Array.from(new Set(products.map(p => p.category)))];
  
  const filteredProducts = products.filter(product => {
    // Filter by category
    const categoryMatch = selectedCategory === 'Semua Produk' || product.category === selectedCategory;
    
    // Filter by search query
    const searchMatch = !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    return categoryMatch && searchMatch;
  });

  if (loading) {
    return <div style={{textAlign: 'center', padding: '3rem'}}>Loading products...</div>;
  }

  return (
    <>
      <div className="products-hero">
        <h1 className="products-title">Our Products</h1>
        <p className="products-subtitle">Discover our collection of premium outdoor furniture</p>
      </div>
      
      {searchQuery && (
        <div style={{textAlign: 'center', padding: '1rem', background: '#f8f9fa', margin: '1rem 2rem', borderRadius: '8px'}}>
          <p>Hasil pencarian untuk: <strong>&quot;{searchQuery}&quot;</strong> ({filteredProducts.length} produk ditemukan)</p>
        </div>
      )}

      {/* Featured Products Section */}
      {!searchQuery && (() => {
        const featuredProducts = products.filter(p => p.featured);
        const displayedFeatured = showAllFeatured ? featuredProducts : featuredProducts.slice(0, 4);
        const hasMoreFeatured = featuredProducts.length > 4;

        return featuredProducts.length > 0 && (
          <div style={{padding: '2rem', maxWidth: '1200px', margin: '0 auto'}}>
            <div className="featured-header">
              <h2 className="featured-title">
                Produk Unggulan
              </h2>
              {hasMoreFeatured && (
                <button
                  onClick={() => setShowAllFeatured(!showAllFeatured)}
                  className="featured-toggle-btn"
                >
                  {showAllFeatured ? 'Tampilkan Lebih Sedikit' : `Lihat Semua Unggulan (${featuredProducts.length})`}
                </button>
              )}
            </div>
            <div className="products-grid">
              {displayedFeatured.map(product => (
                <div key={product.id} className="product-card">
                  <div className="product-image-wrapper">
                    {product.image ? (
                      <img src={product.image} alt={product.name} />
                    ) : (
                      <div style={{
                        width: '100%',
                        height: '200px',
                        background: '#f0f0f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#999'
                      }}>
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-desc">{product.description}</p>
                    <div className="product-price">
                      Rp {product.price.toLocaleString('id-ID')}
                    </div>
                    <span style={{
                      background: '#bfa16a',
                      color: 'white',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      display: 'inline-block',
                      marginTop: '0.5rem'
                    }}>
                      UNGGULAN
                    </span>
                    <a 
                      href={`https://wa.me/6285291413603?text=Halo, saya tertarik dengan ${product.name} - Rp ${product.price.toLocaleString('id-ID')}`}
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="wa-product-btn"
                    >
                      Order via WhatsApp
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}
      
      <div className="products-filter-bar">
        {/* Desktop Category Buttons */}
        <div className="category-btn-group desktop-only">
          {categories.map(category => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Mobile Category Dropdown */}
        <div className="category-dropdown mobile-only">
          <button 
            className={`category-dropdown-btn ${showCategoryDropdown ? 'open' : ''}`}
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
          >
            <span>{selectedCategory}</span>
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="1"/>
              <circle cx="19" cy="12" r="1"/>
              <circle cx="5" cy="12" r="1"/>
            </svg>
          </button>
          
          {showCategoryDropdown && (
            <>
              <div 
                className="category-dropdown-overlay"
                onClick={() => setShowCategoryDropdown(false)}
              />
              <div className="category-dropdown-menu">
                {categories.map(category => (
                  <button
                    key={category}
                    className={`category-dropdown-item ${selectedCategory === category ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedCategory(category);
                      setShowCategoryDropdown(false);
                    }}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      
      <div style={{padding: '2rem', maxWidth: '1200px', margin: '0 auto'}}>
        <h2 style={{textAlign: 'center', marginBottom: '2rem', fontSize: '2rem', color: '#333'}}>
          {selectedCategory === 'Semua Produk' ? 'Semua Produk' : `Kategori: ${selectedCategory}`}
        </h2>
        <div className="products-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image-wrapper">
                  {product.image ? (
                    <img src={product.image} alt={product.name} />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '200px',
                      background: '#f0f0f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#999'
                    }}>
                      No Image
                    </div>
                  )}
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-desc">{product.description}</p>
                  <div className="product-price">
                    Rp {product.price.toLocaleString('id-ID')}
                  </div>
                  <div style={{display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap'}}>
                    <span style={{
                      background: '#e9ecef',
                      color: '#495057',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      fontWeight: 'bold'
                    }}>
                      {product.category}
                    </span>
                    {product.featured && (
                      <span style={{
                        background: '#bfa16a',
                        color: 'white',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold'
                      }}>
                        UNGGULAN
                      </span>
                    )}
                  </div>
                  <a 
                    href={`https://wa.me/6285291413603?text=Halo, saya tertarik dengan ${product.name} - Rp ${product.price.toLocaleString('id-ID')}`}
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="wa-product-btn"
                  >
                    Order via WhatsApp
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div style={{gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: '#666'}}>
              <p>Tidak ada produk yang ditemukan {searchQuery && `untuk &quot;${searchQuery}&quot;`}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
}