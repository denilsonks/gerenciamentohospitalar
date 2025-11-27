export const Schema = {
    Paciente: {
        table: "paciente",
        fields: {
            id: "id",
            nomeCompleto: "nome_completo",
            dataNascimento: "data_nascimento",
            quarto: "quarto",
            leito: "leito",
            convenio: "convenio",
            alergia: "alergia",
            detalhesAlergia: "detalhes_alergia",
            dataUltimaPrescricao: "data_ultima_prescricao",
            statusPrescricao: "status_prescricao" // 'em_dia' | 'pendente' | 'atrasada'
        }
    },
    Medico: {
        table: "medico",
        fields: {
            id: "id",
            nome: "nome",
            crm: "crm",
            especialidade: "especialidade"
        }
    }
} as const;

export type SchemaType = typeof Schema;

// Derived Types for Application Use (CamelCase)
export interface Paciente {
    id: string;
    nomeCompleto: string;
    dataNascimento: string;
    quarto: string;
    leito: string;
    convenio: string;
    alergia: boolean;
    detalhesAlergia?: string;
    dataUltimaPrescricao?: string;
    statusPrescricao: 'em_dia' | 'pendente' | 'atrasada';
}

export interface Medico {
    id: string;
    nome: string;
    crm: string;
    especialidade: string;
}
