import { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    TextField,
    IconButton,
    Tooltip,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Alert
} from '@mui/material';
import { Edit, ExitToApp, Warning, Search } from '@mui/icons-material';
import type { InternacaoComPaciente } from '../../services/recepcao/internacao';
import { updateInternacao, darAltaPaciente } from '../../services/recepcao/internacao';

interface PacientesTableProps {
    internacoes: InternacaoComPaciente[];
    onUpdate: () => void;
}

export default function PacientesTable({ internacoes, onUpdate }: PacientesTableProps) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [editDialog, setEditDialog] = useState<{
        open: boolean;
        internacao: InternacaoComPaciente | null;
        convenio: string;
        quarto: string;
        leito: string;
    }>({
        open: false,
        internacao: null,
        convenio: '',
        quarto: '',
        leito: ''
    });
    const [altaDialog, setAltaDialog] = useState<{
        open: boolean;
        internacao: InternacaoComPaciente | null;
    }>({
        open: false,
        internacao: null
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const calcularIdade = (dataNascimento?: string): string => {
        if (!dataNascimento) return 'N/A';
        const hoje = new Date();
        const nascimento = new Date(dataNascimento);
        let idade = hoje.getFullYear() - nascimento.getFullYear();
        const mes = hoje.getMonth() - nascimento.getMonth();
        if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
            idade--;
        }
        return `${idade} anos`;
    };

    const formatarData = (data: string): string => {
        return new Date(data).toLocaleDateString('pt-BR');
    };

    const filteredInternacoes = internacoes.filter(int =>
        int.paciente?.nomeCompleto?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEdit = (internacao: InternacaoComPaciente) => {
        setEditDialog({
            open: true,
            internacao,
            convenio: internacao.convenio || '',
            quarto: internacao.quarto?.toString() || '',
            leito: internacao.leito || ''
        });
    };

    const handleSaveEdit = async () => {
        if (!editDialog.internacao) return;

        try {
            setLoading(true);
            setError(null);

            await updateInternacao(editDialog.internacao.identificador, {
                convenio: editDialog.convenio,
                quarto: parseInt(editDialog.quarto),
                leito: editDialog.leito
            });

            setEditDialog({ open: false, internacao: null, convenio: '', quarto: '', leito: '' });
            onUpdate();
        } catch (err) {
            console.error('Erro ao atualizar internação:', err);
            setError('Erro ao atualizar internação');
        } finally {
            setLoading(false);
        }
    };

    const handleAlta = (internacao: InternacaoComPaciente) => {
        setAltaDialog({ open: true, internacao });
    };

    const handleConfirmAlta = async () => {
        if (!altaDialog.internacao) return;

        try {
            setLoading(true);
            setError(null);

            await darAltaPaciente(altaDialog.internacao.identificador);

            setAltaDialog({ open: false, internacao: null });
            onUpdate();
        } catch (err) {
            console.error('Erro ao dar alta:', err);
            setError('Erro ao dar alta ao paciente');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" fontWeight={600}>
                        Pacientes Internados
                    </Typography>
                    <TextField
                        size="small"
                        placeholder="Buscar paciente..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                        }}
                        sx={{ width: 300 }}
                    />
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'rgba(102, 126, 234, 0.05)' }}>
                                <TableCell sx={{ fontWeight: 600 }}>Paciente</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Idade</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Documento</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Médico</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Quarto</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Leito</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Convênio</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Data Internação</TableCell>
                                <TableCell sx={{ fontWeight: 600 }} align="center">Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredInternacoes
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((internacao) => (
                                    <TableRow
                                        key={internacao.identificador}
                                        sx={{
                                            '&:nth-of-type(odd)': { bgcolor: 'rgba(0,0,0,0.02)' },
                                            '&:hover': { bgcolor: 'rgba(102, 126, 234, 0.08)' },
                                            transition: 'background-color 0.2s ease'
                                        }}
                                    >
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Tooltip title={internacao.paciente?.comorbidades || 'Sem comorbidades'}>
                                                    <Typography fontWeight={500}>
                                                        {internacao.paciente?.nomeCompleto || 'N/A'}
                                                    </Typography>
                                                </Tooltip>
                                                {internacao.paciente?.alergias && (
                                                    <Chip
                                                        icon={<Warning />}
                                                        label="Alergia"
                                                        size="small"
                                                        color="warning"
                                                        sx={{ height: 20 }}
                                                    />
                                                )}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            {calcularIdade(internacao.paciente?.dataDeNascimento)}
                                        </TableCell>
                                        <TableCell>
                                            {internacao.paciente?.documentoRegistro || 'N/A'}
                                        </TableCell>
                                        <TableCell>
                                            <Tooltip title={
                                                internacao.medico?.registroProfissional && internacao.medico?.numeroRegistro
                                                    ? `${internacao.medico.registroProfissional}: ${internacao.medico.numeroRegistro}`
                                                    : 'Sem registro'
                                            }>
                                                <Typography variant="body2">
                                                    {internacao.medico?.nomeCompleto || 'N/A'}
                                                </Typography>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell>{internacao.quarto || 'N/A'}</TableCell>
                                        <TableCell>{internacao.leito || 'N/A'}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={internacao.convenio || 'N/A'}
                                                size="small"
                                                sx={{
                                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                    color: 'white',
                                                    fontWeight: 500
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>{formatarData(internacao.createdAt)}</TableCell>
                                        <TableCell align="center">
                                            <Tooltip title="Editar">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleEdit(internacao)}
                                                    sx={{
                                                        color: '#2196F3',
                                                        '&:hover': { bgcolor: 'rgba(33, 150, 243, 0.1)' }
                                                    }}
                                                >
                                                    <Edit fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Dar Alta">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleAlta(internacao)}
                                                    sx={{
                                                        color: '#f44336',
                                                        '&:hover': { bgcolor: 'rgba(244, 67, 54, 0.1)' }
                                                    }}
                                                >
                                                    <ExitToApp fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    component="div"
                    count={filteredInternacoes.length}
                    page={page}
                    onPageChange={(_, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(e) => {
                        setRowsPerPage(parseInt(e.target.value, 10));
                        setPage(0);
                    }}
                    labelRowsPerPage="Linhas por página:"
                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                />
            </CardContent>

            {/* Edit Dialog */}
            <Dialog open={editDialog.open} onClose={() => setEditDialog({ open: false, internacao: null, convenio: '', quarto: '', leito: '' })} maxWidth="sm" fullWidth>
                <DialogTitle>Editar Internação</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        <TextField
                            label="Convênio"
                            value={editDialog.convenio}
                            onChange={(e) => setEditDialog({ ...editDialog, convenio: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            label="Quarto"
                            type="number"
                            value={editDialog.quarto}
                            onChange={(e) => setEditDialog({ ...editDialog, quarto: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            label="Leito"
                            value={editDialog.leito}
                            onChange={(e) => setEditDialog({ ...editDialog, leito: e.target.value })}
                            fullWidth
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialog({ open: false, internacao: null, convenio: '', quarto: '', leito: '' })}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSaveEdit} variant="contained" disabled={loading}>
                        {loading ? 'Salvando...' : 'Salvar'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Alta Dialog */}
            <Dialog open={altaDialog.open} onClose={() => setAltaDialog({ open: false, internacao: null })}>
                <DialogTitle>Confirmar Alta</DialogTitle>
                <DialogContent>
                    <Typography>
                        Deseja realmente dar alta ao paciente <strong>{altaDialog.internacao?.paciente?.nomeCompleto}</strong>?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAltaDialog({ open: false, internacao: null })}>
                        Cancelar
                    </Button>
                    <Button onClick={handleConfirmAlta} variant="contained" color="error" disabled={loading}>
                        {loading ? 'Processando...' : 'Confirmar Alta'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
}
