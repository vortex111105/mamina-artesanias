export type ShippingZone = 'caba' | 'gba' | 'interior'

export interface ShippingRate {
  zone: ShippingZone
  label: string
  cost: number
  description: string
}

// Tarifas por zona — actualizar según precios del correo que uses
const RATES: Record<ShippingZone, ShippingRate> = {
  caba: {
    zone: 'caba',
    label: 'Ciudad de Buenos Aires',
    cost: 2500,
    description: 'CABA — 3 a 5 días hábiles',
  },
  gba: {
    zone: 'gba',
    label: 'Gran Buenos Aires',
    cost: 3500,
    description: 'GBA — 3 a 5 días hábiles',
  },
  interior: {
    zone: 'interior',
    label: 'Interior del país',
    cost: 5500,
    description: 'Interior — 5 a 10 días hábiles',
  },
}

export function getShippingZone(postalCode: string): ShippingRate {
  const cp = parseInt(postalCode.replace(/\D/g, ''), 10)
  if (isNaN(cp)) return RATES.interior

  // CABA: 1000–1499
  if (cp >= 1000 && cp <= 1499) return RATES.caba

  // GBA: rangos típicos del conurbano
  if (
    (cp >= 1600 && cp <= 1999) || // zona norte/oeste GBA
    (cp >= 1700 && cp <= 1758) || // zona oeste GBA
    (cp >= 1800 && cp <= 1884) || // zona sur GBA
    (cp >= 1900 && cp <= 1999) || // zona sur GBA
    (cp >= 1500 && cp <= 1599)    // zona oeste GBA
  ) {
    return RATES.gba
  }

  return RATES.interior
}
