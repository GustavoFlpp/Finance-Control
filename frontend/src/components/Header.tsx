// frontend/src/components/Header.tsx
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Switch,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useState, useEffect } from "react";

interface HeaderProps {
  mode: "light" | "dark";
  toggleTheme: () => void;
  onLogout: () => void; // função de logout passada pelo App
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  toggleTheme,
  onLogout,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [name, setName] = useState("");

  // Busca o nome do usuário logado via /profile
  useEffect(() => {
    fetch("/api/profile", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => setName(data.name))
      .catch(() => setName("Usuário"));
  }, []);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <AppBar
      position="fixed"
      color="primary"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Finance Control
        </Typography>

        {/* Alternador de tema */}
        <Switch checked={mode === "dark"} onChange={toggleTheme} />

        {/* Menu do usuário */}
        <IconButton color="inherit" onClick={handleMenu}>
          <AccountCircle />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem disabled>{name}</MenuItem>
          <MenuItem
            onClick={() => {
              handleClose();
              onLogout(); // logout imediato
            }}
          >
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};
