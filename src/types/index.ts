export interface TipoExame {
    id: number;
    createdAt: string;
    nome: string;
}

export interface Colaborador {
    id: number;
    identificador: string;
    createdAt: string;
    funcao: string;
    externo: boolean;
    nomeCompleto: string;
    registroEmpresa?: string;
    telefone?: string;
    registroProfissional?: string;
    numeroRegistro?: string;
    identificadorUsuario: string; // UUID do auth.users
}

export interface Estoque {
    id: number;
    createdAt: string;
    nome: string;
    tipo?: string;
}

export interface ExameRX {
    id: number;
    createdAt: string;
    imagemExame?: string;
    codExame?: string;
    laudo?: string;
    historico?: string;
    pxmm?: string;
    realizado?: boolean;
    radiologista?: string;
    idPaciente?: string; // UUID
    anatomia?: string[];
}

export interface Insumo {
    id: number;
    createdAt: string;
    nome: string;
    categoria?: string;
    quantidade?: number;
    nivelReposicao?: number;
    lote?: string;
}

export interface Internacao {
    identificador: string; // UUID
    createdAt: string;
    identificadorPaciente: string; // UUID -> paciente.codigo
    convenio?: string;
    quarto?: number; // numeric no banco
    leito?: string;
    identificadorUsuario: string; // UUID -> auth.users.id
    alta?: boolean;
}

export interface ItemPrescricao {
    idItem: string; // UUID (PRIMARY KEY)
    createdAt: string;
    identificadorPrescricao: string; // UUID
    produto?: string;
    frequencia?: string;
    seNecessario?: boolean;
    apresentacao?: string;
    horario?: string[];
    viaAdm?: string;
    quantidade?: number;
    devolver?: number;
    observacoes?: string;
    ordem?: number;
    obsApos?: string;
}

export interface Paciente {
    id: number;
    createdAt: string;
    nomeCompleto: string;
    documentoRegistro?: string;
    codigo: string; // UUID (PRIMARY KEY)
    identificador: string; // text
    dataDeNascimento?: string;
    internado?: boolean;
    alergias?: string;
    comorbidades?: string;
}

export interface Prescricao {
    identificador: string; // UUID (PRIMARY KEY)
    createdAt: string;
    identificadorMedico: string; // UUID -> auth.users.id
    nomeMedico?: string;
    quarto?: string;
    leito?: string;
    registroProntuario?: string;
    convenio?: string;
    idPaciente: string; // UUID -> paciente.codigo
    hraInicio?: string;
    hraFinal?: string;
    status?: string;
    tipo?: string;
    prescricaoOriginal?: string; // UUID
    dataPrescricao?: string;
    idInternacao?: string; // UUID -> internacoes.identificador
}

export interface ItemCuidado {
    id: string; // UUID
    createdAt: string;
    nome: string;
    tipo?: string;
}

export interface PrescricaoEnfermagem {
    id: string; // UUID
    createdAt: string;
    paciente: string; // UUID -> paciente.codigo
    usuario: string; // UUID -> auth.users.id
    internacao: string; // UUID -> internacoes.identificador
    medicoAssistente?: string; // UUID -> colaboradores.identificador
    dataPrescricao?: string;
    item?: string;
    observacoes?: string;
}
