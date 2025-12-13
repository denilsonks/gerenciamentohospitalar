import { useState, useMemo } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Checkbox,
    Paper,
    InputAdornment,
    MenuItem,
    Typography,
    Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import type { ItemCuidado } from '@/types';

interface Props {
    open: boolean;
    onClose: () => void;
    onAddItems: (items: ItemCuidado[]) => void;
    allCares: ItemCuidado[];
}

export default function CareSelectionModal({ open, onClose, onAddItems, allCares }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState<string>('all');
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

    const uniqueTypes = useMemo(() => {
        const types = new Set(allCares.map(care => care.tipo).filter(Boolean));
        return Array.from(types).sort();
    }, [allCares]);

    const filteredCares = useMemo(() => {
        return allCares.filter(care => {
            const matchesSearch = care.nome.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = typeFilter === 'all' || care.tipo === typeFilter;
            return matchesSearch && matchesType;
        });
    }, [allCares, searchTerm, typeFilter]);

    const allSelected = filteredCares.length > 0 && filteredCares.every(care => selectedItems.has(care.id));
    const someSelected = filteredCares.some(care => selectedItems.has(care.id));

    const handleSelectAll = () => {
        const newSelected = new Set(selectedItems);
        if (allSelected) {
            filteredCares.forEach(care => newSelected.delete(care.id));
        } else {
            filteredCares.forEach(care => newSelected.add(care.id));
        }
        setSelectedItems(newSelected);
    };

    const handleToggleItem = (id: string) => {
        const newSelected = new Set(selectedItems);
        newSelected.has(id) ? newSelected.delete(id) : newSelected.add(id);
        setSelectedItems(newSelected);
    };

    const handleAdd = () => {
        const itemsToAdd = allCares.filter(care => selectedItems.has(care.id));
        onAddItems(itemsToAdd);
        handleClose();
    };

    const handleClose = () => {
        setSearchTerm('');
        setTypeFilter('all');
        setSelectedItems(new Set());
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 1,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
                }
            }}
        >
            <DialogTitle
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    pb: 1,
                    borderBottom: '1px solid #e0e0e0'
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SearchIcon sx={{ color: '#667eea', fontSize: 22 }} />
                    <Typography variant="subtitle1" fontWeight={600} color="#2d3748" sx={{ fontSize: '1rem' }}>
                        Selecionar Cuidados
                    </Typography>
                </Box>
                <Chip
                    label={`${selectedItems.size} selecionado${selectedItems.size !== 1 ? 's' : ''}`}
                    color="primary"
                    size="small"
                    sx={{ fontWeight: 600, height: 24, fontSize: '0.75rem' }}
                />
            </DialogTitle>

            <DialogContent sx={{ pt: 1, mt: 2 }}>
                {/* Filtros compactos */}
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <TextField
                        fullWidth
                        size="small"
                        placeholder="Buscar cuidado..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: '#9ca3af', fontSize: 20 }} />
                                </InputAdornment>
                            )
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 1,
                                bgcolor: '#f9fafb',
                                fontSize: '0.875rem',
                                height: 40
                            }
                        }}
                    />

                    <TextField
                        select
                        size="small"
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        SelectProps={{
                            MenuProps: {
                                PaperProps: {
                                    sx: {
                                        maxHeight: 200,
                                        mt: 0.5,
                                        '& .MuiMenuItem-root': {
                                            fontSize: '0.8125rem',
                                            minHeight: '32px',
                                            py: '4px',
                                            px: '12px',
                                        }
                                    }
                                }
                            }
                        }}
                        sx={{
                            minWidth: 160,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 1,
                                bgcolor: '#f9fafb',
                                fontSize: '0.875rem',
                                height: 40
                            }
                        }}
                    >
                        <MenuItem value="all">Todos os tipos</MenuItem>
                        {uniqueTypes.map(type => (
                            <MenuItem key={type} value={type}>{type}</MenuItem>
                        ))}
                    </TextField>
                </Box>

                {/* Tabela compacta */}
                <TableContainer
                    component={Paper}
                    sx={{
                        maxHeight: 400,
                        borderRadius: 1,
                        border: '1px solid #e5e7eb',
                        boxShadow: 'none'
                    }}
                >
                    <Table stickyHeader size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox" sx={{ bgcolor: '#f9fafb', borderBottom: '2px solid #e5e7eb', p: 0.5 }}>
                                    <Checkbox
                                        checked={allSelected}
                                        indeterminate={someSelected && !allSelected}
                                        onChange={handleSelectAll}
                                        color="primary"
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell sx={{ bgcolor: '#f9fafb', fontWeight: 600, color: '#374151', borderBottom: '2px solid #e5e7eb', p: 0.5, fontSize: '0.8125rem' }}>
                                    Cuidado
                                </TableCell>
                                <TableCell sx={{ bgcolor: '#f9fafb', fontWeight: 600, color: '#374151', borderBottom: '2px solid #e5e7eb', width: 200, p: 0.5, fontSize: '0.8125rem' }}>
                                    Tipo
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredCares.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} align="center" sx={{ py: 2, color: '#9ca3af', fontSize: '0.8125rem' }}>
                                        Nenhum cuidado encontrado
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredCares.map((care) => (
                                    <TableRow
                                        key={care.id}
                                        hover
                                        onClick={() => handleToggleItem(care.id)}
                                        sx={{
                                            cursor: 'pointer',
                                            '&:hover': { bgcolor: '#f9fafb' },
                                            transition: 'background-color 0.2s',
                                            height: 38
                                        }}
                                    >
                                        <TableCell padding="checkbox" sx={{ p: 0.5 }}>
                                            <Checkbox
                                                checked={selectedItems.has(care.id)}
                                                color="primary"
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell sx={{ color: '#1f2937', fontWeight: 500, p: 0.5, fontSize: '0.8125rem' }}>
                                            {care.nome}
                                        </TableCell>
                                        <TableCell sx={{ p: 0.5 }}>
                                            {care.tipo && (
                                                <Chip
                                                    label={care.tipo}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: '#e0e7ff',
                                                        color: '#4338ca',
                                                        fontWeight: 500,
                                                        fontSize: '0.6875rem',
                                                        height: 20
                                                    }}
                                                />
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Box sx={{ mt: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                        Mostrando {filteredCares.length} de {allCares.length} cuidados
                    </Typography>
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 2, pb: 2, pt: 1, gap: 1, borderTop: '1px solid #e0e0e0' }}>
                <Button
                    size="small"
                    onClick={handleClose}
                    variant="outlined"
                    startIcon={<CloseIcon fontSize="small" />}
                    sx={{
                        borderRadius: 1,
                        textTransform: 'none',
                        fontWeight: 500,
                        px: 2,
                        fontSize: '0.8125rem',
                        borderColor: '#d1d5db',
                        color: '#6b7280',
                        '&:hover': {
                            borderColor: '#9ca3af',
                            bgcolor: '#f9fafb'
                        }
                    }}
                >
                    Cancelar
                </Button>
                <Button
                    size="small"
                    onClick={handleAdd}
                    variant="contained"
                    disabled={selectedItems.size === 0}
                    startIcon={<AddIcon fontSize="small" />}
                    sx={{
                        borderRadius: 1,
                        textTransform: 'none',
                        fontWeight: 500,
                        px: 2,
                        fontSize: '0.8125rem',
                        bgcolor: '#667eea',
                        '&:hover': {
                            bgcolor: '#5a67d8'
                        }
                    }}
                >
                    Adicionar ({selectedItems.size})
                </Button>
            </DialogActions>
        </Dialog>
    );
}
