import { Box, Typography } from '@mui/material';

/**
 * SystemFooter - Rodapé global do sistema
 * 
 * Por enquanto apenas um background visual, conforme solicitado.
 */
export default function SystemFooter() {
    return (
        <Box
            component="footer"
            sx={{
                py: 1,
                px: 2,
                mt: 'auto',
                backgroundColor: '#0f448aff',
                borderTop: '1px solid',
                borderColor: '#e0e0e0',
                textAlign: 'center'
            }}
        >
            <Typography variant="body2" sx={{ color: '#fff', wordSpacing: '1px', letterSpacing: '1px', fontWeight: '300' }}>
                © {new Date().getFullYear()} Associacao Hospitalar Santa Teresa
            </Typography>
        </Box>
    );
}
