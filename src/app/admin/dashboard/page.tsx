'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBoxOpen, faTags, faUsers, faChartBar } from '@fortawesome/free-solid-svg-icons'
import AdminLayout from '@/components/AdminLayout'

export default function AdminDashboard() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [productCount, setProductCount] = useState(0)

  useEffect(() => {
    const loggedIn = localStorage.getItem('adminLoggedIn')
    if (!loggedIn) {
      router.push('/admin')
      return
    }
    setIsLoggedIn(true)

    // Fetch product count
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProductCount(data.length)
        }
      })
      .catch(console.error)
  }, [router])

  if (!isLoggedIn) {
    return <div>Loading...</div>
  }

  return (
    <AdminLayout>
      <div className="admin-dashboard">
        <section className="admin-hero">
          <div className="admin-hero-content">
            <h1>Admin Dashboard</h1>
            <p>Selamat datang di Admin Panel Atiga Meubel</p>
            <div className="admin-hero-stats">
              <div className="hero-stat">
                <span className="hero-stat-number">{productCount}</span>
                <span className="hero-stat-label">Total Produk</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-number">5</span>
                <span className="hero-stat-label">Kategori</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-number">24/7</span>
                <span className="hero-stat-label">Online</span>
              </div>
            </div>
          </div>
          <div className="admin-hero-icon">
            <FontAwesomeIcon icon={faBoxOpen} spin />
          </div>
        </section>
        
        <div className="admin-cards">
          <Link href="/admin/products" className="admin-card">
            <FontAwesomeIcon icon={faBoxOpen} size="2x" className="admin-card-icon" />
            <h3>Produk</h3>
            <p>Kelola produk furniture</p>
          </Link>
          
          <div className="admin-card" style={{ opacity: 0.5, cursor: 'not-allowed' }}>
            <FontAwesomeIcon icon={faTags} size="2x" className="admin-card-icon" />
            <h3>Kategori</h3>
            <p>Kelola kategori produk</p>
          </div>
          
          <div className="admin-card" style={{ opacity: 0.5, cursor: 'not-allowed' }}>
            <FontAwesomeIcon icon={faUsers} size="2x" className="admin-card-icon" />
            <h3>User</h3>
            <p>Kelola admin/user</p>
          </div>
          
          <div className="admin-card" style={{ opacity: 0.5, cursor: 'not-allowed' }}>
            <FontAwesomeIcon icon={faChartBar} size="2x" className="admin-card-icon" />
            <h3>Statistik</h3>
            <p>Lihat statistik penjualan</p>
          </div>
        </div>
        
        <div className="admin-quick-stats">
          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <FontAwesomeIcon icon={faBoxOpen} />
            </div>
            <h4>Total Produk</h4>
            <div className="admin-stat-value">{productCount}</div>
            <div className="admin-stat-trend">+12% dari bulan lalu</div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <FontAwesomeIcon icon={faTags} />
            </div>
            <h4>Produk Unggulan</h4>
            <div className="admin-stat-value">8</div>
            <div className="admin-stat-trend">+5% dari bulan lalu</div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <FontAwesomeIcon icon={faChartBar} />
            </div>
            <h4>Kategori</h4>
            <div className="admin-stat-value">5</div>
            <div className="admin-stat-trend">Stabil</div>
          </div>
        </div>
        
        <div className="admin-recent-activity">
          <h3>Aktivitas Terbaru</h3>
          <div className="admin-activity-list">
            <div className="admin-activity-item">
              <div className="admin-activity-icon">
                <FontAwesomeIcon icon={faBoxOpen} />
              </div>
              <div className="admin-activity-content">
                <p>Sistem admin telah dimigrasikan ke Next.js</p>
                <span className="admin-activity-time">Baru saja</span>
              </div>
            </div>
            <div className="admin-activity-item">
              <div className="admin-activity-icon">
                <FontAwesomeIcon icon={faUsers} />
              </div>
              <div className="admin-activity-content">
                <p>Login admin berhasil</p>
                <span className="admin-activity-time">Baru saja</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}