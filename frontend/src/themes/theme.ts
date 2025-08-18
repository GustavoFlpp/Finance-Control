// frontend/src/theme.ts
import { createTheme } from "@mui/material/styles";

export const getTheme = (mode: "light" | "dark") =>
  createTheme({
    palette: {
      mode,
      ...(mode === "light"
        ? {
            primary: { main: "#1976d2" },
            secondary: { main: "#f50057" },
            background: { default: "#f5f5f5", paper: "#fff" },
          }
        : {
            primary: { main: "#90caf9" },
            secondary: { main: "#f48fb1" },
            background: { default: "#121212", paper: "#1d1d1d" },
          }),
    },
    typography: {
      fontFamily: "Roboto, Arial, sans-serif",
    },
    components: {
      MuiAppBar: { defaultProps: { elevation: 1 } },
      MuiDrawer: { defaultProps: { variant: "permanent" } },
    },
  });
