import type { Metadata } from 'next'
import './globals.css'
import ConditionalLayout from '@/components/ConditionalLayout'

export const metadata: Metadata = {
  title: 'ATIGA Furniture - Premium Furniture from Indonesia',
  description: 'Atiga Meubel berkomitmen menghadirkan furniture outdoor berkualitas, desain elegan, dan harga terbaik. Kami melayani pemesanan custom, grosir, dan pengiriman ke seluruh Indonesia.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body suppressHydrationWarning={true}>
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  )
}