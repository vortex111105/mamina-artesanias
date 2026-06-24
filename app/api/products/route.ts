import { NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase'

export async function GET() {
  const db = getAdminClient()
  const { data, error } = await db
    .from('products')
    .select('*')
    .eq('visible', true)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const secret = req.headers.get('x-secret')
  if (secret !== process.env.INTERNAL_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const db = getAdminClient()
  const { data, error } = await db
    .from('products')
    .insert(body)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data, { status: 201 })
}

export async function PATCH(req: Request) {
  const secret = req.headers.get('x-secret')
  if (secret !== process.env.INTERNAL_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id, ...updates } = await req.json()
  const db = getAdminClient()
  const { data, error } = await db
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data)
}
