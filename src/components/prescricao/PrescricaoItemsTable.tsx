import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box,
    IconButton,
    Chip,
    Tooltip
} from "@mui/material";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import type { ItemPrescricao } from "@/types";
import React from "react";

interface Props {
    itens: ItemPrescricao[];
    onReorder?: (index: number, direction: 'up' | 'down') => void;
    onRemove?: (idItem: string) => void;
    readOnly?: boolean;
}

export default function PrescricaoItemsTable({ itens, onReorder, onRemove, readOnly = false }: Props) {
    if (itens.length === 0) {
        return (
            <Paper sx={{ p: 3, mb: 1.5, textAlign: 'center', bgcolor: '#fafafa', border: '1px dashed #e0e0e0', borderRadius: 2, boxShadow: 'none' }}>
                <Typography variant="body2" color="text.secondary">
                    Nenhum item prescrito.
                </Typography>
            </Paper>
        );
    }

    return (
        <TableContainer component={Paper} elevation={0} sx={{ mb: 1.5, border: '1px solid #e0e0e0', borderRadius: 2, overflow: 'hidden' }}>
            <Table size="small">
                <TableHead>
                    <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                        <TableCell sx={{ width: 50, color: 'text.primary', fontWeight: 600, fontSize: '0.75rem', py: 1.5, textAlign: 'center' }}>#</TableCell>
                        <TableCell sx={{ color: 'text.primary', fontWeight: 600, fontSize: '0.75rem', py: 1.5 }}>Produto</TableCell>
                        <TableCell sx={{ color: 'text.primary', fontWeight: 600, fontSize: '0.75rem', py: 1.5 }}>Apresentação</TableCell>
                        <TableCell sx={{ color: 'text.primary', fontWeight: 600, fontSize: '0.75rem', py: 1.5 }}>Quantidade</TableCell>
                        <TableCell sx={{ color: 'text.primary', fontWeight: 600, fontSize: '0.75rem', py: 1.5 }}>Frequência</TableCell>
                        <TableCell sx={{ color: 'text.primary', fontWeight: 600, fontSize: '0.75rem', py: 1.5 }}>S/N</TableCell>
                        <TableCell sx={{ color: 'text.primary', fontWeight: 600, fontSize: '0.75rem', py: 1.5 }}>Via</TableCell>
                        <TableCell sx={{ color: 'text.primary', fontWeight: 600, fontSize: '0.75rem', py: 1.5 }}>Aprazamento</TableCell>
                        {!readOnly && (
                            <TableCell align="right" sx={{ color: 'text.primary', fontWeight: 600, fontSize: '0.75rem', py: 1.5 }}>Ações</TableCell>
                        )}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {itens.map((item, index) => (
                        <React.Fragment key={item.idItem}>
                            <TableRow
                                sx={{
                                    '&:nth-of-type(4n+1)': { bgcolor: '#fafafa' },
                                    '&:hover': { bgcolor: '#f5f5f5' },
                                    ...(item.observacoes ? { '& td, & th': { borderBottom: 'none' } } : {})
                                }}
                            >
                                <TableCell align="center" sx={{ fontSize: '0.8rem', py: 1 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                                            {index + 1}
                                        </Typography>
                                        {!readOnly && onReorder && (
                                            <>
                                                <IconButton
                                                    size="small"
                                                    disabled={index === 0}
                                                    onClick={() => onReorder(index, 'up')}
                                                    sx={{ p: 0.2, opacity: index === 0 ? 0.3 : 0.7 }}
                                                >
                                                    <ArrowUpwardIcon sx={{ fontSize: 14 }} />
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    disabled={index === itens.length - 1}
                                                    onClick={() => onReorder(index, 'down')}
                                                    sx={{ p: 0.2, opacity: index === itens.length - 1 ? 0.3 : 0.7 }}
                                                >
                                                    <ArrowDownwardIcon sx={{ fontSize: 14 }} />
                                                </IconButton>
                                            </>
                                        )}
                                    </Box>
                                </TableCell>
                                <TableCell sx={{ fontSize: '0.8rem', py: 1 }}>{item.produto}</TableCell>
                                <TableCell sx={{ fontSize: '0.8rem', py: 1 }}>{item.apresentacao || '-'}</TableCell>
                                <TableCell sx={{ fontSize: '0.8rem', py: 1 }}>{item.quantidade}</TableCell>
                                <TableCell sx={{ fontSize: '0.8rem', py: 1 }}>{item.frequencia}</TableCell>
                                <TableCell sx={{ fontSize: '0.8rem', py: 1 }}>{item.seNecessario ? 'Sim' : 'Não'}</TableCell>
                                <TableCell sx={{ fontSize: '0.8rem', py: 1 }}>{item.viaAdm || '-'}</TableCell>
                                <TableCell sx={{ fontSize: '0.8rem', py: 1 }}>
                                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                        {item.horario && item.horario.length > 0 ? (
                                            item.horario.map((hora, idx) => {
                                                const date = new Date(hora);
                                                const formatted = !isNaN(date.getTime())
                                                    ? `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
                                                    : hora;
                                                return (
                                                    <Chip
                                                        key={idx}
                                                        label={formatted}
                                                        size="small"
                                                        variant="outlined"
                                                        color="primary"
                                                        sx={{ height: 20, fontSize: '0.7rem' }}
                                                    />
                                                );
                                            })
                                        ) : (
                                            '-'
                                        )}
                                    </Box>
                                </TableCell>
                                {!readOnly && (
                                    <TableCell align="right" sx={{ py: 1 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                                            <Tooltip title="Excluir item">
                                                <IconButton
                                                    size="small"
                                                    sx={{ color: 'error.main', p: 0.5 }}
                                                    onClick={() => onRemove && onRemove(item.idItem)}
                                                >
                                                    <DeleteOutlineIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </TableCell>
                                )}
                            </TableRow>
                            {item.observacoes && (
                                <TableRow sx={{
                                    '&:hover': { bgcolor: '#f5f5f5' }
                                }}>
                                    <TableCell colSpan={9} sx={{ py: 0.5, pb: 1.5, pt: 0 }}>
                                        <Typography sx={{ fontSize: '10px', color: 'text.secondary', fontStyle: 'italic', pl: 7 }}>
                                            Obs: {item.observacoes}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </React.Fragment>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
