import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    List,
    ListItem,
    ListItemText,
    ListItemButton,
    Typography,
    Box,
    Chip,
    IconButton,
    CircularProgress,
    Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { useNavigate } from 'react-router-dom';
import { getPatientPrescriptions } from '@/services/medico/prescriptions';
import { fromDatabase, Prescricao } from '@/models/Schema';
import type { PatientListItem } from '@/services/medico/patients';
import type { Prescricao as PrescricaoType } from '@/types';

interface Props {
    open: boolean;
    onClose: () => void;
    patient: PatientListItem | null;
}

export default function PrescriptionHistoryModal({ open, onClose, patient }: Props) {
    const navigate = useNavigate();
    const [prescriptions, setPrescriptions] = useState<PrescricaoType[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open && patient) {
            loadHistory();
        }
    }, [open, patient]);

    async function loadHistory() {
        if (!patient) return;
        setLoading(true);
        try {
            const data = await getPatientPrescriptions(patient.codigo);
            // Convert database fields to camelCase
            const formatted = data.map((p: any) => fromDatabase<PrescricaoType>(Prescricao, p));
            setPrescriptions(formatted);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const handleClickPrescription = (prescricaoId: string) => {
        // Redireciona com o código especial para modo leitura
        navigate(`/prescricao?paciente=${patient?.codigo}&prescricao=${prescricaoId}&cod=7456985`);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('pt-BR');
    };

    const getStatusColor = (status?: string) => {
        switch (status) {
            case 'finalizado': return 'success';
            case 'cancelado': return 'error';
            default: return 'warning';
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 1 }
            }}
        >
            <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h6" component="div" fontWeight="" sx={{ fontSize: 16 }}>
                        Histórico de Prescrições
                    </Typography>

                    {patient && (
                        <Typography variant="subtitle2" color="#1b1b1bff" sx={{ fontSize: 14, fontWeight: '500' }}>
                            Nome: {patient.nomeCompleto}
                        </Typography>
                    )}
                </Box>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{ color: (theme) => theme.palette.grey[500] }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <Divider />

            <DialogContent sx={{ p: 0 }}>
                {loading ? (
                    <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
                        <CircularProgress />
                    </Box>
                ) : prescriptions.length === 0 ? (
                    <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
                        <Typography>Nenhuma prescrição encontrada.</Typography>
                    </Box>
                ) : (
                    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                        {prescriptions.map((p, index) => (
                            <Box key={p.identificador}>
                                <ListItem disablePadding>
                                    <ListItemButton
                                        onClick={() => handleClickPrescription(p.identificador)}
                                        sx={{ py: 2, px: 3 }}
                                    >
                                        <Box sx={{ mr: 2, color: 'primary.main', display: 'flex' }}>
                                            <ReceiptLongIcon />
                                        </Box>

                                        <ListItemText
                                            primary={
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                                    <Typography variant="subtitle1" fontWeight="600">
                                                        {formatDate(p.dataPrescricao)}
                                                    </Typography>
                                                    <Chip
                                                        label={p.status || 'Pendente'}
                                                        size="small"
                                                        color={getStatusColor(p.status) as any}
                                                        variant="outlined"
                                                    />
                                                </Box>
                                            }
                                            secondary={
                                                <Typography variant="body2" color="text.secondary">
                                                    ID: {p.identificador.substring(0, 8)}...
                                                </Typography>
                                            }
                                        />

                                        <ArrowForwardIosIcon sx={{ fontSize: 16, color: 'text.disabled', ml: 1 }} />
                                    </ListItemButton>
                                </ListItem>
                                {index < prescriptions.length - 1 && <Divider component="li" />}
                            </Box>
                        ))}
                    </List>
                )}
            </DialogContent>
        </Dialog>
    );
}
