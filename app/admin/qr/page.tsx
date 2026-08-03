'use client'

import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'

const SITE_URL = 'https://mamina.store'

function useQR(ref: React.RefObject<HTMLCanvasElement | null>, size: number) {
  useEffect(() => {
    if (!ref.current) return
    QRCode.toCanvas(ref.current, SITE_URL, {
      width: size,
      margin: 1,
      color: { dark: '#4D3F4D', light: '#FFFFFF' },
    })
  }, [ref, size])
}

/* ── Tarjeta grande (cartel de feria) ─────────────────────── */
function CartelFeria() {
  const qrRef = useRef<HTMLCanvasElement>(null)
  useQR(qrRef, 260)

  return (
    <div
      id="mamina-card"
      className="bg-white rounded-3xl shadow-warm-lg border border-sand/50 flex flex-col items-center gap-7 px-12 py-10"
      style={{ width: 360 }}
    >
      <div className="text-center">
        <p className="text-terracotta text-3xl mb-2">✦</p>
        <h1 className="font-display font-bold text-brown tracking-tight" style={{ fontSize: 52, lineHeight: 1 }}>
          MAMINA
        </h1>
        <p className="text-brown-light text-[13px] mt-3 font-light tracking-wide">
          Cerámica artesanal hecha con amor
        </p>
      </div>
      <div className="flex items-center gap-3 w-full">
        <div className="flex-1 h-px bg-sand" />
        <span className="text-sand text-xs">✦</span>
        <div className="flex-1 h-px bg-sand" />
      </div>
      <div className="rounded-2xl overflow-hidden border border-sand/60 p-2.5 bg-white">
        <canvas ref={qrRef} />
      </div>
      <div className="text-center">
        <p className="text-brown-light text-[11px] tracking-widest uppercase mb-1">
          Escaneá para ver el catálogo
        </p>
        <p className="font-display font-bold text-terracotta text-base tracking-wide">
          mamina.store
        </p>
      </div>
    </div>
  )
}

/* ── Tarjeta chica individual (para repartir) ──────────────── */
function MiniCard({ qrRef }: { qrRef: React.RefObject<HTMLCanvasElement | null> }) {
  return (
    <div
      className="bg-white flex flex-col items-center justify-between py-3 px-4"
      style={{ width: '9cm', height: '5.5cm', border: '0.5px dashed #C8A09A', boxSizing: 'border-box' }}
    >
      <div className="text-center leading-none">
        <span className="text-terracotta" style={{ fontSize: 10 }}>✦</span>
        <h2 className="font-display font-bold text-brown" style={{ fontSize: 22, lineHeight: 1.1 }}>
          MAMINA
        </h2>
        <p className="text-brown-light font-light" style={{ fontSize: 8, marginTop: 2, letterSpacing: '0.05em' }}>
          Cerámica artesanal hecha con amor
        </p>
      </div>
      <div className="rounded-lg overflow-hidden border border-sand/60" style={{ padding: 3 }}>
        <canvas ref={qrRef} />
      </div>
      <div className="text-center">
        <p className="text-brown-light" style={{ fontSize: 7, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 1 }}>
          Escaneá para ver el catálogo
        </p>
        <p className="font-display font-bold text-terracotta" style={{ fontSize: 10, letterSpacing: '0.05em' }}>
          mamina.store
        </p>
      </div>
    </div>
  )
}

/* ── Hoja con 8 tarjetas ───────────────────────────────────── */
function TarjetasRepartir() {
  const refs = Array.from({ length: 8 }, () => useRef<HTMLCanvasElement>(null))

  useEffect(() => {
    refs.forEach((ref) => {
      if (!ref.current) return
      QRCode.toCanvas(ref.current, SITE_URL, {
        width: 90,
        margin: 1,
        color: { dark: '#4D3F4D', light: '#FFFFFF' },
      })
    })
  })

  return (
    <div
      id="mamina-card"
      className="bg-white"
      style={{
        width: '21cm',
        minHeight: '29.7cm',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        alignContent: 'start',
        padding: '1cm',
        gap: 0,
        boxSizing: 'border-box',
      }}
    >
      {refs.map((ref, i) => (
        <MiniCard key={i} qrRef={ref} />
      ))}
    </div>
  )
}

/* ── Página principal ─────────────────────────────────────── */
export default function QRPage() {
  const [modo, setModo] = useState<'cartel' | 'tarjetas'>('cartel')

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white; margin: 0; }
          main { display: flex; justify-content: center; align-items: flex-start; padding: 0 !important; background: white !important; min-height: auto !important; }
          #mamina-card { box-shadow: none !important; border-radius: 0 !important; }
        }
      `}</style>

      <main className="min-h-screen bg-cream flex flex-col items-center justify-center p-8 gap-6">

        {/* Selector de modo */}
        <div className="no-print flex rounded-2xl border border-sand bg-white overflow-hidden shadow-sm">
          <button
            onClick={() => setModo('cartel')}
            className={`px-6 py-3 text-sm font-semibold transition-colors ${
              modo === 'cartel'
                ? 'bg-brown text-white'
                : 'text-brown-light hover:text-brown'
            }`}
          >
            🖼️ Cartel de feria
          </button>
          <button
            onClick={() => setModo('tarjetas')}
            className={`px-6 py-3 text-sm font-semibold transition-colors ${
              modo === 'tarjetas'
                ? 'bg-brown text-white'
                : 'text-brown-light hover:text-brown'
            }`}
          >
            🃏 Tarjetas para repartir
          </button>
        </div>

        <p className="no-print text-brown-light text-xs text-center">
          {modo === 'cartel'
            ? 'Una tarjeta grande para dejar fija en la mesa'
            : '8 tarjetas por hoja A4 — imprimí, recortá y repartí'}
        </p>

        {/* Contenido según modo */}
        {modo === 'cartel' ? <CartelFeria /> : <TarjetasRepartir />}

        {/* Botón imprimir */}
        <button
          onClick={() => window.print()}
          className="no-print flex items-center gap-2 px-8 py-4 bg-brown text-white font-semibold rounded-2xl hover:bg-brown/90 transition-colors shadow-sm text-sm"
        >
          🖨️&nbsp; Imprimir
        </button>
      </main>
    </>
  )
}
