import { useState } from 'react';
import {
    Box,
    Typography,
    IconButton,
    Tooltip,
    Avatar,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Divider
} from '@mui/material';
import { ExitToApp, Hotel } from '@mui/icons-material';
import type { InternacaoComPaciente } from '../../services/recepcao/internacao';
import { darAltaPaciente } from '../../services/recepcao/internacao';

interface CompactPacientesListProps {
    internacoes: InternacaoComPaciente[];
    onUpdate: () => void;
}

export default function CompactPacientesList({ internacoes, onUpdate }: CompactPacientesListProps) {
    const [altaDialog, setAltaDialog] = useState({
        open: false,
        internacao: null as InternacaoComPaciente | null,
    });

    const [loading, setLoading] = useState(false);

    const handleAlta = (internacao: InternacaoComPaciente) => {
        setAltaDialog({ open: true, internacao });
    };

    const handleConfirmAlta = async () => {
        if (!altaDialog.internacao) return;
        try {
            setLoading(true);
            await darAltaPaciente(altaDialog.internacao.identificador);
            setAltaDialog({ open: false, internacao: null });
            onUpdate();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{
            bgcolor: 'white',
            borderRadius: 2,
            p: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            border: '1px solid #edf2f7',
            height: 450, // Altura fixa
            display: 'flex',
            flexDirection: 'column'
        }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexShrink: 0 }}>
                <Typography variant="subtitle2" fontWeight={600} color="#2d3748" fontSize="0.85rem">
                    Pacientes Internados
                </Typography>
                <Chip
                    label={`${internacoes.length} ativos`}
                    size="small"
                    sx={{
                        bgcolor: 'rgba(102, 126, 234, 0.1)',
                        color: '#667eea',
                        fontWeight: 600,
                        height: 20,
                        fontSize: '0.65rem',
                        px: 1
                    }}
                />
            </Box>

            <Box sx={{ flex: 1, overflowY: 'auto', px: 1 }}>
                {internacoes.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" textAlign="center" py={4} fontSize="0.8rem">
                        Nenhum paciente internado.
                    </Typography>
                ) : (
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
                        {internacoes.map((internacao) => (
                            <Box
                                key={internacao.identificador}
                                sx={{
                                    p: 1.5,
                                    borderRadius: 2,
                                    border: '1px solid #edf2f7',
                                    bgcolor: 'white',
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        borderColor: '#cbd5e0',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                                    },
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 1,
                                    position: 'relative'
                                }}
                            >
                                <Box sx={{ display: 'flex', borderRadius: 2, alignItems: 'center', gap: 1 }}>

                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                        <Typography variant="subtitle2" fontWeight={500} color="#2d3748" fontSize="0.8rem" noWrap>
                                            {internacao.paciente?.nomeCompleto}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" display="block" fontSize="0.65rem" noWrap>
                                            Dr. {internacao.medico?.nomeCompleto}
                                        </Typography>
                                    </Box>
                                    <Tooltip title="Dar Alta">
                                        <IconButton
                                            size="small"
                                            onClick={() => handleAlta(internacao)}
                                            sx={{
                                                padding: 0.5,
                                                color: '#718096',
                                                '&:hover': { color: '#e53e3e', bgcolor: 'rgba(229, 62, 62, 0.08)' }
                                            }}
                                        >
                                            <ExitToApp sx={{ fontSize: 16 }} />
                                        </IconButton>
                                    </Tooltip>
                                </Box>

                                <Divider sx={{ borderStyle: 'dashed' }} />

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <Hotel sx={{ fontSize: 14, color: '#a0aec0' }} />
                                        <Typography variant="caption" color="text.secondary" fontWeight={500} fontSize="0.70rem">
                                            {internacao.quarto} / {internacao.leito}
                                        </Typography>
                                    </Box>
                                    <Chip
                                        label={internacao.convenio || 'N/A'}
                                        size="small"
                                        variant="outlined"
                                        sx={{
                                            height: 16,
                                            fontSize: '0.70rem',
                                            borderColor: '#e2e8f0',
                                            color: '#718096'
                                        }}
                                    />
                                </Box>
                            </Box>
                        ))}
                    </Box>
                )}
            </Box>

            <Dialog open={altaDialog.open} onClose={() => setAltaDialog({ open: false, internacao: null })}>
                <DialogTitle>Confirmar Alta</DialogTitle>
                <DialogContent dividers>
                    <Typography>
                        Deseja realmente dar alta para <strong>{altaDialog.internacao?.paciente?.nomeCompleto}</strong>?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setAltaDialog({ open: false, internacao: null })}
                        variant="outlined"
                        color="inherit"
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleConfirmAlta}
                        variant="contained"
                        color="error"
                        disabled={loading}
                    >
                        {loading ? 'Confirmando...' : 'Confirmar'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
