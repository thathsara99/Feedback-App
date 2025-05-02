import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import Home from "./pages/Home";
import Templates from "./pages/Templates";
import Login from "./pages/Login";
import ForgotPasswordPage from "./pages/ForgotPassword";

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
        <>
          <Route
            path="/home"
            element={
              <MainLayout>
                <Home />
              </MainLayout>
            }
          />
          <Route
            path="/templates"
            element={
              <MainLayout>
                <Templates />
              </MainLayout>
            }
          />
        </>
      )}

      {/* Catch-all route for unauthorized access */}
      {!isAuthenticated() && (
        <Route path="*" element={<Navigate to="/login" replace />} />
      )}
    </Routes>
  );
}

export default App;
