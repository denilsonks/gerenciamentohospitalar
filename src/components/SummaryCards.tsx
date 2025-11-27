import React from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import UpdateIcon from '@mui/icons-material/Update';

interface SummaryCardsProps {
    totalPatients: number;
    pendingPrescriptions: number;
    latePrescriptions: number;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ totalPatients, pendingPrescriptions, latePrescriptions }) => {
    const cards = [
        {
            title: 'Total Internados',
            value: totalPatients,
            icon: <PeopleIcon sx={{ fontSize: 28, color: 'primary.main' }} />,
            color: 'primary.light',
            bgColor: 'primary.light', // Using theme colors would be better, but for quick mock:
            bgOpacity: 0.1
        },
        {
            title: 'Prescrições Pendentes',
            value: pendingPrescriptions,
            icon: <AccessTimeIcon sx={{ fontSize: 28, color: 'warning.main' }} />,
            color: 'warning.main',
            bgColor: '#FEF3C7',
            bgOpacity: 1
        },
        {
            title: 'Prescrições Atrasadas',
            value: latePrescriptions,
            icon: <AssignmentLateIcon sx={{ fontSize: 28, color: 'error.main' }} />,
            color: 'error.main',
            bgColor: '#FEE2E2',
            bgOpacity: 1
        },
        {
            title: 'Última Atualização',
            value: 'Agora mesmo',
            icon: <UpdateIcon sx={{ fontSize: 28, color: 'success.main' }} />,
            color: 'success.main',
            bgColor: '#D1FAE5',
            bgOpacity: 1
        }
    ];

    return (
        <Grid container spacing={3} sx={{ mb: 4 }}>
            {cards.map((card, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                    <Card sx={{ height: '100%', display: 'flex', alignItems: 'center', p: 1 }}>
                        <Box
                            sx={{
                                p: 1.5,
                                borderRadius: 2,
                                bgcolor: card.bgColor,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mr: 2,
                                opacity: card.bgOpacity === 1 ? 1 : 0.2 // Adjust if using theme palette directly
                            }}
                        >
                            {/* If opacity is handled by color, remove opacity prop. 
                  Here I used hex codes for bg so opacity logic is a bit mixed. 
                  Let's just use the icon directly in the box.
               */}
                            {/* Fix: Just use the icon with the bg color defined in the array */}
                            {card.icon}
                        </Box>
                        {/* Re-render box to be cleaner */}

                        <CardContent sx={{ p: '0 !important', flexGrow: 1 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                {card.title}
                            </Typography>
                            <Typography variant="h4" color="text.primary">
                                {card.value}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};
