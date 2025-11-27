import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        primary: {
            main: '#0F172A', // Slate 900 - Professional, deep blue/black
            light: '#334155',
            dark: '#020617',
        },
        secondary: {
            main: '#3B82F6', // Blue 500 - Action color
        },
        background: {
            default: '#F8FAFC', // Slate 50 - Very light grey for background
            paper: '#FFFFFF',
        },
        text: {
            primary: '#1E293B', // Slate 800
            secondary: '#64748B', // Slate 500
        },
        success: {
            main: '#10B981', // Emerald 500
            light: '#D1FAE5',
        },
        warning: {
            main: '#F59E0B', // Amber 500
            light: '#FEF3C7',
        },
        error: {
            main: '#EF4444', // Red 500
            light: '#FEE2E2',
        },
        info: {
            main: '#3B82F6',
            light: '#DBEAFE',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h4: {
            fontWeight: 600,
            letterSpacing: '-0.02em',
        },
        h5: {
            fontWeight: 600,
        },
        h6: {
            fontWeight: 600,
        },
        subtitle1: {
            color: '#64748B',
        },
        button: {
            textTransform: 'none',
            fontWeight: 500,
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)',
                    border: '1px solid #E2E8F0',
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 500,
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: 'none',
                    },
                },
            },
        },
    },
});
