#!/usr/bin/env node

// Script de teste para verificar as variáveis de ambiente
console.log('\n=== VERIFICAÇÃO DE VARIÁVEIS DE AMBIENTE ===\n');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('VITE_SUPABASE_URL:', supabaseUrl || '❌ NÃO DEFINIDA');
console.log('VITE_SUPABASE_ANON_KEY:', supabaseKey ? '✅ DEFINIDA' : '❌ NÃO DEFINIDA');

if (!supabaseUrl || !supabaseKey) {
    console.log('\n⚠️  PROBLEMAS DETECTADOS:');
    if (!supabaseUrl) {
        console.log('- VITE_SUPABASE_URL não está definida no arquivo .env');
    }
    if (!supabaseKey) {
        console.log('- VITE_SUPABASE_ANON_KEY não está definida no arquivo .env');
    }
    console.log('\n💡 SOLUÇÃO:');
    console.log('1. Edite o arquivo .env na raiz do projeto');
    console.log('2. Adicione as credenciais do Supabase');
    console.log('3. Reinicie o servidor de desenvolvimento\n');
    process.exit(1);
} else {
    console.log('\n✅ Todas as variáveis de ambiente estão configuradas!\n');
}
