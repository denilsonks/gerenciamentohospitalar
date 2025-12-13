import { Typography, Box } from '@mui/material';
import { Assignment as TaskIcon } from '@mui/icons-material';

export default function RemindersSection() {
    return (
        <Box>
            <Typography variant="h6" component="h2" sx={{ fontWeight: 600, fontSize: '1.1rem', color: '#1a1a1a', mb: 2 }}>
                Lembretes e Tarefas
            </Typography>
            <Box sx={{
                minHeight: 120,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px dashed #e0e0e0',
                borderRadius: 1.5,
                bgcolor: '#fafafa'
            }}>
                <Box sx={{ textAlign: 'center', py: 3 }}>
                    <TaskIcon sx={{ fontSize: 36, color: '#9ca3af', mb: 1 }} />
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Sua lista de tarefas está vazia.
                    </Typography>
                    <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.75rem' }}>
                        (Funcionalidade será implementada em breve)
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}
