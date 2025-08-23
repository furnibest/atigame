'use client'

import React from 'react'

interface Review {
  id: number
  name: string
  rating: number
  comment: string
  date: string
  verified: boolean
}

interface ProductReviewsProps {
  productName: string
}

export default function ProductReviews({ productName }: ProductReviewsProps) {
  // Sample reviews - in real app, this would come from API
  const reviews: Review[] = [
    {
      id: 1,
      name: 'Budi Santoso',
      rating: 5,
      comment: 'Produk sangat berkualitas dan sesuai dengan deskripsi. Pengiriman cepat dan packaging rapi.',
      date: '2024-01-15',
      verified: true
    },
    {
      id: 2,
      name: 'Sari Dewi',
      rating: 5,
      comment: 'Pelayanan sangat memuaskan, produk original dan harga terjangkau. Recommended!',
      date: '2024-01-10',
      verified: true
    },
    {
      id: 3,
      name: 'Ahmad Rahman',
      rating: 4,
      comment: 'Kualitas bagus, hanya saja pengiriman agak lama. Tapi overall puas dengan produknya.',
      date: '2024-01-05',
      verified: false
    }
  ]

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length

  const renderStars = (rating: number, size: 'sm' | 'md' = 'sm') => {
    const stars = []
    const starSize = size === 'sm' ? 16 : 20
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg
          key={i}
          width={starSize}
          height={starSize}
          viewBox="0 0 24 24"
          fill={i <= rating ? '#ffc107' : 'none'}
          stroke={i <= rating ? '#ffc107' : '#e9ecef'}
          strokeWidth="2"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      )
    }
    return stars
  }

  return (
    <div className="product-reviews">
      <div className="reviews-header">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        <h3>Ulasan Pelanggan</h3>
      </div>

      <div className="reviews-summary">
        <div className="rating-overview">
          <div className="average-rating">
            <span className="rating-number">{averageRating.toFixed(1)}</span>
            <div className="rating-stars">
              {renderStars(Math.round(averageRating), 'md')}
            </div>
            <span className="rating-count">({reviews.length} ulasan)</span>
          </div>
        </div>
      </div>

      <div className="reviews-list">
        {reviews.map((review) => (
          <div key={review.id} className="review-item">
            <div className="review-header">
              <div className="reviewer-info">
                <div className="reviewer-avatar">
                  {review.name.charAt(0).toUpperCase()}
                </div>
                <div className="reviewer-details">
                  <div className="reviewer-name">
                    {review.name}
                    {review.verified && (
                      <span className="verified-badge">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M9 12l2 2 4-4"/>
                          <circle cx="12" cy="12" r="9"/>
                        </svg>
                        Terverifikasi
                      </span>
                    )}
                  </div>
                  <div className="review-meta">
                    <div className="review-rating">
                      {renderStars(review.rating)}
                    </div>
                    <span className="review-date">
                      {new Date(review.date).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="review-content">
              <p>{review.comment}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="reviews-cta">
        <p>Sudah pernah membeli produk ini?</p>
        <a
          href={`https://wa.me/6285291413603?text=Halo, saya ingin memberikan review untuk produk ${encodeURIComponent(productName)}`}
          className="review-cta-button"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 9V5a3 3 0 0 0-6 0v4"/>
            <rect x="2" y="9" width="20" height="12" rx="2" ry="2"/>
          </svg>
          Tulis Ulasan
        </a>
      </div>
    </div>
  )
}