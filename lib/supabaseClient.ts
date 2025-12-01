import { createClient } from '@supabase/supabase-js';

// As credenciais devem ser configuradas nas variáveis de ambiente do servidor/build
// REACT_APP_SUPABASE_URL ou VITE_SUPABASE_URL dependendo do bundler
// Aqui usamos o padrão genérico process.env
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Verificação de segurança: Se as chaves não existirem, o cliente será nulo
// O DataContext lidará com isso usando dados Mockados como fallback
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

if (!supabase) {
  console.warn('Supabase credentials not found in environment variables. Running in Mock Mode.');
}