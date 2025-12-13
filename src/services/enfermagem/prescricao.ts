import { supabase } from "@/config/supabase";
import { PrescricaoEnfermagem, ItemCuidado, toDatabase } from "@/models/Schema";
import type { PrescricaoEnfermagem as PrescricaoEnfermagemType } from "@/types";

export async function createPrescription(data: Partial<PrescricaoEnfermagemType>) {
    console.log('📝 Criando prescrição de enfermagem com dados:', data);

    const dbData = toDatabase(PrescricaoEnfermagem, data);

    // Initialize item as empty array if null
    if (!dbData[PrescricaoEnfermagem.fields.item]) {
        dbData[PrescricaoEnfermagem.fields.item] = [];
    }

    console.log('📝 Dados convertidos para o banco:', dbData);

    const { data: newPrescription, error } = await supabase
        .from(PrescricaoEnfermagem.table)
        .insert(dbData)
        .select()
        .single();

    if (error) {
        console.error('❌ Erro ao criar prescrição de enfermagem:', error);
        throw error;
    }

    console.log('✅ Prescrição de enfermagem criada no banco:', newPrescription);
    return newPrescription;
}

export async function getTodayPrescription(pacienteCodigo: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const { data, error } = await supabase
        .from(PrescricaoEnfermagem.table)
        .select('*')
        .eq(PrescricaoEnfermagem.fields.paciente, pacienteCodigo)
        .gte(PrescricaoEnfermagem.fields.dataPrescricao, today.toISOString())
        .lt(PrescricaoEnfermagem.fields.dataPrescricao, tomorrow.toISOString())
        .order(PrescricaoEnfermagem.fields.createdAt, { ascending: false })
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

export async function getPrescricaoById(id: string) {
    const { data, error } = await supabase
        .from(PrescricaoEnfermagem.table)
        .select('*')
        .eq(PrescricaoEnfermagem.fields.id, id)
        .single();

    if (error) {
        console.error('Erro ao buscar prescrição:', error);
        return null;
    }
    return data;
}

export async function getAllItensCuidado() {
    const { data, error } = await supabase
        .from(ItemCuidado.table)
        .select('*')
        .order(ItemCuidado.fields.nome);

    if (error) {
        console.error('Erro ao buscar itens de cuidado:', error);
        return [];
    }
    return data;
}

export async function updatePrescription(id: string, updates: Partial<PrescricaoEnfermagemType>) {
    const dbData = toDatabase(PrescricaoEnfermagem, updates);
    const { data, error } = await supabase
        .from(PrescricaoEnfermagem.table)
        .update(dbData)
        .eq(PrescricaoEnfermagem.fields.id, id)
        .select()
        .single();

    if (error) throw error;
    return data;
}
