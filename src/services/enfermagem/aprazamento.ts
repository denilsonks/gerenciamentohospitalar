import { getPrescricaoById } from './prescricao';

/**
 * Calcula os horários de aprazamento com base na frequência e horário inicial da prescrição de enfermagem.
 */
export async function calculateAprazamento(prescricaoId: string, frequencia: string): Promise<string[]> {
    // 1. Buscar prescrição para obter dataPrescricao (que serve como inicio)
    const prescricao = await getPrescricaoById(prescricaoId);

    // Na prescrição enfermeiro, usamos 'dataPrescricao' como base? Ou 'createdAt'?
    // O createAndRedirect usa 'dataPrescricao' com startDate.
    const dataInicioStr = prescricao?.dataPrescricao || prescricao?.created_at;

    if (!prescricao || !dataInicioStr) {
        console.warn('Prescrição ou hora de início não encontrada.');
        return [];
    }

    const horarios: string[] = [];
    const dataInicio = new Date(dataInicioStr);

    if (isNaN(dataInicio.getTime())) {
        console.error('Data de início inválida:', dataInicioStr);
        return [];
    }

    // Definir hora final (10:00 do dia seguinte ao início)
    const dataLimite = new Date(dataInicio);
    dataLimite.setDate(dataLimite.getDate() + 1);
    dataLimite.setHours(10, 0, 0, 0);

    const intervaloHoras = parseFrequenciaToHours(frequencia);
    if (!intervaloHoras) {
        return [];
    }

    let dataAtual = new Date(dataInicio);

    while (dataAtual <= dataLimite) {
        const horaFormatada = dataAtual.toISOString();
        horarios.push(horaFormatada);

        const proximaData = new Date(dataAtual);
        proximaData.setHours(proximaData.getHours() + intervaloHoras);

        roundToNextEvenHour(proximaData);

        dataAtual = proximaData;

        if (dataAtual.getTime() <= new Date(horarios[horarios.length - 1]).getTime() && intervaloHoras > 0) {
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

    return null;
}

function roundToNextEvenHour(date: Date) {
    if (date.getMinutes() > 0 || date.getSeconds() > 0 || date.getMilliseconds() > 0) {
        date.setHours(date.getHours() + 1);
        date.setMinutes(0, 0, 0);
    }
    if (date.getHours() % 2 !== 0) {
        date.setHours(date.getHours() + 1);
    }
}
