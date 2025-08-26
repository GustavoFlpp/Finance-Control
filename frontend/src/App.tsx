import { CssBaseline, ThemeProvider, Box } from "@mui/material";
import { useState, useMemo } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { getTheme } from "./themes/theme";
import { TransactionsProvider } from "./contexts/TransactionsContext";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import Goals from "./pages/Goals";
import AuthPage from "./pages/AuthPage"; // Página de Login/Register

const App: React.FC = () => {
  const [mode, setMode] = useState<"light" | "dark">(
    () => (localStorage.getItem("theme") as "light" | "dark") || "light"
  );

  const [token, setToken] = useState(() => localStorage.getItem("token"));

  const toggleTheme = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    localStorage.setItem("theme", newMode);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  const theme = useMemo(() => getTheme(mode), [mode]);

  // Se não tem token -> mostra página de autenticação
  if (!token) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<AuthPage setToken={setToken} />} />
          <Route path="/login" element={<AuthPage setToken={setToken} />} />
          <Route path="/register" element={<AuthPage setToken={setToken} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ThemeProvider>
    );
  }

  // Se está logado -> mostra layout com Sidebar + Header + rotas internas
return (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <TransactionsProvider token={token}>
      <Header mode={mode} toggleTheme={toggleTheme} onLogout={handleLogout} />
      <Box sx={{ display: "flex", mt: 8 }}>
        <Sidebar />
        {/* Remover p: 3 daqui */}
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Box>
      </Box>
    </TransactionsProvider>
  </ThemeProvider>
);
};

export default App;
