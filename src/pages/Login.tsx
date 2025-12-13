import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    Container,
    Alert,
    CircularProgress,
    InputAdornment,
    IconButton
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { supabase } from '../config/supabase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getEmailByUsername } from '../services/auth';
import { getRouteByRole } from '../config/roleRoutes';

const Login = () => {
    const navigate = useNavigate();
    const { profile } = useAuth();
    const [loginType, setLoginType] = useState<'email' | 'username'>('username'); // [ADICIONADO]
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState(''); // [ADICIONADO]
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    // Redirecionar quando o profile for carregado
    useEffect(() => {
        if (profile && profile.funcao) {
            const route = getRouteByRole(profile.funcao);
            console.log('Redirecionando para:', route, 'Função:', profile.funcao);
            navigate(route, { replace: true });
        }
    }, [profile, navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            let emailToLogin = email;

            // Se for login por usuário, buscar o email primeiro
            if (loginType === 'username') {
                if (!username) {
                    throw new Error('Por favor, informe o nome de usuário');
                }
                const foundEmail = await getEmailByUsername(username);
                if (!foundEmail) {
                    throw new Error('Usuário não encontrado');
                }
                emailToLogin = foundEmail;
            }

            // Apenas fazer login - o AuthContext vai carregar o perfil automaticamente
            const { error: authError } = await supabase.auth.signInWithPassword({
                email: emailToLogin,
                password,
            });

            if (authError) throw authError;

            // O useEffect acima vai redirecionar quando o profile carregar
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao realizar login';
            setError(errorMessage);
            setLoading(false);
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            bgcolor: '#ffffffff'
        }}>
            {/* Left Side - Image/Brand */}
            <Box sx={{
                flex: 1,
                display: { xs: 'none', md: 'flex' },
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                bgcolor: 'primary.main',
                color: 'white',
                p: 4,
                background: 'linear-gradient(135deg, #028529ff 0%, #02524bff 100%)'
            }}>
                <img src="/logo-hospital.jpg" alt="Hospital Logo" style={{ width: '80px', marginBottom: '16px' }} />
                <Typography variant="h3" fontWeight="bold" gutterBottom>
                    AHST
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.8 }}>
                    Associação Hospitalar Santa Teresa
                </Typography>
            </Box>

            {/* Right Side - Login Form */}
            <Box sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                p: 4
            }}>
                <Container maxWidth="xs">
                    <Paper elevation={0} sx={{ p: 4, bgcolor: 'transparent' }}>
                        <Box sx={{ mb: 4, textAlign: 'center' }}>
                            <Typography variant="h4" fontWeight="bold" color="text.primary" gutterBottom>
                                Bem-vindo
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Insira suas credenciais para acessar
                            </Typography>
                        </Box>

                        {error && (
                            <Alert severity="error" sx={{ mb: 3 }}>
                                {error}
                            </Alert>
                        )}

                        {/* Login Type Toggle */}
                        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                            <Button
                                size="small"
                                onClick={() => setLoginType('username')}
                                variant={loginType === 'username' ? 'contained' : 'outlined'}
                                sx={{
                                    mr: 1,
                                    borderRadius: 20,
                                    textTransform: 'none',
                                    bgcolor: loginType === 'username' ? '#02524bff' : 'transparent',
                                    color: loginType === 'username' ? 'white' : '#02524bff',
                                    borderColor: '#02524bff',
                                    '&:hover': {
                                        bgcolor: loginType === 'username' ? '#01403aff' : 'rgba(2, 82, 75, 0.04)'
                                    }
                                }}
                            >
                                Usuário
                            </Button>
                            <Button
                                size="small"
                                onClick={() => setLoginType('email')}
                                variant={loginType === 'email' ? 'contained' : 'outlined'}
                                sx={{
                                    borderRadius: 20,
                                    textTransform: 'none',
                                    bgcolor: loginType === 'email' ? '#02524bff' : 'transparent',
                                    color: loginType === 'email' ? 'white' : '#02524bff',
                                    borderColor: '#02524bff',
                                    '&:hover': {
                                        bgcolor: loginType === 'email' ? '#01403aff' : 'rgba(2, 82, 75, 0.04)'
                                    }
                                }}
                            >
                                Email
                            </Button>
                        </Box>

                        <form onSubmit={handleLogin}>
                            {loginType === 'username' ? (
                                <TextField
                                    fullWidth
                                    label="Nome de Usuário"
                                    variant="outlined"
                                    margin="normal"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    sx={{ mb: 2 }}
                                    required
                                    autoFocus
                                />
                            ) : (
                                <TextField
                                    fullWidth
                                    label="Email"
                                    variant="outlined"
                                    margin="normal"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    sx={{ mb: 2 }}
                                    required
                                    autoFocus
                                />
                            )}

                            <TextField
                                fullWidth
                                label="Senha"
                                type={showPassword ? 'text' : 'password'}
                                variant="outlined"
                                margin="normal"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                sx={{ mb: 3 }}
                                required
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <Button
                                fullWidth
                                type="submit"
                                variant="contained"
                                size="large"
                                disabled={loading}
                                sx={{
                                    py: 1.5,
                                    textTransform: 'none',
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    bgcolor: '#02524bff',
                                    boxShadow: '0 4px 12px rgba(2, 82, 75, 0.3)',
                                    '&:hover': {
                                        bgcolor: '#01403aff',
                                        boxShadow: '0 6px 16px rgba(2, 82, 75, 0.4)'
                                    }
                                }}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Entrar'}
                            </Button>
                        </form>
                    </Paper>
                </Container>
            </Box>
        </Box>
    );
};

export default Login;
