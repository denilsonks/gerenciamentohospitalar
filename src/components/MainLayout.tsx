import React from 'react';
import { AppBar, Box, Toolbar, Typography, Container, Avatar, Stack, Chip } from '@mui/material';
import type { Medico } from '../models/Schema';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

interface MainLayoutProps {
    children: React.ReactNode;
    doctor: Medico | null;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, doctor }) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
            <AppBar position="static" color="inherit" elevation={0} sx={{ borderBottom: '1px solid #E2E8F0' }}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters sx={{ justifyContent: 'space-between', height: 70 }}>
                        {/* Logo / Brand */}
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <LocalHospitalIcon color="primary" sx={{ fontSize: 32 }} />
                            <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                                HospManager
                            </Typography>
                            <Chip label="Módulo Prescrição" size="small" color="primary" variant="outlined" sx={{ ml: 2, display: { xs: 'none', md: 'flex' } }} />
                        </Stack>

                        {/* Doctor Profile */}
                        {doctor && (
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                                    <Typography variant="subtitle2" color="text.primary" sx={{ fontWeight: 600 }}>
                                        {doctor.nome}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" display="block">
                                        {doctor.especialidade} • {doctor.crm}
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                                    {doctor.nome.charAt(0)}
                                </Avatar>
                            </Stack>
                        )}
                    </Toolbar>
                </Container>
            </AppBar>

            <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
                <Container maxWidth="xl">
                    {children}
                </Container>
            </Box>
        </Box>
    );
};
