import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { Typography, Box, CircularProgress, Alert, Fab, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import PrintIcon from '@mui/icons-material/Print';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import PrescricaoHeader from "@/components/prescricao/PrescricaoHeader";
import PrescricaoItemsTable from "@/components/prescricao/PrescricaoItemsTable";
import AddItemForm from "@/components/prescricao/AddItemForm";
import PrescricaoPrintTemplate from "@/components/prescricao/PrescricaoPrintTemplate";
import { SystemHeader, SystemFooter } from "@/components/layout";
import {
    getPrescricaoById,
    getPacienteByPrescricao,
    getInternacaoByPaciente,
    getInternacaoById,
    getItensPrescricao,
    updatePrescriptionStatus,
    swapItemOrder,
    deletePrescription,
    deletePrescriptionItem
} from "@/services/prescricao/prescricao";
import { supabase } from "@/config/supabase";
import { Colaborador } from "@/models/Schema";
import type { Prescricao, Paciente, Internacao, ItemPrescricao } from "@/types";
import { goBackPage } from '@/services/utils';

export default function PrescricaoPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const prescricaoId = searchParams.get('prescricao');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [finalizing, setFinalizing] = useState(false);

    const [prescricao, setPrescricao] = useState<Prescricao | null>(null);
    const [paciente, setPaciente] = useState<Paciente | null>(null);
    const [internacao, setInternacao] = useState<Internacao | null>(null);
    const [itens, setItens] = useState<ItemPrescricao[]>([]);
    const [medicoNome, setMedicoNome] = useState<string | null>(null);
    const [medicoRegistroProfissional, setMedicoRegistroProfissional] = useState<string | null>(null);
    const [medicoNumeroRegistro, setMedicoNumeroRegistro] = useState<string | null>(null);

    // Determines if Read-Only mode is active
    const isReadOnly = searchParams.get('cod') === '7456985' || prescricao?.status === 'finalizado';

    const loadData = useCallback(async () => {
        if (!prescricaoId) {
            setError('ID da prescrição não fornecido');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // 1. Buscar prescrição
            const prescricaoData = await getPrescricaoById(prescricaoId);
            if (!prescricaoData) {
                throw new Error('Prescrição não encontrada');
            }
            setPrescricao(prescricaoData);

            // 2. Buscar paciente
            const pacienteData = await getPacienteByPrescricao(prescricaoData.idPaciente);
            if (!pacienteData) {
                throw new Error('Paciente não encontrado');
            }
            setPaciente(pacienteData);

            // 3. Buscar internação
            let internacaoData: Internacao | null = null;
            if (prescricaoData.idInternacao) {
                internacaoData = await getInternacaoById(prescricaoData.idInternacao);
            } else {
                internacaoData = await getInternacaoByPaciente(pacienteData.codigo);
            }
            setInternacao(internacaoData);

            // 4. Buscar itens da prescrição
            const itensData = await getItensPrescricao(prescricaoId);
            setItens(itensData);

            // 5. Buscar dados do médico
            if (prescricaoData.identificadorMedico) {
                const { data: medicoData } = await supabase
                    .from(Colaborador.table)
                    .select('nome_completo, registro_profissional, numero_registro')
                    .eq(Colaborador.fields.identificadorUsuario, prescricaoData.identificadorMedico)
                    .single();

                if (medicoData) {
                    setMedicoNome(medicoData.nome_completo || null);
                    setMedicoRegistroProfissional(medicoData.registro_profissional || null);
                    setMedicoNumeroRegistro(medicoData.numero_registro || null);
                }
            }

        } catch (err) {
            console.error('Erro ao carregar dados:', err);
            setError(err instanceof Error ? err.message : 'Erro ao carregar dados da prescrição');
        } finally {
            setLoading(false);
        }
    }, [prescricaoId]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleItemAdded = useCallback(() => {
        // Recarregar itens após adicionar novo
        if (prescricaoId) {
            getItensPrescricao(prescricaoId).then(setItens);
        }
    }, [prescricaoId]);

    const handleFinalizePrescription = async () => {
        if (!prescricaoId) return;

        if (!window.confirm("Tem certeza que deseja finalizar esta prescrição?")) {
            return;
        }

        try {
            setFinalizing(true);
            await updatePrescriptionStatus(prescricaoId, 'finalizado');
            navigate('/medico');
        } catch (err) {
            console.error("Erro ao finalizar prescrição:", err);
            alert("Erro ao finalizar prescrição. Tente novamente.");
        } finally {
            setFinalizing(false);
        }
    };

    const handleReorder = async (index: number, direction: 'up' | 'down') => {
        if (isReadOnly) return;
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === itens.length - 1) return;

        const newItens = [...itens];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        const item1 = newItens[index];
        const item2 = newItens[targetIndex];

        // Otimisticamente atualizar a UI
        const ordem1 = item1.ordem;
        const ordem2 = item2.ordem;

        // Troca posições no array
        newItens[index] = { ...item2, ordem: ordem1 }; // item2 assume posição e ordem do item1
        newItens[targetIndex] = { ...item1, ordem: ordem2 }; // item1 assume posição e ordem do item2

        setItens(newItens);

        try {
            await swapItemOrder(item1, item2);
        } catch (err) {
            console.error("Erro ao reordenar itens:", err);
            alert("Erro ao reordenar itens.");
            // Reverter em caso de erro
            loadData();
        }
    };

    const [deleteConfirmationState, setDeleteConfirmationState] = useState<{ open: boolean; itemId: string | null }>({
        open: false,
        itemId: null
    });

    const handleRemoveItem = (idItem: string) => {
        if (isReadOnly) return;
        setDeleteConfirmationState({ open: true, itemId: idItem });
    };

    const confirmDelete = async () => {
        const { itemId } = deleteConfirmationState;
        if (!itemId) return;

        try {
            await deletePrescriptionItem(itemId);
            // Atualiza a lista após remover
            const updatedItens = itens.filter(item => item.idItem !== itemId);
            setItens(updatedItens);
            setDeleteConfirmationState({ open: false, itemId: null });
        } catch (error) {
            console.error('Erro ao remover item:', error);
            alert('Erro ao remover item da prescrição.');
        }
    };

    const [openConfirmBack, setOpenConfirmBack] = useState(false);

    const handleBack = () => {
        if (isReadOnly) {
            goBackPage();
        } else {
            setOpenConfirmBack(true);
        }
    };

    const handleConfirmExit = async () => {
        setOpenConfirmBack(false);
        if (prescricaoId && !isReadOnly && prescricao?.status !== 'finalizado') {
            try {
                await deletePrescription(prescricaoId);
            } catch (error) {
                console.error("Erro ao excluir prescrição ao voltar:", error);
            }
        }
        goBackPage();
    };

    if (loading) {
        return (
            <Box sx={{
                bgcolor: '#fafafa',
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <CircularProgress size={60} />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{
                bgcolor: '#fafafa',
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
                py: 4,
                px: 2
            }}>
                <Alert severity="error" sx={{ maxWidth: 600 }}>
                    <Typography variant="h6" gutterBottom>Erro</Typography>
                    <Typography>{error}</Typography>
                </Alert>
            </Box>
        );
    }

    if (!prescricao || !paciente) {
        return (
            <Box sx={{
                bgcolor: '#fafafa',
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
                py: 4,
                px: 2
            }}>
                <Alert severity="warning" sx={{ maxWidth: 600 }}>
                    <Typography>Dados não encontrados</Typography>
                </Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#fafafa' }}>
            <Box className="no-print">
                <SystemHeader />
            </Box>

            <Box sx={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                py: 2.5,
                px: 2,
                pb: (showAddForm && !isReadOnly) ? 40 : 12
            }}>
                <Box className="no-print" sx={{ width: '100%', maxWidth: '900px' }}>
                    <Typography

                        fontSize={24}
                        fontWeight={500}
                        sx={{ mb: 1.5, color: '#383838ff', textAlign: 'center', marginTop: '20px', marginBottom: '30px' }}
                    >
                        Prescrição Médica
                        {isReadOnly && (
                            <Box component="span" sx={{ ml: 2, fontSize: 14, color: 'text.secondary', fontWeight: 400, bgcolor: '#eee', px: 1, py: 0.5, borderRadius: 1 }}>
                                (Modo Visualização)
                            </Box>
                        )}
                    </Typography>

                    <Button
                        onClick={handleBack}
                        variant='text'
                        sx={{ mb: 2, mt: 2, fontSize: 16, fontWeight: 500, color: '#8b8b8bff' }}
                    >
                        <ArrowBackIcon sx={{ fontSize: 16, marginRight: 1 }} />
                        Voltar
                    </Button>



                    {/* Cabeçalho com dados do paciente e prescrição */}
                    <PrescricaoHeader
                        paciente={paciente}
                        prescricao={prescricao}
                        internacao={internacao}
                    />

                    {/* Tabela de itens */}
                    <PrescricaoItemsTable
                        itens={itens}
                        onReorder={isReadOnly ? undefined : handleReorder}
                        onRemove={isReadOnly ? undefined : handleRemoveItem}
                        readOnly={isReadOnly}
                    />

                    {/* Formulário fixo para adicionar itens */}
                    {!isReadOnly && (
                        <AddItemForm
                            prescricaoId={prescricao.identificador}
                            onItemAdded={handleItemAdded}
                            isVisible={showAddForm}
                            onToggleVisibility={() => setShowAddForm(!showAddForm)}
                        />
                    )}

                    {/* FAB Finalizar Prescrição */}
                    {!isReadOnly && (
                        <Fab
                            color="success"
                            onClick={handleFinalizePrescription}
                            disabled={finalizing}
                            sx={{
                                position: 'fixed',
                                bottom: 160, // Acima do botão de imprimir (96 + 56 + 8)
                                right: 24,
                                zIndex: 1100,
                                boxShadow: '0 4px 12px rgba(46, 125, 50, 0.3)'
                            }}
                        >
                            <CheckCircleIcon />
                        </Fab>
                    )}

                    {/* Botão de Imprimir */}
                    <Fab
                        color="secondary"
                        onClick={() => window.print()}
                        sx={{
                            position: 'fixed',
                            bottom: 96, // Acima do botão de adicionar (24 + 56 + 16)
                            right: 24,
                            zIndex: 1100,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                        }}
                    >
                        <PrintIcon />
                    </Fab>
                </Box>

                {/* Template de Impressão (invisível na tela) */}
                <PrescricaoPrintTemplate
                    paciente={paciente}
                    prescricao={prescricao}
                    internacao={internacao}
                    itens={itens}
                    medicoNome={medicoNome}
                    medicoRegistroProfissional={medicoRegistroProfissional}
                    medicoNumeroRegistro={medicoNumeroRegistro}
                />

                {/* Dialog de Confirmação de Saída */}
                <Dialog
                    open={openConfirmBack}
                    onClose={() => setOpenConfirmBack(false)}
                    PaperProps={{
                        sx: {
                            borderRadius: 3,
                            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                            p: 2
                        }
                    }}
                >
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 2 }}>
                        <Box sx={{
                            bgcolor: '#fff0f0',
                            borderRadius: '50%',
                            p: 2,
                            mb: 2,
                            display: 'flex',
                            width: 64,
                            height: 64,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <ErrorOutlineIcon sx={{ fontSize: 32, color: 'error.main' }} />
                        </Box>
                        <DialogTitle sx={{ p: 0, mb: 1, fontWeight: 600 }}>
                            Cancelar prescrição?
                        </DialogTitle>
                    </Box>
                    <DialogContent>
                        <DialogContentText sx={{ textAlign: 'center', color: 'text.secondary' }}>
                            Tem certeza que deseja voltar? A prescrição atual será excluída e todos os dados perdidos.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 2, justifyContent: 'center', gap: 1 }}>
                        <Button
                            onClick={() => setOpenConfirmBack(false)}
                            variant="outlined"
                            color="inherit"
                            sx={{ borderRadius: 2, px: 3, textTransform: 'none', fontWeight: 500 }}
                        >
                            Continuar Editando
                        </Button>
                        <Button
                            onClick={handleConfirmExit}
                            variant="contained"
                            color="error"
                            disableElevation
                            sx={{ borderRadius: 2, px: 3, textTransform: 'none', fontWeight: 600 }}
                        >
                            Sair e Excluir
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Dialog de Confirmação de Exclusão de Item */}
                <Dialog
                    open={deleteConfirmationState.open}
                    onClose={() => setDeleteConfirmationState({ open: false, itemId: null })}
                    PaperProps={{
                        sx: {
                            borderRadius: 3,
                            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                            p: 2,
                            maxWidth: 320
                        }
                    }}
                >
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 2 }}>
                        <Box sx={{
                            bgcolor: '#fff0f0',
                            borderRadius: '50%',
                            p: 2,
                            mb: 2,
                            display: 'flex',
                            width: 64,
                            height: 64,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <DeleteOutlineIcon sx={{ fontSize: 32, color: 'error.main' }} />
                        </Box>
                        <DialogTitle sx={{ p: 0, mb: 1, fontWeight: 600 }}>
                            Remover item?
                        </DialogTitle>
                    </Box>
                    <DialogContent>
                        <DialogContentText sx={{ textAlign: 'center', color: 'text.secondary' }}>
                            Tem certeza que deseja remover este medicamento da prescrição?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 2, justifyContent: 'center', gap: 1 }}>
                        <Button
                            onClick={() => setDeleteConfirmationState({ open: false, itemId: null })}
                            variant="outlined"
                            color="inherit"
                            sx={{ borderRadius: 2, px: 3, textTransform: 'none', fontWeight: 500 }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={confirmDelete}
                            variant="contained"
                            color="error"
                            disableElevation
                            sx={{ borderRadius: 2, px: 3, textTransform: 'none', fontWeight: 600 }}
                        >
                            Remover
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
            <Box className="no-print">
                <SystemFooter />
            </Box>
        </Box>
    );
}
