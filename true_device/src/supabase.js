import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase environment variables are missing:', {
    supabaseUrl,
    supabaseAnonKey: supabaseAnonKey ? 'present' : 'missing'
  })
}

console.log('Supabase config:', {
  url: supabaseUrl,
  keyPresent: Boolean(supabaseAnonKey)
})

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
