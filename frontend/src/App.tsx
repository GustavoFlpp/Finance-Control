import { CssBaseline, ThemeProvider, Box } from "@mui/material";
import { useState, useMemo } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { getTheme } from "./themes/theme";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import Goals from "./pages/Goals";
import Login from "./pages/Login";

const App: React.FC = () => {
  const [mode, setMode] = useState<"light" | "dark">(
    () => (localStorage.getItem("theme") as "light" | "dark") || "light"
  );

  // Agora token é estado reativo
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  const toggleTheme = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    localStorage.setItem("theme", newMode);
  };

  const theme = useMemo(() => getTheme(mode), [mode]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null); // atualiza estado imediatamente
  };

  if (!token) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </ThemeProvider>
  );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header mode={mode} toggleTheme={toggleTheme} onLogout={handleLogout} />
      <Box sx={{ display: "flex", mt: 8 }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;
