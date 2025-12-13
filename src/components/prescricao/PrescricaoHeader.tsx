import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Chip } from '@mui/material';
import type { Paciente, Prescricao, Internacao } from '@/types';
import { getColaboradorByIdentificador } from '@/services/prescricao/colaboradores';

interface Props {
    paciente: Paciente;
    prescricao: Prescricao;
    internacao: Internacao | null;
}

/**
 * Calcula idade a partir da data de nascimento
 */
function calcularIdade(dataDeNascimento: string): number {
    const hoje = new Date();
    const nascimento = new Date(dataDeNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();

    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
    }

    return idade;
}

/**
 * Formata data para exibição
 */
function formatarData(data: string): string {
    if (!data) return '';
    // Se a data vier apenas como YYYY-MM-DD (sem hora), o JS interpreta como UTC meia-noite.
    // No Brasil (UTC-3), isso vira 21h do dia anterior.
    // Adicionamos T12:00:00 para garantir que caia no dia correto em qualquer fuso.
    if (data.includes('-') && !data.includes('T')) {
        data += 'T12:00:00';
    }
    const d = new Date(data);
    return d.toLocaleDateString('pt-BR');
}

export default function PrescricaoHeader({ paciente, prescricao, internacao }: Props) {
    const idade = paciente.dataDeNascimento ? calcularIdade(paciente.dataDeNascimento) : null;

    // Data da Prescrição (Campo dataPrescricao) somente
    const dataPrescricao = prescricao.dataPrescricao ? formatarData(prescricao.dataPrescricao) : 'N/A';

    const [medicoAssistencial, setMedicoAssistencial] = useState<string | null>(null);

    useEffect(() => {
        async function fetchMedico() {
            if (internacao?.identificadorUsuario) {
                try {
                    const nome = await getColaboradorByIdentificador(internacao.identificadorUsuario);
                    setMedicoAssistencial(nome);
                } catch (error) {
                    console.error('Erro ao buscar médico:', error);
                    setMedicoAssistencial(null);
                }
            }
        }
        fetchMedico();
    }, [internacao]);

    return (
        <Paper sx={{
            p: 2,
            mb: 1.5,
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            border: '1px solid #f0f0f0',
            borderRadius: 1.5
        }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {/* Dados do Paciente */}
                <Box>
                    <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 0.5 }}>
                        {paciente.nomeCompleto}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                        {idade !== null && (
                            <Typography variant="body2" color="text.secondary">
                                <strong>Idade:</strong> {idade} anos
                            </Typography>
                        )}
                        {paciente.dataDeNascimento && (
                            <Typography variant="body2" color="text.secondary">
                                <strong>Nascimento:</strong> {formatarData(paciente.dataDeNascimento)}
                            </Typography>
                        )}
                    </Box>

                    {/* Alergias */}
                    {paciente.alergias && (
                        <Box sx={{ mt: 1 }}>
                            <Chip
                                label={`Alergias: ${paciente.alergias}`}
                                color="error"
                                size="small"
                                sx={{ fontWeight: 500, fontSize: '0.75rem' }}
                            />
                        </Box>
                    )}
                </Box>

                {/* Dados da Prescrição e Internação */}
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(4, 1fr)' },
                    gap: 2,
                    pt: 1.5,
                    borderTop: '1px solid #f0f0f0'
                }}>

                    <Box>
                        <Typography variant="caption" color="text.secondary" display="block" sx={{ fontSize: '0.7rem' }}>
                            Data da Prescrição
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>
                            {dataPrescricao}
                        </Typography>
                    </Box>

                    {internacao && (
                        <>
                            <Box>
                                <Typography variant="caption" color="text.secondary" display="block" sx={{ fontSize: '0.7rem' }}>
                                    Quarto
                                </Typography>
                                <Typography variant="body2" fontWeight={500}>
                                    {internacao.quarto || 'N/A'}
                                </Typography>
                            </Box>

                            <Box>
                                <Typography variant="caption" color="text.secondary" display="block" sx={{ fontSize: '0.7rem' }}>
                                    Leito
                                </Typography>
                                <Typography variant="body2" fontWeight={500}>
                                    {internacao.leito || 'N/A'}
                                </Typography>
                            </Box>

                            <Box>
                                <Typography variant="caption" color="text.secondary" display="block" sx={{ fontSize: '0.7rem' }}>
                                    Médico Assistencial
                                </Typography>
                                <Typography variant="body2" fontWeight={500}>
                                    {medicoAssistencial || 'Carregando...'}
                                </Typography>
                            </Box>
                        </>
                    )}
                </Box>
            </Box>
        </Paper>
    );
}
