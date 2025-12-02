import { createClient } from '@supabase/supabase-js';

// Usando variáveis de ambiente do Vite (import.meta.env)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Verificação de segurança: Se as chaves não existirem, o cliente será nulo
// O DataContext lidará com isso usando dados Mockados como fallback
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

if (!supabase) {
  console.warn('Supabase credentials not found in environment variables. Running in Mock Mode.');
}