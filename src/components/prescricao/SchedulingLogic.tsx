import { useEffect, useState } from 'react';
import { Box, Chip, Typography } from '@mui/material';

interface Props {
    hraInicio: string;
    hraFinal: string;
    frequencia: number;
    onChange: (horarios: string[]) => void;
}

/**
 * Converte string de hora "HH:mm" para minutos desde meia-noite
 */
function horaParaMinutos(hora: string): number {
    const [h, m] = hora.split(':').map(Number);
    return h * 60 + m;
}

/**
 * Converte minutos desde meia-noite para string "HH:mm"
 */
function minutosParaHora(minutos: number): string {
    const h = Math.floor(minutos / 60);
    const m = minutos % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/**
 * Calcula horários de aprazamento igualmente espaçados
 */
function calcularHorarios(hraInicio: string, hraFinal: string, frequencia: number): string[] {
    if (!hraInicio || !hraFinal || !frequencia || frequencia <= 0) {
        return [];
    }

    const inicioMinutos = horaParaMinutos(hraInicio);
    const finalMinutos = horaParaMinutos(hraFinal);

    // Se hora final é menor que inicial, assumir que é no dia seguinte
    const intervaloTotal = finalMinutos > inicioMinutos
        ? finalMinutos - inicioMinutos
        : (24 * 60 - inicioMinutos) + finalMinutos;

    // Calcular intervalo entre doses
    const intervalo = intervaloTotal / frequencia;

    const horarios: string[] = [];
    for (let i = 0; i < frequencia; i++) {
        const minutos = inicioMinutos + (intervalo * i);
        const minutosNormalizados = minutos % (24 * 60);
        horarios.push(minutosParaHora(Math.round(minutosNormalizados)));
    }

    return horarios;
}

export default function SchedulingLogic({ hraInicio, hraFinal, frequencia, onChange }: Props) {
    const [horarios, setHorarios] = useState<string[]>([]);

    useEffect(() => {
        const novosHorarios = calcularHorarios(hraInicio, hraFinal, frequencia);
        setHorarios(novosHorarios);
        onChange(novosHorarios);
    }, [hraInicio, hraFinal, frequencia, onChange]);

    if (horarios.length === 0) {
        return null;
    }

    return (
        <Box sx={{ mt: 1 }}>
            <Typography variant="caption" color="text.secondary" display="block" gutterBottom sx={{ fontSize: '0.7rem' }}>
                Horários de Aprazamento
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
                {horarios.map((hora, index) => (
                    <Chip
                        key={index}
                        label={hora}
                        color="primary"
                        size="small"
                        sx={{ fontSize: '0.75rem' }}
                    />
                ))}
            </Box>
        </Box>
    );
}
