import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, InputAdornment, Chip, Stack, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { MainLayout } from '../components/MainLayout';
import { SummaryCards } from '../components/SummaryCards';
import { PatientTable } from '../components/PatientTable';
import { db } from '../services/db';
import type { Paciente, Medico } from '../models/Schema';

export const Dashboard: React.FC = () => {
    const [patients, setPatients] = useState<Paciente[]>([]);
    const [doctor, setDoctor] = useState<Medico | null>(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('Meus pacientes');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const loadData = async () => {
            try {
                const [patientsData, doctorData] = await Promise.all([
                    db.getPatients(),
                    db.getDoctorProfile()
                ]);
                setPatients(patientsData);
                setDoctor(doctorData);
            } catch (error) {
                console.error("Failed to load data", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // Filter Logic
    const filteredPatients = patients.filter(p => {
        const matchesSearch = p.nomeCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.convenio.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.quarto.includes(searchTerm);

        if (!matchesSearch) return false;

        if (filter === 'Meus pacientes') return true; // Mock: all are "mine"
        if (filter === 'Pendentes') return p.statusPrescricao === 'pendente';
        if (filter === 'Atrasadas') return p.statusPrescricao === 'atrasada';
        if (filter === 'Com alergias') return p.alergia;
        if (filter === 'Internados hoje') return false; // Mock: none for now

        return true;
    });

    const stats = {
        total: patients.length,
        pending: patients.filter(p => p.statusPrescricao === 'pendente').length,
        late: patients.filter(p => p.statusPrescricao === 'atrasada').length
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <MainLayout doctor={doctor}>
            {/* Header Section */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'text.primary' }}>
                    Prescrições – Painel do Médico
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    Visualize rapidamente seus pacientes internados.
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    <Chip label="Versão: 0.1 (Mock)" size="small" variant="outlined" />
                    <Chip label="Ambiente: Visual Prototype" size="small" variant="outlined" color="info" />
                </Stack>
            </Box>

            {/* Summary Cards */}
            <SummaryCards
                totalPatients={stats.total}
                pendingPrescriptions={stats.pending}
                latePrescriptions={stats.late}
            />

            {/* Filters & Search */}
            <Box sx={{ mb: 3, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, alignItems: 'center', justifyContent: 'space-between' }}>
                <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 1, width: { xs: '100%', md: 'auto' } }}>
                    {['Meus pacientes', 'Pendentes', 'Com alergias', 'Atrasadas', 'Internados hoje'].map((label) => (
                        <Chip
                            key={label}
                            label={label}
                            onClick={() => setFilter(label)}
                            color={filter === label ? 'primary' : 'default'}
                            variant={filter === label ? 'filled' : 'outlined'}
                            sx={{ fontWeight: 500 }}
                        />
                    ))}
                </Stack>

                <TextField
                    placeholder="Buscar por nome, quarto..."
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ width: { xs: '100%', md: 300 }, bgcolor: 'background.paper' }}
                />
            </Box>

            {/* Table */}
            <PatientTable patients={filteredPatients} />
        </MainLayout>
    );
};
