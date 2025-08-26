// frontend/src/pages/Register.tsx
import { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { register } from "../api/auth";

interface RegisterProps {
  setToken: (token: string) => void;
}

const Register: React.FC<RegisterProps> = ({ setToken }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    setError("");
    if (!name || !email || !password) {
      setError("Preencha todos os campos");
      return;
    }

    setLoading(true);
    try {
      await register({ name, email, password });
      setToken(localStorage.getItem("token")!); // Atualiza estado do App
      navigate("/"); // Redireciona para Dashboard
    } catch (err: any) {
      setError(err.message || "Erro ao registrar usuário");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box mt={8} display="flex" flexDirection="column" alignItems="center">
        <Typography variant="h5" mb={3}>
          Finance Control - Registro
        </Typography>

        <TextField
          label="Nome"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          label="Senha"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}

        <Button
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Registrar"}
        </Button>
      </Box>
    </Container>
  );
};

export default Register;
