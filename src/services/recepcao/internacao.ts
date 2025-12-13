import { supabase } from '../../config/supabase';
import { Internacao, Paciente, Colaborador, fromDatabase, toDatabase } from '../../models/Schema';
import type { Internacao as InternacaoType } from '../../types';

export interface CreateInternacaoData {
    identificadorPaciente: string;
    convenio: string;
    quarto: number;
    leito: string;
    identificadorUsuario: string; // UUID do médico selecionado
}

export interface InternacaoComPaciente extends InternacaoType {
    paciente?: {
        nomeCompleto: string;
        documentoRegistro?: string;
        dataDeNascimento?: string;
        alergias?: string;
        comorbidades?: string;
    };
    medico?: {
        nomeCompleto: string;
        registroProfissional?: string;
        numeroRegistro?: string;
    };
}

/**
 * Cria uma nova internação
 */
export async function createInternacao(data: CreateInternacaoData): Promise<InternacaoType> {
    // Converter para snake_case
    const dbData = toDatabase(Internacao, {
        identificadorPaciente: data.identificadorPaciente,
        convenio: data.convenio,
        quarto: data.quarto,
        leito: data.leito,
        identificadorUsuario: data.identificadorUsuario // UUID do médico selecionado
    });

    // Inserir internação
    const { data: internacao, error: internacaoError } = await supabase
        .from(Internacao.table)
        .insert(dbData)
        .select()
        .single();

    if (internacaoError) throw internacaoError;

    // Atualizar flag internado do paciente
    const { error: pacienteError } = await supabase
        .from(Paciente.table)
        .update({ [Paciente.fields.internado]: true })
        .eq(Paciente.fields.codigo, data.identificadorPaciente);

    if (pacienteError) throw pacienteError;

    return fromDatabase<InternacaoType>(Internacao, internacao);
}

/**
 * Busca todas as internações ativas com dados do paciente e médico
 */
export async function getInternacoesAtivas(): Promise<InternacaoComPaciente[]> {
    // Buscar internações ativas (onde alta não é true)
    const { data: internacoesData, error } = await supabase
        .from(Internacao.table)
        .select('*')
        .or(`${Internacao.fields.alta}.is.null,${Internacao.fields.alta}.eq.false`)
        .order(Internacao.fields.createdAt, { ascending: false });

    if (error) throw error;
    if (!internacoesData) return [];

    const result: InternacaoComPaciente[] = [];

    for (const item of internacoesData) {
        const internacao = fromDatabase<InternacaoType>(Internacao, item);

        // Buscar dados do paciente
        let pacienteData = undefined;
        if (internacao.identificadorPaciente) {
            const { data: paciente } = await supabase
                .from(Paciente.table)
                .select('*')
                .eq(Paciente.fields.codigo, internacao.identificadorPaciente)
                .maybeSingle();

            if (paciente) {
                const pacienteConverted = fromDatabase<any>(Paciente, paciente);
                pacienteData = {
                    nomeCompleto: pacienteConverted.nomeCompleto,
                    documentoRegistro: pacienteConverted.documentoRegistro,
                    dataDeNascimento: pacienteConverted.dataDeNascimento,
                    alergias: pacienteConverted.alergias,
                    comorbidades: pacienteConverted.comorbidades
                };
            }
        }

        // Buscar dados do médico (da tabela colaboradores)
        let medicoData = undefined;
        if (internacao.identificadorUsuario) {
            const { data: colaborador } = await supabase
                .from(Colaborador.table)
                .select('*')
                .eq(Colaborador.fields.identificadorUsuario, internacao.identificadorUsuario)
                .maybeSingle();

            if (colaborador) {
                const colaboradorConverted = fromDatabase<any>(Colaborador, colaborador);
                medicoData = {
                    nomeCompleto: colaboradorConverted.nomeCompleto || 'N/A',
                    registroProfissional: colaboradorConverted.registroProfissional,
                    numeroRegistro: colaboradorConverted.numeroRegistro
                };
            }
        }

        result.push({
            ...internacao,
            paciente: pacienteData,
            medico: medicoData
        });
    }

    return result;
}

/**
 * Atualiza dados de uma internação
 */
export async function updateInternacao(
    identificador: string,
    updates: Partial<CreateInternacaoData>
): Promise<InternacaoType> {
    const dbData = toDatabase(Internacao, updates);

    const { data, error } = await supabase
        .from(Internacao.table)
        .update(dbData)
        .eq(Internacao.fields.identificador, identificador)
        .select()
        .single();

    if (error) throw error;

    return fromDatabase<InternacaoType>(Internacao, data);
}

/**
 * Busca internações com filtros e paginação
 */
export async function getInternacoes({
    page,
    pageSize,
    filters
}: {
    page: number;
    pageSize: number;
    filters?: {
        nomePaciente?: string;
        medico?: string;
        status?: 'ativo' | 'todos' | 'alta';
        dataInicio?: string;
        dataFim?: string;
    };
}): Promise<{ data: InternacaoComPaciente[]; total: number }> {
    let query = supabase
        .from(Internacao.table)
        .select('*', { count: 'exact' });

    // Filtros
    if (filters?.status === 'ativo') {
        query = query.or(`${Internacao.fields.alta}.is.null,${Internacao.fields.alta}.eq.false`);
    } else if (filters?.status === 'alta') {
        query = query.eq(Internacao.fields.alta, true);
    }

    if (filters?.dataInicio) {
        query = query.gte(Internacao.fields.createdAt, filters.dataInicio);
    }
    if (filters?.dataFim) {
        query = query.lte(Internacao.fields.createdAt, filters.dataFim);
    }

    if (filters?.medico) {
        query = query.eq(Internacao.fields.identificadorUsuario, filters.medico);
    }

    // Se houver filtro de nome de paciente, precisamos buscar os IDs dos pacientes primeiro
    // Nota: Isso não é ideal para performance em grandes bases, mas funciona para este escopo
    if (filters?.nomePaciente) {
        const { data: pacientes } = await supabase
            .from(Paciente.table)
            .select(Paciente.fields.codigo)
            .ilike(Paciente.fields.nomeCompleto, `%${filters.nomePaciente}%`);

        if (pacientes && pacientes.length > 0) {
            const ids = pacientes.map(p => (p as any)[Paciente.fields.codigo]);
            query = query.in(Internacao.fields.identificadorPaciente, ids);
        } else {
            // Se buscou por nome e não achou ninguém, retorna vazio
            return { data: [], total: 0 };
        }
    }

    // Paginação
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    query = query
        .order(Internacao.fields.createdAt, { ascending: false })
        .range(from, to);

    const { data: internacoesData, error, count } = await query;

    if (error) throw error;
    if (!internacoesData) return { data: [], total: 0 };

    const result: InternacaoComPaciente[] = [];

    // Enriquecer dados (N+1 problema, mas mantendo consistência com o padrão atual do projeto)
    for (const item of internacoesData) {
        const internacao = fromDatabase<InternacaoType>(Internacao, item);

        let pacienteData = undefined;
        if (internacao.identificadorPaciente) {
            const { data: paciente } = await supabase
                .from(Paciente.table)
                .select('*')
                .eq(Paciente.fields.codigo, internacao.identificadorPaciente)
                .maybeSingle();

            if (paciente) {
                const pacienteConverted = fromDatabase<any>(Paciente, paciente);
                pacienteData = {
                    nomeCompleto: pacienteConverted.nomeCompleto,
                    documentoRegistro: pacienteConverted.documentoRegistro,
                    dataDeNascimento: pacienteConverted.dataDeNascimento
                };
            }
        }

        let medicoData = undefined;
        if (internacao.identificadorUsuario) {
            const { data: colaborador } = await supabase
                .from(Colaborador.table)
                .select('*')
                .eq(Colaborador.fields.identificadorUsuario, internacao.identificadorUsuario)
                .maybeSingle();

            if (colaborador) {
                const colaboradorConverted = fromDatabase<any>(Colaborador, colaborador);
                medicoData = {
                    nomeCompleto: colaboradorConverted.nomeCompleto || 'N/A'
                };
            }
        }

        result.push({
            ...internacao,
            paciente: pacienteData,
            medico: medicoData
        });
    }

    return { data: result, total: count || 0 };
}

/**
 * Dá alta ao paciente (atualiza campo 'alta' para true)
 */
export async function darAltaPaciente(internacaoId: string): Promise<void> {
    // Buscar internação para obter ID do paciente
    const { data: internacao, error: fetchError } = await supabase
        .from(Internacao.table)
        .select(Internacao.fields.identificadorPaciente)
        .eq(Internacao.fields.identificador, internacaoId)
        .single();

    if (fetchError) throw fetchError;

    // Atualizar campo 'alta' para true
    const { error: altaError } = await supabase
        .from(Internacao.table)
        .update({ [Internacao.fields.alta]: true })
        .eq(Internacao.fields.identificador, internacaoId);

    if (altaError) throw altaError;

    // Atualizar flag internado do paciente
    const identificadorPaciente = (internacao as any)[Internacao.fields.identificadorPaciente] as string;
    const { error: updateError } = await supabase
        .from(Paciente.table)
        .update({ [Paciente.fields.internado]: false })
        .eq(Paciente.fields.codigo, identificadorPaciente);

    if (updateError) throw updateError;
}

