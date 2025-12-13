import { useState, useEffect } from 'react';
import { Box, Container, Typography, CircularProgress } from '@mui/material';
import { LocalHospital } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getInternacoesAtivas } from '../services/recepcao/internacao';
import type { InternacaoComPaciente } from '../services/recepcao/internacao';

// Componentes Premium
import DashboardMetrics from '../components/recepcao/DashboardMetrics';
import CompactInternacaoForm from '../components/recepcao/CompactInternacaoForm';
import CompactPacientesList from '../components/recepcao/CompactPacientesList';
import { SystemHeader, SystemFooter, AppMenu } from '../components/layout';


export default function RecepcaoTeste() {
    const { profile, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [internacoes, setInternacoes] = useState<InternacaoComPaciente[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && profile && profile.funcao !== 'Recepcionista') {
            navigate('/medico');
        }
    }, [authLoading, profile, navigate]);

    useEffect(() => {
        if (profile?.funcao === 'Recepcionista') {
            loadData();
        }
    }, [profile]);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await getInternacoesAtivas();
            setInternacoes(data);
        } catch (err) {
            console.error('Erro ao carregar dados:', err);
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#f8f9fa' }}>
                <CircularProgress size={40} sx={{ color: '#667eea' }} />
            </Box>
        );
    }

    if (!profile || profile.funcao !== 'Recepcionista') return null;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f8f9fa' }}>
            <SystemHeader />

            <Box sx={{ display: 'flex', flex: 1 }}>
                {/* Sidebar - Agora parte do fluxo flex */}
                <Box sx={{
                    width: 260,
                    bgcolor: 'background.paper',
                    borderRight: '1px solid rgba(0,0,0,0.08)',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <AppMenu />
                </Box>

                {/* Conteúdo Principal */}
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
                    <Box sx={{ p: 4, flex: 1 }}>
                        <Container maxWidth="xl">
                            {/* Header da Página */}
                            <Box sx={{ mb: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                                    <Box sx={{
                                        p: 1,
                                        borderRadius: 2,
                                        bgcolor: 'rgba(102, 126, 234, 0.1)',
                                        color: '#667eea',
                                        display: 'flex'
                                    }}>
                                        <LocalHospital sx={{ fontSize: 24 }} />
                                    </Box>
                                    <Typography variant="h5" fontWeight={700} color="#2d3748" fontSize="1.25rem">
                                        Dashboard Recepção
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ ml: 6.5, fontSize: '0.8rem' }}>
                                    Bem-vindo de volta, {profile.nomeCompleto.split(' ')[0]}
                                </Typography>
                            </Box>

                            {/* Métricas e Gráficos */}
                            <DashboardMetrics totalInternados={internacoes.length} />

                            {/* Grid Principal */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

                                {/* Linha 1: Cadastro e Lista de Pacientes */}
                                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
                                    {/* Coluna 1: Formulário de Internação */}
                                    <Box>
                                        <CompactInternacaoForm onSuccess={loadData} />
                                    </Box>

                                    {/* Coluna 2: Lista de Pacientes */}
                                    <Box sx={{ height: '100%' }}>
                                        <CompactPacientesList internacoes={internacoes} onUpdate={loadData} />
                                    </Box>
                                </Box>
                            </Box>
                        </Container>
                    </Box>
                </Box>
            </Box>
            <SystemFooter />
        </Box>
    );
}
