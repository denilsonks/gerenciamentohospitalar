/**
 * =============================================================================
 * ABSTRAÇÃO DE SCHEMAS DO BANCO DE DADOS
 * =============================================================================
 * 
 * Organização por contexto/módulo seguindo boas práticas modernas.
 * Cada schema contém apenas o nome da tabela e mapeamento de campos.
 * 
 * Uso:
 * import { Paciente } from './types/database.types';
 * const { data } = await supabase.from(Paciente.table).select('*');
 */

// =============================================================================
// TIPO EXAMES
// =============================================================================
export const TipoExame = {
  table: 'TipoExames',
  fields: {
    id: 'id',
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
    identificador: 'identificador',
    createdAt: 'created_at',
    funcao: 'funcao',
    externo: 'externo',
    nomeCompleto: 'nome_completo',
    registroEmpresa: 'registro_empresa',
    telefone: 'telefone',
    registroProfissional: 'registro_profissional',
    numeroRegistro: 'numero_registro',
    identificadorUsuario: 'identificador_usuario'
  }
};

// =============================================================================
// ESTOQUE
// =============================================================================
export const Estoque = {
  table: 'estoque',
  fields: {
    id: 'id',
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
    id: 'id',
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
    identificadorUsuario: 'identificador_usuario'
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
    id: 'id',
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
    observacoes: 'observacoes'
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
    codigo: 'codigo',
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
    id: 'id',
    createdAt: 'created_at',
    identificador: 'identificador',
    identificadorMedico: 'identificado_medico',
    identificadorPaciente: 'identificador_paciente',
    nomeMedico: 'nome_medico',
    quarto: 'quarto',
    leito: 'leito',
    registroProntuario: 'registro_prontuario',
    convenio: 'convenio',
    idPaciente: 'id_paciente'
  },
  relations: {
    medico: 'identificado_medico -> colaboradores.identificador',
    paciente: 'identificador_paciente -> paciente.identificador',
    itens: 'identificador <- item_prescricao.identificado_prescricao'
  }
};

// =============================================================================
// EXPORTAÇÃO CENTRALIZADA
// =============================================================================
export const DB = {
  TipoExame,
  Colaborador,
  Estoque,
  ExameRX,
  Insumo,
  Internacao,
  ItemPrescricao,
  Paciente,
  Prescricao
};

// =============================================================================
// HELPERS UTILITÁRIOS
// =============================================================================

/**
 * Retorna string com todos os campos para SELECT
 * @param {Object} schema - Schema da tabela
 * @returns {string}
 * 
 * @example
 * selectAll(Paciente)
 * // Retorna: "id,created_at,nome_completo,documento_registro,..."
 */
export const selectAll = (schema) => {
  return Object.values(schema.fields).join(',');
};

/**
 * Retorna array com nomes dos campos
 * @param {Object} schema - Schema da tabela
 * @returns {Array<string>}
 * 
 * @example
 * getFieldNames(Paciente)
 * // Retorna: ["id", "created_at", "nome_completo", ...]
 */
export const getFieldNames = (schema) => {
  return Object.values(schema.fields);
};

/**
 * Retorna objeto com mapeamento reverso (valor -> chave)
 * Útil para quando você recebe dados do banco e quer usar aliases
 * @param {Object} schema - Schema da tabela
 * @returns {Object}
 * 
 * @example
 * const reverseMap = getReverseMap(Paciente);
 * const data = { nome_completo: 'João' };
 * const alias = reverseMap[data.nome_completo]; // 'nomeCompleto'
 */
export const getReverseMap = (schema) => {
  const reverse = {};
  Object.entries(schema.fields).forEach(([key, value]) => {
    reverse[value] = key;
  });
  return reverse;
};

/**
 * Lista todas as tabelas disponíveis
 * @returns {Array<string>}
 */
export const getAllTables = () => {
  return Object.values(DB).map(schema => schema.table);
};

/**
 * Busca schema pelo nome da tabela
 * @param {string} tableName - Nome da tabela
 * @returns {Object|null}
 * 
 * @example
 * findSchemaByTable('paciente')
 * // Retorna: Paciente
 */
export const findSchemaByTable = (tableName) => {
  return Object.values(DB).find(
    schema => schema.table === tableName
  ) || null;
};

/**
 * Cria objeto select personalizado
 * @param {Object} schema - Schema da tabela
 * @param {Array<string>} fields - Array com aliases dos campos
 * @returns {string}
 * 
 * @example
 * selectFields(Paciente, ['id', 'nomeCompleto', 'documentoRegistro'])
 * // Retorna: "id,nome_completo,documento_registro"
 */
export const selectFields = (schema, fields) => {
  return fields
    .map(field => schema.fields[field])
    .filter(Boolean)
    .join(',');
};

/**
 * Valida se campos obrigatórios estão presentes
 * @param {Object} data - Dados a validar
 * @param {Array<string>} requiredFields - Campos obrigatórios (nomes do banco)
 * @returns {Object} { valid: boolean, missing: Array<string> }
 * 
 * @example
 * validateRequired(
 *   { nome_completo: 'João' }, 
 *   ['nome_completo', 'documento_registro']
 * )
 * // Retorna: { valid: false, missing: ['documento_registro'] }
 */
export const validateRequired = (data, requiredFields) => {
  const missing = requiredFields.filter(field => {
    const value = data[field];
    return value === undefined || value === null || value === '';
  });

  return {
    valid: missing.length === 0,
    missing
  };
};

/**
 * Converte objeto com aliases para nomes do banco
 * @param {Object} schema - Schema da tabela
 * @param {Object} data - Dados com aliases (camelCase)
 * @returns {Object} - Dados com nomes do banco (snake_case)
 * 
 * @example
 * toDatabase(Paciente, { 
 *   nomeCompleto: 'João', 
 *   documentoRegistro: '123' 
 * })
 * // Retorna: { 
 * //   nome_completo: 'João', 
 * //   documento_registro: '123' 
 * // }
 */
export const toDatabase = (schema, data) => {
  const dbData = {};
  Object.entries(data).forEach(([key, value]) => {
    const dbField = schema.fields[key];
    if (dbField) {
      dbData[dbField] = value;
    }
  });
  return dbData;
};

/**
 * Converte objeto com nomes do banco para aliases
 * @param {Object} schema - Schema da tabela
 * @param {Object} data - Dados do banco (snake_case)
 * @returns {Object} - Dados com aliases (camelCase)
 * 
 * @example
 * fromDatabase(Paciente, { 
 *   nome_completo: 'João', 
 *   documento_registro: '123' 
 * })
 * // Retorna: { 
 * //   nomeCompleto: 'João', 
 * //   documentoRegistro: '123' 
 * // }
 */
export const fromDatabase = (schema, data) => {
  const aliasData = {};
  const reverseMap = getReverseMap(schema);
  
  Object.entries(data).forEach(([key, value]) => {
    const alias = reverseMap[key];
    if (alias) {
      aliasData[alias] = value;
    } else {
      aliasData[key] = value; // Mantém campos não mapeados
    }
  });
  
  return aliasData;
};