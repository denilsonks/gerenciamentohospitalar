import { supabase } from '../config/supabase';
import { Colaborador } from '../models/Schema';

/**
 * Busca o email de um usuário através do nome de usuário.
 * @param username O nome de usuário para buscar
 * @returns O email associado ou null se não encontrado
 */
export async function getEmailByUsername(username: string): Promise<string | null> {
    try {
        const { data, error } = await supabase
            .from(Colaborador.table)
            .select(Colaborador.fields.email)
            .eq(Colaborador.fields.usuario, username)
            .single();

        if (error) {
            console.error('Erro ao buscar email por usuário:', error);
            return null;
        }

        return data ? (data as any)[Colaborador.fields.email] : null;
    } catch (error) {
        console.error('Erro inesperado ao buscar email por usuário:', error);
        return null;
    }
}
