import { supabase } from "@/config/supabase";
import { Prescricao, toDatabase } from "@/models/Schema";
import type { Prescricao as PrescricaoType } from "@/types";

export async function createPrescription(data: Partial<PrescricaoType>) {
    console.log('📝 Criando prescrição com dados:', data);

    const dbData = toDatabase(Prescricao, data);

    console.log('📝 Dados convertidos para o banco:', dbData);

    const { data: newPrescription, error } = await supabase
        .from(Prescricao.table)
        .insert(dbData)
        .select()
        .single();

    if (error) {
        console.error('❌ Erro ao criar prescrição:', error);
        throw error;
    }

    console.log('✅ Prescrição criada no banco:', newPrescription);
    return newPrescription;
}

export async function getLastPrescription(pacienteIdentificador: string) {
    const { data, error } = await supabase
        .from(Prescricao.table)
        .select('*')
        .eq(Prescricao.fields.idPaciente, pacienteIdentificador)
        .order(Prescricao.fields.createdAt, { ascending: false })
        .limit(1)
        .single();

    if (error && error.code !== 'PGRST116') { // Ignorar erro de "não encontrado"
        console.error('Erro ao buscar última prescrição:', error);
    }

    return data;
}

export async function getTodayPrescription(pacienteCodigo: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const { data, error } = await supabase
        .from(Prescricao.table)
        .select('*')
        .eq(Prescricao.fields.idPaciente, pacienteCodigo)
        .gte(Prescricao.fields.hraInicio, today.toISOString())
        .lt(Prescricao.fields.hraInicio, tomorrow.toISOString())
        .order(Prescricao.fields.createdAt, { ascending: false })
        .limit(1)
        .single();

    if (error) {
        if (error.code !== 'PGRST116') {
            console.error('Erro ao buscar prescrição de hoje:', error);
        }
        return null;
    }

    return data;
}

export async function getPatientPrescriptions(pacienteCodigo: string) {
    const { data, error } = await supabase
        .from(Prescricao.table)
        .select('*')
        .eq(Prescricao.fields.idPaciente, pacienteCodigo)
        .order(Prescricao.fields.dataPrescricao, { ascending: false });

    if (error) {
        console.error('Erro ao buscar histórico de prescrições:', error);
        throw error;
    }

    return data;
}
