'use client'

import { usePathname } from 'next/navigation'
import Header from '@/components/Header'
import FooterSimple from '@/components/FooterSimple'

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()
  
  // Check if current path is a product detail page
  const isProductDetailPage = pathname?.match(/^\/products\/\d+$/)
  
  if (isProductDetailPage) {
    // For product detail pages, render without header and footer
    return <>{children}</>
  }
  
  // For all other pages, render with header and footer
  return (
    <div className="App">
      <Header />
      {children}
      <FooterSimple />
    </div>
  )
}