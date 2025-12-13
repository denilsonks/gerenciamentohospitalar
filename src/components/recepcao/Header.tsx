import { Box, Typography, AppBar, Toolbar, Button, Avatar } from '@mui/material';
import { Logout, LocalHospital } from '@mui/icons-material';

interface HeaderProps {
    nomeRecepcionista: string;
    registroEmpresa?: string;
    onLogout: () => void;
}

export default function Header({ nomeRecepcionista, registroEmpresa, onLogout }: HeaderProps) {
    return (
        <AppBar
            position="static"
            elevation={0}
            sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '0 0 16px 16px',
                mb: 4
            }}
        >
            <Toolbar sx={{ py: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
                    <Avatar sx={{
                        bgcolor: 'rgba(255,255,255,0.2)',
                        backdropFilter: 'blur(10px)'
                    }}>
                        <LocalHospital />
                    </Avatar>
                    <Box>
                        <Typography variant="h6" fontWeight={600}>
                            Dashboard da Recepção
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            {nomeRecepcionista}
                            {registroEmpresa && ` • ${registroEmpresa}`}
                        </Typography>
                    </Box>
                </Box>
                <Button
                    color="inherit"
                    startIcon={<Logout />}
                    onClick={onLogout}
                    sx={{
                        bgcolor: 'rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(10px)',
                        '&:hover': {
                            bgcolor: 'rgba(255,255,255,0.2)',
                        },
                        borderRadius: 2,
                        px: 3
                    }}
                >
                    Sair
                </Button>
            </Toolbar>
        </AppBar>
    );
}
