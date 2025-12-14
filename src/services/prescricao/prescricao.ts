import { supabase } from '@/config/supabase';
import { Prescricao, Paciente, Internacao, ItemPrescricao, Insumo, fromDatabase, toDatabase } from '@/models/Schema';
import type { Prescricao as PrescricaoType, Paciente as PacienteType, Internacao as InternacaoType, ItemPrescricao as ItemPrescricaoType, Insumo as InsumoType } from '@/types';

/**
 * Busca prescrição por identificador
 */
export async function getPrescricaoById(identificador: string): Promise<PrescricaoType | null> {
    const { data, error } = await supabase
        .from(Prescricao.table)
        .select('*')
        .eq(Prescricao.fields.identificador, identificador)
        .single();

    if (error) {
        console.error('Erro ao buscar prescrição:', error);
        throw error;
    }

    return data ? fromDatabase<PrescricaoType>(Prescricao, data) : null;
}

/**
 * Busca dados do paciente pelo código
 */
export async function getPacienteByPrescricao(idPaciente: string): Promise<PacienteType | null> {
    const { data, error } = await supabase
        .from(Paciente.table)
        .select('*')
        .eq(Paciente.fields.codigo, idPaciente)
        .single();

    if (error) {
        console.error('Erro ao buscar paciente:', error);
        throw error;
    }

    return data ? fromDatabase<PacienteType>(Paciente, data) : null;
}

/**
 * Busca internação ativa do paciente
 */
export async function getInternacaoByPaciente(identificadorPaciente: string): Promise<InternacaoType | null> {
    const { data, error } = await supabase
        .from(Internacao.table)
        .select('*')
        .eq(Internacao.fields.identificadorPaciente, identificadorPaciente)
        .order(Internacao.fields.createdAt, { ascending: false })
        .limit(1)
        .single();

    if (error) {
        console.error('Erro ao buscar internação:', error);
        return null; // Retorna null se não encontrar internação
    }

    return data ? fromDatabase<InternacaoType>(Internacao, data) : null;
}

/**
 * Busca internação por identificador (UUID)
 */
export async function getInternacaoById(identificador: string): Promise<InternacaoType | null> {
    const { data, error } = await supabase
        .from(Internacao.table)
        .select('*')
        .eq(Internacao.fields.identificador, identificador)
        .single();

    if (error) {
        console.error('Erro ao buscar internação por ID:', error);
        return null;
    }

    return data ? fromDatabase<InternacaoType>(Internacao, data) : null;
}

/**
 * Busca todos os itens de uma prescrição
 */
export async function getItensPrescricao(identificadorPrescricao: string): Promise<ItemPrescricaoType[]> {
    const { data, error } = await supabase
        .from(ItemPrescricao.table)
        .select('*')
        .eq(ItemPrescricao.fields.identificadorPrescricao, identificadorPrescricao)
        .order(ItemPrescricao.fields.ordem, { ascending: true });

    if (error) {
        console.error('Erro ao buscar itens da prescrição:', error);
        throw error;
    }

    return data ? data.map(item => fromDatabase<ItemPrescricaoType>(ItemPrescricao, item)) : [];
}

/**
 * Busca todos os insumos disponíveis
 */
export async function getAllInsumos(): Promise<InsumoType[]> {
    const { data, error } = await supabase
        .from(Insumo.table)
        .select('*')
        .order(Insumo.fields.nome, { ascending: true });

    if (error) {
        console.error('Erro ao buscar insumos:', error);
        throw error;
    }

    return data ? data.map(item => fromDatabase<InsumoType>(Insumo, item)) : [];
}

/**
 * Busca insumos por nome (para autocomplete)
 */
export async function searchInsumos(query: string): Promise<InsumoType[]> {
    const { data, error } = await supabase
        .from(Insumo.table)
        .select('*')
        .ilike(Insumo.fields.nome, `%${query}%`)
        .order(Insumo.fields.nome, { ascending: true })
        .limit(10);

    if (error) {
        console.error('Erro ao buscar insumos:', error);
        throw error;
    }

    return data ? data.map(item => fromDatabase<InsumoType>(Insumo, item)) : [];
}

/**
 * Adiciona novo item à prescrição
 */
export async function addItemPrescricao(item: Partial<ItemPrescricaoType>): Promise<ItemPrescricaoType> {
    // 1. Buscar a maior ordem atual para esta prescrição
    const { data: maxOrderData, error: maxOrderError } = await supabase
        .from(ItemPrescricao.table)
        .select(ItemPrescricao.fields.ordem)
        .eq(ItemPrescricao.fields.identificadorPrescricao, item.identificadorPrescricao)
        .order(ItemPrescricao.fields.ordem, { ascending: false })
        .limit(1);

    if (maxOrderError) {
        console.error('Erro ao buscar ordem máxima:', maxOrderError);
        // Não impede a inserção, apenas loga o erro. A ordem será null ou 0.
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nextOrder = (maxOrderData && maxOrderData.length > 0 && (maxOrderData[0] as any).ordem)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ? (maxOrderData[0] as any).ordem + 1
        : 1;

    // 2. Adicionar a ordem ao item
    const itemWithOrder = { ...item, ordem: nextOrder };
    const dbData = toDatabase(ItemPrescricao, itemWithOrder);

    const { data, error } = await supabase
        .from(ItemPrescricao.table)
        .insert(dbData)
        .select()
        .single();

    if (error) {
        console.error('Erro ao adicionar item à prescrição:', error);
        throw error;
    }

    return fromDatabase<ItemPrescricaoType>(ItemPrescricao, data);
}

/**
 * Atualiza o status da prescrição
 */
export async function updatePrescriptionStatus(identificador: string, status: string): Promise<void> {
    const { error } = await supabase
        .from(Prescricao.table)
        .update({ [Prescricao.fields.status]: status })
        .eq(Prescricao.fields.identificador, identificador);

    if (error) {
        console.error('Erro ao atualizar status da prescrição:', error);
        throw error;
    }
}

/**
 * Troca a ordem de dois itens
 */
export async function swapItemOrder(item1: ItemPrescricaoType, item2: ItemPrescricaoType): Promise<void> {
    // Atualiza item1 com a ordem do item2
    const { error: error1 } = await supabase
        .from(ItemPrescricao.table)
        .update({ [ItemPrescricao.fields.ordem]: item2.ordem })
        .eq(ItemPrescricao.fields.idItem, item1.idItem);

    if (error1) throw error1;

    // Atualiza item2 com a ordem do item1
    const { error: error2 } = await supabase
        .from(ItemPrescricao.table)
        .update({ [ItemPrescricao.fields.ordem]: item1.ordem })
        .eq(ItemPrescricao.fields.idItem, item2.idItem);

    if (error2) throw error2;
}

/**
 * Deleta uma prescrição e seus itens
 */
export async function deletePrescription(identificador: string): Promise<void> {
    // 1. Deletar itens primeiro (embora o CASCADE possa cuidar disso, é bom garantir)
    const { error: errorItems } = await supabase
        .from(ItemPrescricao.table)
        .delete()
        .eq(ItemPrescricao.fields.identificadorPrescricao, identificador);

    if (errorItems) {
        console.error('Erro ao deletar itens da prescrição:', errorItems);
        throw errorItems;
    }

    // 2. Deletar a prescrição
    const { error } = await supabase
        .from(Prescricao.table)
        .delete()
        .eq(Prescricao.fields.identificador, identificador);


    if (error) {
        console.error('Erro ao deletar prescrição:', error);
        throw error;
    }
}

/**
 * Deleta um item específico da prescrição
 */
export async function deletePrescriptionItem(idItem: string): Promise<void> {
    const { error } = await supabase
        .from(ItemPrescricao.table)
        .delete()
        .eq(ItemPrescricao.fields.idItem, idItem);

    if (error) {
        console.error('Erro ao deletar item da prescrição:', error);
        throw error;
    }
}
