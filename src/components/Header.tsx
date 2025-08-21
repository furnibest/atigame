'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  
  const isAdminPage = pathname?.startsWith('/admin');
  const isHomePage = pathname === '/';

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchValue.trim())}`);
      setShowSearch(false);
      setSearchValue("");
    }
  };

  // Admin panel doesn't use the main header
  if (isAdminPage) {
    return null;
  }

  return (
    <header className={`header ${isHomePage ? 'header-transparent' : ''}`}>
      <div className="logo">
        <Link href="/">
          <Image src="/images/atigalogo.png" alt="ATIGA Furniture Logo" className="logo-image" width={160} height={40} />
        </Link>
      </div>
      <nav className="main-nav">
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
        <ul className={menuOpen ? 'open' : ''} onClick={() => setMenuOpen(false)}>
          <li><Link href="/about">About</Link></li>
          <li><Link href="/materials">Bahan</Link></li>
          <li><Link href="/products">Products</Link></li>
          <li><Link href="/contact">Contact</Link></li>
          <li><Link href="/info-order">Info Pemesanan</Link></li>
        </ul>
        {menuOpen && <div className="menu-overlay" onClick={() => setMenuOpen(false)}></div>}
      </nav>
      <div className="header-icons">
        <button className="header-icon" onClick={() => setShowSearch(v => !v)} style={{background:'none',border:'none',cursor:'pointer'}}>
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>
      {showSearch && (
        <form className="search-bar" onSubmit={handleSearchSubmit} style={{position:'absolute',top:60,right:20,zIndex:1000,display:'flex',background:'#fff',borderRadius:8,boxShadow:'0 2px 8px rgba(0,0,0,0.12)'}}>
          <input
            type="text"
            autoFocus
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            placeholder="Cari produk..."
            style={{padding:'0.5rem 1rem',fontSize:'1rem',border:'none',outline:'none',borderRadius:8,minWidth:180}}
          />
          <button type="button" onClick={() => setShowSearch(false)} style={{background:'none',border:'none',fontSize:'1.2rem',padding:'0 0.7rem',cursor:'pointer'}}>&times;</button>
        </form>
      )}
    </header>
  );
}