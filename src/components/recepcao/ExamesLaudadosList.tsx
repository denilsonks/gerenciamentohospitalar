import { Box, Typography, List, ListItem, ListItemText, Chip } from '@mui/material';
import { Description } from '@mui/icons-material';

export default function ExamesLaudadosList() {
    // Mock data
    const exames = [
        { id: 1, paciente: 'Maria Silva', exame: 'Raio-X Tórax', data: '10:30', status: 'Laudado' },
        { id: 2, paciente: 'João Santos', exame: 'Tomografia', data: '09:15', status: 'Laudado' },
        { id: 3, paciente: 'Ana Costa', exame: 'Ressonância', data: '08:45', status: 'Pendente' },
    ];

    return (
        <Box sx={{
            bgcolor: 'white',
            borderRadius: 3,
            p: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
            border: '1px solid rgba(0,0,0,0.02)',
            mt: 2
        }}>
            <Typography variant="subtitle2" fontWeight={600} color="#2d3748" sx={{ mb: 1.5, fontSize: '0.85rem' }}>
                Últimos Exames
            </Typography>

            <List disablePadding>
                {exames.map((exame) => (
                    <ListItem key={exame.id} disablePadding sx={{ mb: 1 }}>
                        <Box sx={{
                            mr: 1.5,
                            width: 28,
                            height: 28,
                            borderRadius: 1.5,
                            bgcolor: 'rgba(102, 126, 234, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Description sx={{ fontSize: 14, color: '#667eea' }} />
                        </Box>
                        <ListItemText
                            primary={
                                <Typography variant="body2" fontWeight={600} color="#2d3748" fontSize="0.8rem">
                                    {exame.exame}
                                </Typography>
                            }
                            secondary={
                                <Typography variant="caption" color="text.secondary" fontSize="0.7rem">
                                    {exame.paciente} • {exame.data}
                                </Typography>
                            }
                        />
                        <Chip
                            label={exame.status}
                            size="small"
                            sx={{
                                height: 18,
                                fontSize: '0.6rem',
                                bgcolor: exame.status === 'Laudado' ? 'rgba(72, 187, 120, 0.1)' : 'rgba(237, 137, 54, 0.1)',
                                color: exame.status === 'Laudado' ? '#48bb78' : '#ed8936',
                                fontWeight: 600
                            }}
                        />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}
