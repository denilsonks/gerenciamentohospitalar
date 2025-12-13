import { Card, CardContent, Typography, Avatar } from '@mui/material';
import { Construction } from '@mui/icons-material';

export default function ExamesPlaceholder() {
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
                        bgcolor: 'rgba(255, 152, 0, 0.1)',
                        color: '#FF9800',
                        mx: 'auto',
                        mb: 3
                    }}
                >
                    <Construction sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography variant="h6" fontWeight={600} gutterBottom color="text.secondary">
                    Cadastro de Exames
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
