import { useState, useEffect } from 'react';
import { Box, Paper, TextField, Autocomplete, Button, CircularProgress, Fab, Tooltip, Popper, FormControlLabel, Checkbox } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { getAllInsumos, addItemPrescricao } from '@/services/prescricao/prescricao';
import { calculateAprazamento } from '@/services/prescricao/aprazamento';
import { inputStyles, formContainerStyles } from '@/styles/componentStyles';
import { filterInsumosByText } from '@/utils/filterInsumos';
import type { Insumo } from '@/types';

interface Props {
    prescricaoId: string;
    onItemAdded: () => void;
    isVisible: boolean;
    onToggleVisibility: () => void;
}

const VIAS_ADMINISTRACAO = [
    'Oral', 'Intravenosa', 'Intramuscular', 'Subcutânea', 'Tópica', 'Inalatória',
    'Retal', 'Sublingual', 'Oftálmica', 'Ótica', 'Nasal'
];

const APRESENTACOES = [
    'Comprimido', 'Ampola', 'Frasco', 'Envelope', 'Tubo', 'Bisnaga', 'Outros'
];

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

export default function AddItemForm({ prescricaoId, onItemAdded, isVisible, onToggleVisibility }: Props) {
    // Lista completa de insumos (carregada uma vez)
    const [allInsumos, setAllInsumos] = useState<Insumo[]>([]);
    // Lista filtrada (atualizada a cada digitação)
    const [filteredOptions, setFilteredOptions] = useState<Insumo[]>([]);

    const [loadingInsumos, setLoadingInsumos] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formKey, setFormKey] = useState(0);

    // Estado do input de texto
    const [inputValue, setInputValue] = useState('');
    // Estado para controlar se a lista está aberta
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Campos do formulário
    const [produtoSelecionado, setProdutoSelecionado] = useState<Insumo | null>(null);
    const [quantidade, setQuantidade] = useState('');
    const [apresentacao, setApresentacao] = useState<string | null>(null);
    const [frequencia, setFrequencia] = useState<string | null>(null);
    const [viaAdm, setViaAdm] = useState<string | null>(null);
    const [seNecessario, setSeNecessario] = useState(false);
    const [observacoes, setObservacoes] = useState('');

    // Carregar insumos uma vez
    useEffect(() => {
        async function loadInsumos() {
            try {
                const data = await getAllInsumos();
                setAllInsumos(data);
            } catch (error) {
                console.error('Erro ao carregar insumos:', error);
            } finally {
                setLoadingInsumos(false);
            }
        }
        loadInsumos();
    }, []);

    // ✅ FILTRAR A CADA DIGITAÇÃO - Chama a função externa
    useEffect(() => {
        const result = filterInsumosByText(allInsumos, inputValue);
        setFilteredOptions(result);
    }, [inputValue, allInsumos]);


    const limparFormulario = () => {
        setProdutoSelecionado(null);
        setQuantidade('');
        setApresentacao(null);
        setFrequencia(null);
        setViaAdm(null);
        setSeNecessario(false);
        setObservacoes('');
        setInputValue(''); // Limpar o texto de busca
        setIsDropdownOpen(false); // Fechar dropdown
        setFormKey(prev => prev + 1);
    };

    const handleSubmit = async () => {
        // Validação básica
        if (!produtoSelecionado || !quantidade || (!frequencia && !seNecessario)) {
            alert('Por favor, preencha os campos obrigatórios: Produto, Quantidade e Frequência (a menos que seja "Se necessário")');
            return;
        }

        setSaving(true);
        try {
            // Calcular aprazamento
            let horariosCalculados: string[] = [];
            if (frequencia && frequencia !== 'Se necessário' && !seNecessario) {
                horariosCalculados = await calculateAprazamento(prescricaoId, frequencia);
            }

            await addItemPrescricao({
                identificadorPrescricao: prescricaoId,
                produto: produtoSelecionado.nome,
                quantidade: Number(quantidade),
                apresentacao: apresentacao || undefined,
                frequencia: frequencia || undefined,
                viaAdm: viaAdm || undefined,
                seNecessario: seNecessario,
                horario: horariosCalculados.length > 0 ? horariosCalculados : undefined,
                observacoes: observacoes || undefined
            });

            limparFormulario();
            onItemAdded();
        } catch (error) {
            console.error('Erro ao adicionar item:', error);
            alert('Erro ao adicionar item à prescrição');
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            {/* Floating Action Button (FAB) */}
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

            {/* Form Container */}
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
                        {/* Formulário */}
                        <Box key={formKey} sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            {/* Linha Única: Produto, Qtd, Apresentação, Freq, Via */}
                            <Box sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', md: '2.5fr 0.6fr 1.1fr 1.8fr 0.8fr' },
                                gap: 1.5,
                                alignItems: 'start'
                            }}>
                                <Autocomplete
                                    value={produtoSelecionado}
                                    onChange={(_, newValue) => {
                                        setProdutoSelecionado(newValue);
                                        if (newValue) {
                                            setInputValue(newValue.nome);
                                            setIsDropdownOpen(false); // ✅ Fecha após selecionar
                                        }
                                    }}
                                    inputValue={inputValue}
                                    onInputChange={(_, newInputValue, reason) => {
                                        // Só atualiza se for digitação do usuário
                                        if (reason === 'input') {
                                            setInputValue(newInputValue);
                                            setIsDropdownOpen(true); // ✅ Abre quando digita
                                        }
                                    }}
                                    // ✅ USA A LISTA JÁ FILTRADA pelo useEffect
                                    options={filteredOptions}
                                    // ✅ DESABILITA o filtro interno do Autocomplete
                                    filterOptions={(x) => x}
                                    getOptionLabel={(option) => option.nome}
                                    // ✅ USA O ID PARA COMPARAR OPÇÕES (evita problemas com nomes iguais)
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    loading={loadingInsumos}
                                    noOptionsText={inputValue ? 'Nenhum resultado' : 'Digite para buscar'}
                                    autoHighlight
                                    openOnFocus={false}
                                    // ✅ USA O ESTADO isDropdownOpen para controlar abertura
                                    open={isDropdownOpen && inputValue.length > 0 && filteredOptions.length > 0}
                                    disableListWrap
                                    slots={{ popper: PopperUp }}
                                    slotProps={{
                                        listbox: { sx: inputStyles.autocompleteListbox }
                                    }}
                                    // ✅ RENDERIZA CADA OPÇÃO COM CHAVE ÚNICA (usando o ID)
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
                                            label="Produto"
                                            size="medium"
                                            InputLabelProps={{ sx: inputStyles.label }}
                                            InputProps={{
                                                ...params.InputProps,
                                                sx: inputStyles.input,
                                                endAdornment: (
                                                    <>
                                                        {loadingInsumos ? <CircularProgress size={20} /> : null}
                                                        {params.InputProps.endAdornment}
                                                    </>
                                                ),
                                            }}
                                            sx={inputStyles.textField}
                                        />
                                    )}
                                />
                                <TextField
                                    label="Qtd"
                                    type="number"
                                    size="medium"
                                    value={quantidade}
                                    onChange={(e) => setQuantidade(e.target.value)}
                                    inputProps={{ min: 0, step: 0.1 }}
                                    InputLabelProps={{ sx: inputStyles.label }}
                                    InputProps={{ sx: inputStyles.input }}
                                    sx={inputStyles.textField}
                                />
                                <Autocomplete
                                    value={apresentacao}
                                    onChange={(_, newValue) => setApresentacao(newValue)}
                                    options={APRESENTACOES}
                                    freeSolo
                                    slots={{ popper: PopperUp }}
                                    slotProps={{
                                        listbox: { sx: inputStyles.autocompleteListbox }
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Apresentação"
                                            placeholder="Ex: Comp."
                                            InputLabelProps={{ sx: inputStyles.label }}
                                            InputProps={{ ...params.InputProps, sx: inputStyles.input }}
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
                                <Autocomplete
                                    value={viaAdm}
                                    onChange={(_, newValue) => setViaAdm(newValue)}
                                    options={VIAS_ADMINISTRACAO}
                                    slots={{ popper: PopperUp }}
                                    slotProps={{
                                        listbox: { sx: inputStyles.autocompleteListbox }
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Via"
                                            size="medium"
                                            InputLabelProps={{ sx: inputStyles.label }}
                                            InputProps={{ ...params.InputProps, sx: inputStyles.input }}
                                            sx={inputStyles.textField}
                                        />
                                    )}
                                />
                            </Box>

                            {/* Linha 2: Observações */}
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

                        {/* Botão de Adicionar (Submit) */}
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
        </>
    );
}