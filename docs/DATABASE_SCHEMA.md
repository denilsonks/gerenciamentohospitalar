# 🗄️ Database Schema Documentation

**Sistema de Gerenciamento Hospitalar - Supabase PostgreSQL**

---

## 📋 Índice

- [Convenções](#-convenções)
- [Tabelas](#-tabelas)
- [Relacionamentos](#-relacionamentos)
- [Mapeamento de Campos](#-mapeamento-de-campos)
- [Exemplos SQL](#-exemplos-sql)

---

## 📐 Convenções

### **Nomenclatura**

#### **No Banco de Dados (PostgreSQL/Supabase)**
- Tabelas: `snake_case` (minúsculas)
- Colunas: `snake_case` (minúsculas)
- Chaves primárias: `id` ou `identificador`
- Chaves estrangeiras: `identificador_[tabela]` ou `id_[tabela]`
- Timestamps: `created_at`, `updated_at`

#### **No Código TypeScript**
- Propriedades: `camelCase`
- Interfaces: `PascalCase`
- Constantes de Schema: `PascalCase`

### **Tipos de Dados Comuns**

| PostgreSQL | TypeScript | Uso |
|------------|------------|-----|
| `uuid` | `string` | IDs únicos |
| `text` | `string` | Textos longos |
| `varchar(n)` | `string` | Textos curtos |
| `integer` | `number` | Números inteiros |
| `boolean` | `boolean` | Verdadeiro/Falso |
| `timestamp` | `string` | Data/hora ISO |
| `date` | `string` | Data (YYYY-MM-DD) |

---

## 📊 Tabelas

### **1. colaboradores**

Armazena informações dos funcionários do hospital.

#### **Estrutura SQL**
```sql
CREATE TABLE colaboradores (
    identificador uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamp with time zone DEFAULT now(),
    funcao text NOT NULL,
    externo boolean DEFAULT false,
    nome_completo text NOT NULL,
    registro_empresa text,
    telefone text,
    registro_profissional text,
    numero_registro text,
    identificador_usuario uuid REFERENCES auth.users(id)
);
```

#### **Campos**

| Campo (DB) | Campo (App) | Tipo | Descrição |
|------------|-------------|------|-----------|
| `identificador` | `identificador` | uuid | ID único do colaborador |
| `created_at` | `createdAt` | timestamp | Data de criação |
| `funcao` | `funcao` | text | Função (Medico, Enfermeiro, etc) |
| `externo` | `externo` | boolean | Se é colaborador externo |
| `nome_completo` | `nomeCompleto` | text | Nome completo |
| `registro_empresa` | `registroEmpresa` | text | Registro interno |
| `telefone` | `telefone` | text | Telefone de contato |
| `registro_profissional` | `registroProfissional` | text | Tipo de registro (CRM, COREN) |
| `numero_registro` | `numeroRegistro` | text | Número do registro |
| `identificador_usuario` | `identificadorUsuario` | uuid | FK para auth.users |

#### **Schema TypeScript**
```typescript
export const Colaborador = {
    table: 'colaboradores',
    fields: {
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
    },
    relations: {
        usuario: 'identificador_usuario -> auth.users.id'
    }
};
```

---

### **2. paciente**

Armazena informações dos pacientes cadastrados.

#### **Estrutura SQL**
```sql
CREATE TABLE paciente (
    id serial PRIMARY KEY,
    created_at timestamp with time zone DEFAULT now(),
    nome_completo text NOT NULL,
    documento_registro text,
    codigo text UNIQUE,
    identificador uuid DEFAULT gen_random_uuid(),
    data_de_nascimento date,
    internado boolean DEFAULT false,
    comorbidades text,
    alergias text
);
```

#### **Campos**

| Campo (DB) | Campo (App) | Tipo | Descrição |
|------------|-------------|------|-----------|
| `id` | `id` | serial | ID numérico sequencial |
| `created_at` | `createdAt` | timestamp | Data de criação |
| `nome_completo` | `nomeCompleto` | text | Nome completo do paciente |
| `documento_registro` | `documentoRegistro` | text | CPF ou RG |
| `codigo` | `codigo` | text | Código único do paciente |
| `identificador` | `identificador` | uuid | UUID do paciente |
| `data_de_nascimento` | `dataDeNascimento` | date | Data de nascimento |
| `internado` | `internado` | boolean | Se está internado |
| `comorbidades` | `comorbidades` | text | Lista de comorbidades |
| `alergias` | `alergias` | text | Lista de alergias |

#### **Schema TypeScript**
```typescript
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
        internado: 'internado',
        comorbidades: 'comorbidades',
        alergias: 'alergias'
    }
};
```

---

### **3. internacoes**

Armazena informações sobre internações ativas.

#### **Estrutura SQL**
```sql
CREATE TABLE internacoes (
    identificador uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamp with time zone DEFAULT now(),
    identificador_paciente text REFERENCES paciente(codigo),
    convenio text,
    quarto text,
    identificador_usuario uuid REFERENCES auth.users(id),
    leito text
);
```

#### **Campos**

| Campo (DB) | Campo (App) | Tipo | Descrição |
|------------|-------------|------|-----------|
| `identificador` | `identificador` | uuid | ID único da internação |
| `created_at` | `createdAt` | timestamp | Data de criação |
| `identificador_paciente` | `identificadorPaciente` | text | FK para paciente.codigo |
| `convenio` | `convenio` | text | Convênio médico |
| `quarto` | `quarto` | text | Número do quarto |
| `identificador_usuario` | `identificadorUsuario` | uuid | FK para auth.users |
| `leito` | `leito` | text | Número do leito |

#### **Schema TypeScript**
```typescript
export const Internacao = {
    table: 'internacoes',
    fields: {
        identificador: 'identificador',
        createdAt: 'created_at',
        identificadorPaciente: 'identificador_paciente',
        convenio: 'convenio',
        quarto: 'quarto',
        identificadorUsuario: 'identificador_usuario',
        leito: 'leito'
    },
    relations: {
        paciente: 'identificador_paciente -> paciente.codigo',
        usuario: 'identificador_usuario -> auth.users.id'
    }
};
```

---

## 🔗 Relacionamentos

### **Diagrama ER**

```
auth.users (Supabase Auth)
    ↓ (1:N)
colaboradores
    identificador_usuario → auth.users.id

paciente
    ↓ (1:N)
internacoes
    identificador_paciente → paciente.codigo
    identificador_usuario → auth.users.id
```

### **Descrição**

1. **auth.users → colaboradores** (1:N)
   - Um usuário pode ter um perfil de colaborador
   - FK: `colaboradores.identificador_usuario`

2. **paciente → internacoes** (1:N)
   - Um paciente pode ter múltiplas internações
   - FK: `internacoes.identificador_paciente`

3. **auth.users → internacoes** (1:N)
   - Um usuário (recepcionista) pode criar múltiplas internações
   - FK: `internacoes.identificador_usuario`

---

## 🔄 Mapeamento de Campos

### **Regra Geral**

```
Database (snake_case) ←→ Application (camelCase)
```

### **Exemplos de Conversão**

| Database | Application |
|----------|-------------|
| `nome_completo` | `nomeCompleto` |
| `data_de_nascimento` | `dataDeNascimento` |
| `identificador_usuario` | `identificadorUsuario` |
| `created_at` | `createdAt` |
| `registro_profissional` | `registroProfissional` |

### **Helper Functions**

#### **fromDatabase** - Converte DB → App
```typescript
const dbData = { nome_completo: 'João', data_de_nascimento: '1990-01-01' };
const appData = fromDatabase(Paciente, dbData);
// { nomeCompleto: 'João', dataDeNascimento: '1990-01-01' }
```

#### **toDatabase** - Converte App → DB
```typescript
const appData = { nomeCompleto: 'João', dataDeNascimento: '1990-01-01' };
const dbData = toDatabase(Paciente, appData);
// { nome_completo: 'João', data_de_nascimento: '1990-01-01' }
```

---

## 📝 Exemplos SQL

### **Buscar Pacientes Internados**

```sql
SELECT 
    p.id,
    p.nome_completo,
    p.data_de_nascimento,
    i.quarto,
    i.leito,
    i.convenio
FROM paciente p
INNER JOIN internacoes i ON p.codigo = i.identificador_paciente
WHERE p.internado = true
ORDER BY p.nome_completo;
```

### **Buscar Colaborador por Usuário**

```sql
SELECT *
FROM colaboradores
WHERE identificador_usuario = 'uuid-do-usuario'
LIMIT 1;
```

### **Criar Nova Internação**

```sql
INSERT INTO internacoes (
    identificador_paciente,
    convenio,
    quarto,
    leito,
    identificador_usuario
) VALUES (
    'codigo-do-paciente',
    'Unimed',
    '101',
    'A',
    'uuid-do-usuario'
)
RETURNING *;
```

---

## 🔐 Row Level Security (RLS)

### **Políticas Recomendadas**

#### **colaboradores**
```sql
-- Usuários podem ver apenas seu próprio perfil
CREATE POLICY "Users can view own profile"
ON colaboradores FOR SELECT
USING (auth.uid() = identificador_usuario);

-- Usuários podem atualizar apenas seu próprio perfil
CREATE POLICY "Users can update own profile"
ON colaboradores FOR UPDATE
USING (auth.uid() = identificador_usuario);
```

#### **paciente**
```sql
-- Colaboradores autenticados podem ver todos os pacientes
CREATE POLICY "Authenticated users can view patients"
ON paciente FOR SELECT
TO authenticated
USING (true);

-- Apenas médicos podem criar pacientes
CREATE POLICY "Only doctors can create patients"
ON paciente FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM colaboradores
        WHERE identificador_usuario = auth.uid()
        AND funcao = 'Medico'
    )
);
```

#### **internacoes**
```sql
-- Colaboradores podem ver todas as internações
CREATE POLICY "Authenticated users can view internacoes"
ON internacoes FOR SELECT
TO authenticated
USING (true);

-- Apenas recepcionistas podem criar internações
CREATE POLICY "Only receptionists can create internacoes"
ON internacoes FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM colaboradores
        WHERE identificador_usuario = auth.uid()
        AND funcao = 'Recepcionista'
    )
);
```

---

## 📚 Índices Recomendados

```sql
-- Índice para busca por nome de paciente
CREATE INDEX idx_paciente_nome ON paciente(nome_completo);

-- Índice para busca de pacientes internados
CREATE INDEX idx_paciente_internado ON paciente(internado) WHERE internado = true;

-- Índice para busca de internações por paciente
CREATE INDEX idx_internacoes_paciente ON internacoes(identificador_paciente);

-- Índice para busca de colaborador por usuário
CREATE INDEX idx_colaborador_usuario ON colaboradores(identificador_usuario);
```

---

## 🔄 Migrations

### **Adicionar Nova Coluna**

```sql
-- Adicionar coluna em snake_case
ALTER TABLE paciente
ADD COLUMN tipo_sanguineo text;

-- Atualizar Schema.ts
export const Paciente = {
    table: 'paciente',
    fields: {
        // ... campos existentes
        tipoSanguineo: 'tipo_sanguineo',  // Adicionar em camelCase
    }
};
```

### **Criar Nova Tabela**

```sql
-- 1. Criar tabela no Supabase
CREATE TABLE prescricoes (
    id serial PRIMARY KEY,
    created_at timestamp with time zone DEFAULT now(),
    identificador_paciente text REFERENCES paciente(codigo),
    identificador_medico uuid REFERENCES colaboradores(identificador),
    medicamento text NOT NULL,
    dosagem text,
    frequencia text
);

-- 2. Adicionar ao Schema.ts
export const Prescricao = {
    table: 'prescricoes',
    fields: {
        id: 'id',
        createdAt: 'created_at',
        identificadorPaciente: 'identificador_paciente',
        identificadorMedico: 'identificador_medico',
        medicamento: 'medicamento',
        dosagem: 'dosagem',
        frequencia: 'frequencia'
    },
    relations: {
        paciente: 'identificador_paciente -> paciente.codigo',
        medico: 'identificador_medico -> colaboradores.identificador'
    }
};

// 3. Adicionar tipo TypeScript em src/types/index.ts
export interface Prescricao {
    id: number;
    createdAt: string;
    identificadorPaciente: string;
    identificadorMedico: string;
    medicamento: string;
    dosagem?: string;
    frequencia?: string;
}
```

---

## ✅ Checklist para Novos Schemas

Ao adicionar uma nova tabela:

- [ ] Criar tabela no Supabase com nomes em `snake_case`
- [ ] Adicionar schema em `src/models/Schema.ts` com mapeamento camelCase
- [ ] Adicionar interface TypeScript em `src/types/index.ts`
- [ ] Configurar RLS policies no Supabase
- [ ] Adicionar índices necessários
- [ ] Documentar relacionamentos
- [ ] Testar conversão com `fromDatabase` e `toDatabase`

---

## 📖 Referências

- [Supabase Database](https://supabase.com/docs/guides/database)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
