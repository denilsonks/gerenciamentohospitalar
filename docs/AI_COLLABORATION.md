# 🤖 AI Collaboration Guide - Sistema Hospitalar

**Documento para IAs que trabalham neste projeto**

Este documento contém **regras estritas** e padrões que devem ser seguidos ao gerar código para este projeto.

---

## 🎯 Regras Fundamentais (NUNCA VIOLE)

### **1. Stack Tecnológica Fixa**
- ✅ React 19 + TypeScript + Vite
- ✅ Material UI (MUI) para UI
- ✅ Supabase para backend
- ❌ **NÃO** use Tailwind CSS
- ❌ **NÃO** use Next.js features
- ❌ **NÃO** use async components

### **2. Nomenclatura de Campos**
- **Banco de Dados (Supabase)**: `snake_case`
  - Exemplo: `nome_completo`, `data_de_nascimento`
- **Código TypeScript**: `camelCase`
  - Exemplo: `nomeCompleto`, `dataDeNascimento`

### **3. Schema Obrigatório**
- **SEMPRE** use `src/models/Schema.ts` para referências
- **NUNCA** escreva nomes de tabelas/campos diretamente
- **SEMPRE** converta entre snake_case e camelCase

---

## 📋 Schema do Banco de Dados

### **Estrutura Padrão**

```typescript
export const NomeDaTabela = {
    table: 'nome_da_tabela',  // Nome exato no Supabase
    fields: {
        // camelCase: 'snake_case'
        campoUm: 'campo_um',
        campoDois: 'campo_dois',
        campoTres: 'campo_tres',
    },
    relations: {
        // Documentação de FKs (opcional)
        nomeRelacao: 'campo_fk -> tabela_destino.campo'
    }
};
```

### **Exemplo Real**

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

## 🔄 Conversão de Dados (OBRIGATÓRIO)

### **Helper Functions**

#### **fromDatabase** - DB → App (snake_case → camelCase)
```typescript
import { fromDatabase } from '@/services/db';
import { Paciente } from '@/models/Schema';

// Dados do Supabase (snake_case)
const dbData = {
    id: 1,
    nome_completo: 'João Silva',
    data_de_nascimento: '1990-01-01',
    internado: true
};

// Converter para camelCase
const appData = fromDatabase(Paciente, dbData);
// Resultado: { id: 1, nomeCompleto: 'João Silva', dataDeNascimento: '1990-01-01', internado: true }
```

#### **toDatabase** - App → DB (camelCase → snake_case)
```typescript
import { toDatabase } from '@/services/db';
import { Paciente } from '@/models/Schema';

// Dados da aplicação (camelCase)
const appData = {
    nomeCompleto: 'João Silva',
    dataDeNascimento: '1990-01-01',
    internado: true
};

// Converter para snake_case
const dbData = toDatabase(Paciente, appData);
// Resultado: { nome_completo: 'João Silva', data_de_nascimento: '1990-01-01', internado: true }
```

---

## 📝 Padrões de CRUD

### **CREATE - Inserir Dados**

```typescript
import { supabase } from '@/config/supabase';
import { Paciente, toDatabase, fromDatabase } from '@/models/Schema';
import type { Paciente as PacienteType } from '@/types';

async function createPaciente(data: Partial<PacienteType>) {
    // ✅ CORRETO
    // 1. Converter para snake_case
    const dbData = toDatabase(Paciente, data);
    
    // 2. Inserir usando Schema.table
    const { data: result, error } = await supabase
        .from(Paciente.table)  // ✅ Usa Schema.table
        .insert(dbData)
        .select()
        .single();
    
    if (error) throw error;
    
    // 3. Converter resposta para camelCase
    return fromDatabase<PacienteType>(Paciente, result);
}

// ❌ ERRADO - Não faça isso
async function createPacienteErrado(data: any) {
    const { data: result, error } = await supabase
        .from('paciente')  // ❌ Nome hardcoded
        .insert({
            nome_completo: data.nomeCompleto,  // ❌ Conversão manual
            data_de_nascimento: data.dataDeNascimento
        });
}
```

### **READ - Buscar Dados**

```typescript
import { supabase } from '@/config/supabase';
import { Paciente, fromDatabase } from '@/models/Schema';
import type { Paciente as PacienteType } from '@/types';

async function getPacientes(): Promise<PacienteType[]> {
    // ✅ CORRETO
    const { data, error } = await supabase
        .from(Paciente.table)  // ✅ Usa Schema.table
        .select('*')
        .eq(Paciente.fields.internado, true);  // ✅ Usa Schema.fields
    
    if (error) throw error;
    
    // ✅ Converte cada item
    return data.map(item => fromDatabase<PacienteType>(Paciente, item));
}

// ❌ ERRADO
async function getPacientesErrado() {
    const { data } = await supabase
        .from('paciente')  // ❌ Nome hardcoded
        .select('*')
        .eq('internado', true);  // ❌ Campo hardcoded
    
    return data;  // ❌ Não converte para camelCase
}
```

### **UPDATE - Atualizar Dados**

```typescript
import { supabase } from '@/config/supabase';
import { Paciente, toDatabase, fromDatabase } from '@/models/Schema';
import type { Paciente as PacienteType } from '@/types';

async function updatePaciente(id: string, updates: Partial<PacienteType>) {
    // ✅ CORRETO
    // 1. Converter para snake_case
    const dbData = toDatabase(Paciente, updates);
    
    // 2. Atualizar usando Schema
    const { data, error } = await supabase
        .from(Paciente.table)
        .update(dbData)
        .eq(Paciente.fields.id, id)  // ✅ Usa Schema.fields
        .select()
        .single();
    
    if (error) throw error;
    
    // 3. Converter resposta
    return fromDatabase<PacienteType>(Paciente, data);
}
```

### **DELETE - Deletar Dados**

```typescript
import { supabase } from '@/config/supabase';
import { Paciente } from '@/models/Schema';

async function deletePaciente(id: string) {
    // ✅ CORRETO
    const { error } = await supabase
        .from(Paciente.table)
        .delete()
        .eq(Paciente.fields.id, id);  // ✅ Usa Schema.fields
    
    if (error) throw error;
}
```

---

## 🔗 Queries com JOIN

### **Padrão Correto**

```typescript
import { supabase } from '@/config/supabase';
import { Internacao, Paciente, fromDatabase } from '@/models/Schema';

async function getInternacoesComPacientes() {
    // ✅ CORRETO
    const { data, error } = await supabase
        .from(Internacao.table)
        .select(`
            *,
            paciente:${Internacao.fields.identificadorPaciente} (*)
        `);
    
    if (error) throw error;
    
    // ✅ Converte ambas as tabelas
    return data.map(item => ({
        ...fromDatabase(Internacao, item),
        paciente: item.paciente ? fromDatabase(Paciente, item.paciente) : null
    }));
}
```

---

## 🎨 Padrões de UI (Material UI)

### **Componentes React**

```typescript
// ✅ CORRETO - Function component síncrono
import { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';

export default function MedicoPage() {
    const [data, setData] = useState<DataType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const result = await fetchData();
            setData(result);
            setLoading(false);
        }
        load();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4">Título</Typography>
            {/* Conteúdo */}
        </Box>
    );
}

// ❌ ERRADO - Async component
export default async function Page() {  // ❌ React não suporta
    const data = await fetchData();
    return <div>{data}</div>;
}
```

### **Styling com MUI**

```typescript
// ✅ CORRETO - Usar sx prop
<Box sx={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: 2,
    p: 4,
    bgcolor: 'background.default'
}}>
    <Typography variant="h6" color="primary">
        Texto
    </Typography>
</Box>

// ❌ ERRADO - Tailwind classes
<div className="grid grid-cols-4 gap-4 p-4">  // ❌ Tailwind não está instalado
    <p className="text-lg text-blue-500">Texto</p>
</div>
```

---

## 📁 Estrutura de Arquivos

### **Services**

```typescript
// src/services/medico/cards.ts
import { supabase } from '@/config/supabase';
import { Paciente, fromDatabase } from '@/models/Schema';

export async function getCardsInfo() {
    // ✅ Lógica de negócio aqui
    const { data } = await supabase
        .from(Paciente.table)
        .select('*');
    
    return data.map(item => fromDatabase(Paciente, item));
}
```

### **Components**

```typescript
// src/components/medico/CardsGerais.tsx
import { Box, Card, CardContent, Typography } from '@mui/material';

export interface CardInfo {
    title: string;
    value: string | number;
    color?: string;
    icon?: React.ReactNode;
}

interface Props {
    cards: CardInfo[];
}

export default function CardsGerais({ cards }: Props) {
    return (
        <Box sx={{ display: 'grid', gap: 2 }}>
            {cards.map((card, index) => (
                <Card key={index}>
                    <CardContent>
                        <Typography>{card.title}</Typography>
                        <Typography variant="h4">{card.value}</Typography>
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
}
```

---

## 🚫 Erros Comuns a Evitar

### **1. Nomes Hardcoded**
```typescript
// ❌ ERRADO
await supabase.from('paciente').select('*');
await supabase.from('paciente').eq('nome_completo', 'João');

// ✅ CORRETO
await supabase.from(Paciente.table).select('*');
await supabase.from(Paciente.table).eq(Paciente.fields.nomeCompleto, 'João');
```

### **2. Sem Conversão**
```typescript
// ❌ ERRADO
const { data } = await supabase.from(Paciente.table).select('*');
return data;  // Retorna snake_case

// ✅ CORRETO
const { data } = await supabase.from(Paciente.table).select('*');
return data.map(item => fromDatabase(Paciente, item));  // Converte para camelCase
```

### **3. Async Components**
```typescript
// ❌ ERRADO
export default async function Page() {
    const data = await fetchData();
    return <div>{data}</div>;
}

// ✅ CORRETO
export default function Page() {
    const [data, setData] = useState(null);
    useEffect(() => {
        fetchData().then(setData);
    }, []);
    return <div>{data}</div>;
}
```

---

## 📚 Checklist para Gerar Código

Antes de gerar qualquer código, verifique:

- [ ] Estou usando `Schema.table` e `Schema.fields`?
- [ ] Estou convertendo com `fromDatabase` e `toDatabase`?
- [ ] Estou usando Material UI (não Tailwind)?
- [ ] Meu component é síncrono (não async)?
- [ ] Estou usando TypeScript com tipos corretos?
- [ ] Estou seguindo a estrutura de pastas do projeto?
- [ ] Estou usando `useEffect` para dados assíncronos?

---

## 🎯 Exemplo Completo

```typescript
// src/services/pacientes/list.ts
import { supabase } from '@/config/supabase';
import { Paciente, fromDatabase } from '@/models/Schema';
import type { Paciente as PacienteType } from '@/types';

export async function listPacientesInternados(): Promise<PacienteType[]> {
    const { data, error } = await supabase
        .from(Paciente.table)
        .select('*')
        .eq(Paciente.fields.internado, true)
        .order(Paciente.fields.nomeCompleto, { ascending: true });
    
    if (error) throw error;
    
    return data.map(item => fromDatabase<PacienteType>(Paciente, item));
}

// src/pages/pacientes.tsx
import { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, CircularProgress } from '@mui/material';
import { listPacientesInternados } from '@/services/pacientes/list';
import type { Paciente } from '@/types';

export default function PacientesPage() {
    const [pacientes, setPacientes] = useState<Paciente[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const data = await listPacientesInternados();
                setPacientes(data);
            } catch (error) {
                console.error('Erro ao carregar pacientes:', error);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>
                Pacientes Internados
            </Typography>
            
            <Box sx={{ display: 'grid', gap: 2, mt: 3 }}>
                {pacientes.map(p => (
                    <Card key={p.id}>
                        <CardContent>
                            <Typography variant="h6">{p.nomeCompleto}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                Nascimento: {p.dataDeNascimento}
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </Box>
    );
}
```

---

## 🔍 Resumo Final

**Ao trabalhar neste projeto, você DEVE:**

1. ✅ Usar `Schema.table` e `Schema.fields` sempre
2. ✅ Converter dados com `fromDatabase` e `toDatabase`
3. ✅ Usar Material UI para UI
4. ✅ Criar components síncronos com `useEffect`
5. ✅ Seguir nomenclatura: camelCase no código, snake_case no DB
6. ✅ Tipar tudo com TypeScript
7. ✅ Organizar código em services/components/pages

**Você NÃO DEVE:**

1. ❌ Usar Tailwind CSS
2. ❌ Criar async components
3. ❌ Hardcodar nomes de tabelas/campos
4. ❌ Retornar dados sem conversão
5. ❌ Usar Next.js features
6. ❌ Ignorar o Schema

---

**Siga estas regras rigorosamente para manter a consistência e qualidade do código.**
