import { useEffect, useState } from "react";
import { Box, CircularProgress, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

// Components
import DashboardHeader from "@/components/medico/DashboardHeader";
import { SystemHeader, SystemFooter } from "@/components/layout";
import MetricsCards from "@/components/medico/MetricsCards";
import TabelaPacientes from "@/components/enfermagem/TabelaPacientes"; // Novo componente

// Services (Enfermagem)
import { getHospitalizedPatients, type PatientListItem } from "@/services/enfermagem/patients";
import { createPrescription, getTodayPrescription } from "@/services/enfermagem/prescricao";

export default function EnfermagemPage() {
    const navigate = useNavigate();
    const { user } = useAuth();

    // States
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [patients, setPatients] = useState<PatientListItem[]>([]);

    useEffect(() => {
        loadDashboardData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const loadDashboardData = async () => {
        if (!user?.id) return;

        try {
            setLoading(true);
            const patientsData = await getHospitalizedPatients(); // Busca todos, com nomes dos médicos
            setPatients(patientsData);
        } catch (err) {
            console.error("Erro ao carregar dados:", err);
            setError("Não foi possível carregar os dados do dashboard.");
        } finally {
            setLoading(false);
        }
    };

    const createAndRedirect = async (patient: PatientListItem, startDate: Date) => {
        if (!user) return;

        try {
            // Criar nova prescrição de enfermagem
            const newPrescription = await createPrescription({
                usuario: user.id, // Enfermeiro logado
                paciente: patient.codigo,
                internacao: patient.identificadorInternacao,
                medicoAssistente: patient.idColaboradorMedico, // ID da tabela colaboradores (FK)
                dataPrescricao: startDate.toISOString(),
            });

            console.log('✅ Prescrição de enfermagem criada:', newPrescription);

            // Redirecionar para a página de prescrição de enfermagem
            navigate(`/prescricao-enfermagem?paciente=${patient.codigo}&prescricao=${newPrescription.id}`);

        } catch (err) {
            console.error("❌ Erro ao criar prescrição:", err);
            alert("Erro ao criar prescrição. Tente novamente.");
        }
    };

    const handleNewPrescriptionClick = async (patient: PatientListItem) => {
        try {
            // Verificar se existe prescrição de enfermagem para hoje
            const todayPrescription = await getTodayPrescription(patient.codigo);

            if (todayPrescription) {
                navigate(`/prescricao-enfermagem?paciente=${patient.codigo}&prescricao=${todayPrescription.id}`);
            } else {
                await createAndRedirect(patient, new Date());
            }
        } catch (error) {
            console.error("Erro ao verificar prescrição:", error);
            alert("Erro ao verificar status da prescrição.");
        }
    };

    if (loading) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                bgcolor: '#fafafa'
            }}>
                <CircularProgress size={40} />
            </Box>
        );
    }

    return (
        <Box sx={{
            bgcolor: '#fafafa',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
        }}>
            <SystemHeader />

            <Box sx={{
                flex: 1,
                py: 2.5,
                px: 2,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start'
            }}>
                <Box sx={{ width: '100%', maxWidth: '1100px' }}> {/* Aumentei um pouco a largura para a tabela nova */}
                    {error && (
                        <Alert
                            severity="error"
                            sx={{
                                mb: 1.5,
                                borderRadius: 1.5,
                                boxShadow: 'none',
                                border: '1px solid #fee2e2'
                            }}
                        >
                            {error}
                        </Alert>
                    )}

                    {/* Header */}
                    <Box sx={{
                        bgcolor: 'transparent',
                        borderRadius: 1.5,
                        p: 2,
                        mb: 1.5,
                        boxShadow: 'none',
                        border: 'none'
                    }}>
                        <DashboardHeader />
                    </Box>


                    {/* Metrics Cards */}
                    <Box sx={{
                        bgcolor: 'white',
                        borderRadius: 1.5,
                        p: 2,
                        mb: 1.5,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                        border: '1px solid #f0f0f0'
                    }}>
                        <MetricsCards />
                    </Box>

                    {/* Patients Table (Separada) */}
                    <Box sx={{
                        bgcolor: 'white',
                        borderRadius: 1.5,
                        p: 2,
                        mb: 1.5,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                        border: '1px solid #f0f0f0'
                    }}>
                        <TabelaPacientes
                            patients={patients}
                            onNewPrescription={handleNewPrescriptionClick}
                        />
                    </Box>
                </Box>
            </Box>
            <SystemFooter />
        </Box>
    );
}
