import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Typography,
    Chip,
    Tooltip,
    Box
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import type { PatientListItem } from '@/services/enfermagem/patients';

interface Props {
    patients: PatientListItem[];
    onNewPrescription: (patient: PatientListItem) => void;
}

export default function TabelaPacientes({ patients, onNewPrescription }: Props) {

    if (!patients || patients.length === 0) {
        return (
            <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: '#f8f9fa' }} elevation={0}>
                <Typography color="text.secondary">
                    Nenhum paciente internado encontrado no momento.
                </Typography>
            </Paper>
        );
    }

    return (
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
            <Table sx={{ minWidth: 650 }} aria-label="tabela de pacientes enfermagem">
                <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Paciente</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Internação</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Médico</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Acomodação</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 600 }}>Ações</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {patients.map((patient) => {
                        const hasPrescription = patient.statusPrescricao === 'finalizado';

                        return (
                            <TableRow
                                key={patient.codigo}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: '#fcfcfc' } }}
                            >
                                <TableCell component="th" scope="row">
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography variant="body2" fontWeight={500}>
                                            {patient.nomeCompleto}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" color="text.secondary">
                                        {patient.dataInternacao ? new Date(patient.dataInternacao).toLocaleDateString('pt-BR') : '-'}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <MonitorHeartIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                        <Typography variant="body2">
                                            {patient.nomeMedico || 'Não informado'}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={`Q: ${patient.quarto || '-'} / L: ${patient.leito || '-'}`}
                                        size="small"
                                        variant="outlined"
                                        sx={{ borderRadius: 1, borderColor: '#ddd', bgcolor: '#fff' }}
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <Tooltip title={hasPrescription ? "Prescrição do dia já realizada" : "Nova Prescrição de Enfermagem"}>
                                        <IconButton
                                            color={hasPrescription ? "success" : "primary"}
                                            onClick={() => onNewPrescription(patient)}
                                            size="small"
                                        >
                                            {hasPrescription ? <CheckCircleIcon /> : <AddCircleOutlineIcon />}
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
