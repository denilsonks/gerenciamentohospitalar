import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    IconButton, Typography, Tooltip, Box
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import type { PatientListItem } from '@/services/medico/patients';

interface PatientsTableProps {
    patients: PatientListItem[];
    onNewPrescription: (patient: PatientListItem) => void;
    onRowClick?: (patient: PatientListItem) => void;
}

export default function PatientsTable({ patients, onNewPrescription, onRowClick }: PatientsTableProps) {
    const calculateAge = (birthDateString?: string) => {
        if (!birthDateString) return '-';
        const today = new Date();
        const birthDate = new Date(birthDateString);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('pt-BR');
    };

    return (
        <Box>
            <Box sx={{ mb: 2 }}>
                <Typography variant="h6" component="h2" sx={{ fontWeight: 600, fontSize: '1.1rem', color: '#1a1a1a' }}>
                    Pacientes Internados
                </Typography>
            </Box>
            <TableContainer sx={{ overflowX: 'auto' }}>
                <Table sx={{ width: '100%' }} aria-label="tabela de pacientes">
                    <TableHead>
                        <TableRow sx={{ bgcolor: '#f8fafc' }}>
                            <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Nome do Paciente</TableCell>
                            <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Idade</TableCell>
                            <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Quarto</TableCell>
                            <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Leito</TableCell>
                            <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Data Internação</TableCell>
                            <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }} align="center">Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {patients.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Nenhum paciente internado encontrado.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            patients.map((patient) => (
                                <TableRow
                                    key={patient.identificador}
                                    onClick={() => onRowClick && onRowClick(patient)}
                                    sx={{
                                        '&:last-child td, &:last-child th': { border: 0 },
                                        '&:hover': { bgcolor: '#f1f5f9' },
                                        transition: 'background-color 0.2s ease',
                                        cursor: onRowClick ? 'pointer' : 'default'
                                    }}
                                >
                                    <TableCell component="th" scope="row">
                                        <Typography variant="body2" fontWeight="500" sx={{ fontSize: '0.875rem' }}>
                                            {patient.nomeCompleto}
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ fontSize: '0.875rem' }}>{calculateAge(patient.dataDeNascimento)} anos</TableCell>
                                    <TableCell sx={{ fontSize: '0.875rem' }}>{patient.quarto || '-'}</TableCell>
                                    <TableCell sx={{ fontSize: '0.875rem' }}>{patient.leito || '-'}</TableCell>
                                    <TableCell sx={{ fontSize: '0.875rem' }}>{formatDate(patient.dataInternacao)}</TableCell>
                                    <TableCell align="center">
                                        <Tooltip title={patient.statusPrescricao === 'finalizado' ? "Nova Prescrição (Finalizada)" : "Nova Prescrição"}>
                                            <IconButton
                                                size="small"
                                                onClick={() => onNewPrescription(patient)}
                                                sx={{
                                                    bgcolor: patient.statusPrescricao === 'finalizado' ? '#10b981' : '#4a6cf7', // Green if finalized, else Blue
                                                    color: 'white',
                                                    '&:hover': {
                                                        bgcolor: patient.statusPrescricao === 'finalizado' ? '#059669' : '#3451d9'
                                                    },
                                                    width: 32,
                                                    height: 32
                                                }}
                                            >
                                                <AddIcon sx={{ fontSize: 18 }} />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
