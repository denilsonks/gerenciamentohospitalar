import { useState, useEffect, useMemo } from 'react';
import {
    Box,
    TextField,
    Button,
    Autocomplete,
    CircularProgress,
    Alert,
    Typography,
    debounce,
    MenuItem
} from '@mui/material';
import { Save, Person, Business, Hotel, Bed, LocalHospital } from '@mui/icons-material';
import { searchPacientes } from '../../services/recepcao/pacientes';
import { createInternacao } from '../../services/recepcao/internacao';
import { getMedicos } from '../../services/recepcao/colaboradores';
import type { Paciente, Colaborador } from '../../types';

interface CompactInternacaoFormProps {
    onSuccess: () => void;
}

export default function CompactInternacaoForm({ onSuccess }: CompactInternacaoFormProps) {
    const [pacientes, setPacientes] = useState<Paciente[]>([]);
    const [medicos, setMedicos] = useState<Colaborador[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingPacientes, setLoadingPacientes] = useState(false);
    const [loadingMedicos, setLoadingMedicos] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        paciente: null as Paciente | null,
        medico: null as Colaborador | null,
        convenio: '',
        quarto: '',
        leito: ''
    });

    useEffect(() => {
        loadMedicos();
    }, []);

    const searchPacienteDebounced = useMemo(
        () =>
            debounce(async (inputValue: string, callback: (results: Paciente[]) => void) => {
                try {
                    const data = await searchPacientes(inputValue);
                    callback(data);
                } catch (err) {
                    console.error('Erro ao buscar pacientes:', err);
                    callback([]);
                }
            }, 400),
        [],
    );

    const handlePacienteInputChange = (_: any, newInputValue: string) => {
        if (newInputValue.length < 3) {
            setPacientes([]);
            setLoadingPacientes(false);
            return;
        }

        setLoadingPacientes(true);
        searchPacienteDebounced(newInputValue, (results) => {
            setPacientes(results);
            setLoadingPacientes(false);
        });
    };

    const loadMedicos = async () => {
        try {
            setLoadingMedicos(true);
            const data = await getMedicos();
            setMedicos(data);
        } catch (err) {
            console.error('Erro ao carregar médicos:', err);
            setError('Erro ao carregar lista de médicos');
        } finally {
            setLoadingMedicos(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.paciente || !formData.medico || !formData.convenio || !formData.quarto || !formData.leito) {
            setError('Todos os campos são obrigatórios');
            return;
        }

        const quartoNum = parseInt(formData.quarto);
        if (isNaN(quartoNum) || quartoNum <= 0) {
            setError('Quarto deve ser um número válido');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            await createInternacao({
                identificadorPaciente: formData.paciente.codigo,
                convenio: formData.convenio,
                quarto: quartoNum,
                leito: formData.leito,
                identificadorUsuario: formData.medico.identificadorUsuario
            });

            setSuccess(true);
            setFormData({
                paciente: null,
                medico: null,
                convenio: '',
                quarto: '',
                leito: ''
            });
            setPacientes([]);
            onSuccess();
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error('Erro ao criar internação:', err);
            setError('Erro ao criar internação. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{
            bgcolor: 'white',
            borderRadius: 2,
            p: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
            border: '1px solid rgba(0,0,0,0.02)'
        }}>
            <Typography variant="subtitle2" fontWeight={600} color="#2d3748" sx={{ mb: 3 }}>
                Nova Internação
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>Internação criada!</Alert>}

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Autocomplete
                    options={pacientes}
                    getOptionLabel={(option) => option.nomeCompleto || ''}
                    isOptionEqualToValue={(option, value) => option.codigo === value.codigo}
                    filterOptions={(x) => x}
                    value={formData.paciente}
                    onChange={(_, newValue) => setFormData({ ...formData, paciente: newValue })}
                    onInputChange={handlePacienteInputChange}
                    loading={loadingPacientes}
                    noOptionsText="Digite para buscar..."
                    componentsProps={{
                        paper: {
                            sx: {
                                fontSize: '0.85rem',
                                py: 0.5
                            }
                        }
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Pesquisar Paciente"
                            size="small"
                            required
                            InputProps={{
                                ...params.InputProps,
                                style: { fontSize: '1rem' },
                                startAdornment: <Person sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />,
                                endAdornment: (
                                    <>
                                        {loadingPacientes ? <CircularProgress size={14} /> : null}
                                        {params.InputProps.endAdornment}
                                    </>
                                ),
                            }}
                            InputLabelProps={{ sx: { fontSize: '1rem' } }}
                        />
                    )}
                    sx={{ gridColumn: 'span 2' }}
                />

                <Autocomplete
                    options={medicos}
                    getOptionLabel={(option) => option.nomeCompleto}
                    isOptionEqualToValue={(option, value) => option.identificadorUsuario === value.identificadorUsuario}
                    value={formData.medico}
                    onChange={(_, newValue) => setFormData({ ...formData, medico: newValue })}
                    loading={loadingMedicos}

                    componentsProps={{
                        paper: {
                            sx: {
                                fontSize: '0.85rem',
                                py: 0.5
                            }
                        }
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Médico"
                            size="small"
                            required
                            InputProps={{
                                ...params.InputProps,
                                style: { fontSize: '1rem' },
                                startAdornment: <LocalHospital sx={{ mr: 1, fontSize: 14, color: 'text.secondary' }} />,
                                endAdornment: (
                                    <>
                                        {loadingMedicos ? <CircularProgress size={14} /> : null}
                                        {params.InputProps.endAdornment}
                                    </>
                                ),
                            }}
                            InputLabelProps={{ sx: { fontSize: '1.10rem' } }}
                        />
                    )}
                    sx={{ gridColumn: 'span 2' }}
                />

                <TextField
                    select
                    label="Convênio"
                    size="small"
                    value={formData.convenio}
                    onChange={(e) => setFormData({ ...formData, convenio: e.target.value })}
                    required
                    InputProps={{
                        style: { fontSize: '1rem' },
                        startAdornment: <Business sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                    }}
                    InputLabelProps={{ sx: { fontSize: '1.10rem' } }}
                    sx={{ gridColumn: 'span 2' }}
                >
                    <MenuItem value="SUS" sx={{ fontSize: '0.75rem' }}>SUS</MenuItem>
                    <MenuItem value="UNIMED" sx={{ fontSize: '0.75rem' }}>UNIMED</MenuItem>
                    <MenuItem value="IPE" sx={{ fontSize: '0.75rem' }}>IPE</MenuItem>
                    <MenuItem value="PARTICULAR" sx={{ fontSize: '0.75rem' }}>PARTICULAR</MenuItem>
                </TextField>

                <TextField
                    label="Quarto"
                    type="number"
                    size="small"
                    value={formData.quarto}
                    onChange={(e) => setFormData({ ...formData, quarto: e.target.value })}
                    required
                    InputProps={{
                        style: { fontSize: '1rem' },
                        startAdornment: <Hotel sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                    }}
                    InputLabelProps={{ sx: { fontSize: '1.10    rem' } }}
                />

                <TextField
                    label="Leito"
                    size="small"
                    value={formData.leito}
                    onChange={(e) => setFormData({ ...formData, leito: e.target.value })}
                    required
                    InputProps={{
                        style: { fontSize: '1rem' },
                        startAdornment: <Bed sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                    }}
                    InputLabelProps={{ sx: { fontSize: '1.10rem' } }}
                />
            </Box>

            <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                startIcon={loading ? <CircularProgress size={14} color="inherit" /> : <Save sx={{ fontSize: 18 }} />}
                sx={{
                    mt: 3,
                    bgcolor: '#667eea',
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    boxShadow: 'none',
                    py: 1,
                    '&:hover': {
                        bgcolor: '#5a67d8',
                        boxShadow: '0 4px 12px rgba(90, 103, 216, 0.3)'
                    }
                }}
            >
                {loading ? 'Salvando...' : 'Confirmar Internação'}
            </Button>
        </Box>
    );
}
