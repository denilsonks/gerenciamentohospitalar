import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';
import { People as PeopleIcon, EventAvailable as EventIcon, CalendarMonth as CalendarIcon } from '@mui/icons-material';
import { getDashboardMetrics } from '@/services/medico/dashboard';

interface Metrics {
    totalInternados: number;
    internadosHoje: number;
    internadosMes: number;
}

export default function MetricsCards() {
    const [metrics, setMetrics] = useState<Metrics>({
        totalInternados: 0,
        internadosHoje: 0,
        internadosMes: 0,
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const data = await getDashboardMetrics();
                setMetrics(data);
            } catch (err) {
                console.error('Failed to load dashboard metrics', err);
                setError('Erro ao carregar métricas');
            } finally {
                setLoading(false);
            }
        };
        fetchMetrics();
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="150px">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box color="error.main" textAlign="center" minHeight="150px">
                {error}
            </Box>
        );
    }

    const cards = [
        {
            title: 'Total Internados',
            value: metrics.totalInternados,
            icon: <PeopleIcon sx={{ fontSize: 28 }} />,
            bgColor: '#f0f4ff',
            iconColor: '#4a6cf7',
        },
        {
            title: 'Internados Hoje',
            value: metrics.internadosHoje,
            icon: <EventIcon sx={{ fontSize: 28 }} />,
            bgColor: '#e8f8f5',
            iconColor: '#10b981',
        },
        {
            title: 'Internados no Mês',
            value: metrics.internadosMes,
            icon: <CalendarIcon sx={{ fontSize: 28 }} />,
            bgColor: '#fff4e6',
            iconColor: '#f59e0b',
        },
    ];

    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: 2,
            }}
        >
            {cards.map((card, index) => (
                <Card
                    key={index}
                    sx={{
                        border: '1px solid #f0f0f0',
                        boxShadow: 'none',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                            transform: 'translateY(-2px)',
                        },
                    }}
                >
                    <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                            <Box
                                sx={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: 2,
                                    bgcolor: card.bgColor,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: card.iconColor,
                                }}
                            >
                                {card.icon}
                            </Box>
                        </Box>
                        <Typography variant="h4" component="div" sx={{ fontWeight: 700, fontSize: '1.75rem', color: '#1a1a1a', mb: 0.5 }}>
                            {card.value}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.813rem', fontWeight: 500 }}>
                            {card.title}
                        </Typography>
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
}
