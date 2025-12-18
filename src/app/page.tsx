'use client';

import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  
  return (
    <main className="hero-section">
      <div className="hero-content" suppressHydrationWarning={true}>
        <h2 className="subtitle">Premium Furniture from Indonesia</h2>
        <div className="main-title" suppressHydrationWarning={true}>
          <div className="title-top" suppressHydrationWarning={true}>LUXURY</div>
          <div className="title-bottom" suppressHydrationWarning={true}>ARTISAN FURNITURE</div>
        </div>
        <button className="cta-button" onClick={() => router.push('/products')}>Shop Now</button>
      </div>
    </main>
  );
}