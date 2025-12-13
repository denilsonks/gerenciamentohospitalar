import { supabase } from "@/config/supabase";
import { ItemCuidado, toDatabase } from "@/models/Schema";
import type { ItemCuidado as ItemCuidadoType } from "@/types";

interface GetCuidadosResponse {
    data: ItemCuidadoType[];
    count: number;
}

export async function getCuidados(page: number, limit: number): Promise<GetCuidadosResponse> {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, count, error } = await supabase
        .from(ItemCuidado.table)
        .select('*', { count: 'exact' })
        .order(ItemCuidado.fields.nome, { ascending: true })
        .range(from, to);

    if (error) {
        console.error('Erro ao buscar cuidados:', error);
        throw error;
    }

    return {
        data: data as ItemCuidadoType[],
        count: count || 0
    };
}

export async function createCuidado(cuidado: Pick<ItemCuidadoType, 'nome' | 'tipo'>) {
    const dbData = toDatabase(ItemCuidado, cuidado);

    const { data, error } = await supabase
        .from(ItemCuidado.table)
        .insert(dbData)
        .select()
        .single();

    if (error) {
        console.error('Erro ao criar cuidado:', error);
        throw error;
    }

    return data;
}

export async function deleteCuidado(id: string) {
    const { error } = await supabase
        .from(ItemCuidado.table)
        .delete()
        .eq(ItemCuidado.fields.id, id);

    if (error) {
        console.error('Erro ao excluir cuidado:', error);
        throw error;
    }
}
