import { useEffect, useState } from "react";
import { Box, CircularProgress, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";


// Components
import DashboardHeader from "@/components/medico/DashboardHeader";
import { SystemHeader, SystemFooter } from "@/components/layout";
import MetricsCards from "@/components/medico/MetricsCards";
import PatientsTable from "@/components/medico/PatientsTable";
import PrescriptionModal from "@/components/medico/PrescriptionModal";
import PrescriptionHistoryModal from "@/components/medico/PrescriptionHistoryModal";
import RemindersSection from "@/components/medico/RemindersSection";

// Services
// Services
import { getHospitalizedPatients, type PatientListItem } from "@/services/medico/patients";

import { createPrescription, getTodayPrescription } from "@/services/medico/prescriptions";

export default function MedicoPage() {
    const navigate = useNavigate();
    const { user } = useAuth();

    // States
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [patients, setPatients] = useState<PatientListItem[]>([]);

    // Modal State
    const [modalOpen, setModalOpen] = useState(false);
    const [historyModalOpen, setHistoryModalOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<PatientListItem | null>(null);
    const [creatingPrescription, setCreatingPrescription] = useState(false);

    useEffect(() => {
        loadDashboardData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const loadDashboardData = async () => {
        if (!user?.id) return;

        try {
            setLoading(true);
            const patientsData = await getHospitalizedPatients(user.id);

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
            setCreatingPrescription(true);

            console.log('🔍 Criando prescrição para:', {
                patient: patient.nomeCompleto,
                date: startDate.toISOString()
            });

            // Calcular hraFinal (10:00 UTC-3 do dia seguinte)
            const hraFinal = new Date(startDate);
            hraFinal.setDate(hraFinal.getDate() + 1); // Dia seguinte
            hraFinal.setHours(10, 0, 0, 0); // 10:00:00

            // Criar nova prescrição
            const newPrescription = await createPrescription({
                identificadorMedico: user.id,
                idPaciente: patient.codigo,
                hraInicio: startDate.toISOString(),
                hraFinal: hraFinal.toISOString(),
                idInternacao: patient.identificadorInternacao,
                dataPrescricao: startDate.toISOString()
            });

            console.log('✅ Prescrição criada:', newPrescription);

            // Redirecionar
            navigate(`/prescricao?paciente=${patient.codigo}&prescricao=${newPrescription.identificador}`);

        } catch (err) {
            console.error("❌ Erro ao criar prescrição:", err);
            alert("Erro ao criar prescrição. Tente novamente.");
        } finally {
            setCreatingPrescription(false);
            setModalOpen(false);
        }
    };

    const handleNewPrescriptionClick = async (patient: PatientListItem) => {
        try {
            // Verificar se existe prescrição para hoje
            const todayPrescription = await getTodayPrescription(patient.codigo);

            if (todayPrescription && todayPrescription.status === 'finalizado') {
                // Se existe e está finalizada, abre modal para agendar (provavelmente amanhã)
                setSelectedPatient(patient);
                setModalOpen(true);
            } else {
                // Se não existe ou não está finalizada (ativa), cria direto com data de AGORA
                await createAndRedirect(patient, new Date());
            }
        } catch (error) {
            console.error("Erro ao verificar prescrição:", error);
            alert("Erro ao verificar status da prescrição.");
        }
    };

    const handleConfirmPrescription = async (selectedDate: Date) => {
        if (!selectedPatient) return;
        await createAndRedirect(selectedPatient, selectedDate);
    };

    const handlePatientClick = (patient: PatientListItem) => {
        setSelectedPatient(patient);
        setHistoryModalOpen(true);
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
                <Box sx={{ width: '100%', maxWidth: '900px' }}>
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

                    {/* Patients Table */}
                    <Box sx={{
                        bgcolor: 'white',
                        borderRadius: 1.5,
                        p: 2,
                        mb: 1.5,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                        border: '1px solid #f0f0f0'
                    }}>
                        <PatientsTable
                            patients={patients}
                            onNewPrescription={handleNewPrescriptionClick}
                            onRowClick={handlePatientClick}
                        />
                    </Box>

                    {/* Reminders Section */}
                    <Box sx={{
                        bgcolor: 'white',
                        borderRadius: 1.5,
                        p: 2,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                        border: '1px solid #f0f0f0'
                    }}>
                        <RemindersSection />
                    </Box>

                    <PrescriptionModal
                        open={modalOpen}
                        onClose={() => setModalOpen(false)}
                        onConfirm={handleConfirmPrescription}
                        patient={selectedPatient}
                        loading={creatingPrescription}
                    />

                    <PrescriptionHistoryModal
                        open={historyModalOpen}
                        onClose={() => setHistoryModalOpen(false)}
                        patient={selectedPatient}
                    />
                </Box>
            </Box>
            <SystemFooter />
        </Box>
    );
}
