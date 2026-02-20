import { useState, useEffect } from "react";
import API from "@/lib/api-configs";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { useUserRole } from "./hooks/useUserRole"; // Import your role hook

// Page Imports
import Home from "./pages/Home";
import About from "./pages/About";
import Events from "./pages/Events";
import Gallery from "./pages/Gallery";
import News from "./pages/News";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminDashboard from "./pages/AdminDashboard";
import Maintenance from "./pages/Maintenance"; // Add this

const queryClient = new QueryClient();

/**
 * 1. Private Route: Ensures user is logged in
 */
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center font-black italic uppercase animate-pulse">
        Loading AIT...
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/login" />;
};

/**
 * 2. Admin Route: Ensures user is logged in AND has level 4+
 */
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const { roleNumber } = useUserRole(); // This will now work because AdminRoute is inside AuthProvider

  // If not logged in or level too low, kick back to home
  if (!user || roleNumber < 4) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  const [isMaintenance, setIsMaintenance] = useState(false);

  // Removed 'loading: roleLoading' since your hook doesn't provide it
  const { roleNumber } = useUserRole();
  const { loading: authLoading } = useAuth();

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const { data } = await API.get("/admin/system-status");
        setIsMaintenance(data.maintenance);
      } catch (err) {
        console.error("Maintenance check failed", err);
        setIsMaintenance(false);
      }
    };
    checkStatus();
  }, []);

  // Only check authLoading here
  if (authLoading) {
    return (
      <div className="h-screen flex items-center justify-center font-black italic uppercase animate-pulse text-xs tracking-widest bg-background">
        Establishing Secure Link...
      </div>
    );
  }

  // Comment out this to prevent blocking access to the maintenance page for admins
  // if (isMaintenance && roleNumber < 4) {
  //   return <Maintenance />;
  // }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/about" element={<About />} />
      <Route path="/events" element={<Events />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/news" element={<News />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Protected Member Routes */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile/:identifier?"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />

      {/* Admin Route - Level 4, 5, 6 only */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />

      {/* 404 Route */}
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
