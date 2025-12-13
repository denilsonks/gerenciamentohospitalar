import { Card, CardContent, Typography, Avatar } from '@mui/material';
import { Biotech } from '@mui/icons-material';

export default function RXLaudadosPlaceholder() {
    return (
        <Card
            sx={{
                borderRadius: 3,
                border: '2px dashed',
                borderColor: 'divider',
                bgcolor: 'rgba(0,0,0,0.02)',
                boxShadow: 'none'
            }}
        >
            <CardContent sx={{ p: 6, textAlign: 'center' }}>
                <Avatar
                    sx={{
                        width: 80,
                        height: 80,
                        bgcolor: 'rgba(156, 39, 176, 0.1)',
                        color: '#9C27B0',
                        mx: 'auto',
                        mb: 3
                    }}
                >
                    <Biotech sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography variant="h6" fontWeight={600} gutterBottom color="text.secondary">
                    Exames RX Laudados
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Este módulo estará disponível em breve
                </Typography>
                <Typography variant="caption" color="text.disabled" sx={{ mt: 2, display: 'block' }}>
                    Aguardando implementação do backend
                </Typography>
            </CardContent>
        </Card>
    );
}
