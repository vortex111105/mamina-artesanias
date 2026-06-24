'use client'

import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import { Download } from 'lucide-react'

export default function QRPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [url, setUrl] = useState('')
  const [generated, setGenerated] = useState(false)

  const appUrl =
    typeof window !== 'undefined'
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL || ''

  useEffect(() => {
    setUrl(appUrl)
  }, [appUrl])

  async function generateQR() {
    if (!canvasRef.current || !url) return
    await QRCode.toCanvas(canvasRef.current, url, {
      width: 400,
      margin: 3,
      color: { dark: '#5C3D2E', light: '#FFF8F0' },
    })
    setGenerated(true)
  }

  function downloadQR() {
    if (!canvasRef.current) return
    const link = document.createElement('a')
    link.download = 'mamina-qr.png'
    link.href = canvasRef.current.toDataURL('image/png')
    link.click()
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-cream">
      <div className="w-full max-w-sm flex flex-col items-center gap-6">
        <h1 className="font-display text-3xl font-bold text-brown text-center">
          Generador de QR
        </h1>
        <p className="text-brown-light text-sm text-center">
          Este QR lleva a la landing de MAMINA Artesanías
        </p>

        <div className="bg-white rounded-2xl p-6 border border-sand shadow-sm flex flex-col items-center gap-4 w-full">
          <input
            type="text"
            value={url}
            onChange={(e) => { setUrl(e.target.value); setGenerated(false) }}
            className="w-full rounded-xl border border-sand px-4 py-2.5 text-sm text-brown focus:outline-none focus:border-terracotta"
            placeholder="URL de la web"
          />

          <canvas ref={canvasRef} className={generated ? 'rounded-xl' : 'hidden'} />

          {!generated && (
            <div className="w-48 h-48 bg-sand/40 rounded-xl flex items-center justify-center text-brown-light/40 text-4xl">
              📱
            </div>
          )}

          <div className="flex flex-col gap-2 w-full">
            <button
              onClick={generateQR}
              className="w-full py-3 bg-terracotta text-white font-semibold rounded-2xl hover:bg-terracotta-dark transition-colors"
            >
              Generar QR
            </button>

            {generated && (
              <button
                onClick={downloadQR}
                className="w-full flex items-center justify-center gap-2 py-3 bg-brown text-white font-semibold rounded-2xl hover:bg-brown/90 transition-colors"
              >
                <Download className="w-4 h-4" />
                Descargar PNG
              </button>
            )}
          </div>
        </div>

        <p className="text-brown-light/50 text-xs text-center">
          Imprimí el QR y colocalo en la tienda para que los clientes lo escaneen
        </p>
      </div>
    </main>
  )
}
