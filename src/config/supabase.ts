import { createClient } from '@supabase/supabase-js';

// Validação das variáveis de ambiente
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('🔍 Verificando credenciais do Supabase:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    url: supabaseUrl
});

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ ERRO: Credenciais do Supabase não configuradas!');
    console.error('URL:', supabaseUrl);
    console.error('Has Key:', !!supabaseAnonKey);
    throw new Error(
        'Credenciais do Supabase não configuradas. Verifique o arquivo .env'
    );
}

// Criação do cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    }
});

// Tipos para o Database (você pode expandir conforme seu schema)
export type Database = {
    public: {
        Tables: {
            pacientes: {
                Row: {
                    id: number;
                    nome: string;
                    idade: number;
                    convenio: string;
                    quarto: string;
                    leito: string;
                    data_ultima_prescricao: string | null;
                    possui_alergia: boolean;
                    status_prescricao: 'ok' | 'pendente' | 'atrasada';
                    created_at?: string;
                    updated_at?: string;
                };
                Insert: Omit<Database['public']['Tables']['pacientes']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['pacientes']['Insert']>;
            };
            medicos: {
                Row: {
                    id: number;
                    nome: string;
                    crm: string;
                    especialidade: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Insert: Omit<Database['public']['Tables']['medicos']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['medicos']['Insert']>;
            };
            // Adicione outras tabelas conforme necessário
        };
    };
};
