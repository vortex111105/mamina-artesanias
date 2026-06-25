import { createClient, SupabaseClient } from '@supabase/supabase-js'

let _supabase: SupabaseClient | null = null

export function getSupabaseClient(): SupabaseClient {
  if (!_supabase) {
    _supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
  }
  return _supabase
}

// Alias para los Server Components que usan `supabase` directamente
export const supabase = {
  from: (...args: Parameters<SupabaseClient['from']>) => getSupabaseClient().from(...args),
  storage: {
    get from() {
      return getSupabaseClient().storage.from.bind(getSupabaseClient().storage)
    },
  },
} as unknown as SupabaseClient

export function getAdminClient(): SupabaseClient {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}
