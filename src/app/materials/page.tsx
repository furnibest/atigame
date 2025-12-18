"use client"
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

type MaterialItem = {
  name: string
  image: string
  desc: string
  category: 'Kayu' | 'Rotan' | 'Kain'
}

const woods: Omit<MaterialItem, 'category'>[] = [
  {
    name: 'Kayu Jati',
    image: '/images/jati.jpg',
    desc: 'Kayu jati terkenal sangat kuat, tahan cuaca, dan memiliki serat indah. Pilihan utama untuk furniture outdoor premium.'
  }
]

const rattans: Omit<MaterialItem, 'category'>[] = [
  {
    name: 'Rotan Alami',
    image: '/images/rotan alami.jpg',
    desc: 'Rotan asli dari alam, serat kuat dan fleksibel, cocok untuk nuansa natural.'
  },
  {
    name: 'Rotan Sintetis',
    image: '/images/rotan sistesis.jpg',
    desc: 'Rotan buatan dari plastik khusus, tahan cuaca dan mudah dibersihkan.'
  }
]

const fabrics: Omit<MaterialItem, 'category'>[] = [
  {
    name: 'Kain Parasit',
    image: '/images/Parasit.jpeg',
    desc: 'Kain parasit ringan, tipis, dan tahan air, cocok untuk pelapis luar.'
  },
  {
    name: 'Kain Kantata',
    image: '/images/Kantata.jpeg',
    desc: 'Kain kanvas tebal, kuat, dan tahan lama, cocok untuk outdoor.'
  },
  {
    name: 'Kain Unione',
    image: '/images/Union.jpeg',
    desc: 'Kain unione lembut, nyaman, dan memiliki tekstur halus.'
  },
  {
    name: 'Kain Nagata',
    image: '/images/Nagata.jpeg',
    desc: 'Kain nagata terkenal kuat, awet, dan banyak digunakan untuk seragam.'
  },
  {
    name: 'Kain SR 10',
    image: '/images/SR 10.jpeg',
    desc: 'Kain SR 10 adalah kain sintetis dengan daya tahan tinggi dan warna cerah.'
  }
]

export default function MaterialsPage() {
  const [selected, setSelected] = useState<MaterialItem | null>(null)
  const allMaterials: MaterialItem[] = [
    ...woods.map((item) => ({ ...item, category: 'Kayu' as const })),
    ...rattans.map((item) => ({ ...item, category: 'Rotan' as const })),
    ...fabrics.map((item) => ({ ...item, category: 'Kain' as const })),
  ]

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setSelected(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const renderCard = (item: MaterialItem) => (
    <button
      key={`${item.category}-${item.name}`}
      className="material-card material-card-action"
      onClick={() => setSelected(item)}
      aria-label={`Lihat detail ${item.name}`}
    >
      <div className="material-image-wrapper">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
          style={{ objectFit: 'cover' }}
        />
        <div className="material-card-overlay">
          {/* kategori disembunyikan pada landing */}
          <h3 className="material-card-title">{item.name}</h3>
          <span className="material-view-btn">Lihat detail</span>
        </div>
      </div>
    </button>
  )

  return (
    <div className="materials-page">
      <div className="materials-hero">
        <div>
          <h1 className="materials-title">Bahan & Material</h1>
          <p className="materials-subtitle">Pilih bahan terbaik untuk furniture outdoor Anda</p>
        </div>
      </div>

      <div className="materials-content">

        {/* Galeri tunggal */}
        <section className="materials-section">
          <h2 className="materials-landing-section-title">Galeri Material</h2>
          <div className="materials-grid">
            {allMaterials.map((item) => renderCard(item))}
          </div>
        </section>

        {/* CTA */}
        <section className="materials-cta" aria-label="Aksi lanjut">
          <h3>Tertarik dengan material tertentu?</h3>
          <p>Hubungi kami untuk konsultasi dan rekomendasi bahan terbaik.</p>
          <div className="materials-cta-btns">
            <a
              className="materials-cta-primary"
              href={`https://wa.me/6285291413603?text=${encodeURIComponent('Halo, saya ingin konsultasi bahan furniture outdoor.')}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Konsultasi WhatsApp
            </a>
            <Link className="materials-cta-secondary" href="/products">Lihat Produk</Link>
          </div>
        </section>
      </div>

      {selected && (
        <div
          className="material-modal-overlay"
          onClick={() => setSelected(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`Detail ${selected.name}`}
        >
          <div className="material-modal" onClick={(e) => e.stopPropagation()}>
            <button className="material-modal-close" onClick={() => setSelected(null)} aria-label="Tutup detail">×</button>
            <div className="material-modal-image">
              <Image
                src={selected.image}
                alt={selected.name}
                fill
                sizes="100vw"
                priority
                style={{ objectFit: 'cover' }}
              />
            </div>
            <aside className="material-modal-details">
              <div className="material-modal-header">
                <div className="material-modal-header-left">
                  <span className="material-chip large">{selected.category}</span>
                  <h3 className="material-modal-title">{selected.name}</h3>
                </div>
                <button
                  className="material-modal-close-inline"
                  onClick={() => setSelected(null)}
                  aria-label="Tutup detail"
                >
                  ×
                </button>
              </div>
              <p className="material-modal-desc">{selected.desc}</p>
              <div className="material-spec-list">
                <div className="material-spec">
                  <span className="spec-label">Kualitas</span>
                  <span className="spec-value">Grade premium, seleksi serat terbaik</span>
                </div>
                <div className="material-spec">
                  <span className="spec-label">Perawatan</span>
                  <span className="spec-value">Mudah dibersihkan, tahan cuaca harian</span>
                </div>
                <div className="material-spec">
                  <span className="spec-label">Cocok untuk</span>
                  <span className="spec-value">Teras, taman, kafe outdoor, dan resort</span>
                </div>
              </div>
              <div className="material-modal-actions">
                <button className="material-modal-close-cta" onClick={() => setSelected(null)}>
                  Tutup
                </button>
              </div>
            </aside>
          </div>
        </div>
      )}
    </div>
  )
}