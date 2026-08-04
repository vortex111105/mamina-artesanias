export type ShippingZone = 'local' | 'caba' | 'gba' | 'interior'

export interface ShippingRate {
  zone: ShippingZone
  label: string
  cost: number
  description: string
}

// ============================================================
// Tarifas por zona — origen: Bella Vista, San Miguel (CP 1661)
// Estimadas según rangos publicados de Correo Argentino 2026.
// Actualizar acá cuando tengas los precios exactos de MiCorreo.
// ============================================================
const RATES: Record<ShippingZone, ShippingRate> = {
  local: {
    zone: 'local',
    label: 'San Miguel / Bella Vista',
    cost: 2500,
    description: 'Zona local — 1 a 2 días hábiles',
  },
  gba: {
    zone: 'gba',
    label: 'Gran Buenos Aires',
    cost: 4000,
    description: 'GBA — 2 a 4 días hábiles',
  },
  caba: {
    zone: 'caba',
    label: 'Ciudad de Buenos Aires',
    cost: 4500,
    description: 'CABA — 2 a 4 días hábiles',
  },
  interior: {
    zone: 'interior',
    label: 'Interior del país',
    cost: 6500,
    description: 'Interior — 4 a 8 días hábiles',
  },
}

// CPs del partido de San Miguel y alrededores inmediatos de Bella Vista
const LOCAL_CPS = [1661, 1662, 1663]

export function getShippingZone(postalCode: string): ShippingRate {
  const cp = parseInt(postalCode.replace(/\D/g, ''), 10)
  if (isNaN(cp)) return RATES.interior

  // Zona local: San Miguel / Bella Vista / Muñiz
  if (LOCAL_CPS.includes(cp)) return RATES.local

  // CABA: 1000–1499
  if (cp >= 1000 && cp <= 1499) return RATES.caba

  // GBA: rangos del conurbano bonaerense
  if (cp >= 1500 && cp <= 1999) return RATES.gba

  return RATES.interior
}
