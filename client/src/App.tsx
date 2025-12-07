import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './styles/design-system.css';
import { Login } from './pages/auth/Login';
import { RegisterHospital } from './pages/auth/RegisterHospital';
import { DoctorDashboard } from './pages/doctor/DoctorDashboard';
import { PatientProfile } from './pages/doctor/PatientProfile';
import { PatientSearch } from './pages/doctor/PatientSearch';
import { CreateUHID } from './pages/uhid/CreateUHID';
import { CreateVisit } from './pages/doctor/CreateVisit';
import { CreatePrescription } from './pages/doctor/CreatePrescription';
import { CreateLabTest } from './pages/doctor/CreateLabTest';
import { ReferPatient } from './pages/doctor/ReferPatient';
import { AIInsights } from './pages/doctor/AIInsights';
import { HospitalAdminDashboard } from './pages/admin/HospitalAdminDashboard';
import { HospitalManagement } from './pages/admin/HospitalManagement';
import { AuditLogs } from './pages/admin/AuditLogs';
import { LabDashboard } from './pages/lab/LabDashboard';
import { CentralAdminDashboard } from './pages/central/CentralAdminDashboard';
import { InterHospitalExchange } from './pages/exchange/InterHospitalExchange';
import { PatientPortal } from './pages/patient/PatientPortal';
import { PatientRegister } from './pages/auth/PatientRegister';

const ProtectedRoute: React.FC<{ children: React.ReactNode; requiredRole?: string }> = ({
  children,
  requiredRole,
}) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterHospital />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route
        path="/doctor"
        element={
          <ProtectedRoute requiredRole="doctor">
            <DoctorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/search"
        element={
          <ProtectedRoute requiredRole="doctor">
            <PatientSearch />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/create-uhid"
        element={
          <ProtectedRoute requiredRole="doctor">
            <CreateUHID />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/ai-insights"
        element={
          <ProtectedRoute requiredRole="doctor">
            <AIInsights />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/patients/:id"
        element={
          <ProtectedRoute requiredRole="doctor">
            <PatientProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/patients/:id/visits/new"
        element={
          <ProtectedRoute requiredRole="doctor">
            <CreateVisit />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/patients/:id/prescription"
        element={
          <ProtectedRoute requiredRole="doctor">
            <CreatePrescription />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/patients/:id/lab-test"
        element={
          <ProtectedRoute requiredRole="doctor">
            <CreateLabTest />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/patients/:id/refer"
        element={
          <ProtectedRoute requiredRole="doctor">
            <ReferPatient />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/exchange/:uhid"
        element={
          <ProtectedRoute requiredRole="doctor">
            <InterHospitalExchange />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <HospitalAdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/audit"
        element={
          <ProtectedRoute requiredRole="admin">
            <AuditLogs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/lab"
        element={
          <ProtectedRoute requiredRole="lab">
            <LabDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/central"
        element={
          <ProtectedRoute requiredRole="central">
            <CentralAdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/central/hospitals"
        element={
          <ProtectedRoute requiredRole="central">
            <HospitalManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient"
        element={
          <ProtectedRoute requiredRole="patient">
            <PatientPortal />
          </ProtectedRoute>
        }
      />
      <Route path="/patient/register" element={<PatientRegister />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
