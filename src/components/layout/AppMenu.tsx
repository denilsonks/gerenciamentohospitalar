import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { PeopleAlt, Assignment, CalendarMonth, LocalHospital, BedroomParent } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

// Define the menu items – same as in recepcaoteste Sidebar
const menuItems = [
    { text: 'Pacientes', icon: <PeopleAlt />, path: '/recepcaoteste' }, // Assuming this was the recepcao home
    { text: 'Exames', icon: <Assignment />, path: '/exames' }, // Placeholder
    { text: 'Agenda', icon: <CalendarMonth />, path: '/agenda' }, // Placeholder
    { text: 'Internação', icon: <LocalHospital />, path: '/internacoes' },
    { text: 'Leitos', icon: <BedroomParent />, path: '/leitos' }, // Placeholder
];

/**
 * Reusable application menu component.
 * Can be placed in any page/layout to provide a consistent navigation list.
 */
export default function AppMenu() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    return (
        <List sx={{ px: 2, flex: 1 }}>
            <Typography
                variant="caption"
                color="text.secondary"
                sx={{ px: 2, mb: 1, display: 'block', fontWeight: 600 }}
            >
                MENU PRINCIPAL
            </Typography>
            {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                    <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                        <ListItemButton
                            onClick={() => handleNavigation(item.path)}
                            sx={{
                                borderRadius: 2,
                                bgcolor: isActive ? 'rgba(102, 126, 234, 0.08)' : 'transparent',
                                color: isActive ? '#667eea' : '#718096',
                                '&:hover': {
                                    bgcolor: 'rgba(102, 126, 234, 0.04)',
                                    color: '#667eea',
                                },
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>{item.icon}</ListItemIcon>
                            <ListItemText
                                primary={item.text}
                                primaryTypographyProps={{
                                    fontSize: '0.9rem',
                                    fontWeight: isActive ? 600 : 500,
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                )
            })}
        </List>
    );
}
