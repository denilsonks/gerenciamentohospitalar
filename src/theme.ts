import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    /* =========================================================
     * DENSIDADE GLOBAL
     * =======================================================*/
    spacing: 6, // padrão MUI = 8 → reduz tudo
    shape: {
        borderRadius: 8, // 12 é bonito, mas "fofo demais" para clínica
    },

    /* =========================================================
     * PALETA – CLÍNICA, SÓBRIA, PROFISSIONAL
     * =======================================================*/
    palette: {
        mode: 'light',

        primary: {
            main: '#0F172A', // Slate 900
            light: '#334155',
            dark: '#020617',
        },

        secondary: {
            main: '#2563EB', // Azul clínico
        },

        background: {
            default: '#F8FAFC', // Slate 50
            paper: '#FFFFFF',
        },

        text: {
            primary: '#1E293B', // Slate 800
            secondary: '#64748B', // Slate 500
        },

        success: {
            main: '#059669', // Verde mais sério
            light: '#D1FAE5',
        },

        warning: {
            main: '#D97706',
            light: '#FEF3C7',
        },

        error: {
            main: '#DC2626',
            light: '#FEE2E2',
        },

        info: {
            main: '#2563EB',
            light: '#DBEAFE',
        },

        divider: '#E2E8F0',
    },

    /* =========================================================
     * TIPOGRAFIA – DENSIDADE + LEGIBILIDADE
     * =======================================================*/
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',

        fontSize: 12, // FUNDAMENTAL: base compacta

        h1: { fontSize: '1.6rem', fontWeight: 600 },
        h2: { fontSize: '1.4rem', fontWeight: 600 },
        h3: { fontSize: '1.25rem', fontWeight: 600 },
        h4: { fontSize: '1.1rem', fontWeight: 600 },
        h5: { fontSize: '1rem', fontWeight: 600 },
        h6: { fontSize: '0.95rem', fontWeight: 600 },

        subtitle1: {
            fontSize: '0.85rem',
            color: '#64748B',
        },

        subtitle2: {
            fontSize: '0.8rem',
            color: '#64748B',
        },

        body1: {
            fontSize: '0.85rem',
        },

        body2: {
            fontSize: '0.8rem',
        },

        button: {
            fontSize: '0.8rem',
            fontWeight: 500,
            textTransform: 'none',
        },

        caption: {
            fontSize: '0.7rem',
            color: '#64748B',
        },
    },

    /* =========================================================
     * COMPONENTES – COMPACTOS POR PADRÃO
     * =======================================================*/
    components: {
        /* ---------------- BUTTON ---------------- */
        MuiButton: {
            defaultProps: {
                size: 'small',
                disableElevation: true,
            },
            styleOverrides: {
                root: {
                    minHeight: 32,
                    padding: '4px 10px',
                },
            },
        },

        /* ---------------- TEXT FIELD / INPUT ---------------- */
        MuiTextField: {
            defaultProps: {
                size: 'small',
                margin: 'dense',
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    minHeight: 32,
                },
                input: {
                    padding: '6px 8px',
                },
            },
        },

        MuiFormControl: {
            defaultProps: {
                size: 'small',
                margin: 'dense',
            },
        },

        MuiSelect: {
            defaultProps: {
                size: 'small',
            },
        },

        /* ---------------- CARD ---------------- */
        MuiCard: {
            styleOverrides: {
                root: {
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                },
            },
        },

        MuiCardContent: {
            styleOverrides: {
                root: {
                    padding: '12px',
                    '&:last-child': {
                        paddingBottom: '12px',
                    },
                },
            },
        },

        /* ---------------- TABLE ---------------- */
        MuiTableCell: {
            styleOverrides: {
                root: {
                    padding: '6px 8px',
                    fontSize: '0.8rem',
                },
                head: {
                    fontWeight: 600,
                    backgroundColor: '#F1F5F9',
                },
            },
        },

        /* ---------------- CHIP ---------------- */
        MuiChip: {
            defaultProps: {
                size: 'small',
            },
            styleOverrides: {
                root: {
                    fontWeight: 500,
                },
            },
        },

        /* ---------------- DIALOG (CRÍTICO EM SAÚDE) ---------------- */
        MuiDialogTitle: {
            styleOverrides: {
                root: {
                    padding: '10px 14px',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                },
            },
        },

        MuiDialogContent: {
            styleOverrides: {
                root: {
                    padding: '10px 14px',
                    fontSize: '0.85rem',
                },
            },
        },

        MuiDialogActions: {
            styleOverrides: {
                root: {
                    padding: '8px 14px',
                    gap: '8px',
                },
            },
        },

        /* ---------------- ALERT ---------------- */
        MuiAlert: {
            styleOverrides: {
                root: {
                    fontSize: '0.8rem',
                    padding: '6px 10px',
                },
            },
        },

        /* ---------------- TOOLTIP ---------------- */
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    fontSize: '0.75rem',
                },
            },
        },
    },
});
