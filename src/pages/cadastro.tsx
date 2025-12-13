import { useEffect } from 'react';
import {
    Box,
    Container,
    CircularProgress
} from '@mui/material';
import { SystemHeader, SystemFooter } from '../components/layout';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { UserRegistrationForm } from '../components/admin/UserRegistrationForm';

export default function Cadastro() {
    const { profile, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    // Verificar se o usuário é admin
    useEffect(() => {
        if (!authLoading && (!profile || profile.funcao !== 'Admin')) {
            navigate('/');
        }
    }, [authLoading, profile, navigate]);

    if (authLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#f8f9fa' }}>
                <CircularProgress size={40} sx={{ color: '#667eea' }} />
            </Box>
        );
    }

    if (!profile || profile.funcao !== 'Admin') {
        return null;
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f8f9fa' }}>
            <SystemHeader />
            <Box sx={{ flex: 1, py: 6 }}>
                <Container maxWidth="md">
                    <UserRegistrationForm />
                </Container>
            </Box>
            <SystemFooter />
        </Box>
    );
}
