import { getPrescricaoById } from './prescricao';

/**
 * Calcula os horários de aprazamento com base na frequência e horário inicial da prescrição.
 * 
 * Regras:
 * 1. O primeiro horário é o hraInicio da prescrição.
 * 2. Os próximos horários somam o intervalo.
 * 3. Arredonda para o próximo horário par cheio (ex: 19:30 + 4h -> 23:30 -> 00:00).
 * 4. Limite até às 10:00 do dia seguinte.
 */
export async function calculateAprazamento(prescricaoId: string, frequencia: string): Promise<string[]> {
    // 1. Buscar prescrição para obter hraInicio
    const prescricao = await getPrescricaoById(prescricaoId);
    if (!prescricao || !prescricao.hraInicio) {
        console.warn('Prescrição ou hora de início não encontrada.');
        return [];
    }

    const horarios: string[] = [];

    // Parse hraInicio (assumindo formato ISO ou timestampz do Supabase)
    const dataInicio = new Date(prescricao.hraInicio);

    // Validar data
    if (isNaN(dataInicio.getTime())) {
        console.error('Data de início inválida:', prescricao.hraInicio);
        return [];
    }

    // Definir hora final (10:00 do dia seguinte ao início)
    // A lógica "dia seguinte" depende da data de início da prescrição.
    // Se a prescrição começa hoje, o limite é amanhã às 10h.
    const dataLimite = new Date(dataInicio);
    dataLimite.setDate(dataLimite.getDate() + 1);
    dataLimite.setHours(10, 0, 0, 0);

    // Converter frequência para horas (intervalo)
    const intervaloHoras = parseFrequenciaToHours(frequencia);
    if (!intervaloHoras) {
        return []; // Frequência não calculável (ex: "Se necessário")
    }

    // Adicionar horário inicial
    let dataAtual = new Date(dataInicio);

    // Loop para gerar horários
    while (dataAtual <= dataLimite) {
        // Formatar para ISO string (timestampz)
        const horaFormatada = dataAtual.toISOString();
        horarios.push(horaFormatada);

        // Calcular próximo horário
        // 1. Somar intervalo
        const proximaData = new Date(dataAtual);
        proximaData.setHours(proximaData.getHours() + intervaloHoras);

        // 2. Se não for o primeiro item (que já foi adicionado), aplicar regra de "Par e Cheio"
        // A regra diz: "Os horários seguintes... devem ser pares e cheios"
        // Como estamos no loop, o `dataAtual` atual já foi processado. O `proximaData` será o próximo.
        // Mas o primeiro horário (index 0) pode ter minutos. Os próximos não.

        // Arredondar para hora cheia e par
        roundToNextEvenHour(proximaData);

        // Atualizar dataAtual para o próximo loop
        dataAtual = proximaData;

        // Proteção contra loop infinito (se intervalo for 0 ou data não avançar)
        if (dataAtual.getTime() <= new Date(horarios[horarios.length - 1]).getTime() && intervaloHoras > 0) {
            // Forçar avanço se a lógica de arredondamento falhar em avançar
            dataAtual.setHours(dataAtual.getHours() + 1);
        }
    }

    return horarios;
}

function parseFrequenciaToHours(frequencia: string): number | null {
    const freqLower = frequencia.toLowerCase();

    if (freqLower.includes('1 vez ao dia') || freqLower.includes('24/24h')) return 24;
    if (freqLower.includes('2 vezes ao dia') || freqLower.includes('12/12h')) return 12;
    if (freqLower.includes('3 vezes ao dia') || freqLower.includes('8/8h')) return 8;
    if (freqLower.includes('4 vezes ao dia') || freqLower.includes('6/6h')) return 6;
    if (freqLower.includes('6 vezes ao dia') || freqLower.includes('4/4h')) return 4;
    if (freqLower.includes('a cada 4 horas')) return 4;
    if (freqLower.includes('a cada 6 horas')) return 6;
    if (freqLower.includes('a cada 8 horas')) return 8;
    if (freqLower.includes('a cada 12 horas')) return 12;

    // Outros casos (Uso contínuo, Se necessário) não geram horários fixos
    return null;
}

function roundToNextEvenHour(date: Date) {
    // Zerar minutos e segundos para garantir hora cheia
    if (date.getMinutes() > 0 || date.getSeconds() > 0 || date.getMilliseconds() > 0) {
        date.setHours(date.getHours() + 1);
        date.setMinutes(0, 0, 0);
    }

    // Garantir que é par
    if (date.getHours() % 2 !== 0) {
        date.setHours(date.getHours() + 1);
    }
}


