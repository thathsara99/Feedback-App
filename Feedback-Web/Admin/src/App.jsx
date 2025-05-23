import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import Home from "./pages/Home";
import Templates from "./pages/Templates";
import Companies from "./pages/Company";
import Profile from "./pages/profile";
import User from "./pages/User";
import Login from "./pages/Login";
import ForgotPasswordPage from "./pages/ForgotPassword";
import { CompanyProvider } from "./contexts/CompanyContext";

// Simple auth check using token from localStorage
const isAuthenticated = () => !!localStorage.getItem("token");

function App() {
  const location = useLocation();
  const isLogin = location.pathname === "/login";

  return (
    <Routes>
      {/* Redirect root to login or home */}
      <Route path="/" element={<Navigate to={isAuthenticated() ? "/home" : "/login"} />} />

      {/* Public login route */}
      <Route path="/login" element={<Login />} />

      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Protected routes inside MainLayout */}
      {isAuthenticated() && (
        <Route
        path="/*"
        element={
          <CompanyProvider>
            <Routes>
              <Route path="/home" element={<MainLayout><Home /></MainLayout>} />
              <Route path="/templates" element={<MainLayout><Templates /></MainLayout>} />
              <Route path="/companies" element={<MainLayout><Companies /></MainLayout>} />
              <Route path="/users" element={<MainLayout><User /></MainLayout>} />
              <Route path="/profile" element={<MainLayout><Profile /></MainLayout>} />
            </Routes>
          </CompanyProvider>
        }
      />
      )}

      {/* Catch-all route for unauthorized access */}
      {!isAuthenticated() && (
        <Route path="*" element={<Navigate to="/login" replace />} />
      )}
    </Routes>
  );
}

export default App;
