import { supabase } from '../../config/supabase';
import { Colaborador as ColaboradorSchema } from '../../models/Schema';
import type { Colaborador } from '../../types';
import { toDatabase, fromDatabase } from '../db';

export interface CreateUserData {
    email: string;
    password: string;
    usuario: string; // [ADICIONADO]
    nomeCompleto: string;
    funcao: 'Médico' | 'Recepcionista' | 'Admin';
    telefone?: string;
    registroProfissional?: string;
    numeroRegistro?: string;
}

export interface CreateUserResponse {
    userId: string;
    colaborador: Colaborador;
}

/**
 * Cria um novo usuário no Supabase Auth e um registro correspondente na tabela colaboradores
 */
export async function createUser(data: CreateUserData): Promise<CreateUserResponse> {
    try {
        console.log('🔵 Iniciando criação de usuário:', data.email);

        // 1. Criar usuário no Supabase Auth (sem confirmação de email)
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
                emailRedirectTo: undefined, // Não redirecionar após confirmação
                data: {
                    nome_completo: data.nomeCompleto,
                    funcao: data.funcao
                }
            }
        });

        if (authError) {
            console.error('❌ Erro ao criar usuário no Auth:', authError);
            throw new Error(`Erro ao criar usuário: ${authError.message}`);
        }

        if (!authData.user) {
            console.error('❌ Usuário não foi retornado pelo signUp');
            throw new Error('Usuário não foi criado');
        }

        const userId = authData.user.id;
        console.log('✅ Usuário criado no Auth com UUID:', userId);

        // 2. Criar registro na tabela colaboradores
        const colaboradorData = toDatabase(ColaboradorSchema, {
            identificadorUsuario: userId,
            identificador: crypto.randomUUID(), // Gerar UUID válido
            nomeCompleto: data.nomeCompleto,
            funcao: data.funcao,
            usuario: data.usuario, // [ADICIONADO]
            email: data.email, // [ADICIONADO] - Salvando email para lookup
            telefone: data.telefone || null,
            registroProfissional: data.registroProfissional || null,
            numeroRegistro: data.numeroRegistro || null,
            externo: false
        });

        console.log('🔵 Tentando inserir colaborador:', colaboradorData);

        const { data: colaboradorResult, error: colaboradorError } = await supabase
            .from(ColaboradorSchema.table)
            .insert(colaboradorData)
            .select()
            .single();

        if (colaboradorError) {
            console.error('❌ Erro ao criar colaborador:', colaboradorError);
            console.error('Detalhes do erro:', {
                message: colaboradorError.message,
                details: colaboradorError.details,
                hint: colaboradorError.hint,
                code: colaboradorError.code
            });

            // Não tentar deletar o usuário - deixar para o admin fazer manualmente se necessário
            throw new Error(`Erro ao criar colaborador: ${colaboradorError.message}. Usuário criado mas colaborador não. UUID: ${userId}`);
        }

        if (!colaboradorResult) {
            console.error('❌ Colaborador não foi retornado após insert');
            throw new Error('Colaborador não foi criado. Usuário criado mas colaborador não. UUID: ' + userId);
        }

        console.log('✅ Colaborador criado com sucesso:', colaboradorResult);

        const colaborador = fromDatabase(ColaboradorSchema, colaboradorResult) as Colaborador;

        return {
            userId,
            colaborador
        };
    } catch (error) {
        console.error('❌ Erro geral no createUser:', error);
        throw error;
    }
}

/**
 * Lista todos os colaboradores
 */
export async function getAllColaboradores(): Promise<Colaborador[]> {
    const { data, error } = await supabase
        .from(ColaboradorSchema.table)
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Erro ao buscar colaboradores:', error);
        throw new Error(`Erro ao buscar colaboradores: ${error.message}`);
    }

    return data.map(item => fromDatabase(ColaboradorSchema, item)) as Colaborador[];
}
