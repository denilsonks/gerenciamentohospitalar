import { Box, Card, Typography, LinearProgress } from '@mui/material';
import { TrendingUp, TrendingDown, Hotel, Assignment } from '@mui/icons-material';

export default function DashboardMetrics({ totalInternados }: { totalInternados: number }) {
    return (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1.5, mb: 3 }}>
            {/* Card 1: Total Internados */}
            <Card sx={{ p: 1.5, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.02)' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} fontSize="0.7rem">
                        TOTAL INTERNADOS
                    </Typography>
                    <Box sx={{ bgcolor: 'rgba(102, 126, 234, 0.1)', borderRadius: 1, p: 0.25 }}>
                        <Hotel sx={{ fontSize: 14, color: '#667eea' }} />
                    </Box>
                </Box>
                <Typography variant="h5" fontWeight={700} color="#2d3748">
                    {totalInternados}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                    <TrendingUp sx={{ fontSize: 14, color: '#48bb78' }} />
                    <Typography variant="caption" color="#48bb78" fontWeight={600} fontSize="0.7rem">
                        +12%
                    </Typography>
                    <Typography variant="caption" color="text.secondary" fontSize="0.7rem">
                        vs mês anterior
                    </Typography>
                </Box>
            </Card>

            {/* Card 2: Taxa de Ocupação */}
            <Card sx={{ p: 1.5, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.02)' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} fontSize="0.7rem">
                        OCUPAÇÃO LEITOS
                    </Typography>
                    <Typography variant="caption" color="#667eea" fontWeight={700}>
                        85%
                    </Typography>
                </Box>
                <LinearProgress
                    variant="determinate"
                    value={85}
                    sx={{
                        height: 6,
                        borderRadius: 3,
                        bgcolor: 'rgba(102, 126, 234, 0.1)',
                        '& .MuiLinearProgress-bar': {
                            borderRadius: 3,
                            background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
                        }
                    }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', fontSize: '0.7rem' }}>
                    42 leitos disponíveis
                </Typography>
            </Card>

            {/* Card 3: Exames Pendentes */}
            <Card sx={{ p: 1.5, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.02)' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} fontSize="0.7rem">
                        EXAMES HOJE
                    </Typography>
                    <Box sx={{ bgcolor: 'rgba(237, 137, 54, 0.1)', borderRadius: 1, p: 0.25 }}>
                        <Assignment sx={{ fontSize: 14, color: '#ed8936' }} />
                    </Box>
                </Box>
                <Typography variant="h5" fontWeight={700} color="#2d3748">
                    28
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                    <TrendingDown sx={{ fontSize: 14, color: '#e53e3e' }} />
                    <Typography variant="caption" color="#e53e3e" fontWeight={600} fontSize="0.7rem">
                        -5%
                    </Typography>
                    <Typography variant="caption" color="text.secondary" fontSize="0.7rem">
                        vs ontem
                    </Typography>
                </Box>
            </Card>

            {/* Card 4: Raio-X Realizados */}
            <Card sx={{ p: 1.5, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.02)' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} fontSize="0.7rem">
                        RAIO-X REALIZADOS
                    </Typography>
                    <Box sx={{ bgcolor: 'rgba(72, 187, 120, 0.1)', borderRadius: 1, p: 0.25 }}>
                        <Typography variant="caption" fontWeight={700} color="#48bb78" fontSize="0.7rem">RX</Typography>
                    </Box>
                </Box>
                <Typography variant="h5" fontWeight={700} color="#2d3748">
                    14
                </Typography>
                <Box sx={{ mt: 0.5, height: 16, display: 'flex', alignItems: 'flex-end', gap: 0.5 }}>
                    {[40, 70, 30, 80, 50, 90, 60].map((h, i) => (
                        <Box key={i} sx={{
                            flex: 1,
                            height: `${h}%`,
                            bgcolor: i === 6 ? '#48bb78' : 'rgba(72, 187, 120, 0.2)',
                            borderRadius: '1px 1px 0 0'
                        }} />
                    ))}
                </Box>
            </Card>
        </Box>
    );
}
