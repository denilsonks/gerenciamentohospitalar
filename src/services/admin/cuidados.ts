import { supabase } from '@/config/supabase';
import type { ItemCuidado } from '@/types';

const TABLE = 'item_cuidados';

/**
 * Busca todos os cuidados
 */
export async function getAllCuidados(): Promise<ItemCuidado[]> {
    const { data, error } = await supabase
        .from(TABLE)
        .select('*')
        .order('nome', { ascending: true });

    if (error) {
        console.error('Erro ao buscar cuidados:', error);
        throw error;
    }

    return (data || []).map(item => ({
        id: item.id,
        createdAt: item.created_at,
        nome: item.nome,
        tipo: item.tipo,
    }));
}

/**
 * Cria um novo cuidado
 */
export async function createCuidado(nome: string, tipo?: string): Promise<ItemCuidado> {
    const { data, error } = await supabase
        .from(TABLE)
        .insert({
            nome: nome,
            tipo: tipo || null,
        })
        .select()
        .single();

    if (error) {
        console.error('Erro ao criar cuidado:', error);
        throw error;
    }

    return {
        id: data.id,
        createdAt: data.created_at,
        nome: data.nome,
        tipo: data.tipo,
    };
}

/**
 * Atualiza um cuidado existente
 */
export async function updateCuidado(id: string, nome: string, tipo?: string): Promise<ItemCuidado> {
    const { data, error } = await supabase
        .from(TABLE)
        .update({
            nome: nome,
            tipo: tipo || null,
        })
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Erro ao atualizar cuidado:', error);
        throw error;
    }

    return {
        id: data.id,
        createdAt: data.created_at,
        nome: data.nome,
        tipo: data.tipo,
    };
}

/**
 * Exclui um cuidado
 */
export async function deleteCuidado(id: string): Promise<void> {
    const { error } = await supabase
        .from(TABLE)
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Erro ao excluir cuidado:', error);
        throw error;
    }
}
