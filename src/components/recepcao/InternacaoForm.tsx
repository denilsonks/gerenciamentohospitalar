import { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Autocomplete,
    CircularProgress,
    Alert
} from '@mui/material';
import { Save, Person, Business, Hotel, Bed, LocalHospital } from '@mui/icons-material';
import { getAllPacientesNaoInternados } from '../../services/recepcao/pacientes';
import { createInternacao } from '../../services/recepcao/internacao';
import { getMedicos } from '../../services/recepcao/colaboradores';
import type { Paciente, Colaborador } from '../../types';

interface InternacaoFormProps {
    onSuccess: () => void;
}

export default function InternacaoForm({ onSuccess }: InternacaoFormProps) {
    const [pacientes, setPacientes] = useState<Paciente[]>([]);
    const [medicos, setMedicos] = useState<Colaborador[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingPacientes, setLoadingPacientes] = useState(true);
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
        loadPacientes();
        loadMedicos();
    }, []);

    const loadPacientes = async () => {
        try {
            setLoadingPacientes(true);
            const data = await getAllPacientesNaoInternados();
            setPacientes(data);
        } catch (err) {
            console.error('Erro ao carregar pacientes:', err);
            setError('Erro ao carregar lista de pacientes');
        } finally {
            setLoadingPacientes(false);
        }
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

            // Recarregar lista de pacientes
            await loadPacientes();

            // Notificar sucesso
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
        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ p: 4 }}>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mb: 3 }}>
                        Internação criada com sucesso!
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                    <Autocomplete
                        options={pacientes}
                        getOptionLabel={(option) =>
                            `${option.nomeCompleto}${option.documentoRegistro ? ` - ${option.documentoRegistro}` : ''}`
                        }
                        value={formData.paciente}
                        onChange={(_, newValue) => setFormData({ ...formData, paciente: newValue })}
                        loading={loadingPacientes}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Paciente"
                                required
                                InputProps={{
                                    ...params.InputProps,
                                    startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />,
                                    endAdornment: (
                                        <>
                                            {loadingPacientes ? <CircularProgress size={20} /> : null}
                                            {params.InputProps.endAdornment}
                                        </>
                                    ),
                                }}
                            />
                        )}
                        sx={{ mb: 3 }}
                    />

                    <Autocomplete
                        options={medicos}
                        getOptionLabel={(option) => option.nomeCompleto}
                        value={formData.medico}
                        onChange={(_, newValue) => setFormData({ ...formData, medico: newValue })}
                        loading={loadingMedicos}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Médico Responsável"
                                required
                                InputProps={{
                                    ...params.InputProps,
                                    startAdornment: <LocalHospital sx={{ mr: 1, color: 'text.secondary' }} />,
                                    endAdornment: (
                                        <>
                                            {loadingMedicos ? <CircularProgress size={20} /> : null}
                                            {params.InputProps.endAdornment}
                                        </>
                                    ),
                                }}
                            />
                        )}
                        sx={{ mb: 3 }}
                    />

                    <TextField
                        fullWidth
                        label="Convênio"
                        value={formData.convenio}
                        onChange={(e) => setFormData({ ...formData, convenio: e.target.value })}
                        required
                        placeholder="Ex: SUS, Unimed, Particular"
                        InputProps={{
                            startAdornment: <Business sx={{ mr: 1, color: 'text.secondary' }} />
                        }}
                        sx={{ mb: 3 }}
                    />

                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
                        <TextField
                            label="Quarto"
                            type="number"
                            value={formData.quarto}
                            onChange={(e) => setFormData({ ...formData, quarto: e.target.value })}
                            required
                            InputProps={{
                                startAdornment: <Hotel sx={{ mr: 1, color: 'text.secondary' }} />
                            }}
                        />

                        <TextField
                            label="Leito"
                            value={formData.leito}
                            onChange={(e) => setFormData({ ...formData, leito: e.target.value })}
                            required
                            placeholder="Ex: A, B, 01"
                            InputProps={{
                                startAdornment: <Bed sx={{ mr: 1, color: 'text.secondary' }} />
                            }}
                        />
                    </Box>

                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        fullWidth
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                        sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            py: 1.5,
                            borderRadius: 2,
                            fontWeight: 600,
                            '&:hover': {
                                background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)'
                            },
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {loading ? 'Salvando...' : 'Cadastrar Internação'}
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
}
