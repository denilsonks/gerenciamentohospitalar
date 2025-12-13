# 📚 Resumo Técnico - Sistema Hospitalar

## 🛠️ **STACK DE TECNOLOGIA APLICADA**

### **Frontend Framework**
- **React 19.2.0** (Vite)
- **TypeScript 5.9.3**
- **React Router DOM 7.9.6** (para roteamento)

### **UI Framework**
- **Material UI (MUI) 7.3.5** ✅
  - Componentes: `Box`, `Button`, `TextField`, `Typography`, etc.
  - Sistema de temas customizado
  - Emotion para CSS-in-JS

### **Backend/Database**
- **Supabase** (PostgreSQL + Auth)
  - Autenticação de usuários
  - Database queries
  - Real-time subscriptions (disponível mas não implementado)

### **Build Tool**
- **Vite 7.2.4**
- **ESLint** para linting

---

## ✅ **O QUE VOCÊ PODE FAZER**

### **1. React Components**
```typescript
// ✅ CORRETO - Function Component Síncrono
export default function Medico() {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    async function loadData() {
      const result = await fetchData();
      setData(result);
    }
    loadData();
  }, []);

  return <div>...</div>;
}
```

### **2. Material UI Styling**
```typescript
// ✅ CORRETO - Usar sx prop do MUI
<Box sx={{ 
  display: 'flex', 
  padding: 2,
  bgcolor: 'primary.main'
}}>
  <Typography variant="h4">Título</Typography>
</Box>

// ✅ CORRETO - Usar componentes MUI
<Button variant="contained" color="primary">
  Clique aqui
</Button>
```

### **3. TypeScript Types**
```typescript
// ✅ CORRETO - Definir interfaces
interface Paciente {
  id: number;
  nomeCompleto: string;
  quarto?: string;
}

// ✅ CORRETO - Usar tipos
const [pacientes, setPacientes] = useState<Paciente[]>([]);
```

### **4. Supabase Queries**
```typescript
// ✅ CORRETO - Queries assíncronas
const { data, error } = await supabase
  .from('paciente')
  .select('*')
  .eq('internado', true);
```

### **5. Path Aliases Configurados**
```typescript
// ✅ CORRETO - Usar aliases do tsconfig
import { db } from '@/services/db';
import Header from '@Header';
import { getCards } from '@services/medico/cards';
```

---

## ❌ **O QUE VOCÊ NÃO PODE FAZER**

### **1. Async Components**
```typescript
// ❌ ERRADO - React não suporta async components
export default async function Page() {
  const data = await fetchData();  // ❌ ERRO!
  return <div>{data}</div>;
}

// ✅ CORRETO - Usar useEffect
export default function Page() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetchData().then(setData);
  }, []);
  
  return <div>{data}</div>;
}
```

### **2. Tailwind CSS Classes**
```typescript
// ❌ ERRADO - Tailwind não está instalado
<div className="flex justify-center items-center">
  <p className="text-lg font-bold text-blue-500">Texto</p>
</div>

// ✅ CORRETO - Usar Material UI
<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
  <Typography variant="h6" color="primary" fontWeight="bold">
    Texto
  </Typography>
</Box>
```

### **3. Next.js Features**
```typescript
// ❌ ERRADO - Não é Next.js
"use client";  // ❌ Diretiva do Next.js
export default async function Page() { }  // ❌ Server Components

// ❌ ERRADO - Não tem getServerSideProps
export async function getServerSideProps() { }

// ✅ CORRETO - É React puro com Vite
export default function Page() {
  // Client-side rendering normal
}
```

### **4. CSS Modules sem configuração**
```typescript
// ❌ ERRADO - CSS Modules não configurado
import styles from './medico.module.css';
<div className={styles.container}>...</div>

// ✅ CORRETO - Usar MUI ou inline styles
<div style={{ padding: 20 }}>...</div>
// OU
<Box sx={{ p: 2.5 }}>...</Box>
```

### **5. Imports sem alias configurado**
```typescript
// ❌ ERRADO - @/ não está configurado no vite.config.ts
import { Component } from "@/components/Component";

// ✅ CORRETO - Usar path relativo ou alias configurado
import { Component } from "../components/Component";
// OU (se configurar no vite.config.ts)
import { Component } from "@/components/Component";
```

---

## 🏗️ **ARQUITETURA DO PROJETO**

### **Estrutura de Pastas**
```
src/
├── components/          # Componentes reutilizáveis
│   ├── ErrorBoundary.tsx
│   └── ProtectedRoute.tsx
├── config/             # Configurações (Supabase)
│   └── supabase.ts
├── context/            # React Context (Auth)
│   └── AuthContext.tsx
├── models/             # Schemas do banco
│   └── Schema.ts
├── pages/              # Páginas/Rotas
│   ├── Login.tsx
│   └── medico.tsx
├── services/           # Lógica de negócio
│   └── db.ts
├── types/              # TypeScript types
│   └── index.ts
├── App.tsx             # Roteamento principal
├── main.tsx            # Entry point
└── theme.ts            # MUI theme
```

### **Padrões de Código**

#### **1. Components**
- Function components com TypeScript
- Hooks: `useState`, `useEffect`, `useContext`
- Props tipadas com interfaces

#### **2. State Management**
- React Context para autenticação
- Local state com `useState`
- Sem Redux/Zustand

#### **3. Styling**
- Material UI `sx` prop (preferencial)
- Inline styles quando necessário
- Theme customizado em `theme.ts`

#### **4. Data Fetching**
- Supabase client direto
- Async/await em `useEffect`
- Error handling com try/catch

---

## 🚫 **LIMITAÇÕES IMPORTANTES**

### **1. Não é Next.js**
- Sem Server-Side Rendering (SSR)
- Sem API Routes
- Sem Server Components
- Sem `getServerSideProps` ou `getStaticProps`

### **2. Não tem Tailwind**
- Não use classes como `flex`, `grid`, `text-lg`
- Use Material UI ou inline styles

### **3. Client-Side Only**
- Todo código roda no navegador
- Sem server-side data fetching
- Autenticação via Supabase client

### **4. Vite Specific**
- Variáveis de ambiente: `import.meta.env.VITE_*`
- Hot Module Replacement (HMR)
- Build otimizado para produção

---

## 📝 **EXEMPLO COMPLETO CORRETO**

```typescript
// src/pages/medico.tsx
import { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Card, CardContent } from '@mui/material';
import { db } from '../services/db';
import type { Paciente } from '../types';

export default function Medico() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await db.getPatients();
        setPacientes(data);
      } catch (err) {
        setError('Erro ao carregar pacientes');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard do Médico
      </Typography>
      
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 2, mt: 3 }}>
        {pacientes.map(p => (
          <Card key={p.id}>
            <CardContent>
              <Typography variant="h6">{p.nomeCompleto}</Typography>
              <Typography variant="body2" color="text.secondary">
                Quarto: {p.quarto || 'N/A'} | Leito: {p.leito || 'N/A'}
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

## 🎯 **RESUMO RÁPIDO**

| Aspecto | Tecnologia | Pode Usar | Não Pode Usar |
|---------|-----------|-----------|---------------|
| **Framework** | React + Vite | Function components, Hooks | Async components, Server components |
| **Styling** | Material UI | `sx` prop, MUI components | Tailwind classes, CSS Modules |
| **Routing** | React Router | Client-side routing | Server-side routing |
| **Data** | Supabase | Client queries, Auth | Server-side queries |
| **TypeScript** | TS 5.9 | Interfaces, Types | Any sem eslint-disable |
| **Build** | Vite | HMR, Fast builds | Next.js features |

---

**Dica Final:** Se você quer usar Tailwind ou Next.js features, seria necessário migrar o projeto ou reconfigurar completamente. O projeto atual é **React + Vite + Material UI + Supabase**.
