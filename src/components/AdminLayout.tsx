'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTachometerAlt, 
  faBoxOpen, 
  faSignOutAlt, 
  faBars, 
  faTimes,
  faHome
} from '@fortawesome/free-solid-svg-icons';
import '../styles/admin.css';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    router.push('/admin');
  };

  const menuItems = [
    { href: '/admin/dashboard', icon: faTachometerAlt, label: 'Dashboard' },
    { href: '/admin/products', icon: faBoxOpen, label: 'Produk' },
    { href: '/', icon: faHome, label: 'Kembali ke Website' },
  ];

  return (
    <div className="admin-layout">
      {/* Mobile Header */}
      <div className="admin-mobile-header">
        <button 
          className="admin-mobile-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <FontAwesomeIcon icon={sidebarOpen ? faTimes : faBars} />
        </button>
        <h1>Admin Panel</h1>
        <button className="admin-logout-mobile" onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} />
        </button>
      </div>

      {/* Sidebar */}
      <div className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <h2>Atiga Meubel</h2>
          <p>Admin Panel</p>
        </div>
        
        <nav className="admin-sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-nav-item ${pathname === item.href ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <FontAwesomeIcon icon={item.icon} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <button className="admin-logout-btn" onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div 
          className="admin-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="admin-main">
        <div className="admin-content">
          {children}
        </div>
      </div>
    </div>
  );
}