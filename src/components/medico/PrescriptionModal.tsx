import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, TextField, Fade } from '@mui/material';
import type { PatientListItem } from '@/services/medico/patients';
import { useState, useEffect } from 'react';

interface PrescriptionModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (date: Date) => void;
    patient: PatientListItem | null;
    loading?: boolean;
}

export default function PrescriptionModal({ open, onClose, onConfirm, patient, loading = false }: PrescriptionModalProps) {
    const [selectedDate, setSelectedDate] = useState<string>('');

    useEffect(() => {
        if (open) {
            // Default to tomorrow
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const formatted = tomorrow.toISOString().split('T')[0];
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setSelectedDate(formatted);
        }
    }, [open]);

    if (!patient) return null;

    const handleConfirm = () => {
        if (!selectedDate) return;
        // Create date object at 10:00 AM local time
        const [year, month, day] = selectedDate.split('-').map(Number);
        const date = new Date(year, month - 1, day, 10, 0, 0);
        onConfirm(date);
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 3, boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }
            }}
            TransitionComponent={Fade}
            transitionDuration={300}
        >
            <Box sx={{ p: 1 }}>
                <DialogTitle sx={{ fontWeight: 700, fontSize: '1.1rem', textAlign: 'center', pb: 1 }}>
                    Nova Prescrição
                </DialogTitle>
                <DialogContent sx={{ pb: 1 }}>
                    <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
                        Para: <strong>{patient.nomeCompleto}</strong>
                    </Typography>

                    <Box sx={{ bgcolor: '#f8fafc', p: 2, borderRadius: 2, border: '1px solid #e2e8f0' }}>
                        <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 600, color: '#64748b' }}>
                            DATA DE INÍCIO
                        </Typography>
                        <TextField
                            type="date"
                            fullWidth
                            variant="standard"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            InputProps={{
                                disableUnderline: true,
                                sx: { fontSize: '1.1rem', fontWeight: 500, color: '#334155' }
                            }}
                        />
                    </Box>
                    <Typography variant="caption" display="block" textAlign="center" sx={{ mt: 2, color: '#94a3b8' }}>
                        Horário padrão: 10:00 AM
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2, justifyContent: 'center', gap: 1 }}>
                    <Button
                        onClick={onClose}
                        disabled={loading}
                        sx={{
                            color: '#64748b',
                            fontWeight: 600,
                            textTransform: 'none',
                            px: 3
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        variant="contained"
                        disabled={loading || !selectedDate}
                        disableElevation
                        sx={{
                            bgcolor: '#4a6cf7',
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                            px: 4,
                            '&:hover': { bgcolor: '#3b5bdb' }
                        }}
                    >
                        {loading ? 'Criando...' : 'Confirmar'}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}
