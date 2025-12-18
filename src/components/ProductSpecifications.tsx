'use client'

import React from 'react'

interface ProductSpecificationsProps {
  category: string
}

export default function ProductSpecifications({ category }: ProductSpecificationsProps) {
  // Spesifikasi berdasarkan kategori produk
  const getSpecifications = (category: string) => {
    const specs: Record<string, Array<{label: string, value: string}>> = {
      'Furniture': [
        { label: 'Material', value: 'Kayu Jati Premium' },
        { label: 'Finishing', value: 'Natural Wood Coating' },
        { label: 'Garansi', value: '2 Tahun' },
        { label: 'Perawatan', value: 'Mudah Dibersihkan' }
      ],
      'Elektronik': [
        { label: 'Daya', value: 'Energy Efficient' },
        { label: 'Garansi', value: '1 Tahun Resmi' },
        { label: 'Sertifikat', value: 'SNI & ISO' },
        { label: 'Support', value: '24/7 Customer Service' }
      ],
      'Fashion': [
        { label: 'Bahan', value: 'Premium Cotton' },
        { label: 'Ukuran', value: 'S, M, L, XL' },
        { label: 'Perawatan', value: 'Machine Washable' },
        { label: 'Origin', value: 'Made in Indonesia' }
      ],
      'Makanan': [
        { label: 'Kemasan', value: 'Food Grade Packaging' },
        { label: 'Expired', value: '6 Bulan dari Produksi' },
        { label: 'Halal', value: 'Bersertifikat MUI' },
        { label: 'Storage', value: 'Suhu Ruang' }
      ],
      'Kesehatan': [
        { label: 'Sertifikat', value: 'BPOM & Halal MUI' },
        { label: 'Komposisi', value: '100% Natural' },
        { label: 'Usia', value: 'Dewasa & Anak' },
        { label: 'Efek Samping', value: 'Tidak Ada' }
      ]
    }

    return specs[category] || [
      { label: 'Kualitas', value: 'Premium Quality' },
      { label: 'Garansi', value: 'Sesuai Standar' },
      { label: 'Origin', value: 'Indonesia' },
      { label: 'Support', value: 'Customer Service' }
    ]
  }

  const specifications = getSpecifications(category)

  return (
    <div className="product-specifications">
      <div className="specifications-header">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <rect x="7" y="7" width="3" height="9"/>
          <rect x="14" y="7" width="3" height="5"/>
        </svg>
        <h3>Spesifikasi Produk</h3>
      </div>
      <div className="specifications-grid">
        {specifications.map((spec, index) => (
          <div key={index} className="specification-item">
            <div className="spec-label">{spec.label}</div>
            <div className="spec-divider">:</div>
            <div className="spec-value">{spec.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}