import { useState } from 'react';
import { Box, Typography, Avatar, IconButton, Badge, Tooltip, Menu, MenuItem, ListItemIcon, Divider } from '@mui/material';
import { NotificationsOutlined, SettingsOutlined, Logout, Person } from '@mui/icons-material';
import { useAuth } from '@/context/AuthContext';
import hospitalLogo from '@/midia/logo-hospital.jpg';

/**
 * SystemHeader - Cabeçalho global do sistema hospitalar
 * * Layout:
 * [Logo Hospital] ............. [Nome] [🔔] [⚙️] [Avatar]
 */
export default function SystemHeader() {
    const { profile, signOut } = useAuth();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        handleMenuClose();
        await signOut();
    };

    // Obter iniciais do nome para o avatar
    const getInitials = (name: string | undefined) => {
        if (!name) return 'U';
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
        }
        return parts[0][0].toUpperCase();
    };

    // Nome de exibição (primeiro e último nome)
    const getDisplayName = (name: string | undefined) => {
        if (!name) return 'Usuário';
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return `${parts[0]} ${parts[parts.length - 1]}`;
        }
        return parts[0];
    };

    return (
        <Box
            component="header"
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 3,
                py: 1.5,
                bgcolor: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                position: 'sticky',
                top: 0,
                zIndex: 1100,
            }}
        >
            {/* Lado Esquerdo - Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                    component="img"
                    src={hospitalLogo}
                    alt="Logo Hospital"
                    sx={{
                        height: 40,
                        width: 'auto',
                        objectFit: 'contain',
                    }}
                />
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 400,
                        color: 'primary.main',
                        fontSize: '1rem',
                        display: { xs: 'none', sm: 'block' },
                    }}
                >
                    Sistema Hospitalar
                </Typography>
            </Box>

            {/* Lado Direito - Usuário, Notificações, Configurações, Avatar */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {/* Nome do Usuário */}
                <Typography
                    variant="body2"
                    sx={{
                        color: 'text.secondary',
                        fontWeight: 500,
                        mr: 1,
                        display: { xs: 'none', md: 'block' },
                    }}
                >
                    {getDisplayName(profile?.nomeCompleto)}
                </Typography>

                {/* Ícone de Notificações */}
                <Tooltip title="Notificações" arrow>
                    <IconButton
                        size="small"
                        sx={{
                            color: 'text.secondary',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                color: 'secondary.main',
                                bgcolor: 'rgba(59, 130, 246, 0.08)',
                                transform: 'scale(1.05)',
                            },
                        }}
                    >
                        <Badge
                            badgeContent={3}
                            color="error"
                            sx={{
                                '& .MuiBadge-badge': {
                                    fontSize: '0.65rem',
                                    minWidth: 16,
                                    height: 16,
                                },
                            }}
                        >
                            <NotificationsOutlined fontSize="small" />
                        </Badge>
                    </IconButton>
                </Tooltip>

                {/* Ícone de Configurações */}
                <Tooltip title="Configurações" arrow>
                    <IconButton
                        size="small"
                        sx={{
                            color: 'text.secondary',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                color: 'secondary.main',
                                bgcolor: 'rgba(59, 130, 246, 0.08)',
                                transform: 'rotate(45deg)',
                            },
                        }}
                    >
                        <SettingsOutlined fontSize="small" />
                    </IconButton>
                </Tooltip>

                {/* Avatar do Usuário */}
                <Tooltip title={profile?.nomeCompleto || 'Usuário'} arrow>
                    <IconButton
                        onClick={handleMenuOpen}
                        size="small"
                        sx={{ ml: 0.5 }}
                        aria-controls={open ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                    >
                        <Avatar
                            sx={{
                                width: 36,
                                height: 36,
                                bgcolor: 'primary.main',
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                transition: 'all 0.2s ease',
                                border: '2px solid transparent',
                                '&:hover': {
                                    borderColor: 'secondary.main',
                                    transform: 'scale(1.05)',
                                },
                            }}
                        >
                            {getInitials(profile?.nomeCompleto)}
                        </Avatar>
                    </IconButton>
                </Tooltip>

                <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={open}
                    onClose={handleMenuClose}
                    onClick={handleMenuClose}
                    PaperProps={{
                        elevation: 0,
                        sx: {
                            minWidth: 180, // Aumenta a largura mínima do menu para 180px
                            '& .MuiMenuItem-root': {
                                fontSize: '0.85rem', // Define a fonte menor para todos os itens
                            },
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                            },
                            '&:before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                            },
                        },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    <MenuItem onClick={handleMenuClose}>
                        <ListItemIcon>
                            <Person fontSize="small" />
                        </ListItemIcon>
                        Perfil
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                        <ListItemIcon>
                            <Logout fontSize="small" />
                        </ListItemIcon>
                        Sair
                    </MenuItem>
                </Menu>
            </Box>
        </Box>
    );
}