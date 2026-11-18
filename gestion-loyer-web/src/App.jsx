import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import Login from "./pages/auth/Login";
import DashboardLocataire from "./pages/locataire/DashboardLocataire";
import AdminLayout from "./components/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import "./index.css";
import Register from "./pages/auth/Register";
import ResetPassword from "./pages/auth/ResetPassword";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Foyers from "./pages/admin/Foyers";
import FoyerForm from "./pages/admin/FoyerForm";
import LocataireLayout from "./components/LocataireLayout";
import Paiements from "./pages/admin/Paiements";
import Impayes from "./pages/admin/Impayes";
import Contrats from "./pages/admin/Contrats";
import Reclamations from "./pages/admin/Reclamations";
import Rapports from "./pages/admin/Rapports";
import Parametres from "./pages/admin/Parametres";
import FoyerDetail from "./pages/admin/FoyerDetail";
import Lots from "./pages/admin/Lots";




function PrivateRoute({ children, role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/login" />;
  return children;
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="foyers/:id" element={<FoyerDetail />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/forgot-password" element={<ForgotPassword />} />
  <Route path="/reset-password" element={<ResetPassword />} />

  {/* Pages Locataire protégées */}
  <Route
    path="/locataire"
    element={
      <PrivateRoute role="LOCATAIRE">
        <DashboardLocataire />
      </PrivateRoute>
    }
  />

  {/* Pages Admin protégées */}
  <Route
    path="/admin"
    element={
      <PrivateRoute role="ADMIN">
        <AdminLayout />
      </PrivateRoute>
    }
  >
    <Route index element={<Dashboard />} />
    <Route path="foyers" element={<Foyers />} />
    <Route path="foyers/nouveau" element={<FoyerForm />} />
    <Route path="foyers/:id/modifier" element={<FoyerForm />} />
    <Route path="foyers/:id" element={<FoyerDetail />} />
    <Route path="paiements" element={<Paiements />} />
    <Route path="impayes" element={<Impayes />} />
    <Route path="contrats" element={<Contrats />} />
    <Route path="reclamations" element={<Reclamations />} />
    <Route path="rapports" element={<Rapports />} />
    <Route path="parametres" element={<Parametres />} />
    <Route path="lots" element={<Lots />} />
  </Route>

  {/* Redirection par défaut */}
  <Route path="*" element={<Navigate to="/login" />} />
</Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;