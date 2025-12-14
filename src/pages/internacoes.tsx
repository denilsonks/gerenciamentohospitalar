import { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    TextField,
    MenuItem,
    Grid,
    CircularProgress,
    Chip,
    InputAdornment
} from '@mui/material';
import { Search, LocalHospital, FilterList } from '@mui/icons-material';
import { SystemHeader, SystemFooter, AppMenu } from '../components/layout';
import { getInternacoes } from '../services/recepcao/internacao';
import { getMedicos } from '../services/recepcao/colaboradores';
import type { InternacaoComPaciente } from '../services/recepcao/internacao';
import type { Colaborador } from '../types';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function InternacoesPage() {
    const { profile, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    // Estado da tabela/dados
    const [data, setData] = useState<InternacaoComPaciente[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);

    // Estado dos filtros
    const [filters, setFilters] = useState({
        nomePaciente: '',
        medico: '',
        status: 'todos' as 'ativo' | 'todos' | 'alta',
        dataInicio: '',
        dataFim: ''
    });

    // Estado auxiliar
    const [medicos, setMedicos] = useState<Colaborador[]>([]);

    useEffect(() => {
        if (!authLoading && (!profile || (profile.funcao !== 'Recepcionista' && profile.funcao !== 'Admin'))) {
            navigate('/');
        }
    }, [authLoading, profile, navigate]);

    // Carregar lista de médicos para o filtro
    useEffect(() => {
        getMedicos().then(setMedicos).catch(console.error);
    }, []);

    // Carregar dados da tabela
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const { data: resultData, total: resultTotal } = await getInternacoes({
                page: page + 1, // API usa 1-based index se não me engano, mas vamos confirmar. O service usa (page-1)*pageSize, então enviando page+1. Eita, espera. Service: (page-1)*pageSize. Se page começa em 0 no MUI, page+1 é 1. (1-1)*20 = 0. Correto.
                pageSize: rowsPerPage,
                filters: {
                    nomePaciente: filters.nomePaciente || undefined,
                    medico: filters.medico || undefined,
                    status: filters.status,
                    dataInicio: filters.dataInicio || undefined,
                    dataFim: filters.dataFim || undefined
                }
            });
            setData(resultData);
            setTotal(resultTotal);
        } catch (error) {
            console.error('Erro ao buscar internações:', error);
        } finally {
            setLoading(false);
        }
    }, [page, rowsPerPage, filters]);

    // Debounce simplificado para fetch quando filtros mudam
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchData();
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [fetchData]);

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleFilterChange = (field: keyof typeof filters, value: any) => {
        setFilters(prev => ({ ...prev, [field]: value }));
        setPage(0); // Resetar para primeira página ao filtrar
    };

    if (authLoading) return <CircularProgress />;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f8f9fa' }}>
            <SystemHeader />

            <Box sx={{ display: 'flex', flex: 1 }}>
                <Box sx={{
                    width: 260,
                    bgcolor: 'background.paper',
                    borderRight: '1px solid rgba(0,0,0,0.08)',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <AppMenu />
                </Box>

                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto', p: 4 }}>
                    <Container maxWidth="xl">
                        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'rgba(102, 126, 234, 0.1)', color: '#667eea' }}>
                                <LocalHospital />
                            </Box>
                            <Typography variant="h6" fontWeight={600} color="#2d3748">
                                Gestão de Internações
                            </Typography>
                        </Box>

                        <Paper sx={{ p: 3, mb: 3, borderRadius: 2, border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                            <Typography variant="subtitle2" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                                <FilterList fontSize="small" /> Filtros
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, md: 3 }}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Nome do Paciente"
                                        value={filters.nomePaciente}
                                        onChange={(e) => handleFilterChange('nomePaciente', e.target.value)}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment>
                                        }}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 3 }}>
                                    <TextField
                                        select
                                        fullWidth
                                        size="small"
                                        label="Médico Assistente"
                                        value={filters.medico}
                                        onChange={(e) => handleFilterChange('medico', e.target.value)}
                                    >
                                        <MenuItem value="">Todos</MenuItem>
                                        {medicos.map(medico => (
                                            <MenuItem key={medico.identificadorUsuario} value={medico.identificadorUsuario}>
                                                {medico.nomeCompleto}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid size={{ xs: 12, md: 2 }}>
                                    <TextField
                                        select
                                        fullWidth
                                        size="small"
                                        label="Status"
                                        value={filters.status}
                                        onChange={(e) => handleFilterChange('status', e.target.value)}
                                    >
                                        <MenuItem value="todos">Todos</MenuItem>
                                        <MenuItem value="ativo">Internados</MenuItem>
                                        <MenuItem value="alta">Alta</MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid size={{ xs: 12, md: 2 }}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        type="date"
                                        label="Data Início"
                                        InputLabelProps={{ shrink: true }}
                                        value={filters.dataInicio}
                                        onChange={(e) => handleFilterChange('dataInicio', e.target.value)}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 2 }}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        type="date"
                                        label="Data Fim"
                                        InputLabelProps={{ shrink: true }}
                                        value={filters.dataFim}
                                        onChange={(e) => handleFilterChange('dataFim', e.target.value)}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>

                        <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                            <TableContainer sx={{ maxHeight: 640 }}>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 600, color: '#4a5568', bgcolor: '#f8fafc' }}>Paciente</TableCell>
                                            <TableCell sx={{ fontWeight: 600, color: '#4a5568', bgcolor: '#f8fafc' }}>Médico Assistente</TableCell>
                                            <TableCell sx={{ fontWeight: 600, color: '#4a5568', bgcolor: '#f8fafc' }}>Quarto/Leito</TableCell>
                                            <TableCell sx={{ fontWeight: 600, color: '#4a5568', bgcolor: '#f8fafc' }}>Data Internação</TableCell>
                                            <TableCell sx={{ fontWeight: 600, color: '#4a5568', bgcolor: '#f8fafc' }}>Data Alta</TableCell>
                                            <TableCell sx={{ fontWeight: 600, color: '#4a5568', bgcolor: '#f8fafc' }}>Status</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {loading ? (
                                            <TableRow>
                                                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                                    <CircularProgress size={30} />
                                                </TableCell>
                                            </TableRow>
                                        ) : data.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                                                    Nenhuma internação encontrada
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            data.map((row) => (
                                                <TableRow key={row.identificador} hover>
                                                    <TableCell>
                                                        <Typography variant="body2" fontWeight={600} color="#2d3748">
                                                            {row.paciente?.nomeCompleto || 'Desconhecido'}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {row.paciente?.documentoRegistro || '-'}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>{row.medico?.nomeCompleto || 'N/A'}</TableCell>
                                                    <TableCell>{`Q${row.quarto} / L${row.leito}`}</TableCell>
                                                    <TableCell>{new Date(row.createdAt).toLocaleDateString()} {new Date(row.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</TableCell>
                                                    <TableCell>
                                                        {row.alta && row.createdAt ? (
                                                            // Nota: O campo de data de alta não existe explicitamente no schema mostrado, presumindo que se Alta=True, talvez devêssemos usar updated_at ou adicionar campo.
                                                            // Mas o prompt pediu "Data da Alta". Como não temos esse campo específico no schema Internacao (só boolean 'alta'),
                                                            // Vou deixar vazio se não tiver, ou exibir '-' se não for alta.
                                                            // Se realmente precisarmos da data, teríamos que migrar o banco.
                                                            // Por enquanto, vou mostrar "Concluída" ou tentar usar updated_at se disponível no objeto (n está no type).
                                                            // Vou deixar em branco se não for alta, e se for, mostrar um placeholder ou updated se tiver.
                                                            // A API não retorna data de alta explícita.
                                                            <Typography variant="body2" color="text.secondary">-</Typography>
                                                        ) : '-'}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={row.alta ? 'Alta' : 'Internado'}
                                                            color={row.alta ? 'default' : 'success'}
                                                            size="small"
                                                            variant="outlined"
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                rowsPerPageOptions={[10, 20]}
                                component="div"
                                count={total}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                labelRowsPerPage="Linhas por página:"
                            />
                        </Paper>
                    </Container>
                </Box>
            </Box>
            <SystemFooter />
        </Box>
    );
}
