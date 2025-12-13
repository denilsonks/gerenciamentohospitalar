/**
 * =============================================================================
 * ABSTRAÇÃO DE SCHEMAS DO BANCO DE DADOS
 * =============================================================================
 * 
 * Organização por contexto/módulo seguindo boas práticas modernas.
 * Cada schema contém apenas o nome da tabela e mapeamento de campos.
 */

// =============================================================================
// TIPO EXAMES
// =============================================================================
export const TipoExame = {
    table: 'TipoExames',
    fields: {
        id: 'id', // Código de identificação do tipo de exame
        createdAt: 'created_at',
        nome: 'nome'
    }
};

// =============================================================================
// COLABORADORES
// =============================================================================
export const Colaborador = {
    table: 'colaboradores',
    fields: {
        id: 'id',
        identificador: 'identificador', // Código de identificação do colaborador
        createdAt: 'created_at',
        funcao: 'funcao',
        externo: 'externo',
        nomeCompleto: 'nome_completo',
        registroEmpresa: 'registro_empresa',
        telefone: 'telefone',
        registroProfissional: 'registro_profissional',
        numeroRegistro: 'numero_registro',
        identificadorUsuario: 'identificador_usuario', // Código de relacionamento para identificação do usuário
        usuario: 'usuario',
        email: 'email'
    },
    relations: {
        usuario: 'identificador_usuario -> auth.users.id'
    }
};

// =============================================================================
// ESTOQUE
// =============================================================================
export const Estoque = {
    table: 'estoque',
    fields: {
        id: 'id', // Código de identificação do estoque
        createdAt: 'created_at',
        nome: 'nome'
    }
};

// =============================================================================
// EXAME RX (RAIO-X)
// =============================================================================
export const ExameRX = {
    table: 'exame_rx',
    fields: {
        id: 'id',
        createdAt: 'created_at',
        imagemExame: 'imagem_exame',
        codExame: 'codexame',
        laudo: 'laudo',
        historico: 'historico',
        pxmm: 'pxmm',
        realizado: 'realizado',
        radiologista: 'radiologista',
        idPaciente: 'idpaciente'
    },
    relations: {
        paciente: 'idpaciente -> paciente.id'
    }
};

// =============================================================================
// INSUMOS
// =============================================================================
export const Insumo = {
    table: 'insumos',
    fields: {
        id: 'id', // Código de identificação do insumo
        createdAt: 'created_at',
        nome: 'nome',
        categoria: 'categoria',
        quantidade: 'quantidade',
        nivelReposicao: 'nivel_reposicao',
        lote: 'lote'
    }
};

// =============================================================================
// INTERNAÇÕES
// =============================================================================
export const Internacao = {
    table: 'internacoes',
    fields: {
        identificador: 'identificador',
        createdAt: 'created_at',
        identificadorPaciente: 'identificador_paciente',
        convenio: 'convenio',
        quarto: 'quarto',
        leito: 'leito',
        identificadorUsuario: 'identificador_usuario',
        alta: 'alta'
    },
    relations: {
        paciente: 'identificador_paciente -> paciente.identificador',
        usuario: 'identificador_usuario -> auth.users.id'
    }
};

// =============================================================================
// ITEM PRESCRIÇÃO
// =============================================================================
export const ItemPrescricao = {
    table: 'item_prescricao',
    fields: {
        idItem: 'id_item', // Código de identificação do item de prescrição
        createdAt: 'created_at',
        identificadorPrescricao: 'identificado_prescricao',
        produto: 'produto',
        frequencia: 'frequencia',
        seNecessario: 'senecessario',
        apresentacao: 'apresentacao',
        horario: 'horario',
        viaAdm: 'via_adm',
        quantidade: 'quantidade',
        devolver: 'devolver',
        observacoes: 'observacoes',
        ordem: 'ordem'
    },
    relations: {
        prescricao: 'identificado_prescricao -> prescricoes.identificador'
    }
};

// =============================================================================
// PACIENTE
// =============================================================================
export const Paciente = {
    table: 'paciente',
    fields: {
        id: 'id',
        createdAt: 'created_at',
        nomeCompleto: 'nome_completo',
        documentoRegistro: 'documento_registro',
        codigo: 'codigo', // Código de identificação do paciente
        identificador: 'identificador',
        dataDeNascimento: 'data_de_nascimento',
        internado: 'internado'
    }
};

// =============================================================================
// PRESCRIÇÕES
// =============================================================================
export const Prescricao = {
    table: 'prescricoes',
    fields: {
        // id: 'id', // Desativado, não usar
        createdAt: 'created_at',
        identificador: 'identificador', // Código de identificação da prescrição
        identificadorMedico: 'identificado_medico', // Sempre pegar do usuário logado (auth.user)
        // identificadorPaciente: 'identificador_paciente', // Desativado, não usar
        // nomeMedico: 'nome_medico', // Desativado, não usar
        // quarto: 'quarto', // Desativado, não usar
        // leito: 'leito', // Desativado, não usar
        // registroProntuario: 'registro_prontuario', // Desativado, não usar
        // convenio: 'convenio', // Desativado, não usar
        idPaciente: 'id_paciente',
        hraInicio: 'hra_inicio',
        hraFinal: 'hra_final',
        idInternacao: 'id_internacao',
        status: 'status',
        dataPrescricao: 'data_prescricao'
    },
    relations: {
        medico: 'identificado_medico -> auth.users.id',
        paciente: 'id_paciente -> paciente.codigo',
        itens: 'identificador <- item_prescricao.identificado_prescricao',
        internacao: 'id_internacao -> internacoes.identificador'
    }
};

// =============================================================================
// PRESCRIÇÕES ENFERMAGEM
// =============================================================================
export const PrescricaoEnfermagem = {
    table: 'prescricoes_enfermagem',
    fields: {
        id: 'id',
        paciente: 'paciente',                   // FK -> paciente.codigo ✅
        usuario: 'usuario',                     // FK -> auth.users.id
        internacao: 'internacao',               // FK -> internacoes.identificador
        medicoAssistente: 'medico_assistente',  // FK -> colaboradores.identificador
        dataPrescricao: 'data_prescricao',
        item: 'item',
        observacoes: 'observacoes',
        createdAt: 'created_at'
    },
    relations: {
        paciente: 'paciente -> paciente.codigo', // ✅ Correto agora
        usuario: 'usuario -> auth.users.id',
        internacao: 'internacao -> internacoes.identificador',
        medicoAssistente: 'medico_assistente -> colaboradores.identificador'
    }
};


// =============================================================================
// ITENS DE CUIDADOS DE ENFERMAGEM
// =============================================================================
export const ItemCuidado = {
    table: 'item_cuidados',
    fields: {
        id: 'id',                          // UUID do item
        createdAt: 'created_at',           // Timestamp de criação
        nome: 'nome',                      // Nome do cuidado
        tipo: 'tipo'                       // Categoria ou tipo do cuidado (ex: higiene, posicionamento)
    }
};






// =============================================================================
// HELPERS UTILITÁRIOS
// =============================================================================

/**
 * Retorna objeto com mapeamento reverso (valor -> chave)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getReverseMap = (schema: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const reverse: any = {};
    Object.entries(schema.fields).forEach(([key, value]) => {
        reverse[value as string] = key;
    });
    return reverse;
};

/**
 * Converte objeto com nomes do banco para aliases
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fromDatabase = <T>(schema: any, data: any): T => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const aliasData: any = {};
    const reverseMap = getReverseMap(schema);

    Object.entries(data).forEach(([key, value]) => {
        const alias = reverseMap[key];
        if (alias) {
            aliasData[alias] = value;
        } else {
            aliasData[key] = value; // Mantém campos não mapeados
        }
    });

    return aliasData as T;
};

/**
 * Converte objeto com aliases para nomes do banco
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const toDatabase = (schema: any, data: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dbData: any = {};
    Object.entries(data).forEach(([key, value]) => {
        const dbField = schema.fields[key];
        if (dbField) {
            dbData[dbField] = value;
        }
    });
    return dbData;
};
