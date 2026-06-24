import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import { CartProvider } from '@/lib/cart-context'
import './globals.css'

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap',
})

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'MAMINA Artesanías',
  description: 'Productos artesanales hechos con amor',
  openGraph: {
    title: 'MAMINA Artesanías',
    description: 'Productos artesanales hechos con amor',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${playfair.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-cream font-sans">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  )
}
