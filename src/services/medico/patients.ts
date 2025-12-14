import { supabase } from "@/config/supabase";
import { Paciente, Internacao, Prescricao } from "@/models/Schema";
import { fromDatabase } from "@/models/Schema";
import type { Paciente as PacienteType } from "@/types";

// Interface (Mantida sem alterações)
export interface PatientListItem extends PacienteType {
    quarto?: number;
    leito?: string;
    dataInternacao?: string;
    convenio?: string;
    identificadorInternacao?: string;
    statusPrescricao?: string; // Usado como flag: 'finalizado' se houver prescrição hoje, senão undefined/outro
}

export async function getHospitalizedPatients(userId: string): Promise<PatientListItem[]> {

    // 1. Busca no Supabase (Mantida sem alterações na busca e no JOIN)
    // A query já filtra pela Internação ativa do userId e puxa as Prescrições
    const { data: internacoesData, error: internacoesError } = await supabase
        .from(Internacao.table)
        .select(`
            ${Internacao.fields.identificador},
            ${Internacao.fields.quarto},
            ${Internacao.fields.leito},
            ${Internacao.fields.createdAt},
            ${Internacao.fields.convenio},
            ${Internacao.fields.identificadorPaciente},
            ${Paciente.table}!${Internacao.fields.identificadorPaciente} (
                *
            ),
            ${Prescricao.table}!${Prescricao.fields.idInternacao} (
                ${Prescricao.fields.status},
                ${Prescricao.fields.createdAt}
            )
        `)
        // Filtro: Apenas internações associadas ao usuário logado (userId)
        .eq(Internacao.fields.identificadorUsuario, userId);

    if (internacoesError) {
        console.error('Erro ao buscar internações:', internacoesError);
        return [];
    }

    if (!internacoesData) return [];

    // 2. Mapeamento dos Dados com a Nova Lógica
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pacientesCompletos = internacoesData.map((internacao: any) => {
        const pacienteData = internacao[Paciente.table];

        if (!pacienteData) return null;

        const paciente = fromDatabase<PacienteType>(Paciente, pacienteData);

        // Obter todas as prescrições relacionadas à internação
        const prescricoes = internacao[Prescricao.table] || [];

        const hoje = new Date().toISOString().split('T')[0];

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const hasPrescriptionToday = prescricoes.some((prescricao: any) => {
            const dataCriacao = new Date(prescricao[Prescricao.fields.createdAt]).toISOString().split('T')[0];
            return dataCriacao === hoje;
        });

        // Se houver prescrição hoje, definimos o status como 'finalizado' para ativar a cor VERDE no frontend.
        const statusParaBotao = hasPrescriptionToday ? 'finalizado' : undefined;

        // =========================================================================


        return {
            ...paciente,
            quarto: internacao[Internacao.fields.quarto] || 0,
            leito: internacao[Internacao.fields.leito] || '',
            convenio: internacao[Internacao.fields.convenio] || '',
            dataInternacao: internacao[Internacao.fields.createdAt] || '',
            identificadorInternacao: internacao[Internacao.fields.identificador],
            statusPrescricao: statusParaBotao
        } as PatientListItem;
    }).filter(Boolean) as PatientListItem[];

    return pacientesCompletos;
}