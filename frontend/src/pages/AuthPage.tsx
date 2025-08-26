// frontend/src/pages/AuthPage.tsx
import React from "react";
import {
  Box,
  Container,
  Paper,
  Tabs,
  Tab,
  useMediaQuery,
  Theme,
} from "@mui/material";
import Login from "./Login";
import Register from "./Register";

interface AuthPageProps {
  setToken: (token: string) => void;
}

function a11yProps(index: number) {
  return {
    id: `auth-tab-${index}`,
    "aria-controls": `auth-tabpanel-${index}`,
  };
}

const AuthPage: React.FC<AuthPageProps> = ({ setToken }) => {
  const [tab, setTab] = React.useState(0);
  const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={8}
        sx={{
          width: "100%",
          p: { xs: 3, sm: 5 },
          borderRadius: 3,
          boxShadow: 6,
        }}
      >
        <Tabs
          value={tab}
          onChange={handleChange}
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
          sx={{ mb: 3 }}
        >
          <Tab label="Entrar" {...a11yProps(0)} />
          <Tab label="Registrar" {...a11yProps(1)} />
        </Tabs>

        <Box
          role="tabpanel"
          hidden={tab !== 0}
          id="auth-tabpanel-0"
          aria-labelledby="auth-tab-0"
        >
          {tab === 0 && <Login setToken={setToken} />}
        </Box>

        <Box
          role="tabpanel"
          hidden={tab !== 1}
          id="auth-tabpanel-1"
          aria-labelledby="auth-tab-1"
        >
          {tab === 1 && <Register setToken={setToken} />}
        </Box>
      </Paper>
    </Container>
  );
};

export default AuthPage;
