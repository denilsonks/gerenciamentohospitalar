import { supabase } from "@/config/supabase";
import { Colaborador } from "@/models/Schema";

/**
 * Busca o nome do colaborador pelo identificador (UUID).
 * @param identificador O UUID do colaborador (que vem de internacao.identificadorUsuario)
 * @returns O nome completo do colaborador ou null se não encontrado.
 */
export async function getColaboradorByIdentificador(identificador: string): Promise<string | null> {
    if (!identificador) return null;

    try {
        console.log('🔍 Service getColaboradorByIdentificador - Buscando:', identificador);
        const { data, error } = await supabase
            .from(Colaborador.table)
            .select(Colaborador.fields.nomeCompleto)
            .eq(Colaborador.fields.identificadorUsuario, identificador)
            .single();

        if (error) {
            console.error('❌ Erro ao buscar colaborador:', error);
            return null;
        }

        console.log('✅ Colaborador encontrado:', data);
        return data ? (data as any)[Colaborador.fields.nomeCompleto] : null;
    } catch (error) {
        console.error('Erro inesperado ao buscar colaborador:', error);
        return null;
    }
}
