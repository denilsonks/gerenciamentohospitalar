# 🏥 Sistema de Gerenciamento Hospitalar

Sistema completo de gestão hospitalar desenvolvido com React, TypeScript, Material UI e Supabase.

---

## 📋 Índice

- [Stack Tecnológica](#-stack-tecnológica)
- [Arquitetura do Projeto](#-arquitetura-do-projeto)
- [Configuração Inicial](#-configuração-inicial)
- [Regras de Desenvolvimento](#-regras-de-desenvolvimento)
- [Schema do Banco de Dados](#-schema-do-banco-de-dados)
- [Padrões de Código](#-padrões-de-código)
- [Guia de CRUD](#-guia-de-crud)
- [Autenticação e Autorização](#-autenticação-e-autorização)

---

## 🛠️ Stack Tecnológica

### **Frontend**
- **React 19.2.0** - Library UI
- **TypeScript 5.9.3** - Tipagem estática
- **Vite 7.2.4** - Build tool e dev server
- **React Router DOM 7.9.6** - Roteamento client-side

### **UI Framework**
- **Material UI (MUI) 7.3.5** - Componentes e design system
- **Emotion** - CSS-in-JS (usado pelo MUI)

### **Backend/Database**
- **Supabase** - PostgreSQL + Auth + Real-time
  - PostgreSQL como banco de dados
  - Supabase Auth para autenticação
  - Row Level Security (RLS) para segurança

### **Ferramentas**
- **ESLint** - Linting
- **TypeScript ESLint** - Regras específicas para TS

---

## 🏗️ Arquitetura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ErrorBoundary.tsx
│   ├── ProtectedRoute.tsx
│   └── medico/
│       └── CardsGerais.tsx
├── config/             # Configurações
│   └── supabase.ts     # Cliente Supabase
├── context/            # React Context
│   └── AuthContext.tsx # Contexto de autenticação
├── models/             # Schemas do banco
│   └── Schema.ts       # Abstração de tabelas
├── pages/              # Páginas/Rotas
│   ├── Login.tsx
│   └── medico.tsx
├── services/           # Lógica de negócio
│   ├── db.ts           # Helpers de conversão
│   └── medico/
│       └── cards.ts    # Serviços específicos
├── types/              # TypeScript types
│   └── index.ts
├── App.tsx             # Roteamento principal
├── main.tsx            # Entry point
└── theme.ts            # MUI theme customizado
```

---

## ⚙️ Configuração Inicial

### **1. Instalação**
```bash
npm install
```

### **2. Variáveis de Ambiente**
Crie um arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

### **3. Executar em Desenvolvimento**
```bash
npm run dev
```

### **4. Build para Produção**
```bash
npm run build
```

---

## 📐 Regras de Desenvolvimento

### **✅ O QUE VOCÊ PODE FAZER**

#### **1. React Components Síncronos**
```typescript
// ✅ CORRETO
export default function MedicoPage() {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    async function load() {
      const result = await fetchData();
      setData(result);
    }
    load();
  }, []);

  return <div>{/* JSX */}</div>;
}
```

#### **2. Material UI Styling**
```typescript
// ✅ CORRETO - Usar sx prop
<Box sx={{ 
  display: 'flex', 
  p: 2,
  bgcolor: 'primary.main'
}}>
  <Typography variant="h4">Título</Typography>
</Box>
```

#### **3. TypeScript Tipado**
```typescript
// ✅ CORRETO
interface CardInfo {
  title: string;
  value: number;
}

const [cards, setCards] = useState<CardInfo[]>([]);
```

### **❌ O QUE VOCÊ NÃO PODE FAZER**

#### **1. Async Components**
```typescript
// ❌ ERRADO - React não suporta
export default async function Page() {
  const data = await fetchData();
  return <div>{data}</div>;
}
```

#### **2. Tailwind CSS**
```typescript
// ❌ ERRADO - Tailwind não está instalado
<div className="flex justify-center">
  <p className="text-lg font-bold">Texto</p>
</div>
```

#### **3. Next.js Features**
```typescript
// ❌ ERRADO - Não é Next.js
"use client";
export async function getServerSideProps() {}
```

---

## 🗄️ Schema do Banco de Dados

### **Convenção de Nomenclatura**

#### **No Supabase (PostgreSQL)**
- **snake_case** para nomes de tabelas e colunas
- Exemplos: `nome_completo`, `data_de_nascimento`, `identificador_usuario`

#### **No Código TypeScript**
- **camelCase** para propriedades de objetos
- Exemplos: `nomeCompleto`, `dataDeNascimento`, `identificadorUsuario`

### **Estrutura do Schema**

Cada tabela é definida em `src/models/Schema.ts` com:

```typescript
export const NomeDaTabela = {
    table: 'nome_da_tabela',  // Nome no Supabase (snake_case)
    fields: {
        // camelCase: 'snake_case'
        campoUm: 'campo_um',
        campoDois: 'campo_dois',
    },
    relations: {
        // Documentação de relacionamentos (opcional)
        relacao: 'campo_fk -> outra_tabela.campo'
    }
};
```

### **Exemplo Completo**

```typescript
export const Paciente = {
    table: 'paciente',
    fields: {
        id: 'id',
        createdAt: 'created_at',
        nomeCompleto: 'nome_completo',
        documentoRegistro: 'documento_registro',
        dataDeNascimento: 'data_de_nascimento',
        internado: 'internado',
    }
};
```

### **Tabelas Existentes**

1. **colaboradores** - Funcionários do hospital
2. **paciente** - Pacientes cadastrados
3. **internacoes** - Internações ativas

---

## 💻 Padrões de Código

### **1. Imports**

```typescript
// ✅ CORRETO - Ordem de imports
import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { supabase } from '@/config/supabase';
import { Paciente } from '@/models/Schema';
import { fromDatabase } from '@/services/db';
import type { Paciente as PacienteType } from '@/types';
```

### **2. Components**

```typescript
// ✅ CORRETO - Estrutura de componente
export default function ComponentName() {
    // 1. Hooks
    const [state, setState] = useState<Type>([]);
    
    // 2. Effects
    useEffect(() => {
        // código
    }, []);
    
    // 3. Handlers
    const handleClick = () => {
        // código
    };
    
    // 4. Render
    return (
        <Box sx={{ p: 4 }}>
            {/* JSX */}
        </Box>
    );
}
```

### **3. TypeScript Types**

```typescript
// ✅ CORRETO - Definir interfaces
export interface CardInfo {
    title: string;
    value: string | number;
    color?: string;
    icon?: React.ReactNode;
}

// ✅ CORRETO - Usar type para props
interface ComponentProps {
    data: CardInfo[];
    onUpdate?: () => void;
}
```

---

## 🔄 Guia de CRUD

### **Regras Fundamentais**

1. **SEMPRE use o Schema** para referências de tabelas e campos
2. **SEMPRE converta** dados entre snake_case (DB) e camelCase (App)
3. **NUNCA escreva** nomes de campos diretamente nas queries

### **Helper Functions**

#### **fromDatabase** - Converte DB → App
```typescript
import { fromDatabase } from '@/services/db';
import { Paciente } from '@/models/Schema';

const dbData = { nome_completo: 'João', data_de_nascimento: '1990-01-01' };
const appData = fromDatabase(Paciente, dbData);
// Resultado: { nomeCompleto: 'João', dataDeNascimento: '1990-01-01' }
```

#### **toDatabase** - Converte App → DB
```typescript
import { toDatabase } from '@/services/db';
import { Paciente } from '@/models/Schema';

const appData = { nomeCompleto: 'João', dataDeNascimento: '1990-01-01' };
const dbData = toDatabase(Paciente, appData);
// Resultado: { nome_completo: 'João', data_de_nascimento: '1990-01-01' }
```

### **CREATE - Inserir Dados**

```typescript
import { supabase } from '@/config/supabase';
import { Paciente, toDatabase } from '@/models/Schema';

async function createPaciente(data: PacienteType) {
    // 1. Converter para snake_case
    const dbData = toDatabase(Paciente, data);
    
    // 2. Inserir no Supabase
    const { data: result, error } = await supabase
        .from(Paciente.table)
        .insert(dbData)
        .select()
        .single();
    
    if (error) throw error;
    
    // 3. Converter resposta para camelCase
    return fromDatabase<PacienteType>(Paciente, result);
}
```

### **READ - Buscar Dados**

```typescript
import { supabase } from '@/config/supabase';
import { Paciente, fromDatabase } from '@/models/Schema';

async function getPacientes() {
    // 1. Query usando Schema.table e Schema.fields
    const { data, error } = await supabase
        .from(Paciente.table)
        .select('*')
        .eq(Paciente.fields.internado, true);
    
    if (error) throw error;
    
    // 2. Converter cada item para camelCase
    return data.map(item => fromDatabase<PacienteType>(Paciente, item));
}
```

### **UPDATE - Atualizar Dados**

```typescript
import { supabase } from '@/config/supabase';
import { Paciente, toDatabase } from '@/models/Schema';

async function updatePaciente(id: string, updates: Partial<PacienteType>) {
    // 1. Converter para snake_case
    const dbData = toDatabase(Paciente, updates);
    
    // 2. Atualizar no Supabase
    const { data, error } = await supabase
        .from(Paciente.table)
        .update(dbData)
        .eq(Paciente.fields.id, id)
        .select()
        .single();
    
    if (error) throw error;
    
    // 3. Converter resposta para camelCase
    return fromDatabase<PacienteType>(Paciente, data);
}
```

### **DELETE - Deletar Dados**

```typescript
import { supabase } from '@/config/supabase';
import { Paciente } from '@/models/Schema';

async function deletePaciente(id: string) {
    const { error } = await supabase
        .from(Paciente.table)
        .delete()
        .eq(Paciente.fields.id, id);
    
    if (error) throw error;
}
```

### **Queries com JOIN**

```typescript
import { supabase } from '@/config/supabase';
import { Internacao, Paciente, fromDatabase } from '@/models/Schema';

async function getInternacoesComPacientes() {
    const { data, error } = await supabase
        .from(Internacao.table)
        .select(`
            *,
            paciente:${Internacao.fields.identificadorPaciente} (*)
        `);
    
    if (error) throw error;
    
    return data.map(item => ({
        ...fromDatabase(Internacao, item),
        paciente: fromDatabase(Paciente, item.paciente)
    }));
}
```

---

## 🔐 Autenticação e Autorização

### **Fluxo de Autenticação**

1. **Login** → `Login.tsx`
2. **AuthContext** verifica sessão e busca perfil do usuário
3. **ProtectedRoute** valida acesso baseado em roles
4. **Redirecionamento** para página apropriada

### **Roles Disponíveis**

- `Medico` - Acesso ao dashboard médico
- (Adicionar mais conforme necessário)

### **Exemplo de Uso**

```typescript
// Em App.tsx
<Route path="/medico" element={
  <ProtectedRoute allowedRoles={['Medico']}>
    <Medico />
  </ProtectedRoute>
} />
```

---

## 📚 Recursos Adicionais

### **Documentação**
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Material UI](https://mui.com/material-ui/getting-started/)
- [Supabase](https://supabase.com/docs)
- [Vite](https://vitejs.dev/)

### **Arquivos de Referência**
- `TECH_STACK.md` - Detalhes técnicos completos
- `DATABASE_SCHEMA.md` - Documentação do banco de dados
- `AI_COLLABORATION.md` - Guia para colaboração com IA

---

## 🤝 Contribuindo

Ao adicionar novas funcionalidades:

1. **Sempre defina o Schema** em `src/models/Schema.ts`
2. **Use os helpers** `fromDatabase` e `toDatabase`
3. **Siga os padrões** de nomenclatura (camelCase no código, snake_case no DB)
4. **Documente** mudanças significativas

---

## 📝 Licença

Projeto proprietário - Todos os direitos reservados
