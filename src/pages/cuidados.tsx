import { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Paper,
    TextField,
    IconButton,
    Typography,
    InputAdornment,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    CircularProgress,
    Tooltip,
    Alert,
    Snackbar,
    Fade,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Chip,
} from '@mui/material';
import {
    Search as SearchIcon,
    Delete as DeleteIcon,
    Check as CheckIcon,
    Close as CloseIcon,
    Add as AddIcon,
    Edit as EditIcon,
    SortByAlpha as SortIcon,
} from '@mui/icons-material';
import SystemHeader from '@/components/layout/SystemHeader';
import SystemFooter from '@/components/layout/SystemFooter';
import { getAllCuidados, createCuidado, updateCuidado, deleteCuidado } from '@/services/admin/cuidados';
import type { ItemCuidado } from '@/types';

type SortOrder = 'asc' | 'desc';
type SortField = 'nome' | 'tipo' | 'id';

const ITEMS_PER_PAGE = 20;

export default function CuidadosPage() {
    const [cuidados, setCuidados] = useState<ItemCuidado[]>([]);
    const [filteredCuidados, setFilteredCuidados] = useState<ItemCuidado[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState<SortField>('nome');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
    const [page, setPage] = useState(0);

    // Estados para edição inline
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingNome, setEditingNome] = useState('');
    const [editingTipo, setEditingTipo] = useState('');

    // Estado para novo item
    const [isAdding, setIsAdding] = useState(false);
    const [newNome, setNewNome] = useState('');
    const [newTipo, setNewTipo] = useState('');

    // Estados de feedback
    const [saving, setSaving] = useState(false);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
        open: false,
        message: '',
        severity: 'success',
    });

    // Carregar cuidados
    const loadCuidados = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getAllCuidados();
            setCuidados(data);
        } catch (error) {
            console.error('Erro ao carregar cuidados:', error);
            setSnackbar({ open: true, message: 'Erro ao carregar cuidados', severity: 'error' });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadCuidados();
    }, [loadCuidados]);

    // Filtrar e ordenar
    useEffect(() => {
        let result = [...cuidados];

        // Filtrar por termo de busca
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(
                (item) =>
                    item.nome.toLowerCase().includes(term) ||
                    (item.tipo && item.tipo.toLowerCase().includes(term))
            );
        }

        // Ordenar
        result.sort((a, b) => {
            let valueA: string = '';
            let valueB: string = '';

            if (sortField === 'nome') {
                valueA = a.nome.toLowerCase();
                valueB = b.nome.toLowerCase();
            } else if (sortField === 'tipo') {
                valueA = (a.tipo || '').toLowerCase();
                valueB = (b.tipo || '').toLowerCase();
            } else if (sortField === 'id') {
                valueA = a.id;
                valueB = b.id;
            }

            if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
            if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

        setFilteredCuidados(result);
        // Resetar para primeira página quando filtros mudam
        setPage(0);
    }, [cuidados, searchTerm, sortField, sortOrder]);

    // Iniciar edição
    const startEditing = (cuidado: ItemCuidado) => {
        setEditingId(cuidado.id);
        setEditingNome(cuidado.nome);
        setEditingTipo(cuidado.tipo || '');
    };

    // Cancelar edição
    const cancelEditing = () => {
        setEditingId(null);
        setEditingNome('');
        setEditingTipo('');
    };

    // Salvar edição
    const saveEditing = async () => {
        if (!editingId || !editingNome.trim()) return;

        setSaving(true);
        try {
            const updated = await updateCuidado(editingId, editingNome.trim(), editingTipo.trim() || undefined);
            setCuidados((prev) => prev.map((item) => (item.id === editingId ? updated : item)));
            setSnackbar({ open: true, message: 'Cuidado atualizado!', severity: 'success' });
            cancelEditing();
        } catch (error) {
            console.error('Erro ao atualizar:', error);
            setSnackbar({ open: true, message: 'Erro ao atualizar cuidado', severity: 'error' });
        } finally {
            setSaving(false);
        }
    };

    // Adicionar novo
    const handleAdd = async () => {
        if (!newNome.trim()) return;

        setSaving(true);
        try {
            const created = await createCuidado(newNome.trim(), newTipo.trim() || undefined);
            setCuidados((prev) => [...prev, created]);
            setSnackbar({ open: true, message: 'Cuidado adicionado!', severity: 'success' });
            setNewNome('');
            setNewTipo('');
            setIsAdding(false);
        } catch (error) {
            console.error('Erro ao adicionar:', error);
            setSnackbar({ open: true, message: 'Erro ao adicionar cuidado', severity: 'error' });
        } finally {
            setSaving(false);
        }
    };

    // Excluir
    const handleDelete = async (id: string) => {
        if (!window.confirm('Tem certeza que deseja excluir este cuidado?')) return;

        setSaving(true);
        try {
            await deleteCuidado(id);
            setCuidados((prev) => prev.filter((item) => item.id !== id));
            setSnackbar({ open: true, message: 'Cuidado excluído!', severity: 'success' });
        } catch (error) {
            console.error('Erro ao excluir:', error);
            setSnackbar({ open: true, message: 'Erro ao excluir cuidado', severity: 'error' });
        } finally {
            setSaving(false);
        }
    };

    const toggleSortOrder = () => {
        setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    };

    // Calcular itens da página atual
    const paginatedCuidados = filteredCuidados.slice(
        page * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE + ITEMS_PER_PAGE
    );

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f5f7fa' }}>
            <SystemHeader />

            <Box sx={{ flex: 1, p: 3, maxWidth: 1200, mx: 'auto', width: '100%' }}>
                {/* Título */}
                <Typography
                    variant="h4"
                    sx={{
                        mb: 3,
                        fontWeight: 600,
                        color: '#1a237e',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                    }}
                >
                    🏥 Gerenciamento de Cuidados
                </Typography>

                {/* Barra de Filtros */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 2,
                        mb: 3,
                        borderRadius: 3,
                        border: '1px solid #e0e0e0',
                        display: 'flex',
                        gap: 2,
                        flexWrap: 'wrap',
                        alignItems: 'center',
                    }}
                >
                    {/* Busca */}
                    <TextField
                        placeholder="Buscar cuidados..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        size="small"
                        sx={{ minWidth: 300, flex: 1 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                    />

                    {/* Ordenar por */}
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Ordenar por</InputLabel>
                        <Select
                            value={sortField}
                            label="Ordenar por"
                            onChange={(e) => setSortField(e.target.value as SortField)}
                        >
                            <MenuItem value="nome">Nome</MenuItem>
                            <MenuItem value="tipo">Tipo</MenuItem>
                            <MenuItem value="id">ID</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Ordem */}
                    <Tooltip title={sortOrder === 'asc' ? 'Crescente' : 'Decrescente'}>
                        <IconButton onClick={toggleSortOrder} color="primary">
                            <SortIcon sx={{ transform: sortOrder === 'desc' ? 'scaleY(-1)' : 'none' }} />
                        </IconButton>
                    </Tooltip>

                    {/* Botão Adicionar */}
                    <Tooltip title="Adicionar cuidado">
                        <IconButton
                            onClick={() => setIsAdding(true)}
                            sx={{
                                bgcolor: 'primary.main',
                                color: 'white',
                                '&:hover': { bgcolor: 'primary.dark' },
                            }}
                        >
                            <AddIcon />
                        </IconButton>
                    </Tooltip>

                    {/* Contador */}
                    <Chip
                        label={`${filteredCuidados.length} cuidados`}
                        size="small"
                        color="primary"
                        variant="outlined"
                    />
                </Paper>

                {/* Tabela */}
                <TableContainer
                    component={Paper}
                    elevation={0}
                    sx={{
                        borderRadius: 3,
                        border: '1px solid #e0e0e0',
                        overflow: 'hidden',
                    }}
                >
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                                <TableCell sx={{ fontWeight: 600 }}>Nome do Cuidado</TableCell>
                                <TableCell sx={{ fontWeight: 600, width: 200 }}>Tipo</TableCell>
                                <TableCell sx={{ fontWeight: 600, width: 120, textAlign: 'center' }}>Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {/* Linha para adicionar novo */}
                            {isAdding && (
                                <Fade in={isAdding}>
                                    <TableRow sx={{ bgcolor: '#e3f2fd' }}>
                                        <TableCell>
                                            <TextField
                                                value={newNome}
                                                onChange={(e) => setNewNome(e.target.value)}
                                                placeholder="Descrição do cuidado"
                                                size="small"
                                                fullWidth
                                                autoFocus
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') handleAdd();
                                                    if (e.key === 'Escape') setIsAdding(false);
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                value={newTipo}
                                                onChange={(e) => setNewTipo(e.target.value)}
                                                placeholder="Tipo (opcional)"
                                                size="small"
                                                fullWidth
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') handleAdd();
                                                    if (e.key === 'Escape') setIsAdding(false);
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>
                                            <Tooltip title="Salvar">
                                                <span>
                                                    <IconButton
                                                        onClick={handleAdd}
                                                        color="success"
                                                        disabled={saving || !newNome.trim()}
                                                    >
                                                        {saving ? <CircularProgress size={20} /> : <CheckIcon />}
                                                    </IconButton>
                                                </span>
                                            </Tooltip>
                                            <Tooltip title="Cancelar">
                                                <IconButton
                                                    onClick={() => {
                                                        setIsAdding(false);
                                                        setNewNome('');
                                                        setNewTipo('');
                                                    }}
                                                    color="error"
                                                >
                                                    <CloseIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                </Fade>
                            )}

                            {/* Loading */}
                            {loading && (
                                <TableRow>
                                    <TableCell colSpan={3} sx={{ textAlign: 'center', py: 5 }}>
                                        <CircularProgress />
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                            Carregando cuidados...
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}

                            {/* Lista vazia */}
                            {!loading && filteredCuidados.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={3} sx={{ textAlign: 'center', py: 5 }}>
                                        <Typography variant="body1" color="text.secondary">
                                            {searchTerm ? 'Nenhum cuidado encontrado' : 'Nenhum cuidado cadastrado'}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}

                            {/* Lista de cuidados */}
                            {!loading &&
                                paginatedCuidados.map((cuidado) => (
                                    <TableRow
                                        key={cuidado.id}
                                        sx={{
                                            '&:hover': { bgcolor: '#fafafa' },
                                            transition: 'background-color 0.2s',
                                        }}
                                    >
                                        <TableCell>
                                            {editingId === cuidado.id ? (
                                                <TextField
                                                    value={editingNome}
                                                    onChange={(e) => setEditingNome(e.target.value)}
                                                    size="small"
                                                    fullWidth
                                                    autoFocus
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') saveEditing();
                                                        if (e.key === 'Escape') cancelEditing();
                                                    }}
                                                />
                                            ) : (
                                                <Typography variant="body1">{cuidado.nome}</Typography>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {editingId === cuidado.id ? (
                                                <TextField
                                                    value={editingTipo}
                                                    onChange={(e) => setEditingTipo(e.target.value)}
                                                    placeholder="Tipo"
                                                    size="small"
                                                    fullWidth
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') saveEditing();
                                                        if (e.key === 'Escape') cancelEditing();
                                                    }}
                                                />
                                            ) : (
                                                <Typography variant="body2" color="text.secondary">
                                                    {cuidado.tipo || '-'}
                                                </Typography>
                                            )}
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>
                                            {editingId === cuidado.id ? (
                                                <>
                                                    <Tooltip title="Salvar">
                                                        <span>
                                                            <IconButton
                                                                onClick={saveEditing}
                                                                color="success"
                                                                size="small"
                                                                disabled={saving}
                                                            >
                                                                {saving ? <CircularProgress size={16} /> : <CheckIcon />}
                                                            </IconButton>
                                                        </span>
                                                    </Tooltip>
                                                    <Tooltip title="Cancelar">
                                                        <IconButton onClick={cancelEditing} color="error" size="small">
                                                            <CloseIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </>
                                            ) : (
                                                <>
                                                    <Tooltip title="Editar">
                                                        <IconButton
                                                            onClick={() => startEditing(cuidado)}
                                                            color="primary"
                                                            size="small"
                                                        >
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Excluir">
                                                        <span>
                                                            <IconButton
                                                                onClick={() => handleDelete(cuidado.id)}
                                                                color="error"
                                                                size="small"
                                                                disabled={saving}
                                                            >
                                                                <DeleteIcon fontSize="small" />
                                                            </IconButton>
                                                        </span>
                                                    </Tooltip>
                                                </>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>

                    {/* Paginação */}
                    {!loading && filteredCuidados.length > 0 && (
                        <TablePagination
                            component="div"
                            count={filteredCuidados.length}
                            page={page}
                            onPageChange={handleChangePage}
                            rowsPerPage={ITEMS_PER_PAGE}
                            rowsPerPageOptions={[ITEMS_PER_PAGE]}
                            labelDisplayedRows={({ from, to, count }) =>
                                `${from}-${to} de ${count}`
                            }
                            sx={{
                                borderTop: '1px solid #e0e0e0',
                                '.MuiTablePagination-displayedRows': {
                                    fontWeight: 500,
                                },
                            }}
                        />
                    )}
                </TableContainer>
            </Box>

            <SystemFooter />

            {/* Snackbar para feedback */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
                    severity={snackbar.severity}
                    variant="filled"
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
