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
import { getAllInsumos, createInsumo, updateInsumo, deleteInsumo } from '@/services/admin/insumos';
import type { Insumo } from '@/types';

type SortOrder = 'asc' | 'desc';
type SortField = 'nome' | 'categoria' | 'id';

const ITEMS_PER_PAGE = 20;

export default function MedicamentosPage() {
    const [insumos, setInsumos] = useState<Insumo[]>([]);
    const [filteredInsumos, setFilteredInsumos] = useState<Insumo[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState<SortField>('nome');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
    const [page, setPage] = useState(0);

    // Estados para edição inline
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingNome, setEditingNome] = useState('');
    const [editingCategoria, setEditingCategoria] = useState('');

    // Estado para novo item
    const [isAdding, setIsAdding] = useState(false);
    const [newNome, setNewNome] = useState('');
    const [newCategoria, setNewCategoria] = useState('');

    // Estados de feedback
    const [saving, setSaving] = useState(false);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
        open: false,
        message: '',
        severity: 'success',
    });

    // Carregar insumos
    const loadInsumos = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getAllInsumos();
            setInsumos(data);
        } catch (error) {
            console.error('Erro ao carregar medicamentos:', error);
            setSnackbar({ open: true, message: 'Erro ao carregar medicamentos', severity: 'error' });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadInsumos();
    }, [loadInsumos]);

    // Filtrar e ordenar
    useEffect(() => {
        let result = [...insumos];

        // Filtrar por termo de busca
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(
                (item) =>
                    item.nome.toLowerCase().includes(term) ||
                    (item.categoria && item.categoria.toLowerCase().includes(term))
            );
        }

        // Ordenar
        result.sort((a, b) => {
            let valueA: string | number = '';
            let valueB: string | number = '';

            if (sortField === 'nome') {
                valueA = a.nome.toLowerCase();
                valueB = b.nome.toLowerCase();
            } else if (sortField === 'categoria') {
                valueA = (a.categoria || '').toLowerCase();
                valueB = (b.categoria || '').toLowerCase();
            } else if (sortField === 'id') {
                valueA = a.id;
                valueB = b.id;
            }

            if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
            if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

        setFilteredInsumos(result);
        // Resetar para primeira página quando filtros mudam
        setPage(0);
    }, [insumos, searchTerm, sortField, sortOrder]);

    // Iniciar edição
    const startEditing = (insumo: Insumo) => {
        setEditingId(insumo.id);
        setEditingNome(insumo.nome);
        setEditingCategoria(insumo.categoria || '');
    };

    // Cancelar edição
    const cancelEditing = () => {
        setEditingId(null);
        setEditingNome('');
        setEditingCategoria('');
    };

    // Salvar edição
    const saveEditing = async () => {
        if (!editingId || !editingNome.trim()) return;

        setSaving(true);
        try {
            const updated = await updateInsumo(editingId, editingNome.trim(), editingCategoria.trim() || undefined);
            setInsumos((prev) => prev.map((item) => (item.id === editingId ? updated : item)));
            setSnackbar({ open: true, message: 'Medicamento atualizado!', severity: 'success' });
            cancelEditing();
        } catch (error) {
            console.error('Erro ao atualizar:', error);
            setSnackbar({ open: true, message: 'Erro ao atualizar medicamento', severity: 'error' });
        } finally {
            setSaving(false);
        }
    };

    // Adicionar novo
    const handleAdd = async () => {
        if (!newNome.trim()) return;

        setSaving(true);
        try {
            const created = await createInsumo(newNome.trim(), newCategoria.trim() || undefined);
            setInsumos((prev) => [...prev, created]);
            setSnackbar({ open: true, message: 'Medicamento adicionado!', severity: 'success' });
            setNewNome('');
            setNewCategoria('');
            setIsAdding(false);
        } catch (error) {
            console.error('Erro ao adicionar:', error);
            setSnackbar({ open: true, message: 'Erro ao adicionar medicamento', severity: 'error' });
        } finally {
            setSaving(false);
        }
    };

    // Excluir
    const handleDelete = async (id: number) => {
        if (!window.confirm('Tem certeza que deseja excluir este medicamento?')) return;

        setSaving(true);
        try {
            await deleteInsumo(id);
            setInsumos((prev) => prev.filter((item) => item.id !== id));
            setSnackbar({ open: true, message: 'Medicamento excluído!', severity: 'success' });
        } catch (error) {
            console.error('Erro ao excluir:', error);
            setSnackbar({ open: true, message: 'Erro ao excluir medicamento', severity: 'error' });
        } finally {
            setSaving(false);
        }
    };

    const toggleSortOrder = () => {
        setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    };

    // Calcular itens da página atual
    const paginatedInsumos = filteredInsumos.slice(
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
                    💊 Gerenciamento de Medicamentos
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
                        placeholder="Buscar medicamentos..."
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
                            <MenuItem value="categoria">Categoria</MenuItem>
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
                    <Tooltip title="Adicionar medicamento">
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
                        label={`${filteredInsumos.length} medicamentos`}
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
                                <TableCell sx={{ fontWeight: 600, width: 80 }}>ID</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Nome</TableCell>
                                <TableCell sx={{ fontWeight: 600, width: 200 }}>Categoria</TableCell>
                                <TableCell sx={{ fontWeight: 600, width: 120, textAlign: 'center' }}>Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {/* Linha para adicionar novo */}
                            {isAdding && (
                                <Fade in={isAdding}>
                                    <TableRow sx={{ bgcolor: '#e3f2fd' }}>
                                        <TableCell>
                                            <Chip label="Novo" size="small" color="primary" />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                value={newNome}
                                                onChange={(e) => setNewNome(e.target.value)}
                                                placeholder="Nome do medicamento"
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
                                                value={newCategoria}
                                                onChange={(e) => setNewCategoria(e.target.value)}
                                                placeholder="Categoria (opcional)"
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
                                                <IconButton
                                                    onClick={handleAdd}
                                                    color="success"
                                                    disabled={saving || !newNome.trim()}
                                                >
                                                    {saving ? <CircularProgress size={20} /> : <CheckIcon />}
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Cancelar">
                                                <IconButton
                                                    onClick={() => {
                                                        setIsAdding(false);
                                                        setNewNome('');
                                                        setNewCategoria('');
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
                                    <TableCell colSpan={4} sx={{ textAlign: 'center', py: 5 }}>
                                        <CircularProgress />
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                            Carregando medicamentos...
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}

                            {/* Lista vazia */}
                            {!loading && filteredInsumos.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} sx={{ textAlign: 'center', py: 5 }}>
                                        <Typography variant="body1" color="text.secondary">
                                            {searchTerm ? 'Nenhum medicamento encontrado' : 'Nenhum medicamento cadastrado'}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}

                            {/* Lista de medicamentos */}
                            {!loading &&
                                paginatedInsumos.map((insumo) => (
                                    <TableRow
                                        key={insumo.id}
                                        sx={{
                                            '&:hover': { bgcolor: '#fafafa' },
                                            transition: 'background-color 0.2s',
                                        }}
                                    >
                                        <TableCell>
                                            <Typography variant="body2" color="text.secondary">
                                                #{insumo.id}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            {editingId === insumo.id ? (
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
                                                <Typography variant="body1">{insumo.nome}</Typography>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {editingId === insumo.id ? (
                                                <TextField
                                                    value={editingCategoria}
                                                    onChange={(e) => setEditingCategoria(e.target.value)}
                                                    placeholder="Categoria"
                                                    size="small"
                                                    fullWidth
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') saveEditing();
                                                        if (e.key === 'Escape') cancelEditing();
                                                    }}
                                                />
                                            ) : (
                                                <Typography variant="body2" color="text.secondary">
                                                    {insumo.categoria || '-'}
                                                </Typography>
                                            )}
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>
                                            {editingId === insumo.id ? (
                                                <>
                                                    <Tooltip title="Salvar">
                                                        <IconButton
                                                            onClick={saveEditing}
                                                            color="success"
                                                            size="small"
                                                            disabled={saving}
                                                        >
                                                            {saving ? <CircularProgress size={16} /> : <CheckIcon />}
                                                        </IconButton>
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
                                                            onClick={() => startEditing(insumo)}
                                                            color="primary"
                                                            size="small"
                                                        >
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Excluir">
                                                        <IconButton
                                                            onClick={() => handleDelete(insumo.id)}
                                                            color="error"
                                                            size="small"
                                                            disabled={saving}
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>

                    {/* Paginação */}
                    {!loading && filteredInsumos.length > 0 && (
                        <TablePagination
                            component="div"
                            count={filteredInsumos.length}
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
