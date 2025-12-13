import type { Insumo } from '@/types';

/**
 * Normaliza o texto removendo acentos e caracteres especiais
 */
function normalizeText(text: string): string {
    return text
        .toLowerCase()
        .trim()
        // Remove acentos (ex: "ã" -> "a", "é" -> "e")
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Remove duplicatas da lista baseado no nome do insumo
 */
function removeDuplicates(insumos: Insumo[]): Insumo[] {
    const seen = new Set<string>();
    return insumos.filter(insumo => {
        const normalizedName = normalizeText(insumo.nome);
        if (seen.has(normalizedName)) {
            return false; // Já existe, remove
        }
        seen.add(normalizedName);
        return true;
    });
}

/**
 * Filtra a lista de insumos baseado no texto digitado.
 * Retorna apenas os itens que COMEÇAM com o texto (case-insensitive, sem acentos).
 * Remove duplicatas automaticamente.
 * 
 * @param insumos - Lista completa de insumos
 * @param searchText - Texto digitado pelo usuário
 * @returns Lista filtrada de insumos (sem duplicatas)
 */
export function filterInsumosByText(insumos: Insumo[], searchText: string): Insumo[] {
    const normalizedSearch = normalizeText(searchText);

    // Se não há texto, retorna lista vazia (não mostra nada)
    if (!normalizedSearch) {
        return [];
    }

    // Primeiro remove duplicatas
    const uniqueInsumos = removeDuplicates(insumos);

    // Depois filtra apenas os que COMEÇAM com o texto digitado
    const filtered = uniqueInsumos.filter(insumo => {
        const normalizedNome = normalizeText(insumo.nome);
        return normalizedNome.startsWith(normalizedSearch);
    });

    console.log(`[Filter] Busca: "${searchText}" | Resultados: ${filtered.length} (de ${uniqueInsumos.length} únicos)`);

    return filtered;
}

/**
 * Remove duplicatas de toda a lista de insumos (usar no carregamento inicial)
 */
export function getUniqueInsumos(insumos: Insumo[]): Insumo[] {
    return removeDuplicates(insumos);
}
