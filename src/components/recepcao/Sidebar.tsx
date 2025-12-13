import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Avatar, IconButton } from '@mui/material';
import {
    PeopleAlt,
    Assignment,
    CalendarMonth,
    LocalHospital,
    BedroomParent,
    Logout
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Sidebar() {
    const { profile, signOut } = useAuth();
    const navigate = useNavigate();

    const menuItems = [
        { text: 'Pacientes', icon: <PeopleAlt />, active: true },
        { text: 'Exames', icon: <Assignment />, active: false },
        { text: 'Agenda', icon: <CalendarMonth />, active: false },
        { text: 'Internação', icon: <LocalHospital />, active: false },
        { text: 'Leitos', icon: <BedroomParent />, active: false },
    ];

    const handleLogout = async () => {
        await signOut();
        navigate('/login');
    };

    return (
        <Box sx={{
            width: 260,
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(12px)',
            borderRight: '1px solid rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1200
        }}>
            {/* Logo Area */}
            <Box sx={{ p: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{
                    width: 32,
                    height: 32,
                    bgcolor: '#667eea',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold'
                }}>
                    H
                </Box>
                <Typography variant="h6" fontWeight={700} color="#2d3748" sx={{ letterSpacing: '-0.5px' }}>
                    Hospital
                </Typography>
            </Box>

            {/* Menu */}
            <List sx={{ px: 2, flex: 1 }}>
                <Typography variant="caption" color="text.secondary" sx={{ px: 2, mb: 1, display: 'block', fontWeight: 600 }}>
                    MENU PRINCIPAL
                </Typography>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                        <ListItemButton sx={{
                            borderRadius: 2,
                            bgcolor: item.active ? 'rgba(102, 126, 234, 0.08)' : 'transparent',
                            color: item.active ? '#667eea' : '#718096',
                            '&:hover': {
                                bgcolor: 'rgba(102, 126, 234, 0.04)',
                                color: '#667eea'
                            }
                        }}>
                            <ListItemIcon sx={{
                                minWidth: 40,
                                color: 'inherit'
                            }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.text}
                                primaryTypographyProps={{
                                    fontSize: '0.9rem',
                                    fontWeight: item.active ? 600 : 500
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

            {/* User Profile */}
            <Box sx={{ p: 2, borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: 'white',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
                }}>
                    <Avatar sx={{ width: 36, height: 36, bgcolor: '#764ba2', fontSize: '0.9rem' }}>
                        {profile?.nomeCompleto?.charAt(0) || 'U'}
                    </Avatar>
                    <Box sx={{ flex: 1, overflow: 'hidden' }}>
                        <Typography variant="subtitle2" noWrap fontWeight={600} color="#2d3748">
                            {profile?.nomeCompleto || 'Usuário'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {profile?.funcao || 'Recepcionista'}
                        </Typography>
                    </Box>
                    <IconButton size="small" onClick={handleLogout} sx={{ color: '#cbd5e0', '&:hover': { color: '#e53e3e' } }}>
                        <Logout fontSize="small" />
                    </IconButton>
                </Box>
            </Box>
        </Box>
    );
}
