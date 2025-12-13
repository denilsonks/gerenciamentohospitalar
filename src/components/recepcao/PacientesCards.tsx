import { useState } from 'react';
import {
    Box,
    Typography,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Alert
} from '@mui/material';
import { ExitToApp, Person, MedicalServices, CalendarToday, Hotel, Bed, Business } from '@mui/icons-material';
import type { InternacaoComPaciente } from '../../services/recepcao/internacao';
import { darAltaPaciente } from '../../services/recepcao/internacao';

interface PacientesCardsProps {
    internacoes: InternacaoComPaciente[];
    onUpdate: () => void;
}

export default function PacientesCards({ internacoes, onUpdate }: PacientesCardsProps) {
    const [altaDialog, setAltaDialog] = useState<{
        open: boolean;
        internacao: InternacaoComPaciente | null;
    }>({
        open: false,
        internacao: null
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const formatarData = (data: string): string => {
        return new Date(data).toLocaleDateString('pt-BR');
    };

    const handleAlta = (internacao: InternacaoComPaciente) => {
        setAltaDialog({ open: true, internacao });
    };

    const handleConfirmAlta = async () => {
        if (!altaDialog.internacao) return;

        try {
            setLoading(true);
            setError(null);

            await darAltaPaciente(altaDialog.internacao.identificador);

            setAltaDialog({ open: false, internacao: null });
            onUpdate();
        } catch (err) {
            console.error('Erro ao dar alta:', err);
            setError('Erro ao dar alta ao paciente');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Pacientes Internados
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {internacoes.length === 0 ? (
                <Typography color="text.secondary" textAlign="center" py={4}>
                    Nenhum paciente internado no momento
                </Typography>
            ) : (
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: 2
                }}>
                    {internacoes.map((internacao) => (
                        <Box
                            key={internacao.identificador}
                            sx={{
                                bgcolor: 'white',
                                borderRadius: 2,
                                border: '1px solid',
                                borderColor: 'rgba(102, 126, 234, 0.2)',
                                p: 2,
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                                    borderColor: 'rgba(102, 126, 234, 0.4)',
                                    transform: 'translateY(-2px)'
                                }
                            }}
                        >
                            {/* Header com nome e botão de alta */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                                    <Person sx={{ color: '#667eea', fontSize: 20 }} />
                                    <Typography
                                        fontWeight={600}
                                        fontSize="0.95rem"
                                        sx={{
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {internacao.paciente?.nomeCompleto || 'N/A'}
                                    </Typography>
                                </Box>
                                <Tooltip title="Dar Alta">
                                    <IconButton
                                        size="small"
                                        onClick={() => handleAlta(internacao)}
                                        sx={{
                                            color: '#f44336',
                                            bgcolor: 'rgba(244, 67, 54, 0.08)',
                                            '&:hover': {
                                                bgcolor: 'rgba(244, 67, 54, 0.15)',
                                                transform: 'scale(1.1)'
                                            },
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        <ExitToApp fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Box>

                            {/* Quarto / Leito / Convênio */}
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                mb: 1,
                                p: 1,
                                bgcolor: 'rgba(102, 126, 234, 0.05)',
                                borderRadius: 1
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Hotel sx={{ fontSize: 16, color: 'text.secondary' }} />
                                    <Typography variant="body2" fontWeight={500}>
                                        {internacao.quarto || '-'}
                                    </Typography>
                                </Box>
                                <Typography color="text.disabled">/</Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Bed sx={{ fontSize: 16, color: 'text.secondary' }} />
                                    <Typography variant="body2" fontWeight={500}>
                                        {internacao.leito || '-'}
                                    </Typography>
                                </Box>
                                <Typography color="text.disabled">/</Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Business sx={{ fontSize: 16, color: 'text.secondary' }} />
                                    <Typography variant="body2" fontWeight={500}>
                                        {internacao.convenio || '-'}
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Médico */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <MedicalServices sx={{ fontSize: 16, color: '#764ba2' }} />
                                <Typography variant="body2" color="text.secondary">
                                    Dr(a). {internacao.medico?.nomeCompleto || 'N/A'}
                                </Typography>
                            </Box>

                            {/* Data de Internação */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
                                <Typography variant="body2" color="text.secondary">
                                    {formatarData(internacao.createdAt)}
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>
            )}

            {/* Alta Dialog */}
            <Dialog open={altaDialog.open} onClose={() => setAltaDialog({ open: false, internacao: null })}>
                <DialogTitle>Confirmar Alta</DialogTitle>
                <DialogContent>
                    <Typography>
                        Deseja realmente dar alta ao paciente <strong>{altaDialog.internacao?.paciente?.nomeCompleto}</strong>?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAltaDialog({ open: false, internacao: null })}>
                        Cancelar
                    </Button>
                    <Button onClick={handleConfirmAlta} variant="contained" color="error" disabled={loading}>
                        {loading ? 'Processando...' : 'Confirmar Alta'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
