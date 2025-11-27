import React from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Chip, Typography, Box, Tooltip, Button
} from '@mui/material';
import type { Paciente } from '../models/Schema';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface PatientTableProps {
    patients: Paciente[];
}

const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
};

const getStatusChip = (status: Paciente['statusPrescricao']) => {
    switch (status) {
        case 'em_dia':
            return <Chip icon={<CheckCircleIcon />} label="Em dia" color="success" size="small" variant="outlined" />;
        case 'pendente':
            return <Chip icon={<AccessTimeIcon />} label="Pendente" color="warning" size="small" variant="outlined" />;
        case 'atrasada':
            return <Chip icon={<ErrorIcon />} label="Atrasada" color="error" size="small" variant="filled" />;
        default:
            return null;
    }
};

export const PatientTable: React.FC<PatientTableProps> = ({ patients }) => {
    return (
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: 3 }}>
            <Table sx={{ minWidth: 650 }} aria-label="patient table">
                <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>PACIENTE</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>IDADE</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>CONVÊNIO</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>LOCALIZAÇÃO</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>ÚLT. PRESCRIÇÃO</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>STATUS</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600, color: 'text.secondary' }}>AÇÕES</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {patients.map((patient) => (
                        <TableRow
                            key={patient.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: '#F1F5F9' } }}
                        >
                            <TableCell component="th" scope="row">
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                        {patient.nomeCompleto}
                                    </Typography>
                                    {patient.alergia && (
                                        <Tooltip title={`Alergia: ${patient.detalhesAlergia || 'Não especificado'}`}>
                                            <Chip
                                                label="Alergia"
                                                size="small"
                                                color="error"
                                                variant="filled"
                                                sx={{ bgcolor: '#FEE2E2', color: '#EF4444', height: 20, fontSize: '0.7rem', fontWeight: 700 }}
                                            />
                                        </Tooltip>
                                    )}
                                </Box>
                            </TableCell>
                            <TableCell>{calculateAge(patient.dataNascimento)} anos</TableCell>
                            <TableCell>{patient.convenio}</TableCell>
                            <TableCell>
                                <Typography variant="body2">
                                    Q: {patient.quarto} / L: {patient.leito}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                {patient.dataUltimaPrescricao
                                    ? new Date(patient.dataUltimaPrescricao).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
                                    : '-'}
                            </TableCell>
                            <TableCell>
                                {getStatusChip(patient.statusPrescricao)}
                            </TableCell>
                            <TableCell align="right">
                                <Button
                                    variant="contained"
                                    size="small"
                                    endIcon={<ArrowForwardIcon />}
                                    sx={{ borderRadius: 20, textTransform: 'none' }}
                                >
                                    Abrir
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
