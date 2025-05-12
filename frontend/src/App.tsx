import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState } from "react";

import "./App.css"
import { NavBar } from "./components/NavBar";
import { SignupPage } from "./pages/Signup";
import { LoginPage } from "./pages/Login";
import { DashboardPage } from "./pages/Dashboard";
import { ProjectPage } from "./pages/Project";
import { CreatePage } from "./pages/Create";
import { SendPage } from "./pages/Send";
import { TemplatePage } from "./pages/Template";
import { ProtectedRoute } from "./components/ProtectedRoute"

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return !!localStorage.getItem("userID")
  })

  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/project/:id"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <ProjectPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <CreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/project/:id/send"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <SendPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/template/:id"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <TemplatePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  )
}