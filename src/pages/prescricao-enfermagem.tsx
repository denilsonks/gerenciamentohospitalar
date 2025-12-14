
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { Typography, Box, CircularProgress, Alert, Fab, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import PrintIcon from '@mui/icons-material/Print';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';


// Components
import PrescricaoHeader from "@/components/prescricao/PrescricaoHeader";
import TabelaItensPrescricao from "@/components/enfermagem/TabelaItensPrescricao";
import FormularioItemEnfermagem from "@/components/enfermagem/FormularioItem";
import PrescricaoEnfermagemPrint from "@/components/enfermagem/PrescricaoEnfermagemPrint";
import { SystemHeader, SystemFooter } from "@/components/layout";

// Services (Enfermagem)
import {
    getPrescricaoById,
    updatePrescription
} from "@/services/enfermagem/prescricao";

// Services (Compartilhados - Paciente/Internacao)
import { getPacienteByPrescricao, getInternacaoByPaciente, getInternacaoById } from "@/services/prescricao/prescricao";
import { supabase } from "@/config/supabase";
import { Colaborador } from "@/models/Schema";
import { goBackPage } from '@/services/utils';

// Types
import type { Prescricao, Paciente, Internacao, ItemPrescricao, PrescricaoEnfermagem } from "@/types";

export default function PrescricaoEnfermagemPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const prescricaoId = searchParams.get('prescricao');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);


    const [prescricao, setPrescricao] = useState<PrescricaoEnfermagem | null>(null);
    const [paciente, setPaciente] = useState<Paciente | null>(null);
    const [internacao, setInternacao] = useState<Internacao | null>(null);
    const [itens, setItens] = useState<ItemPrescricao[]>([]);
    const [medicoNome, setMedicoNome] = useState<string | null>(null);

    // Determines if Read-Only mode is active (não tem campo status ainda, mas se tivesse...)
    const isReadOnly = searchParams.get('cod') === '7456985';

    const loadData = useCallback(async () => {
        if (!prescricaoId) {
            setError('ID da prescrição não fornecido');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // 1. Buscar prescrição de enfermagem
            const prescricaoData = await getPrescricaoById(prescricaoId);
            if (!prescricaoData) {
                throw new Error('Prescrição de enfermagem não encontrada');
            }
            setPrescricao(prescricaoData);

            // Parse Itens
            let parsedItens: ItemPrescricao[] = [];
            try {
                if (prescricaoData.item) {
                    // Check if it's already an array or string
                    parsedItens = typeof prescricaoData.item === 'string'
                        ? JSON.parse(prescricaoData.item)
                        : prescricaoData.item;
                }
            } catch (e) {
                console.error("Erro ao parsear itens:", e);
                parsedItens = [];
            }
            setItens(parsedItens);

            // 2. Buscar paciente
            const pacienteData = await getPacienteByPrescricao(prescricaoData.paciente);
            if (!pacienteData) {
                throw new Error('Paciente não encontrado');
            }
            setPaciente(pacienteData);

            // 3. Buscar internação
            let internacaoData: Internacao | null = null;
            if (prescricaoData.internacao) {
                internacaoData = await getInternacaoById(prescricaoData.internacao);
            } else {
                internacaoData = await getInternacaoByPaciente(pacienteData.codigo);
            }
            setInternacao(internacaoData);

            // 4. Buscar dados do médico assistente (se houver)
            // Se médicoAssistente estiver preenchido na prescrição, usa ele. Senão tenta da internação.
            const medicoId = prescricaoData.medicoAssistente || internacaoData?.identificadorUsuario;

            if (medicoId) {
                const { data: medicoData } = await supabase
                    .from(Colaborador.table)
                    .select('nome_completo, numero_registro')
                    .eq(Colaborador.fields.identificadorUsuario, medicoId)
                    .single();

                if (medicoData) {
                    setMedicoNome(medicoData.nome_completo || null);
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


    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleSaveItem = async (newItem: any) => {
        if (!prescricao) return;

        const updatedItens = [...itens, newItem];

        try {
            await updatePrescription(prescricao.id, {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                item: updatedItens as any
            });
            // Atualiza estado local para refletir imediatamente
            setItens(updatedItens);
        } catch (err) {
            console.error("Erro ao salvar item:", err);
            alert("Erro ao salvar item na prescrição.");
        }
    };

    // Reorder itens localmente e salva o array inteiro
    const handleReorder = async (index: number, direction: 'up' | 'down') => {
        if (isReadOnly || !prescricao) return;
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === itens.length - 1) return;

        const newItens = [...itens];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        const itemMoved = newItens[index];
        newItens.splice(index, 1);
        newItens.splice(targetIndex, 0, itemMoved);

        setItens(newItens); // Otimista

        try {
            await updatePrescription(prescricao.id, {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                item: newItens as any
            });
        } catch (err) {
            console.error("Erro ao reordenar itens:", err);
            alert("Erro ao reordenar itens.");
            loadData(); // Reverte
        }
    };

    // Remover item e salvar array
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
        if (!itemId || !prescricao) return;

        const updatedItens = itens.filter(i => i.idItem !== itemId);
        setItens(updatedItens); // Otimista
        setDeleteConfirmationState({ open: false, itemId: null });

        try {
            await updatePrescription(prescricao.id, {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                item: updatedItens as any
            });
        } catch (error) {
            console.error('Erro ao remover item:', error);
            alert('Erro ao remover item da prescrição.');
            loadData();
        }
    };


    const handleFinalizePrescription = async () => {
        if (!window.confirm("Deseja sair da prescrição?")) return;
        navigate('/enfermagem');
    };

    const handleBack = () => {
        if (isReadOnly) {
            goBackPage();
        } else {

            goBackPage();
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#fafafa' }}>
                <CircularProgress size={60} />
            </Box>
        );
    }

    if (error || !prescricao || !paciente) {
        return (
            <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
                <Alert severity="error">{error || 'Dados não encontrados'}</Alert>
            </Box>
        );
    }

    // Adaptar prescricaoEnfermagem para Header (que espera Prescricao)
    const prescricaoForHeader: Prescricao = {
        identificador: prescricao.id,
        createdAt: prescricao.createdAt,
        identificadorMedico: prescricao.medicoAssistente || '', // Usado p/ fetch nome se nao tiver na internação
        idPaciente: prescricao.paciente,
        dataPrescricao: prescricao.dataPrescricao || new Date().toISOString().split('T')[0],
        // Campos opcionais
    };

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
                        sx={{ color: '#383838ff', textAlign: 'center', mt: '20px', mb: '30px' }}
                    >
                        Prescrição de Enfermagem
                        {isReadOnly && (
                            <Box component="span" sx={{ ml: 2, fontSize: 14, color: 'text.secondary', bgcolor: '#eee', px: 1, py: 0.5, borderRadius: 1 }}>
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

                    <PrescricaoHeader
                        paciente={paciente}
                        prescricao={prescricaoForHeader}
                        internacao={internacao}
                    />

                    <TabelaItensPrescricao
                        itens={itens}
                        onReorder={isReadOnly ? undefined : handleReorder}
                        onRemove={isReadOnly ? undefined : handleRemoveItem}
                        readOnly={isReadOnly}
                    />

                    {!isReadOnly && (
                        <FormularioItemEnfermagem
                            prescricaoId={prescricao.id}
                            onSaveItem={handleSaveItem}
                            isVisible={showAddForm}
                            onToggleVisibility={() => setShowAddForm(!showAddForm)}
                        />
                    )}

                    {!isReadOnly && (
                        <Fab
                            color="success"
                            onClick={handleFinalizePrescription}

                            sx={{
                                position: 'fixed',
                                bottom: 160,
                                right: 24,
                                zIndex: 1100,
                                boxShadow: '0 4px 12px rgba(46, 125, 50, 0.3)'
                            }}
                        >
                            <CheckCircleIcon />
                        </Fab>
                    )}

                    <Fab
                        color="secondary"
                        onClick={() => window.print()}
                        sx={{
                            position: 'fixed',
                            bottom: 96,
                            right: 24,
                            zIndex: 1100,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                        }}
                    >
                        <PrintIcon />
                    </Fab>
                </Box>

                <PrescricaoEnfermagemPrint
                    paciente={paciente}
                    prescricao={prescricaoForHeader}
                    internacao={internacao}
                    itens={itens}
                    medicoNome={medicoNome}
                />

                <Dialog
                    open={deleteConfirmationState.open}
                    onClose={() => setDeleteConfirmationState({ open: false, itemId: null })}
                    PaperProps={{ sx: { p: 2, maxWidth: 240, borderRadius: 3 } }}
                >
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 2 }}>
                        <Box sx={{ bgcolor: '#fff0f0', borderRadius: '50%', p: 2, mb: 2 }}>
                            <DeleteOutlineIcon sx={{ fontSize: 32, color: 'error.main' }} />
                        </Box>
                        <DialogTitle sx={{ p: 0, mb: 1, fontWeight: 600 }}>Remover item?</DialogTitle>
                    </Box>
                    <DialogContent>
                        <DialogContentText sx={{ textAlign: 'center' }}>
                            Tem certeza que deseja remover este item da prescrição?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions sx={{ justifyContent: 'center' }}>
                        <Button onClick={() => setDeleteConfirmationState({ open: false, itemId: null })}>Cancelar</Button>
                        <Button onClick={confirmDelete} variant="contained" color="error">Remover</Button>
                    </DialogActions>
                </Dialog>
            </Box>
            <Box className="no-print">
                <SystemFooter />
            </Box>
        </Box>
    );
}
