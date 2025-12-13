import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Carregar variáveis de ambiente manualmente pois não estamos no Vite
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://seu-projeto.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'sua-chave';

if (supabaseUrl === 'https://seu-projeto.supabase.co') {
    console.error('❌ Configure as variáveis de ambiente no script ou use o .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPacientes() {
    console.log('🔍 Verificando pacientes...');

    const { data, error } = await supabase
        .from('paciente')
        .select('nome_completo, internado');

    if (error) {
        console.error('❌ Erro ao buscar pacientes:', error);
        return;
    }

    console.log(`✅ Encontrados ${data.length} pacientes.`);
    console.table(data);

    const naoInternadosFalse = data.filter(p => p.internado === false);
    const naoInternadosNull = data.filter(p => p.internado === null);
    const internados = data.filter(p => p.internado === true);

    console.log('\n📊 Resumo:');
    console.log(`- Internado = false: ${naoInternadosFalse.length}`);
    console.log(`- Internado = null: ${naoInternadosNull.length}`);
    console.log(`- Internado = true: ${internados.length}`);
}

checkPacientes();
