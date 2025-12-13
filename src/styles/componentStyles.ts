import type { SxProps, Theme } from '@mui/material';

export const inputStyles = {
    // Estilo para o Rótulo (Label) do Input
    label: {
        fontSize: '15px',
        color: '#64748B', // slate-500

        // 🚨 AJUSTE PARA CENTRALIZAR O LABEL EM INPUTS DE 40PX 🚨
        // Quando o rótulo NÃO está encolhido (posição inicial/central)
        '&:not(.MuiInputLabel-shrink)': {
            // Ajuste o valor de '0.7rem' para centralizar verticalmente no input de 40px.
            transform: 'translate(14px, 0.7rem) scale(1)',
        },

        '&.Mui-focused': {
            color: '#3B82F6', // blue-500
        },

        // Mantém o rótulo encolhido no topo alinhado
        '&.MuiInputLabel-shrink': {
            transform: 'translate(14px, -9px) scale(0.75)',
        }

    } as SxProps<Theme>,

    // Estilo para o Texto interno do Input
    input: {
        backgroundColor: '#FFFFFF',
        '& .MuiInputBase-input': {
            fontSize: '14px',
            color: '#1E293B', // slate-800
            textAlign: 'left',
            fontWeight: 500,
            cursor: 'pointer',
            '&::placeholder': {
                color: '#9c9c9cff !important', // slate-400
                opacity: 1,
                fontSize: '14px',
                fontWeight: 400,
            },
        },
    } as SxProps<Theme>,

    // Estilo para o Container do Autocomplete (Listbox)
    autocompleteListbox: {
        fontSize: '14px', // Aumentei um pouco de 11px para ficar mais legível, mas mantendo compacto
        padding: '4px 0',
        cursor: 'pointer',
        '& .MuiAutocomplete-option': {
            padding: '6px 16px',
            minHeight: 'auto',
        }
    } as SxProps<Theme>,

    // Estilo base para Inputs (TextField)
    textField: {
        '& .MuiOutlinedInput-root': {
            backgroundColor: '#FFFFFF',
            transition: 'all 0.2s ease-in-out',
            height: 40, // Altura fixada em 40px
            cursor: 'pointer',
            borderRadius: 0.5,
            '&:hover': {
                backgroundColor: '#F8FAFC', // slate-50
            },
            '&.Mui-focused': {
                backgroundColor: '#FFFFFF',
                boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.1)', // blue-500 com opacidade
            }
        }
    } as SxProps<Theme>
};

export const formContainerStyles = {
    paper: {
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        p: 3,
        borderTop: '1px solid #E2E8F0',
        bgcolor: '#FFFFFF',
        zIndex: 1000,
        boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
    } as SxProps<Theme>,

    content: {
        maxWidth: '1200px',
        mx: 'auto',
        position: 'relative',
        pr: { xs: 0, md: 8 } // Responsivo
    } as SxProps<Theme>
};