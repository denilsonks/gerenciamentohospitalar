/**
 * Configuração de rotas baseadas em roles/funções
 * 
 * Para adicionar novas funções, basta adicionar uma nova entrada neste objeto
 * seguindo o padrão: 'NomeDaFuncao': '/rota-destino'
 */

export const ROLE_ROUTES: Record<string, string> = {
    'Medico': '/medico',
    'Recepcionista': '/recepcao',
    'Enfermeiro': '/enfermagem',
    'Admin': '/admin-dashboard',
    // Adicione novas funções aqui conforme necessário
    // Exemplo:
    // 'Farmaceutico': '/farmacia',
};

/**
 * Rota padrão caso a função do usuário não esteja mapeada
 */
export const DEFAULT_ROUTE = '/Login';

/**
 * Obtém a rota de destino baseada na função do usuário
 * @param funcao - Função do usuário (ex: 'Medico', 'Recepcionista')
 * @returns Rota de destino
 */
export function getRouteByRole(funcao: string | undefined): string {
    if (!funcao) return DEFAULT_ROUTE;
    return ROLE_ROUTES[funcao] || DEFAULT_ROUTE;
}
