import { useState, useEffect } from 'react';
import { Box, Tabs, Tab, CircularProgress, Alert, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// import Header from '../components/recepcao/Header';
import SummaryCards from '../components/recepcao/SummaryCards';
import InternacaoForm from '../components/recepcao/InternacaoForm';
import PacientesTable from '../components/recepcao/PacientesTable';
import ExamesPlaceholder from '../components/recepcao/ExamesPlaceholder';
import RXLaudadosPlaceholder from '../components/recepcao/RXLaudadosPlaceholder';
import { getInternacoesAtivas } from '../services/recepcao/internacao';
import type { InternacaoComPaciente } from '../services/recepcao/internacao';

export default function Recepcao() {
    const { profile, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [tabValue, setTabValue] = useState(0);
    const [internacoes, setInternacoes] = useState<InternacaoComPaciente[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Verificar permissão de acesso
    useEffect(() => {
        if (!authLoading && profile && profile.funcao !== 'Recepcionista') {
            navigate('/medico');
        }
    }, [authLoading, profile, navigate]);

    // Carregar dados
    useEffect(() => {
        if (profile?.funcao === 'Recepcionista') {
            loadData();
        }
    }, [profile]);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getInternacoesAtivas();
            setInternacoes(data);
        } catch (err) {
            console.error('Erro ao carregar internações:', err);
            setError('Erro ao carregar dados. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    /* Função de logout não utilizada no momento pois o Header foi removido
    const handleLogout = async () => {
        await signOut();
        navigate('/login');
    };
    */

    // Calcular métricas
    const totalInternados = internacoes.length;
    const hoje = new Date().toISOString().split('T')[0];
    const internacoesHoje = internacoes.filter(int =>
        int.createdAt.startsWith(hoje)
    ).length;

    if (authLoading || loading) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                bgcolor: '#fafafa'
            }}>
                <CircularProgress size={60} />
            </Box>
        );
    }

    if (!profile || profile.funcao !== 'Recepcionista') {
        return null;
    }

    return (
        <Box sx={{ bgcolor: '#fafafa', minHeight: '100vh', pb: 4 }}>
            {/* Header removido conforme solicitado
            <Header
                nomeRecepcionista={profile.nomeCompleto}
                registroEmpresa={profile.registroEmpresa}
                onLogout={handleLogout}
            />
            */}

            <Container maxWidth={false} sx={{ width: '1080px', mt: 2 }}>

                <SummaryCards
                    totalInternados={totalInternados}
                    internacoesHoje={internacoesHoje}
                />

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}

                {/* Grid Principal */}
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>

                    {/* Coluna Esquerda: Abas de Cadastro */}
                    <Box sx={{
                        bgcolor: 'white',
                        borderRadius: 3,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        overflow: 'hidden',
                        height: 'fit-content'
                    }}>
                        <Tabs
                            value={tabValue}
                            onChange={(_, newValue) => setTabValue(newValue)}
                            sx={{
                                borderBottom: 1,
                                borderColor: 'divider',
                                px: 2,
                                '& .MuiTab-root': {
                                    fontWeight: 600,
                                    fontSize: '0.9rem',
                                    textTransform: 'none',
                                    minHeight: 48
                                },
                                '& .Mui-selected': {
                                    color: '#667eea'
                                },
                                '& .MuiTabs-indicator': {
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    height: 3
                                }
                            }}
                        >
                            <Tab label="Internações" />
                            <Tab label="Cadastro de Exames" />
                        </Tabs>

                        <Box sx={{ p: 2 }}>
                            {/* Tab 0: Internações */}
                            {tabValue === 0 && (
                                <InternacaoForm onSuccess={loadData} />
                            )}

                            {/* Tab 1: Cadastro de Exames (Placeholder) */}
                            {tabValue === 1 && <ExamesPlaceholder />}
                        </Box>
                    </Box>

                    {/* Coluna Direita: Lista de Pacientes Internados */}
                    <Box sx={{
                        bgcolor: 'white',
                        borderRadius: 3,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        overflow: 'hidden',
                        height: 'fit-content',
                        p: 2
                    }}>
                        <PacientesTable internacoes={internacoes} onUpdate={loadData} />
                    </Box>

                </Box>

                {/* Área Inferior: Lista de Raio-X */}
                <Box sx={{
                    mt: 3,
                    bgcolor: 'white',
                    borderRadius: 3,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    overflow: 'hidden',
                    p: 2
                }}>
                    <RXLaudadosPlaceholder />
                </Box>

            </Container>
        </Box>
    );
}
