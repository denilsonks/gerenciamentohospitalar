import { Box, Card, CardContent, Typography, Avatar } from '@mui/material';
import { LocalHospital, PersonAdd, Assignment, CheckCircle } from '@mui/icons-material';
import type { ReactNode } from 'react';

interface CardData {
    title: string;
    value: number | string;
    icon: ReactNode;
    color: string;
    gradient: string;
}

interface SummaryCardsProps {
    totalInternados: number;
    internacoesHoje: number;
}

export default function SummaryCards({ totalInternados, internacoesHoje }: SummaryCardsProps) {
    const cards: CardData[] = [
        {
            title: 'Pacientes Internados',
            value: totalInternados,
            icon: <LocalHospital sx={{ fontSize: 20 }} />,
            color: '#2196F3',
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        },
        {
            title: 'Internações Hoje',
            value: internacoesHoje,
            icon: <PersonAdd sx={{ fontSize: 20 }} />,
            color: '#4CAF50',
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
        },
        {
            title: 'Exames Pendentes',
            value: 'Em breve',
            icon: <Assignment sx={{ fontSize: 20 }} />,
            color: '#FF9800',
            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
        },
        {
            title: 'RX Laudados',
            value: 'Em breve',
            icon: <CheckCircle sx={{ fontSize: 20 }} />,
            color: '#9C27B0',
            gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
        }
    ];

    return (
        <Box sx={{
            display: 'grid',
            gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(4, 1fr)'
            },
            gap: 2,
            mb: 3
        }}>
            {cards.map((card, index) => (
                <Card
                    key={index}
                    sx={{
                        position: 'relative',
                        overflow: 'hidden',
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                        },
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '3px',
                            background: card.gradient
                        }
                    }}
                >
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box sx={{ flexGrow: 1 }}>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    fontWeight={400}
                                    sx={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}
                                >
                                    {card.title}
                                </Typography>
                                <Typography
                                    variant="h6"
                                    fontWeight={400}
                                    sx={{
                                        mt: 0.5,
                                        background: card.gradient,
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text'
                                    }}
                                >
                                    {card.value}
                                </Typography>
                            </Box>
                            <Avatar
                                sx={{
                                    background: card.gradient,
                                    width: 40,
                                    height: 40,
                                    boxShadow: `0 4px 12px ${card.color}40`
                                }}
                            >
                                {card.icon}
                            </Avatar>
                        </Box>
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
}
