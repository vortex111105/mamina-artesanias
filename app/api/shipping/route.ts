import { NextResponse } from 'next/server'
import { getShippingZone } from '@/lib/shipping'

export async function POST(req: Request) {
  const { postal_code } = await req.json()
  if (!postal_code) {
    return NextResponse.json({ error: 'Falta el código postal' }, { status: 400 })
  }
  const rate = getShippingZone(String(postal_code))
  return NextResponse.json(rate)
}
