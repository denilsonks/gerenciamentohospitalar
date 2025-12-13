import { useState, useEffect } from 'react';
import { Box, Paper, TextField, Autocomplete, Button, CircularProgress, Fab, Tooltip, Popper, FormControlLabel, Checkbox, IconButton, InputAdornment } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { getAllItensCuidado } from '@/services/enfermagem/prescricao';
import { calculateAprazamento } from '@/services/enfermagem/aprazamento';
import { inputStyles, formContainerStyles } from '@/styles/componentStyles';
import CareSelectionModal from './CareSelectionModal';
import type { ItemCuidado } from '@/types';

interface Props {
    prescricaoId: string;
    onSaveItem: (item: any) => Promise<void>;
    isVisible: boolean;
    onToggleVisibility: () => void;
}

const FREQUENCIAS = [
    '1 vez ao dia', '2 vezes ao dia (12/12h)', '3 vezes ao dia (8/8h)',
    '4 vezes ao dia (6/6h)', '6 vezes ao dia (4/4h)', 'A cada 4 horas',
    'A cada 6 horas', 'A cada 8 horas', 'A cada 12 horas', 'Uso contínuo', 'Se necessário'
];

// Custom Popper to force opening upwards
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PopperUp = (props: any) => {
    return <Popper {...props} placement="top-start" modifiers={[{ name: 'flip', enabled: false }]} />;
};

export default function FormularioItemEnfermagem({ prescricaoId, onSaveItem, isVisible, onToggleVisibility }: Props) {
    const [allItens, setAllItens] = useState<ItemCuidado[]>([]);
    const [filteredOptions, setFilteredOptions] = useState<ItemCuidado[]>([]);

    const [loadingItens, setLoadingItens] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formKey, setFormKey] = useState(0);

    const [inputValue, setInputValue] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const [itemSelecionado, setItemSelecionado] = useState<ItemCuidado | null>(null);
    const [frequencia, setFrequencia] = useState<string | null>(null);
    const [seNecessario, setSeNecessario] = useState(false);
    const [observacoes, setObservacoes] = useState('');
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        async function loadItens() {
            try {
                const data = await getAllItensCuidado();
                setAllItens(data);
            } catch (error) {
                console.error('Erro ao carregar itens de cuidado:', error);
            } finally {
                setLoadingItens(false);
            }
        }
        loadItens();
    }, []);

    useEffect(() => {
        if (!inputValue) {
            setFilteredOptions(allItens);
            return;
        }
        const term = inputValue.toLowerCase();
        const result = allItens.filter(item => item.nome.toLowerCase().includes(term));
        setFilteredOptions(result);
    }, [inputValue, allItens]);


    const limparFormulario = () => {
        setItemSelecionado(null);
        setFrequencia(null);
        setSeNecessario(false);
        setObservacoes('');
        setInputValue('');
        setIsDropdownOpen(false);
        setFormKey(prev => prev + 1);
    };

    const handleSubmit = async () => {
        if (!itemSelecionado || (!frequencia && !seNecessario)) {
            alert('Por favor, preencha o Cuidado e a Frequência (ou marque "Se necessário")');
            return;
        }

        setSaving(true);
        try {
            let horariosCalculados: string[] = [];
            if (frequencia && frequencia !== 'Se necessário' && !seNecessario) {
                horariosCalculados = await calculateAprazamento(prescricaoId, frequencia);
            }

            const newItem = {
                idItem: crypto.randomUUID(), // Gerar ID localmente
                createdAt: new Date().toISOString(),
                identificadorPrescricao: prescricaoId,
                produto: itemSelecionado.nome,
                // Campos removidos da UI mas mantidos (opcionalmente) na DB ou omitidos se não obrigatórios
                // Para enfermagem, não usamos quantidade, apresentacao, viaAdm
                frequencia: frequencia || undefined,
                seNecessario: seNecessario,
                horario: horariosCalculados.length > 0 ? horariosCalculados : undefined,
                observacoes: observacoes || undefined
            };

            await onSaveItem(newItem);

            limparFormulario();
        } catch (error) {
            console.error('Erro ao adicionar item:', error);
            alert('Erro ao adicionar item à prescrição');
        } finally {
            setSaving(false);
        }
    };

    const handleAddMultipleItems = async (items: ItemCuidado[]) => {
        if (items.length === 0) return;

        setSaving(true);
        try {
            // Add all selected items with default frequency
            for (const item of items) {
                const newItem = {
                    idItem: crypto.randomUUID(),
                    createdAt: new Date().toISOString(),
                    identificadorPrescricao: prescricaoId,
                    produto: item.nome,
                    frequencia: '1 vez ao dia', // Default frequency
                    seNecessario: false,
                    horario: await calculateAprazamento(prescricaoId, '1 vez ao dia'),
                    observacoes: undefined
                };
                await onSaveItem(newItem);
            }

            limparFormulario();
        } catch (error) {
            console.error('Erro ao adicionar itens:', error);
            alert('Erro ao adicionar itens à prescrição');
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <Tooltip title={isVisible ? "Fechar formulário" : "Adicionar item"} placement="left">
                <Fab
                    color="primary"
                    onClick={onToggleVisibility}
                    sx={{
                        position: 'fixed',
                        bottom: 24,
                        right: 24,
                        zIndex: 1100,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                        transition: 'transform 0.3s ease',
                        transform: isVisible ? 'rotate(45deg)' : 'rotate(0deg)'
                    }}
                >
                    <AddIcon />
                </Fab>
            </Tooltip>

            <Paper
                elevation={4}
                sx={{
                    ...formContainerStyles.paper,
                    transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
                    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    pb: 10
                }}
            >
                <Box sx={formContainerStyles.content}>
                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', mt: 1 }}>
                        <Box key={formKey} sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            <Box sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', md: '3fr 1.5fr' }, // Grid simplificado
                                gap: 1.5,
                                alignItems: 'start'
                            }}>
                                <Autocomplete
                                    value={itemSelecionado}
                                    onChange={(_, newValue) => {
                                        setItemSelecionado(newValue);
                                        if (newValue) {
                                            setInputValue(newValue.nome);
                                            setIsDropdownOpen(false);
                                        }
                                    }}
                                    inputValue={inputValue}
                                    onInputChange={(_, newInputValue, reason) => {
                                        if (reason === 'input') {
                                            setInputValue(newInputValue);
                                            setIsDropdownOpen(true);
                                        }
                                    }}
                                    options={filteredOptions}
                                    filterOptions={(x) => x}
                                    getOptionLabel={(option) => option.nome}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    loading={loadingItens}
                                    noOptionsText={inputValue ? 'Nenhum resultado' : 'Digite para buscar'}
                                    autoHighlight
                                    openOnFocus={false}
                                    open={isDropdownOpen && inputValue.length > 0 && filteredOptions.length > 0}
                                    disableListWrap
                                    slots={{ popper: PopperUp }}
                                    slotProps={{
                                        listbox: { sx: inputStyles.autocompleteListbox }
                                    }}
                                    renderOption={(props, option) => {
                                        const { key, ...restProps } = props;
                                        return (
                                            <li key={option.id} {...restProps}>
                                                {option.nome}
                                            </li>
                                        );
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Item de Cuidado"
                                            size="medium"
                                            InputLabelProps={{ sx: inputStyles.label }}
                                            InputProps={{
                                                ...params.InputProps,
                                                sx: inputStyles.input,
                                                endAdornment: (
                                                    <>
                                                        {loadingItens ? <CircularProgress size={20} /> : null}
                                                        {params.InputProps.endAdornment}
                                                    </>
                                                ),
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => setModalOpen(true)}
                                                            sx={{
                                                                color: '#667eea',
                                                                '&:hover': {
                                                                    bgcolor: 'rgba(102, 126, 234, 0.08)'
                                                                }
                                                            }}
                                                        >
                                                            <SearchIcon />
                                                        </IconButton>
                                                    </InputAdornment>
                                                )
                                            }}
                                            sx={inputStyles.textField}
                                        />
                                    )}
                                />

                                <Autocomplete
                                    value={frequencia}
                                    onChange={(_, newValue) => setFrequencia(newValue)}
                                    options={FREQUENCIAS}
                                    freeSolo
                                    slots={{ popper: PopperUp }}
                                    slotProps={{
                                        listbox: { sx: inputStyles.autocompleteListbox }
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Freq."
                                            size="medium"
                                            InputLabelProps={{ sx: inputStyles.label }}
                                            InputProps={{ ...params.InputProps, sx: inputStyles.input }}
                                            sx={inputStyles.textField}
                                        />
                                    )}
                                />
                            </Box>

                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                <TextField
                                    label="Observações"
                                    size="medium"
                                    fullWidth
                                    value={observacoes}
                                    onChange={(e) => setObservacoes(e.target.value)}
                                    placeholder="Informações adicionais"
                                    InputLabelProps={{ sx: inputStyles.label }}
                                    InputProps={{ sx: inputStyles.input }}
                                    sx={inputStyles.textField}
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={seNecessario}
                                            onChange={(e) => setSeNecessario(e.target.checked)}
                                            color="primary"
                                        />
                                    }
                                    label="Se necessário"
                                    componentsProps={{
                                        typography: { variant: 'body2', color: 'text.secondary' }
                                    }}
                                    sx={{ minWidth: 120, mr: 0 }}
                                />
                            </Box>
                        </Box>

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            disabled={saving}
                            sx={{
                                height: 'auto',
                                alignSelf: 'stretch',
                                minWidth: 40,
                                px: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            {saving ? (
                                <CircularProgress size={20} color="inherit" />
                            ) : (
                                <AddIcon />
                            )}
                        </Button>
                    </Box>
                </Box>
            </Paper>

            <CareSelectionModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onAddItems={handleAddMultipleItems}
                allCares={allItens}
            />
        </>
    );
}
