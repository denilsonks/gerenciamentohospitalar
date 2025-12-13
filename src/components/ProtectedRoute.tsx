import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CircularProgress, Box, Typography, Button } from '@mui/material';
import { getRouteByRole } from '../config/roleRoutes';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
    const { user, profile, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    // Not authenticated - redirect to login
    if (!user) {
        console.log('ProtectedRoute: No user, redirecting to login');
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    console.log('ProtectedRoute: User authenticated, checking roles', { userRole: profile?.funcao, allowedRoles });

    // If allowedRoles is specified, check if user has the required role
    if (allowedRoles && allowedRoles.length > 0) {
        if (!profile) {
            // Profile not loaded yet or user has no profile
            return (
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    gap: 2,
                    p: 3
                }}>
                    <Typography variant="h5" color="error">
                        Perfil não encontrado
                    </Typography>
                    <Typography variant="body1" color="text.secondary" textAlign="center">
                        Seu usuário não está vinculado a um colaborador no sistema.
                        <br />
                        Entre em contato com o administrador.
                    </Typography>
                    <Button variant="contained" onClick={() => window.location.href = '/login'}>
                        Voltar ao Login
                    </Button>
                </Box>
            );
        }

        if (!allowedRoles.includes(profile.funcao)) {
            // User doesn't have the required role - redirect to their correct page
            const correctRoute = getRouteByRole(profile.funcao);
            return <Navigate to={correctRoute} replace />;
        }
    }

    return <>{children}</>;
};
