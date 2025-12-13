import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { theme } from './theme';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { getRouteByRole } from './config/roleRoutes';

import MedicoPage from './pages/medico';
import PrescricaoPage from './pages/prescricao';
import RecepcaoPage from './pages/recepcao';
import Recepcao2 from './pages/recepcaoteste';
import Cadastro from './pages/cadastro';
import Login from './pages/Login';
import AdminDashboard from './pages/admin-dashboard';
import InternacoesPage from './pages/internacoes';
import MedicamentosPage from './pages/medicamentos';
import EnfermagemPage from './pages/enfermagem';
import PrescricaoEnfermagemPage from './pages/prescricao-enfermagem';
import CuidadosPage from './pages/cuidados';

// Componente para redirecionar baseado no role
function RoleBasedRedirect() {
  const { profile, loading } = useAuth();

  if (loading) {
    return null; // Ou um loading spinner
  }

  const route = getRouteByRole(profile?.funcao);
  return <Navigate to={route} replace />;
}

function App() {
  console.log('App: Rendering...');
  return (
    <AuthProvider>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route path="/admin-dashboard" element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />

            <Route path="/medico" element={
              <ProtectedRoute allowedRoles={['Medico', 'Admin']}>
                <MedicoPage />
              </ProtectedRoute>
            } />

            <Route path="/prescricao" element={
              <ProtectedRoute allowedRoles={['Medico', 'Admin']}>
                <PrescricaoPage />
              </ProtectedRoute>
            } />

            <Route path="/recepcao" element={
              <ProtectedRoute allowedRoles={['Recepcionist0a']}>
                <RecepcaoPage />
              </ProtectedRoute>
            } />

            <Route path="/recepcaoteste" element={
              <ProtectedRoute allowedRoles={['Recepcionista', 'Admin']}>
                <Recepcao2 />
              </ProtectedRoute>
            } />

            <Route path="/internacoes" element={
              <ProtectedRoute allowedRoles={['Recepcionista', 'Admin']}>
                <InternacoesPage />
              </ProtectedRoute>
            } />

            <Route path="/medicamentos" element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <MedicamentosPage />
              </ProtectedRoute>
            } />

            <Route path="/enfermagem" element={
              <ProtectedRoute allowedRoles={['Enfermeiro', 'Admin']}>
                <EnfermagemPage />
              </ProtectedRoute>
            } />

            <Route path="/prescricao-enfermagem" element={
              <ProtectedRoute allowedRoles={['Enfermeiro', 'Admin']}>
                <PrescricaoEnfermagemPage />
              </ProtectedRoute>
            } />

            <Route path="/cuidados-enfermagem" element={
              <ProtectedRoute allowedRoles={['Enfermeiro', 'Admin']}>
                <CuidadosPage />
              </ProtectedRoute>
            } />

            <Route path="/cadastro" element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <Cadastro />
              </ProtectedRoute>
            } />

            {/* Default route - redirect based on user role */}
            <Route path="/" element={
              <ProtectedRoute>
                <RoleBasedRedirect />
              </ProtectedRoute>
            } />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
