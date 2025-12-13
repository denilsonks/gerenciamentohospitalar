import { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    MenuItem,
    Alert,
    CircularProgress,
    Paper
} from '@mui/material';
import { PersonAdd, Email, Lock, Person, Phone, Badge } from '@mui/icons-material';
import { createUser, type CreateUserData } from '../../services/admin/usuarios';

interface UserRegistrationFormProps {
    onSuccess?: () => void;
}

export function UserRegistrationForm({ onSuccess }: UserRegistrationFormProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState<CreateUserData & { confirmPassword: string }>({
        email: '',
        password: '',
        confirmPassword: '',
        nomeCompleto: '',
        usuario: '',
        funcao: 'Recepcionista',
        telefone: '',
        registroProfissional: '',
        numeroRegistro: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validações
        if (formData.password !== formData.confirmPassword) {
            setError('As senhas não coincidem');
            return;
        }

        if (formData.password.length < 6) {
            setError('A senha deve ter no mínimo 6 caracteres');
            return;
        }

        try {
            setLoading(true);

            const { confirmPassword, ...userData } = formData;
            await createUser(userData);

            setSuccess(true);
            setFormData({
                email: '',
                password: '',
                confirmPassword: '',
                nomeCompleto: '',
                usuario: '',
                funcao: 'Recepcionista',
                telefone: '',
                registroProfissional: '',
                numeroRegistro: ''
            });

            if (onSuccess) {
                onSuccess();
            }

            setTimeout(() => setSuccess(false), 5000);
        } catch (err: any) {
            console.error('Erro ao criar usuário:', err);
            setError(err.message || 'Erro ao criar usuário. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper sx={{
            p: 4,
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
            {/* Header */}
            <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Box sx={{
                    display: 'inline-flex',
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'rgba(102, 126, 234, 0.1)',
                    mb: 2
                }}>
                    <PersonAdd sx={{ fontSize: 40, color: '#667eea' }} />
                </Box>
                <Typography variant="h4" fontWeight={700} color="#2d3748" gutterBottom>
                    Cadastro de Usuários
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Crie novos usuários para o sistema hospitalar
                </Typography>
            </Box>

            {/* Alerts */}
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 3 }}>Usuário criado com sucesso!</Alert>}

            {/* Form */}
            <Box component="form" onSubmit={handleSubmit}>
                <Box sx={{ display: 'grid', gap: 3 }}>
                    {/* Email */}
                    <TextField
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        inputProps={{
                            startAdornment: <Email sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
                        }}
                    />

                    {/* Nome de Usuário */}
                    <TextField
                        label="Nome de Usuário"
                        value={formData.usuario}
                        onChange={(e) => setFormData({ ...formData, usuario: e.target.value })}
                        required
                        fullWidth
                        InputProps={{
                            startAdornment: <Badge sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
                        }}
                    />

                    {/* Nome Completo */}
                    <TextField
                        label="Nome Completo"
                        value={formData.nomeCompleto}
                        onChange={(e) => setFormData({ ...formData, nomeCompleto: e.target.value })}
                        required
                        fullWidth
                        InputProps={{
                            startAdornment: <Person sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
                        }}
                    />

                    {/* Senha e Confirmação */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                        <TextField
                            label="Senha"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                            InputProps={{
                                startAdornment: <Lock sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
                            }}
                        />
                        <TextField
                            label="Confirmar Senha"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            required
                            InputProps={{
                                startAdornment: <Lock sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
                            }}
                        />
                    </Box>

                    {/* Função */}
                    <TextField
                        select
                        label="Função"
                        value={formData.funcao}
                        onChange={(e) => setFormData({ ...formData, funcao: e.target.value as any })}
                        required
                        fullWidth
                    >
                        <MenuItem value="Medico">Médico</MenuItem>
                        <MenuItem value="Recepcionista">Recepcionista</MenuItem>
                        <MenuItem value="Admin">Administrador</MenuItem>
                        <MenuItem value="Enfermeiro">Enfermeiro</MenuItem>
                    </TextField>

                    {/* Telefone */}
                    <TextField
                        label="Telefone (opcional)"
                        value={formData.telefone}
                        onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                        fullWidth
                        InputProps={{
                            startAdornment: <Phone sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
                        }}
                    />

                    {/* Registro Profissional */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                        <TextField
                            label="Registro Profissional (opcional)"
                            placeholder="Ex: CRM, COREN"
                            value={formData.registroProfissional}
                            onChange={(e) => setFormData({ ...formData, registroProfissional: e.target.value })}
                            InputProps={{
                                startAdornment: <Badge sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
                            }}
                        />
                        <TextField
                            label="Número do Registro (opcional)"
                            placeholder="Ex: 12345/SP"
                            value={formData.numeroRegistro}
                            onChange={(e) => setFormData({ ...formData, numeroRegistro: e.target.value })}
                        />
                    </Box>

                    {/* Botões */}
                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PersonAdd />}
                            sx={{
                                bgcolor: '#667eea',
                                textTransform: 'none',
                                fontWeight: 600,
                                py: 1.5,
                                '&:hover': {
                                    bgcolor: '#5a67d8'
                                }
                            }}
                        >
                            {loading ? 'Criando...' : 'Criar Usuário'}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Paper>
    );
}
