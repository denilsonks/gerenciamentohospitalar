import { supabase } from '../../config/supabase';
import { Paciente, fromDatabase } from '../../models/Schema';
import type { Paciente as PacienteType } from '../../types';

/**
 * Busca pacientes não internados para seleção no formulário
 */
export async function searchPacientes(query: string): Promise<PacienteType[]> {
    const { data, error } = await supabase
        .from(Paciente.table)
        .select('*')
        .or(`${Paciente.fields.internado}.is.null,${Paciente.fields.internado}.eq.false`)
        .or(`${Paciente.fields.nomeCompleto}.ilike.%${query}%,${Paciente.fields.documentoRegistro}.ilike.%${query}%`)
        .order(Paciente.fields.nomeCompleto, { ascending: true })
        .limit(10);

    if (error) throw error;

    return data.map(item => fromDatabase<PacienteType>(Paciente, item));
}

/**
 * Busca todos os pacientes (para autocomplete)
 */
export async function getAllPacientesNaoInternados(): Promise<PacienteType[]> {
    const { data, error } = await supabase
        .from(Paciente.table)
        .select('*')
        .or(`${Paciente.fields.internado}.is.null,${Paciente.fields.internado}.eq.false`)
        .order(Paciente.fields.nomeCompleto, { ascending: true });

    if (error) throw error;

    return data.map(item => fromDatabase<PacienteType>(Paciente, item));
}
