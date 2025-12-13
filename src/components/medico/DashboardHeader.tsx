import { Box, Typography } from '@mui/material';
import { useAuth } from '@/context/AuthContext';

export default function DashboardHeader() {
    const { profile } = useAuth();
    const today = new Date();

    const formattedDate = today.toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <Box>
            <Typography
                variant="h5"
                component="h1"
                sx={{
                    fontWeight: 600,
                    color: '#1a1a1a',
                    mb: 0.5,
                    fontSize: '19px'
                }}
            >
                Olá 👋 Dr(a). {profile?.nomeCompleto || 'Médico'}, seja bem vindo.
            </Typography>
            <Typography
                variant="body2"
                sx={{
                    color: 'text.secondary',
                    textTransform: 'none',
                    fontSize: '15px'
                }}
            >
                hoje é {formattedDate}
            </Typography>
        </Box>
    );
}
