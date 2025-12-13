import { supabase } from '../../config/supabase';
import { Colaborador as ColaboradorSchema, fromDatabase } from '../../models/Schema';
import type { Colaborador } from '../../types';

/**
 * Busca todos os colaboradores com função "Medico"
 */
export async function getMedicos(): Promise<Colaborador[]> {
    const { data, error } = await supabase
        .from(ColaboradorSchema.table)
        .select('*')
        .eq(ColaboradorSchema.fields.funcao, 'Medico')
        .order(ColaboradorSchema.fields.nomeCompleto, { ascending: true });

    if (error) throw error;
    if (!data) return [];

    return data.map(item => fromDatabase<Colaborador>(ColaboradorSchema, item));
}
