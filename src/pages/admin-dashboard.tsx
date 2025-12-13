import { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    CardActionArea,
    CircularProgress,
    Divider,
} from '@mui/material';
import {
    People,
    LocalHospital,
    Medication,
    Assignment,
    Dashboard,
    Science,
    Healing
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { SystemHeader, SystemFooter } from '../components/layout';
import { UserRegistrationForm } from '../components/admin/UserRegistrationForm';
import { getAllColaboradores } from '../services/admin/usuarios';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const { profile, loading: authLoading } = useAuth();
    const [userCount, setUserCount] = useState<number | null>(null);
    const [loadingStats, setLoadingStats] = useState(true);

    const fetchStats = async () => {
        try {
            const users = await getAllColaboradores();
            setUserCount(users.length);
        } catch (error) {
            console.error('Erro ao buscar estatísticas:', error);
        } finally {
            setLoadingStats(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const menuItems = [
        { title: 'Médico', icon: <LocalHospital fontSize="large" />, path: '/medico', color: '#48bb78' },
        { title: 'Recepção', icon: <Dashboard fontSize="large" />, path: '/recepcao', color: '#ed8936' },
        { title: 'Internações', icon: <Assignment fontSize="large" />, path: '/internacoes', color: '#4299e1' },
        { title: 'Enfermagem', icon: <Science fontSize="large" />, path: '/enfermagem', color: '#9f7aea' },
        { title: 'Medicamentos', icon: <Medication fontSize="large" />, path: '/medicamentos', color: '#f56565' },
        { title: 'Cuidados', icon: <Healing fontSize="large" />, path: '/cuidados-enfermagem', color: '#319795' },
    ];

    if (authLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#f8f9fa' }}>
                <CircularProgress size={40} sx={{ color: '#667eea' }} />
            </Box>
        );
    }

    if (!profile || profile.funcao !== 'Admin') {
        return null; // ou redirecionar
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f8f9fa' }}>
            <SystemHeader />

            <Box sx={{ flex: 1, py: 6 }}>
                <Container maxWidth="lg">
                    {/* Welcome Section */}
                    <Box sx={{ mb: 6 }}>
                        <Typography variant="h4" fontWeight={700} color="#2d3748" gutterBottom>
                            Painel Administrativo
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Gerencie usuários e acesse todos os módulos do sistema
                        </Typography>
                    </Box>

                    {/* Stats Cards */}
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                        gap: 3,
                        mb: 6
                    }}>
                        <Card sx={{
                            borderRadius: 4,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                            height: '100%'
                        }}>
                            <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
                                <Box sx={{
                                    p: 2,
                                    borderRadius: 3,
                                    bgcolor: 'rgba(102, 126, 234, 0.1)',
                                    mr: 2
                                }}>
                                    <People sx={{ fontSize: 32, color: '#667eea' }} />
                                </Box>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" fontWeight={600}>
                                        Total de Usuários
                                    </Typography>
                                    <Typography variant="h4" fontWeight={700} color="#2d3748">
                                        {loadingStats ? <CircularProgress size={24} /> : userCount}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                        {/* More stats can be added here */}
                    </Box>

                    <Divider sx={{ mb: 6 }} />

                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: '5fr 7fr' },
                        gap: 4
                    }}>
                        {/* Quick Links Column */}
                        <Box>
                            <Typography variant="h6" fontWeight={700} color="#2d3748" sx={{ mb: 3 }}>
                                Acesso Rápido
                            </Typography>
                            <Box sx={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, 1fr)',
                                gap: 2
                            }}>
                                {menuItems.map((item) => (
                                    <Card key={item.path} sx={{
                                        borderRadius: 3,
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                        transition: 'transform 0.2s',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                                        }
                                    }}>
                                        <CardActionArea
                                            onClick={() => navigate(item.path)}
                                            sx={{ p: 3, minHeight: 140, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}
                                        >
                                            <Box sx={{
                                                p: 1.5,
                                                borderRadius: '50%',
                                                bgcolor: `${item.color}20`,
                                                color: item.color,
                                                display: 'flex'
                                            }}>
                                                {item.icon}
                                            </Box>
                                            <Typography variant="subtitle1" fontWeight={600} color="#4a5568">
                                                {item.title}
                                            </Typography>
                                        </CardActionArea>
                                    </Card>
                                ))}
                            </Box>
                        </Box>

                        {/* User Registration Column */}
                        <Box>
                            <Typography variant="h6" fontWeight={700} color="#2d3748" sx={{ mb: 3 }}>
                                Gerenciamento de Usuários
                            </Typography>
                            <UserRegistrationForm onSuccess={fetchStats} />
                        </Box>
                    </Box>
                </Container>
            </Box>

            <SystemFooter />
        </Box>
    );
}
