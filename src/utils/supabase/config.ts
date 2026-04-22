export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://giqxdpbqdtdkytrgjhez.supabase.co'
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_tM366lsKs-8wyYepjR80Gg_xAvI_2gY'

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase configuration missing! Using hardcoded fallbacks.')
}
