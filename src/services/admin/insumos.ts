import { supabase } from '@/config/supabase';
import type { Insumo } from '@/types';

const TABLE = 'insumos';

/**
 * Busca todos os insumos
 */
export async function getAllInsumos(): Promise<Insumo[]> {
    const { data, error } = await supabase
        .from(TABLE)
        .select('*')
        .order('nome', { ascending: true });

    if (error) {
        console.error('Erro ao buscar insumos:', error);
        throw error;
    }

    return (data || []).map(item => ({
        id: item.id,
        createdAt: item.created_at,
        nome: item.nome,
        categoria: item.categoria,
        quantidade: item.quantidade,
        nivelReposicao: item.nivel_reposicao,
        lote: item.lote,
    }));
}

/**
 * Cria um novo insumo
 */
export async function createInsumo(nome: string, categoria?: string): Promise<Insumo> {
    const { data, error } = await supabase
        .from(TABLE)
        .insert({
            nome: nome,
            categoria: categoria || null,
        })
        .select()
        .single();

    if (error) {
        console.error('Erro ao criar insumo:', error);
        throw error;
    }

    return {
        id: data.id,
        createdAt: data.created_at,
        nome: data.nome,
        categoria: data.categoria,
        quantidade: data.quantidade,
        nivelReposicao: data.nivel_reposicao,
        lote: data.lote,
    };
}

/**
 * Atualiza um insumo existente
 */
export async function updateInsumo(id: number, nome: string, categoria?: string): Promise<Insumo> {
    const { data, error } = await supabase
        .from(TABLE)
        .update({
            nome: nome,
            categoria: categoria || null,
        })
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Erro ao atualizar insumo:', error);
        throw error;
    }

    return {
        id: data.id,
        createdAt: data.created_at,
        nome: data.nome,
        categoria: data.categoria,
        quantidade: data.quantidade,
        nivelReposicao: data.nivel_reposicao,
        lote: data.lote,
    };
}

/**
 * Exclui um insumo
 */
export async function deleteInsumo(id: number): Promise<void> {
    const { error } = await supabase
        .from(TABLE)
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Erro ao excluir insumo:', error);
        throw error;
    }
}
