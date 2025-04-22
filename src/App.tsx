import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import ServicesPage from "./pages/ServicesPage";
import ServiceDetailPage from "./pages/ServiceDetailPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ClientDashboard from "./pages/client/ClientDashboard";
import SubcontractorDashboard from "./pages/subcontractor/SubcontractorDashboard";

const queryClient = new QueryClient();

// Route guard for protected routes
const ProtectedRoute = ({ 
  children, 
  allowedRole 
}: { 
  children: JSX.Element, 
  allowedRole?: string 
}) => {
  const { user, currentRole } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRole && currentRole !== allowedRole) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/services/:id" element={<ServiceDetailPage />} />
      
      {/* Admin routes */}
      <Route 
        path="/admin/dashboard" 
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/services/new" 
        element={
          <ProtectedRoute allowedRole="admin">
            <ServiceDetailPage />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/admin/services/:id/edit" 
        element={
          <ProtectedRoute allowedRole="admin">
            <ServiceDetailPage />
          </ProtectedRoute>
        }
      />
      
      {/* Subcontractor routes */}
      <Route 
        path="/contractor/dashboard" 
        element={
          <ProtectedRoute allowedRole="subcontractor">
            <SubcontractorDashboard />
          </ProtectedRoute>
        }
      />
      
      {/* Client routes */}
      <Route 
        path="/client/dashboard" 
        element={
          <ProtectedRoute allowedRole="client">
            <ClientDashboard />
          </ProtectedRoute>
        }
      />
      
      {/* Catch all for 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
