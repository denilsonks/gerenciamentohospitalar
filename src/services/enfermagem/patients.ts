import { supabase } from "@/config/supabase";
import { Paciente, Internacao, PrescricaoEnfermagem, Colaborador } from "@/models/Schema";
import { fromDatabase } from "@/models/Schema";
import type { Paciente as PacienteType } from "@/types";

export interface PatientListItem extends PacienteType {
    quarto?: number;
    leito?: string;
    dataInternacao?: string;
    convenio?: string;
    identificadorInternacao?: string;
    statusPrescricao?: string;
    medicoResponsavel?: string;
    nomeMedico?: string;
    idColaboradorMedico?: string; // Novo campo para guardar o ID do colaborador
}

export async function getHospitalizedPatients(): Promise<PatientListItem[]> {

    console.log("Iniciando busca de pacientes hospitalizados...");

    // 1. Busca todas as internações ativas
    const { data: internacoesData, error: internacoesError } = await supabase
        .from(Internacao.table)
        .select(`
            ${Internacao.fields.identificador},
            ${Internacao.fields.quarto},
            ${Internacao.fields.leito},
            ${Internacao.fields.createdAt},
            ${Internacao.fields.convenio},
            ${Internacao.fields.identificadorUsuario},
            ${Internacao.fields.identificadorPaciente},
            ${Paciente.table}!${Internacao.fields.identificadorPaciente} (
                *
            )
        `)
        .eq(Internacao.fields.alta, false);

    if (internacoesError) {
        console.error('Erro ao buscar internações:', internacoesError);
        return [];
    }

    if (!internacoesData || internacoesData.length === 0) {
        console.log("Nenhuma internação ativa encontrada.");
        return [];
    }

    console.log(`Encontradas ${internacoesData.length} internações.`);

    // 2. Coletar IDs para buscar dados complementares
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userIds = [...new Set(internacoesData.map((i: any) => i[Internacao.fields.identificadorUsuario]).filter(Boolean))];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const internacaoIds = internacoesData.map((i: any) => i[Internacao.fields.identificador]);

    // 3. Buscar nomes e identificadores dos colaboradores (Médicos)
    const mapMedicos: Record<string, string> = {};
    const mapColaboradorId: Record<string, string> = {}; // Mapeia UserId -> ColaboradorIdentifier

    if (userIds.length > 0) {
        const { data: colaboradoresData } = await supabase
            .from(Colaborador.table)
            .select(`${Colaborador.fields.identificador}, ${Colaborador.fields.identificadorUsuario}, ${Colaborador.fields.nomeCompleto}`)
            .in(Colaborador.fields.identificadorUsuario, userIds);

        if (colaboradoresData) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            colaboradoresData.forEach((c: any) => {
                mapMedicos[c[Colaborador.fields.identificadorUsuario]] = c[Colaborador.fields.nomeCompleto];
                mapColaboradorId[c[Colaborador.fields.identificadorUsuario]] = c[Colaborador.fields.identificador];
            });
        }
    }

    // 4. Buscar Prescrições de Enfermagem de Hoje para essas internações
    const hoje = new Date().toISOString().split('T')[0];
    const mapPrescricoesHoje: Record<string, boolean> = {};

    if (internacaoIds.length > 0) {
        const { data: prescricoesData } = await supabase
            .from(PrescricaoEnfermagem.table)
            .select(`${PrescricaoEnfermagem.fields.internacao}, ${PrescricaoEnfermagem.fields.dataPrescricao}, ${PrescricaoEnfermagem.fields.createdAt}`)
            .in(PrescricaoEnfermagem.fields.internacao, internacaoIds)
            .gte(PrescricaoEnfermagem.fields.dataPrescricao, `${hoje}T00:00:00`)
            .lte(PrescricaoEnfermagem.fields.dataPrescricao, `${hoje}T23:59:59`);

        if (prescricoesData) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            prescricoesData.forEach((p: any) => {
                const dataRef = p[PrescricaoEnfermagem.fields.dataPrescricao] || p[PrescricaoEnfermagem.fields.createdAt];
                if (dataRef && dataRef.startsWith(hoje)) {
                    mapPrescricoesHoje[p[PrescricaoEnfermagem.fields.internacao]] = true;
                }
            });
        }
    }

    // 5. Montar lista final
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pacientesCompletos = internacoesData.map((internacao: any) => {
        const pacienteData = internacao[Paciente.table];

        if (!pacienteData) return null;

        const paciente = fromDatabase<PacienteType>(Paciente, pacienteData);
        const internacaoId = internacao[Internacao.fields.identificador];
        const hasPrescriptionToday = !!mapPrescricoesHoje[internacaoId];
        const statusParaBotao = hasPrescriptionToday ? 'finalizado' : undefined;
        const medicoUserId = internacao[Internacao.fields.identificadorUsuario];
        const medicoColaboradorId = mapColaboradorId[medicoUserId]; // Pode ser undefined se não achou no map

        return {
            ...paciente,
            quarto: internacao[Internacao.fields.quarto] || 0,
            leito: internacao[Internacao.fields.leito] || '',
            convenio: internacao[Internacao.fields.convenio] || '',
            dataInternacao: internacao[Internacao.fields.createdAt] || '',
            identificadorInternacao: internacaoId,
            statusPrescricao: statusParaBotao,
            medicoResponsavel: medicoUserId, // Mantém o ID do usuário para compatibilidade visual ou outros usos
            idColaboradorMedico: medicoColaboradorId, // Novo campo com ID correto para FK
            nomeMedico: mapMedicos[medicoUserId] || 'Não identificado'
        } as PatientListItem;
    }).filter(Boolean) as PatientListItem[];

    console.log(`Retornando ${pacientesCompletos.length} pacientes formatados.`);
    return pacientesCompletos;
}
