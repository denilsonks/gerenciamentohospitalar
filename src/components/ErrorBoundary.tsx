import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                    bgcolor: '#f5f5f5',
                    p: 3
                }}>
                    <Paper sx={{ p: 4, maxWidth: 600, width: '100%' }}>
                        <Typography variant="h4" color="error" gutterBottom>
                            Ops! Algo deu errado.
                        </Typography>
                        <Typography variant="body1" paragraph>
                            Ocorreu um erro inesperado na aplicação.
                        </Typography>
                        <Box sx={{
                            bgcolor: '#ffebee',
                            p: 2,
                            borderRadius: 1,
                            mb: 3,
                            overflow: 'auto',
                            maxHeight: 200
                        }}>
                            <Typography variant="caption" component="pre" sx={{ fontFamily: 'monospace' }}>
                                {this.state.error?.message}
                            </Typography>
                        </Box>
                        <Button
                            variant="contained"
                            onClick={() => window.location.reload()}
                        >
                            Recarregar Página
                        </Button>
                    </Paper>
                </Box>
            );
        }

        return this.props.children;
    }
}
